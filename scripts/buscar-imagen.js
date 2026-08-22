#!/usr/bin/env node
/*
 * Search for a free-to-reuse photo/illustration to accompany a deck card,
 * using Openverse (openverse.org) — an aggregator of openly-licensed
 * images from Flickr, Wikimedia Commons, museums, and other sources,
 * searchable with no signup at all (same "no key needed" spirit as
 * sinonimia's ARASAAC fallback in buscar-pictograma.js).
 *
 * Unlike ARASAAC (always the same license), Openverse results carry
 * *different* licenses per image, so this tool only requests
 * commercial-reuse, no-extra-restriction licenses in the first place
 * (`license=cc0,pdm,by,by-sa` — excludes NC "non-commercial" and ND "no
 * derivatives", since a chosen image may later need cropping/resizing)
 * and still prints each result's license for a human to double-check.
 *
 * This tool only searches and lists results — it does NOT download or
 * pick automatically. Pick the one that actually fits the card by
 * reading its title/source below — do NOT open/view the candidate
 * images to check them, that burns vision tokens for no benefit the
 * title text doesn't already give you (a full-res source image costs
 * ~1000+ vision tokens per view; a thumbnail still costs ~300-400).
 * Then download it by hand into assets/img/decks/<deck-slug>/<file>.jpg
 * and record its attribution in the card's `imagen` field (see
 * doc/en/technical.md §3).
 *
 * Prefer the `thumb` URL over `image` for the download: it's the same
 * picture at a much smaller size (a few hundred KB → tens of KB),
 * which is plenty for a support illustration on a card and keeps the
 * shipped page lighter. The thumbnail proxy occasionally fails (HTTP
 * 400) for some source hosts — if `curl -f` on it errors, fall back to
 * the full `image` URL.
 *
 * Usage:
 *   node scripts/buscar-imagen.js <term> [maxResults]
 *
 * Examples:
 *   node scripts/buscar-imagen.js "cuento infantil"
 *   node scripts/buscar-imagen.js "sistema circulatorio" 5
 */

const term = process.argv[2];
const maxResults = Math.max(1, Math.min(20, parseInt(process.argv[3], 10) || 10));

if (!term) {
  console.error("Usage: node scripts/buscar-imagen.js <term> [maxResults]");
  process.exit(1);
}

// Safe-to-reuse licenses only: CC0, Public Domain Mark, CC BY, CC BY-SA.
// Deliberately excludes NC (non-commercial) and ND (no derivatives).
const SAFE_LICENSES = "cc0,pdm,by,by-sa";

async function searchOpenverse() {
  const url = "https://api.openverse.org/v1/images/" +
    "?q=" + encodeURIComponent(term) +
    "&license=" + SAFE_LICENSES +
    "&page_size=" + maxResults;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Openverse search failed (HTTP " + res.status + ")");
  }
  const data = await res.json();
  return (data.results || []).map(function (r) {
    return {
      titulo: r.title || "(sin título)",
      autor: r.creator || "(autor desconocido)",
      licencia: "CC " + String(r.license || "").toUpperCase() + (r.license_version ? " " + r.license_version : ""),
      fuente: r.foreign_landing_url,
      imageUrl: r.url,
      thumbUrl: r.thumbnail,
      dimensions: r.width && r.height ? r.width + "x" + r.height : "(unknown)",
      filetype: r.filetype,
    };
  });
}

function printResults(results) {
  console.log(
    'Openverse — ' + results.length + ' result(s) for "' + term + '" (licenses: CC0, Public Domain, CC BY, CC BY-SA only):\n'
  );
  results.forEach(function (r, i) {
    console.log((i + 1) + ". " + r.titulo + "  [" + r.licencia + "]  " + r.dimensions);
    console.log("   author: " + r.autor);
    console.log("   source: " + r.fuente);
    console.log("   thumb:  " + r.thumbUrl + "  (prefer this one — smaller, same picture, always .jpg)");
    console.log("   image:  " + r.imageUrl + "  (full-res fallback if the thumb 400s — filetype: " + (r.filetype || "unknown") + ")");
    console.log("");
  });
  console.log(
    "Pick the one that actually fits the card FROM THE TITLE/SOURCE TEXT ABOVE —\n" +
    "do not open/view the candidates to check them, it costs vision tokens for no\n" +
    "benefit the text doesn't already give you. Then download the THUMB by hand\n" +
    "into assets/img/decks/<deck-slug>/<file>.jpg — the thumbnail proxy always\n" +
    "re-encodes to JPEG regardless of the source format, so .jpg is always correct\n" +
    "here, e.g.:\n" +
    '  curl -f -o assets/img/decks/<deck-slug>/<file>.jpg "<thumb url>"\n' +
    "If that fails (HTTP 400 — the thumbnail proxy sometimes can't render a given\n" +
    "source host), fall back to the full-res image url instead — but then MATCH\n" +
    "THE EXTENSION TO THE filetype PRINTED ABOVE (jpg/png/webp/svg), don't assume\n" +
    ".jpg: a mismatched extension breaks nothing visually in most browsers but is\n" +
    "wrong and has bitten this repo before (a raw Openverse `image` URL can be\n" +
    "WebP even when the term/thumb suggested a jpg). e.g.:\n" +
    '  curl -o assets/img/decks/<deck-slug>/<file>.<real-ext> "<image url>"\n\n' +
    "Then add this to that card in the deck's JSON (doc/en/technical.md §3):\n" +
    '  "imagen": {\n' +
    '    "archivo": "assets/img/decks/<deck-slug>/<file>.jpg",\n' +
    '    "alt": "<plain description of what the image shows, in the deck\'s language>",\n' +
    '    "titulo": "<titulo from above>",\n' +
    '    "autor": "<autor from above>",\n' +
    '    "fuente": "<source from above>",\n' +
    '    "licencia": "<licencia from above>"\n' +
    "  }"
  );
}

(async () => {
  let results = [];
  try {
    results = await searchOpenverse();
  } catch (err) {
    console.error("Error: " + err.message);
    process.exitCode = 1;
    return;
  }

  if (!results.length) {
    console.log('No results for "' + term + '" with a safe-to-reuse license. Try a different/broader term.');
    return;
  }

  printResults(results);
})();
