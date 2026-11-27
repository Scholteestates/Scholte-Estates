---
name: release
description: Ship a change to scholteestates.com — branch, checks, pull request, Netlify deploy-preview test, merge, live check. Use whenever the user asks to put something live, release, deploy, merge or "get it live" in the Scholte Estates project.
---

# Release a change to scholteestates.com

The user has authorised Claude to merge tested pull requests for changes they
request (CLAUDE.md, "Releases"). Never push to `main`, never use bypass mode,
never touch AIVENA repositories or permissions.

## 1. Branch from an up-to-date main

```bash
git switch main && git pull
git switch -c <type>/<short-name>      # feat/…, fix/…, chore/…, docs/…
```

Check `.gitignore` on the new branch covers `/.private/` (ignore rules can
differ between branches — a branch cut from an older main once pushed the
private trial feed because the rule only existed on another branch).

## 2. Checks before committing

```bash
npm run lint && npm run typecheck && npm run build
```

After a build, confirm nothing private reached it:

```bash
grep -rl "redsp-n8791\|N8791\|preview-media/redsp" .next/server .next/static | head
```

(The folder name `preview-media` alone can appear in the route tree; that is
fine. Trial references must not.)

## 3. Stage by name, look, then commit

- **Never** `git add -A` (or `git add .`) chained with `git commit`.
- `git add <each path>` → `git status --short` → read it → then commit.
- Must never be staged: `.private/`, `.env*` (except `.env.example`),
  `.claude/settings.local.json`, `public/map/maplibre-gl-worker.mjs`
  (generated), build output, customer data, provider feeds or photos.
- Commit message ends with the Co-Authored-By line given in the session.

## 4. Pull request and deploy preview

```bash
git push -u origin <branch>
gh pr create --base main --title "…" --body "…"   # body ends with the Claude Code line
```

Netlify builds `https://deploy-preview-<N>--scholte-estates.netlify.app`
(~1–2 min). Wait for it (`gh pr checks <N>`, look for
`netlify/scholte-estates/deploy-preview pass`), then test **in the browser
pane**, not only with curl:

- the changed pages in **EN and ES**, desktop and mobile (375 px);
- `read_console_messages` for errors;
- third-party requests: list `performance.getEntriesByType('resource')`
  hosts. Only the site's own host (and `app.netlify.com` on previews) is
  expected before consent. Google requests are allowed only after the visitor
  clicks "Load Google Maps" or accepts analytics cookies;
- private routes still absent: `/en/preview/redsp-n8791` and
  `/preview-media/…` must return 404.

The site uses a scroll-reveal script, so scroll with `scroll_to` / wheel
events; `window.scrollTo` from javascript_tool does not move the page.

## 5. Merge and check live

```bash
gh pr merge <N> --merge
```

Then poll `https://scholteestates.com/…` until the change appears (production
deploy ~1–3 min) and re-test the key page in the browser pane. Report what is
live and what was verified, with the PR link.

## Policy-affecting changes

Before adding any form, analytics, embed, map, chat widget or new provider:
re-audit the live requests and update `src/content/legal.ts` (EN and ES) and
`site.legal.updated` in the same PR. Third-party content loads only after an
explicit click or consent.

## Lessons log

Add a dated line here whenever a release goes wrong or the user corrects the
process, so the next release starts with the lesson.

- 2026-11-26 — `git add -A` on a branch from main pushed `.private/` (trial
  feed, photos). Branch was force-pushed clean. Stage by name; check ignores.
- 2026-11-26 — Dev server can serve stale CSS after edits; if a style change
  does not show, restart it with preview_stop / preview_start.
