# Cloudflare Workers (static assets) — Memofun

> **Part of a group of sibling projects.** Memofun is one of six static,
> no-backend, accessibility-first sites that share the same author and
> the same Cloudflare deploy story. **Apptonomia is the main project**
> of the group; the canonical Cloudflare guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md).
> This document is the Memofun-specific runbook on top of it, modeled
> on [Sinonimia's `CLOUDFLARE.md`](https://github.com/miralante/sinonimia/blob/main/CLOUDFLARE.md)
> since both use the same **Workers + static assets** model
> (`wrangler.toml` + `[assets]`).

**Live URL (once deployed):** `https://memofun.<account-subdomain>.workers.dev`

> **No `*.workers.dev` subdomain? Read "Triggers" below.** A successful
> build with no errors can still show up as "No active routes" in the
> dashboard, which means the project is deployed but Cloudflare has
> nowhere to serve it from. The fix is one toggle, not a rebuild.

## How it works

1. Connect the `miralante/memofun` repo to a Cloudflare Workers project
   named `memofun` via the Cloudflare dashboard's Git connector
   (Workers & Pages → Create application → Connect to Git).
2. In the **Connect to Git** wizard, leave the **"Workers.dev
   subdomain"** toggle enabled (default). This is what later assigns
   the project its `memofun.<account-subdomain>.workers.dev` URL — see
   the "Triggers" section below if it was skipped.
3. Every push to the production branch triggers a build via Workers
   Builds, which reads `wrangler.toml` and deploys the repo root as a
   static-assets Worker (no `main` script — the site is plain
   HTML/CSS/JS, no build step).
4. `wrangler.toml`'s `[assets] directory = "."` and
   `not_found_handling = "404-page"` make Cloudflare serve this repo's
   own `404.html` for an unmatched path instead of a bare empty 404.

## Triggers — `*.workers.dev` subdomain

For a static-assets Worker like Memofun, Cloudflare only serves
requests over a **route** (a `*.workers.dev` subdomain or a custom
domain). Without one, the project deploys fine — the build succeeds,
files are uploaded, "Deployments" lists the commit — but the dashboard
shows **"No active routes"** and every URL returns empty.

This bit Memofun on its first Cloudflare setup: the Git connector was
created, the build succeeded, but `memofun.<account-subdomain>.workers.dev`
didn't resolve. The sibling projects (Sinonimia, Okeymoney, Calculia,
Teclatlon) all have the URL because the toggle was left on in their
wizard; here it was off.

**Fix — one click in the dashboard:**

1. Workers & Pages → `memofun` → **Settings** → **Triggers** (or
   **Routes**, depending on the dashboard version).
2. Under **Workers.dev subdomain**, click **Enable** (or **Add**).
   Cloudflare assigns `memofun.<account-subdomain>.workers.dev`
   immediately; no rebuild needed.
3. If the dashboard only shows a routes table, add a route manually:
   - **Route pattern**: `*/*`
   - **Zone**: `workers.dev` (the account's free `*.workers.dev` zone)
   - **Worker**: `memofun`
4. Once the route is active, if the latest commit isn't already showing
   as the **Active** deployment, go to **Deployments** → click the most
   recent successful build → **Retry deployment** (or **Promote to
   deploy**).

> **Cannot be set in `wrangler.toml`.** The `workers.dev` binding is a
> per-project dashboard setting; it is not declared anywhere in the
> repo. `wrangler deploy` from the CLI does not apply here either —
> Workers Builds owns the deploy, and the dashboard owns the routes.

## Configuration in Cloudflare

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Root directory | *(empty — repo root)* |
| Workers.dev subdomain | **Enabled** (toggle on in the Connect-to-Git wizard, or afterwards in **Settings → Triggers** — see the "Triggers" section above) |

No environment variables are required — the app is vanilla HTML/CSS/JS
with zero third-party dependencies, not even from a CDN, and makes no
server-side calls.

## Required Cloudflare headers

`_headers` at the repo root sets security headers (a tight CSP with no
external script/connect hosts, plus the usual clickjacking/MIME/
referrer hardening) and cache policy. Cloudflare reads it on every
deploy automatically.

## Service worker cache

`sw.js` is cache-first for the app shell. Any change to a file listed
in its `FILES` array needs a `VERSION` bump in the same commit, or
installed/offline users keep seeing the old version — see `CLAUDE.md`.

The `cache-bump` job in [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
fails the build if a file listed in `sw.js` FILES changed in the diff
without `VERSION` also being bumped. This is the only check that catches
the "forgot to bump VERSION" mistake before it ships — once deployed,
Cache Storage is per-browser state that no server-side smoke test can
observe, so it has to be caught from the diff, not after.

## CI — pre-deploy gate

Every push to `main` and every PR against `main` runs
[`.github/workflows/ci.yml`](.github/workflows/ci.yml), which contains
four jobs (none of them deploy):

| Job | Purpose | Failure means |
|---|---|---|
| `check` | Runs `node scripts/check.js` (92 checks: structural, i18n parity, no-clinical-language, CSP quoting, deck manifest integrity, sw.js ↔ disk parity). | A user-facing file is broken, missing a translation, or violates a project rule. |
| `cache-bump` | Runs `node scripts/check-version-bump.js`. Diffs `sw.js` against the parent commit and fails if a file in `FILES` changed without `VERSION` being bumped. | A returning visitor with the PWA installed will see the old version. |
| `i18n-smoke` | Runs `node scripts/i18n-keys-smoke.js` (informational, `continue-on-error: true`). Lists every `data-i18n*` / `App.i18n.t()` key used in a page that isn't registered in any locale. | Doesn't fail by default — content gaps to fix in `strings.<locale>.js`, surfaced in the job log. Same pattern as the sibling apptonomia project's `scripts/i18n-keys-smoke.js`. |
| `secrets-scan` | Runs `node scripts/scan-secrets.js` (same script maintainers can run locally). Pattern-based grep for accidentally committed secrets (API keys, tokens, private keys). | A leak in the repo. |

A separate workflow, [`.github/workflows/smoke-prod.yml`](.github/workflows/smoke-prod.yml),
runs [`scripts/smoke-prod.js`](scripts/smoke-prod.js) against the live
URL on a `cron: '17 */6 * * *'` schedule (and on demand). It checks
that what visitors actually get matches the source tree — i18n key
parity between the live `index.html` and the live `assets/js/i18n.js`
+ `strings.<locale>.js`, reachability of `decks/manifest.json`, and
that the four security headers from `_headers` are still applied.

The CI workflow **does not deploy**. Deploy is exclusively the Cloudflare
Git connector reading `wrangler.toml` and `_headers`. No GitHub secret
is required, no `wrangler login` is needed locally.

### One-time setup — `PRODUCTION_URL` repo variable

`smoke-prod.yml` reads the live URL from `vars.PRODUCTION_URL` (a
**repo variable**, not a secret — the URL is public). To enable it:

1. GitHub repo → **Settings → Secrets and variables → Actions →
   Variables → New repository variable**.
2. Name: `PRODUCTION_URL`. Value: `https://memofun.<account-subdomain>.workers.dev`
   (no trailing slash — the job normalises it).

Without this variable, `smoke-prod.yml` uses the default
`https://memofun.miralante.workers.dev` and exits with whatever it
finds there. Set it for forks that deploy to a different subdomain.

## Rollback

Cloudflare dashboard → Workers & Pages → `memofun` → **Deployments** →
pick a previous build → **Rollback to this deployment**.
