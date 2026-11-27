---
title: Use defer or async on Script Tags
impact: HIGH
impactDescription: eliminates render-blocking
tags: rendering, script, defer, async, performance
---

## Use defer or async on Script Tags

**Impact: HIGH (eliminates render-blocking)**

Script tags without `defer` or `async` block HTML parsing while the script downloads and executes. This delays First Contentful Paint and Time to Interactive.

- **`defer`**: Downloads in parallel, executes after HTML parsing completes, maintains execution order
- **`async`**: Downloads in parallel, executes immediately when ready, no guaranteed order

Use `defer` for scripts that depend on DOM or other scripts. Use `async` for independent scripts like analytics.

**Incorrect (blocks rendering):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        <script src="https://example.com/analytics.js" />
        <script src="/scripts/utils.js" />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**Correct (non-blocking):**

```tsx
export default function Document() {
  return (
    <html>
      <head>
        {/* Independent script - use async */}
        <script src="https://example.com/analytics.js" async />
        {/* DOM-dependent script - use defer */}
        <script src="/scripts/utils.js" defer />
      </head>
      <body>{/* content */}</body>
    </html>
  )
}
```

**프로젝트 참고:** Vite 프로젝트에서는 외부 스크립트를 루트 `index.html`에 직접 넣으므로, 위 예시의 `async`·`defer` 속성을 `index.html`의 `<script>` 태그에 그대로 적용합니다. 외부 스크립트 추가는 승인이 필요합니다(`AGENTS.md` 2장).

Reference: [MDN - Script element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#defer)
