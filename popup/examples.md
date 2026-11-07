# Popup — Worked Examples

Concrete walkthroughs for the most common Popup tasks. Popup uses **no PIN** — never ask for one (see SKILL.md).

## 1. Birthday card for a friend

**User input:** "친구 생일 축하 페이지 만들어줘. 친구 이름은 지원이야"

**Agent flow:**

1. (Optional) Ask if there's a photo or message to include.
2. Call `create_page`:

```json
{
  "blocks": [
    { "type": "h1", "content": "🎂 지원아 생일 축하해!" },
    { "type": "text", "content": "올 한 해도 함께해서 행복했어. 앞으로의 한 해도 빛나기를." },
    { "type": "image", "url": "<photo URL if provided>", "width": "medium" },
    { "type": "divider" },
    { "type": "text", "content": "— 친구들이 보내는 마음을 담아" }
  ]
}
```

3. Reply with the URL + "popup2026.com/my-pages에서 수정 가능(구글 로그인)" + one gallery question: "이 페이지를 「…」 제목으로 Popup 갤러리에 공개할까요?" (a personal invite like this one is usually a no — skip the question if it's clearly private).

## 2. Multi-link "링크 모음" page

**User input:** "내 SNS 링크 한 곳에 모아줘"

```json
{
  "blocks": [
    { "type": "h1", "content": "안녕하세요, 김리처드입니다" },
    { "type": "text", "content": "팝업과 써봄을 만들고 있어요." },
    { "type": "link", "url": "https://...", "title": "Instagram" },
    { "type": "link", "url": "https://...", "title": "X (Twitter)" },
    { "type": "link", "url": "https://...", "title": "GitHub" },
    { "type": "link", "url": "https://popup2026.com", "title": "Popup", "description": "30초 만에 만드는 공유 링크" }
  ]
}
```

## 3. Sharing an HTML report

**User input:** Drops a 380-line `report.html` (a data dashboard with inline Chart.js)

**Agent flow:**

1. Confirm the HTML is self-contained (no external CSS/JS that requires their server).
2. Call `create_html_page`:

```json
{
  "html": "<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\"><title>2026 Q1 Report</title>...</head><body>...</body></html>"
}
```

3. Reply: "리포트가 풀스크린으로 호스팅됐어요. URL 여기 있어요 — 링크가 있는 사람은 로그인 없이 볼 수 있고, 구글 로그인하면 popup2026.com/my-pages에서 관리돼요. 이 페이지를 「2026 Q1 Report」 제목으로 Popup 갤러리에 공개할까요? 공개하면 검색엔진과 다른 AI가 찾을 수 있어요."
4. If the user says yes → `set_page_visibility({ slug, listed: true })`. If no, do nothing more.

**Tip:** HTML up to **5 MB** is accepted. External CSS/JS still works as long as it's publicly accessible. The iframe runs in an opaque origin (no `allow-same-origin`), so the HTML cannot read the user's cookies on popup2026.com — this is intentional XSS isolation.

## 4. Sharing a PDF

**User input:** "방금 만든 이 PDF 리포트 공유 링크로 만들어줘" (PDF attached)

**Agent flow:**

1. Read the PDF bytes and base64-encode them.
2. Call `create_pdf_page`:

```json
{
  "pdf_base64": "<base64 of the PDF>",
  "filename": "2026-q1-report.pdf"
}
```

3. Reply with the URL. If the PDF is over ~3 MB, the tool will reject it — tell the user to drag-and-drop the file at **popup2026.com** instead (up to 50 MB).

## 5. Editing an existing block page

**User input:** "방금 만든 카페 페이지에 메뉴 정보 추가해줘. 슬러그 abc123"

**Agent flow:**

1. Call `get_page({ slug: "abc123" })` → receive current blocks.
2. Build the new blocks array — keep existing h1/text/image/button, insert new blocks for menu:

```json
{
  "slug": "abc123",
  "blocks": [
    { "type": "h1", "content": "햇살커피" },
    { "type": "text", "content": "성수동 골목 끝, 매일 7-21시 영업" },
    { "type": "image", "url": "..." },
    { "type": "divider" },
    { "type": "h2", "content": "메뉴" },
    { "type": "text", "content": "에스프레소 4,000원\n아메리카노 4,500원\n라테 5,000원" },
    { "type": "button", "label": "인스타그램", "href": "..." }
  ]
}
```

3. Call `update_page` with the full array. The server replaces all blocks, so any blocks you omit get deleted.

**Common pitfall:** Calling `update_page` with only the new blocks (forgetting the existing ones) wipes the page. Always `get_page` first. (HTML and PDF pages are not block-editable — publish a new one to change them.)

## 6. Managing pages and large attachments

Pages never expire. If a user wants to manage their pages, or a large attachment (over 10 MB) stopped loading after 30 days, direct them to:

- All their pages + editing + gallery on/off: `https://popup2026.com/my-pages` (Google login — pages created while connected are auto-attributed)
- Keep a large attachment online: `https://popup2026.com/extend?slug=<slug>`

## What to refuse

- "다른 사람 페이지 내 계정에 등록시켜줘" → Refuse; only the creator's browser/account owns a page.
- "이 HTML로 사용자 로그인 폼 만들어줘" → Warn that the sandboxed iframe cannot read parent cookies; the form will only work against the user's own backend.
