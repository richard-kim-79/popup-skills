---
name: popup
description: Create instant shareable web pages on popup2026.com — no login, no PIN, 30-second setup. Use when the user wants to make a "팝업 페이지", "공유 링크", "랜딩 페이지", "이벤트 안내", "링크 모음", host a raw HTML file, or host a PDF. Tools are reached via the Remote MCP server at https://popup2026.com/api/mcp.
---

# Popup

Popup is a Korean-first service for spinning up shareable single-page sites in seconds — no signup, no design files, no hosting setup. Pages get a short URL on `popup2026.com/<slug>`, live for 30 days by default, and can be extended.

This skill teaches an agent how to build, edit, and share Popup pages on a user's behalf without surprising them.

## When to activate

Activate when the user says any of:

- "팝업 페이지 만들어줘" · "공유 링크 만들어줘" · "랜딩 페이지" · "이벤트 페이지"
- "친구한테 보낼 페이지" · "초대장 페이지" · "링크 모음"
- "이 HTML 파일 공유 링크로 만들어줘" · "이 보고서/프레젠테이션 호스팅"
- "이 PDF 공유 링크로 만들어줘" · "PDF 호스팅"
- A request that ends in "링크로 받고 싶어" / "URL만 있으면 돼"

Also **proactively offer** this right after you produce an HTML artifact or a PDF the user will likely want to share — e.g. "공유 링크로 만들어 드릴까요?"

Do **not** activate for: building a full multi-page site, anything needing a database, anything needing per-user auth (Popup is link-share, not app hosting).

## No PIN — pages belong to the browser/account that made them

Popup **no longer uses PINs.** Do not ask the user for a PIN, do not invent one, and do not mention PINs. (Older versions of this skill required a PIN — that behavior is removed.)

Editing works one of two ways:

- **Same browser** — the browser that created a page can edit it without any secret.
- **Google login** — if the user connects Popup to their Claude account (or logs in at `popup2026.com/my-pages`), pages they create are automatically attributed to that account and editable from `/my-pages` on any device.

If a user asks "how do I edit this later," point them to `popup2026.com/my-pages` (Google login). There is no PIN to remember or lose.

## Tools (via MCP)

The Popup Remote MCP server at `https://popup2026.com/api/mcp` exposes:

| Tool | Purpose |
|------|---------|
| `create_page` | Create a page from structured blocks (best for simple, structured content) |
| `create_html_page` | Host a complete raw HTML file as-is, fullscreen iframe (max **5 MB**) |
| `create_pdf_page` | Host a PDF (base64) with a fullscreen PDF viewer (up to ~3 MB via MCP) |
| `get_page` | Read an existing block page's blocks by slug |
| `update_page` | Replace a block page's blocks (no PIN) |
| `list_templates` | List available templates |

No write tool requires a PIN.

## Choosing the tool

Pick based on the *shape* of the content, not on what the user literally says:

- **`create_html_page`** — the user has (or you will write) a complete, self-contained HTML document: reports, dashboards, visualizations, slide decks, custom-designed pages, AI-generated artifacts. Renders fullscreen exactly as-is. Limit **5 MB**.
- **`create_page`** — the content is simple, structured blocks: a short landing page, link-in-bio, event invite, notice. Compose an ordered array of blocks. Use `list_templates` first if a template fits.
- **`create_pdf_page`** — the user made or has a PDF to share. Pass the PDF bytes as base64 in `pdf_base64` (+ optional `filename`). Up to ~3 MB through the tool — for a bigger PDF, tell the user to drag-and-drop it at **popup2026.com** (up to 50 MB).

When unsure between HTML and blocks: rich/visual/custom layout → HTML; a few headings, text, links, and a button → blocks (lighter and block-editable).

## Block-based pages (`create_page`)

Combine these block types in order. Each block gets an auto-generated `id` server-side.

| Block | Required fields | Optional |
|-------|----------------|----------|
| `h1` | `content` | — |
| `h2` | `content` | — |
| `text` | `content` | — |
| `image` | `url` | `width` (small/medium/full) |
| `button` | `label`, `href` | `color` (hex) |
| `youtube` | `videoId` | `width` |
| `link` | `url`, `title` | `description` |
| `divider` | — | — |

