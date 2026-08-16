# XYPHORIA

Professional platform scaffold for publishing and managing tools. Built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

Quick start

1. Copy `.env.example` to `.env.local` and provide values for:
   - GITHUB_TOKEN (store securely)
   - GITHUB_OWNER
   - GITHUB_REPOSITORY
   - GITHUB_BRANCH
   - OWNER_USERNAME
   - OWNER_PASSWORD_HASH (bcrypt hash of owner password)
   - SESSION_SECRET
2. npm install
3. npm run dev

Notes

- GitHub operations that write (upload/update/delete) require GITHUB_TOKEN to be set in environment (server-side only).
- This repository contains API routes under `src/pages/api/*` that act as the backend. They will use GitHub as the JSON datastore (`data/*.json`) and the `services/github` wrapper.
- To generate an OWNER_PASSWORD_HASH locally, run a small node script using bcryptjs or use online tooling (do not share the hash publicly if you use weak passwords).

Static export

Run `npm run export` to produce a static export in the `out/` folder.

Security

- Never commit secrets into source code.
- Use GitHub Actions secrets or host environment to provide GITHUB_TOKEN and SESSION_SECRET.

This scaffold focuses on clean architecture and provides endpoints for:
- /api/tools
- /api/categories
- /api/download/:slug
- /api/auth/login
- /api/auth/logout

Implemented features in this scaffold:

- Public pages: /, /tools, /tools/[slug], /categories, /about, /search
- Admin endpoints (require owner session): /api/admin/upload, /api/admin/categories, /api/admin/files/delete
- Dashboard pages (basic): /dashboard, /dashboard/upload, /dashboard/files
- Upload flow: drag & drop front-end that posts files to /api/admin/upload (server-side parses multipart, validates, commits files to GitHub and updates data/tools.json)

Note: Writing to GitHub requires GITHUB_TOKEN configured as an environment variable. For convenience during local development, if GITHUB_TOKEN is NOT provided the server will fall back to writing to the local data/ folder (so uploads, delete, and download-count increments can be tested locally). This fallback is only for local/testing purposes — in production a proper GITHUB_TOKEN with repo permissions must be set. Do NOT commit any secrets to source control.
