# popup-skills

[![CI](https://github.com/richard-kim-79/popup-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/richard-kim-79/popup-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/richard-kim-79/popup-skills?logo=github)](https://github.com/richard-kim-79/popup-skills/releases)
[![GitHub stars](https://img.shields.io/github/stars/richard-kim-79/popup-skills?style=flat&logo=github)](https://github.com/richard-kim-79/popup-skills/stargazers)
[![Popup](https://img.shields.io/badge/popup2026.com-2A6049?logo=safari&logoColor=white)](https://popup2026.com)
[![MCP](https://img.shields.io/badge/MCP-Remote%20Server-blue)](https://popup2026.com/api/mcp)

AI agent skills for [Popup](https://popup2026.com) — the 30-second shareable-page service. **No login, no PIN.**

Drop this into any agent that follows the [Agent Skills](https://agentskills.io) convention (Claude Code, Codex CLI, Gemini CLI, Cursor) and your assistant will know how to create, edit, and host Popup pages with the same conventions the team uses.

> **Upgrading from an older install?** Popup removed the PIN mechanism. If you have an
> older "popup" MCP connector that asks for a PIN or caps HTML at 500 KB, **remove it**
> and connect only `https://popup2026.com/api/mcp`. This repo reflects the current,
> PIN-free server (5 MB HTML + PDF hosting).

---

## What's inside

```
popup-skills/
├── popup/
│   ├── SKILL.md         # Agent activation rules (no PIN) + tool guide + block reference
│   ├── examples.md      # Worked walkthroughs (birthday card, link-in-bio, HTML, PDF, edits)
│   └── marketplace.json # Human-facing metadata
├── .mcp.json            # popup2026.com/api/mcp — packaged so install auto-wires the MCP
└── README.md            # This file
```

The skill itself is documentation. The actual page-creation power comes from the Popup MCP server at `https://popup2026.com/api/mcp`, which the bundled `.mcp.json` connects automatically.

---

## Install

### Claude Code

```bash
git clone https://github.com/richard-kim-79/popup-skills.git ~/popup-skills
mkdir -p ~/.claude/skills && ln -s ~/popup-skills/popup ~/.claude/skills/popup
claude mcp add popup https://popup2026.com/api/mcp
```

Or copy `.mcp.json` to your project root for per-project install.

### Claude (web / desktop connector)

Settings → Connectors → Add custom connector → URL `https://popup2026.com/api/mcp` → Connect → Google login. Pages you make while connected are auto-saved to your account at `popup2026.com/my-pages`.

### Codex CLI

```bash
mkdir -p .agents/skills && cp -R popup-skills/popup .agents/skills/popup
cp popup-skills/.mcp.json .
```

### Gemini CLI

```bash
gemini extension install ./popup-skills/popup
```

### Cursor

```bash
mkdir -p ~/.cursor/skills && cp -R popup-skills/popup ~/.cursor/skills/popup
```

Then add the Popup MCP server in Cursor settings → MCP, URL: `https://popup2026.com/api/mcp`.

---

## Try it

Once installed, talk to your agent naturally:

> "팝업 페이지 만들어줘. 친구 생일 축하 페이지로."

The skill activates and you get back a `popup2026.com/<slug>` URL in seconds — **no PIN prompt.**

For HTML files:

> Drop `report.html` into the chat → "이 HTML 공유 링크로 호스팅해줘"

For PDFs:

> Drop `report.pdf` → "이 PDF 공유 링크로 만들어줘"

---

## Tools exposed by the MCP

| Tool | Purpose |
|------|---------|
| `create_page` | Block-based page (h1/h2/text/image/button/link/youtube/divider) |
| `create_html_page` | Raw HTML hosting, fullscreen iframe (max **5 MB**) |
| `create_pdf_page` | PDF hosting with a fullscreen viewer (up to ~3 MB via MCP; 50 MB via drag-and-drop at popup2026.com) |
| `get_page` | Fetch an existing block page by slug |
| `update_page` | Replace a block page's blocks (**no PIN**) |
| `list_templates` | List page templates |
| `set_page_visibility` | Publish to / hide from the public gallery (indexed by search engines and other AI agents) |

---

## Why a skill instead of "just" an MCP?

The MCP gives the agent the *tools*. The skill gives it the *judgment*:

- It tells the agent **not to ask for a PIN** (Popup is PIN-free; pages belong to the creating browser/account and are managed via Google login at `/my-pages`).
- It helps the agent **pick the right tool** — blocks vs. raw HTML vs. PDF — based on the shape of the content.
- It has the agent **ask once** whether to publish a new page to the public gallery, with a concrete suggested title — and never publish without a yes.
- It tells the agent **when not to activate** (Popup is not multi-page hosting, not a CMS, not for user-auth apps).
- It provides composition heuristics (lead with H1 = becomes OG title, follow with text = becomes OG description, etc.).

Same pattern as [`huggingface/skills`](https://github.com/huggingface/skills) — the MCP is the muscle, SKILL.md is the brain.

---

## Service URLs

- App: <https://popup2026.com>
- Remote MCP: <https://popup2026.com/api/mcp>
- My pages (Google login): <https://popup2026.com/my-pages>
- Extend: <https://popup2026.com/extend>

---

## License

MIT
