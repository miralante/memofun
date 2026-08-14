# Security policy

> 🌐 **Other languages:** [Español](SECURITY.es.md)

Memofun is a fully client-side, dependency-free web app: no server of
its own, no backend, no database, no telemetry, no third-party library
at all (not even from a CDN), and no integration with any external
API — not even an AI one — anywhere in the code. The attack surface is
the browser's same-origin surface. The `scripts/` utilities (Node.js,
zero npm packages) run locally, outside the site, make no network
calls, and expose no service.

## Supported versions

Only the main branch receives security patches. We don't maintain old
versions.

## Reporting a vulnerability

Open a private advisory via the repository's GitHub Security
Advisories, or open an issue clearly labeled **security** with a
`[SEC]` prefix in the title if you can't use Security Advisories.
**Do not post working exploits** in a public issue — wait for a
maintainer to coordinate.

Please include:

- A brief description and reproduction steps.
- Observed or expected impact.
- The affected commit SHA or tag.

## What to expect

- Acknowledgement within 5 business days.
- Initial assessment (reproduction, severity, plan) within 15 business
  days.
- If confirmed, a patch or mitigation as soon as feasible.

## Coordinated disclosure

We prefer to coordinate disclosure if the fix requires visible changes
to the UI or the PWA shell.
