# Changelog

All notable changes to this skill package will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] — 2026-07-15

Major update to match the current Popup server. **Breaking:** the PIN mechanism was
removed service-wide; agents must no longer ask for or pass a PIN.

### Changed

- **Removed the PIN requirement everywhere.** `create_page` / `create_html_page` /
  `update_page` no longer take or verify a PIN. SKILL.md, examples.md, and README no
  longer instruct the agent to ask for one.
- **Ownership model:** pages belong to the browser/account that created them. Cross-device
  editing is via Google login at `popup2026.com/my-pages` (auto-attribution while connected).
- **HTML limit raised 500 KB → 5 MB** for `create_html_page`.

### Added

- **`create_pdf_page`** — host a PDF (base64) with a fullscreen viewer, up to ~3 MB via
  MCP (50 MB via drag-and-drop at popup2026.com). Documented in SKILL.md + examples.md.
- "Choosing the tool" guidance (blocks vs. raw HTML vs. PDF) in SKILL.md.
- Proactive-offer note: suggest a share link right after producing an HTML/PDF artifact.
- README upgrade note + troubleshooting row for removing stale/old "popup" connectors
  that still ask for a PIN.

### Removed

- MANDATORY PIN rule, PIN-recovery flow, and all PIN-related troubleshooting/refusals.

## [1.0.0] — 2026-06-03

Initial public release.

### Added

- `popup/SKILL.md` — Activation rules, MANDATORY PIN rule, block reference,
  composition heuristics, first-time setup reminder, PIN-recovery flow,
  troubleshooting table
- `popup/examples.md` — 5 worked walkthroughs:
  birthday card, link-in-bio page, HTML report hosting, editing flow,
  refusal cases (lost PIN, foreign page ownership, in-iframe auth)
- `popup/marketplace.json` — Human-facing metadata for skill marketplaces
- `.mcp.json` — Bundles the Popup Remote MCP server at
  `https://popup2026.com/api/mcp` so install auto-wires the toolset
- `README.md` — Per-agent install instructions for Claude Code, Codex CLI,
  Gemini CLI, and Cursor
- `LICENSE` — MIT
- `.github/workflows/validate.yml` — CI for SKILL.md frontmatter, markdown
  link checking, and MCP server reachability
- `scripts/validate-skill.mjs` — Frontmatter validator for SKILL.md

### Notes

- Compatible with the [agentskills.io](https://agentskills.io) spec
- Tools exposed (via MCP): `create_page`, `create_html_page`, `get_page`,
  `update_page`, `list_templates`
- Free page extension on popup2026.com runs through **2026-08-23**

[2.0.0]: https://github.com/richard-kim-79/popup-skills/releases/tag/v2.0.0
[1.0.0]: https://github.com/richard-kim-79/popup-skills/releases/tag/v1.0.0
