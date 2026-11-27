---
title: Defer Non-Critical Third-Party Libraries
impact: MEDIUM
impactDescription: loads after first render
tags: bundle, third-party, analytics, defer
---

## Defer Non-Critical Third-Party Libraries

> 프로젝트 수정: 원본의 `next/dynamic` 예시를 `React.lazy`로 바꿨습니다. 분석·로그 도구 추가는 새 라이브러리 설치에 해당하므로 승인이 필요합니다(`AGENTS.md` 2장).

Analytics, logging, and error tracking don't block user interaction. Load them after the first render.

**Incorrect (blocks initial bundle):**

```tsx
import { Analytics } from 'some-analytics/react'

export default function App() {
  return (
    <>
      <Routes />
      <Analytics />
    </>
  )
}
```

**Correct (loaded in a separate chunk after first render):**

```tsx
import { lazy, Suspense } from 'react'

const Analytics = lazy(() =>
  import('some-analytics/react').then(m => ({ default: m.Analytics }))
)

export default function App() {
  return (
    <>
      <Routes />
      <Suspense fallback={null}>
        <Analytics />
      </Suspense>
    </>
  )
}
```
