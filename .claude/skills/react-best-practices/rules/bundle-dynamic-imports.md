---
title: Dynamic Imports for Heavy Components
impact: CRITICAL
impactDescription: directly affects TTI and LCP
tags: bundle, dynamic-import, code-splitting, react-lazy
---

## Dynamic Imports for Heavy Components

> 프로젝트 수정: 원본의 `next/dynamic`을 React 기본 기능인 `React.lazy` + `Suspense`로 바꿨습니다.

Use `React.lazy` to lazy-load large components not needed on initial render.

**Incorrect (Monaco bundles with main chunk ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correct (Monaco loads on demand):**

```tsx
import { lazy, Suspense } from 'react'

const MonacoEditor = lazy(() =>
  import('./monaco-editor').then(m => ({ default: m.MonacoEditor }))
)

function CodePanel({ code }: { code: string }) {
  return (
    <Suspense fallback={null}>
      <MonacoEditor value={code} />
    </Suspense>
  )
}
```

`fallback`에 로딩 표시가 필요하면 템플릿의 `Loading` 컴포넌트(`@/components/ui`)를 사용합니다.
