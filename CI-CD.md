# CI/CD and deployment — Memofun

This is the project-specific CI/CD and Cloudflare deployment runbook. For the suite-wide test matrix, see the [Miralante CI/CD guide](https://github.com/miralante/apptonomia/blob/main/CI-CD.md).

## CI validation

Run the checks required by `.github/workflows/validate.yml` from this repository before merging. Project-specific checks and the suite-wide Playwright, crawler, service-worker, and release checks are listed in the linked CI/CD guide.

## Cloudflare deployment profile — Memofun

> **Deploy:** automatic on every push to `main` through the Cloudflare Git connector; Workers Builds deploys the repo and GitHub Actions only validates. The Cloudflare dashboard is the source of truth for project settings. This is a Worker with static assets, not classic Pages. Live at <https://memofun.miralante.workers.dev>.

## Configuration

| Setting | Value |
|---|---|
| Worker | `memofun` |
| Production branch | `main` |
| Framework preset | None |
| Build command | (empty) |
| Output / root | `.` / repository root |
| GitHub workflow | [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — lint, markup, cache-version, i18n, secrets, and UI/service-worker checks on pushes and pull requests |

`wrangler.toml` is the deploy configuration: it pins the Worker name, serves `[assets] directory = "."` without a `main` script, and sets `not_found_handling = "404-page"`. Keep it; do not convert this project to classic Pages (`pages_build_output_dir` or `wrangler pages deploy`). Workers Builds reads it directly.

`_headers` applies security and cache headers at deploy time; no dashboard rules are needed. No environment variables or Cloudflare service-account keys are required. `.assetsignore` defines the upload scope, excluding repository metadata and development files. It replaced `[build] command = "rm -rf .git"`: the Git pack was about 78 MiB, above the 25 MiB asset limit, but `rm` is POSIX-only and deleted the local repository when run on Windows. No `_redirects`, `functions/`, or `package.json`. Each section (`tools/<slug>/`, `about/`, `config/`, `legal/`, `decks/`) has its own `index.html`.

## Routing and Workers.dev

Cloudflare serves static Worker assets through an active `workers.dev` subdomain or custom domain. A deployment can succeed yet serve nothing without an active route. If a Worker shows **No active routes**, enable its Workers.dev subdomain under **Workers & Pages → `memofun` → Settings → Triggers**. If only a route table is available, add `*/*` on the account's `workers.dev` zone for Worker `memofun`. Routes are dashboard settings, not `wrangler.toml`; enabling one needs no rebuild. If a deployment is not active afterward, retry or promote the latest successful deployment.

Per-directory `index.html` files handle deep links without rewrite rules.

## Cache and service worker

`sw.js` uses network-first with cache fallback: online clients receive the server copy; cache is used offline. It declares a `VERSION` and a `FILES` (or `ARCHIVOS`) precache list. Bump `VERSION` in the same commit whenever a listed file changes; `scripts/check-version-bump.js` enforces this in CI. Bump liberally so installed clients receive fixes. See `CLAUDE.md` §B.1.

## Deploy, rollback, and domains

Push to `main` to deploy automatically. Workers Builds handles production deploys, so no local `wrangler login` or GitHub deploy secret is needed. For a manual deployment or preview, run `npx wrangler deploy` (Wrangler reads `wrangler.toml`). To rebuild in the dashboard, open **Workers & Pages → memofun → Create deployment**. Roll back in **Deployments** by retrying or rolling back to a prior successful version.

To add a custom domain, use **Workers & Pages → `memofun` → Custom domains → Set up a custom domain**. Cloudflare configures DNS for a zone in the account; otherwise follow the wizard's DNS instructions. Current setup: No custom domain; the `workers.dev` URL is the live origin.

There are no API tokens or secrets to rotate. The GitHub integration uses OAuth; revoke access at [github.com/settings/applications](https://github.com/settings/applications).

## Project-specific notes

The app is static HTML/CSS/JS, has no external CDN or server-side calls, and needs no environment variables. `.github/workflows/smoke-prod.yml` periodically checks production; forks may set its URL with the `PRODUCTION_URL` repository variable.

## References

- [`wrangler.toml`](wrangler.toml) — Worker and asset configuration.
- [`_headers`](_headers) — security and cache policy.
- [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — validation; it does not deploy unless stated above.
- [`CLAUDE.md`](CLAUDE.md) — agent workflow and, where applicable, the canonical service-worker cache contract (§B.1).
- [Miralante's shared Cloudflare runbook](https://github.com/miralante/apptonomia/blob/main/CI-CD.md) — common setup and recovery steps.
