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

## How it works

1. Connect the `miralante/memofun` repo to a Cloudflare Workers project
   named `memofun` via the Cloudflare dashboard's Git connector
   (Workers & Pages → Create application → Connect to Git).
2. Every push to the production branch triggers a build via Workers
   Builds, which reads `wrangler.toml` and deploys the repo root as a
   static-assets Worker (no `main` script — the site is plain
   HTML/CSS/JS, no build step).
3. `wrangler.toml`'s `[assets] directory = "."` and
   `not_found_handling = "404-page"` make Cloudflare serve this repo's
   own `404.html` for an unmatched path instead of a bare empty 404.

## Configuration in Cloudflare

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Root directory | *(empty — repo root)* |

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

## Rollback

Cloudflare dashboard → Workers & Pages → `memofun` → **Deployments** →
pick a previous build → **Rollback to this deployment**.
