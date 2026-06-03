# popup-skills

[![CI](https://github.com/richard-kim-79/popup-skills/actions/workflows/validate.yml/badge.svg)](https://github.com/richard-kim-79/popup-skills/actions/workflows/validate.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Release](https://img.shields.io/github/v/release/richard-kim-79/popup-skills?logo=github)](https://github.com/richard-kim-79/popup-skills/releases)
[![GitHub stars](https://img.shields.io/github/stars/richard-kim-79/popup-skills?style=flat&logo=github)](https://github.com/richard-kim-79/popup-skills/stargazers)
[![Popup](https://img.shields.io/badge/popup2026.com-2A6049?logo=safari&logoColor=white)](https://popup2026.com)
[![MCP](https://img.shields.io/badge/MCP-Remote%20Server-blue)](https://popup2026.com/api/mcp)

AI agent skills for [Popup](https://popup2026.com) — the 30-second shareable-page service.

Drop this into any agent that follows the [Agent Skills](https://agentskills.io) convention (Claude Code, Codex CLI, Gemini CLI, Cursor) and your assistant will know how to create, edit, and host Popup pages with the same conventions the team uses.

---

## What's inside

```
popup-skills/
├── popup/
│   ├── SKILL.md         # Agent activation rules + MANDATORY PIN rule + block reference
│   ├── examples.md      # Worked walkthroughs (birthday card, link-in-bio, HTML hosting, edits)
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

The skill activates, the agent asks for your edit PIN, and you get back a `popup2026.com/<slug>` URL in seconds.

For HTML files:

> Drop `report.html` into the chat → "이 HTML 공유 링크로 호스팅해줘"

---

## Tools exposed by the MCP

| Tool | Purpose |
|------|---------|
| `create_page` | Block-based page (h1/h2/text/image/button/link/youtube/divider) |
| `create_html_page` | Raw HTML hosting, fullscreen iframe (max 500 KB) |
| `get_page` | Fetch existing page by slug |
| `update_page` | Replace blocks (requires PIN) |
| `list_templates` | List page templates |

---

## Why a skill instead of "just" an MCP?

The MCP gives the agent the *tools*. The skill gives it the *judgment*:

- It enforces that the agent **always asks the user for a PIN** before creating a page (PINs are unrecoverable; an auto-generated one bricks the page).
- It tells the agent **when not to activate** (Popup is not multi-page hosting, not a CMS, not for user-auth apps).
- It provides composition heuristics (lead with H1 = becomes OG title, follow with text = becomes OG description, etc.).
- It documents the lock/extend/PIN-recovery flow so the agent doesn't hallucinate workarounds.

Same pattern as [`huggingface/skills`](https://github.com/huggingface/skills) — the MCP is the muscle, SKILL.md is the brain.

---

## Service URLs

- App: <https://popup2026.com>
- Remote MCP: <https://popup2026.com/api/mcp>
- My pages (Google login): <https://popup2026.com/my-pages>
- Extend (free through 2026-08-23): <https://popup2026.com/extend>

---

## License

MIT