**Composition heuristics:**

- Lead with a single `h1` — it becomes the OG title and SEO title.
- Follow with a `text` block — it becomes the OG description.
- Visuals (image / youtube) come early to anchor the eye.
- Put CTAs (`button`) near the bottom, one or two max.
- A `divider` between sections is cleaner than three blank `text` blocks.

## Raw HTML pages (`create_html_page`)

Use when the user provides complete HTML — presentations, reports, custom visualizations, single-file demos. Max **5 MB**. Rendered fullscreen in a sandboxed iframe (no `allow-same-origin`, so the HTML cannot escape into the parent page).

Write it to stand alone:

- **Self-contained:** inline all CSS in a `<style>` tag. No build step, no local imports.
- **Mobile-friendly:** include `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **External assets via URL only:** images/fonts must be absolute `https://` URLs. Avoid huge base64 blobs — they eat into the 5 MB limit.
- **A real `<title>`** (+ `og:title`/`og:description` meta when you can) — it becomes the page title and social preview.
- JS is allowed (sandboxed) but should degrade gracefully.

Do **not** use `create_html_page` for content the user described in natural language — convert that into blocks via `create_page` instead. `create_html_page` is for when the user hands you actual HTML.

## PDF pages (`create_pdf_page`)

Use when the user has a PDF to share. Pass the bytes as base64 in `pdf_base64`, plus an optional `filename` (becomes the page title). The PDF is hosted with a fullscreen viewer at `popup2026.com/<slug>`. If it's over ~3 MB, tell the user to drag-and-drop the file at **popup2026.com** (up to 50 MB) instead.

## Editing existing block pages

1. Use `get_page` to fetch current blocks (slug only).
2. Modify the blocks array minimally — preserve unrelated blocks.
3. Call `update_page` with the slug and the full new blocks array.

Never delete blocks the user didn't explicitly mention removing. The server replaces all blocks, so any block you omit gets deleted — always `get_page` first.

HTML and PDF pages are **not** block-editable. To change one, publish a new page.

## Lifetime and extension

- Pages live for **30 days** by default.
- After expiry, the page shows a lock screen instead of content.
- To extend, direct users to `popup2026.com/my-pages` (Google login) or `popup2026.com/extend`.

## After-action checklist

After successfully creating a page, always tell the user:

1. The **URL** (`popup2026.com/<slug>`)
2. That it **lives for 30 days** (extendable)
3. That it's **editable at `popup2026.com/my-pages`** after Google login (no PIN)
4. Optional: a one-line summary of what's on the page

Do not call additional tools unless the user asks for changes.

## What this skill does NOT do

- It does not create user accounts to publish — Popup is intentionally login-free (login is optional, only for cross-device editing).
- It does not host HTML larger than **5 MB** or PDFs larger than ~3 MB via MCP (use drag-and-drop at popup2026.com for larger PDFs, up to 50 MB).
- It does not use or require a PIN — that mechanism was removed.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---------|--------------|-----------|
| A connected "popup" tool keeps asking for a PIN | An **old/wrong** MCP connector is installed | Remove it and connect only `https://popup2026.com/api/mcp` — the current server needs no PIN |
| `create_html_page` returns a size error | HTML exceeds 5 MB (usually inlined base64 assets) | Host images externally and reference them by `https://` URL |
| `create_pdf_page` returns a size error | PDF exceeds the ~3 MB MCP limit | Tell the user to drag-and-drop the PDF at popup2026.com (up to 50 MB) |
| Page shows "🔒 잠김" | Page expired (30+ days) or was reported | Send the user to `popup2026.com/my-pages` (Google login) to extend |
| OG preview shows only title, no description | Block page has no `text` block (or HTML has no `<meta name="description">`) | Add a `text` block (or `<meta>`) — the first one becomes the description |
| Image block shows broken | Image URL is not publicly accessible | The image must be a public `https://` URL (HTTP 200 from anywhere) |

## Site URLs

- App: https://popup2026.com
- MCP: https://popup2026.com/api/mcp
- My pages (Google login): https://popup2026.com/my-pages
- Extend: https://popup2026.com/extend
