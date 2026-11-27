---
name: react-best-practices
description: React performance optimization guidelines adapted for this Vite + React 19 publishing project (based on Vercel's vercel-react-best-practices, with Next.js-only rules removed). Use when writing, reviewing, or refactoring React components in this project, or when the user asks about re-renders, bundle size, or performance. Project rules in AGENTS.md always take precedence.
license: MIT
metadata:
  author: vercel (adapted for this project)
  source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
  version: "1.0.0-project"
---

# React Best Practices (프로젝트 적용판)

Vercel의 `vercel-react-best-practices`(MIT)를 이 프로젝트(Vite 7 + React 19, 퍼블리싱 전용)에 맞게 고친 버전입니다.

## 이 프로젝트에서의 우선순위 (먼저 읽기)

1. **`AGENTS.md`와 `docs/stack/react.md`가 이 스킬보다 우선합니다.** 충돌하면 프로젝트 규칙을 따르고, 차이를 사용자에게 보고합니다.
2. **import 경로:** 공통 컴포넌트는 `@/components/ui`에서 가져옵니다. barrel import를 개별 경로로 바꾸자고 제안하지 않습니다 (`rules/bundle-barrel-imports.md`).
3. **데이터 요청:** SWR을 쓰지 않고, 이미 있는 `@tanstack/react-query`를 씁니다 (`rules/client-query-dedup.md`). 퍼블리싱 단계에서는 실제 API를 연동하지 않습니다.
4. **새 라이브러리 금지:** 규칙을 지키려고 패키지를 새로 설치하지 않습니다. 필요하면 이유를 설명하고 승인을 받습니다.
5. **측정 없이 단정하지 않기:** 성능 개선 효과를 측정하지 않았으면 "확인하지 않았다"고 밝힙니다.

## 원본에서 바꾼 점

- **삭제 (Next.js·서버 전용):** `server-*` 10개, `async-api-routes`, `async-suspense-boundaries`(서버 비동기 컴포넌트 기준), `rendering-hydration-no-flicker`, `rendering-hydration-suppress-warning`
- **SWR → React Query:** `client-swr-dedup` → `client-query-dedup`, `client-event-listeners`에서 SWR 제거
- **`next/dynamic` → `React.lazy`:** `bundle-dynamic-imports`, `bundle-defer-third-party`
- **프로젝트 규칙으로 대체:** `bundle-barrel-imports`
- **새 라이브러리 예시 제거:** `async-dependencies`(`better-all`)
- **Next.js 언급 정리:** `bundle-analyzable-paths`, `bundle-preload`, `rendering-script-defer-async`, `async-cheap-condition-before-await`

## When to Apply

- Writing new React components or publishing pages
- Reviewing code for performance issues
- Refactoring existing React code
- Optimizing bundle size or load times

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 4 | Re-render Optimization | MEDIUM | `rerender-` |
| 5 | Rendering Performance | MEDIUM | `rendering-` |
| 6 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 7 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

### 1. Eliminating Waterfalls (CRITICAL)

- `async-cheap-condition-before-await` - Check cheap sync conditions before awaiting flags or remote values
- `async-defer-await` - Move await into branches where actually used
- `async-parallel` - Use Promise.all() for independent operations
- `async-dependencies` - Start dependent promises early, await together

### 2. Bundle Size Optimization (CRITICAL)

- `bundle-barrel-imports` - **Project rule:** keep `@/components/ui` imports
- `bundle-analyzable-paths` - Prefer statically analyzable import paths
- `bundle-dynamic-imports` - Use `React.lazy` for heavy components
- `bundle-defer-third-party` - Load analytics/logging after first render
- `bundle-conditional` - Load modules only when feature is activated
- `bundle-preload` - Preload on hover/focus for perceived speed

### 3. Client-Side Data Fetching (MEDIUM-HIGH)

- `client-query-dedup` - Use React Query for automatic request deduplication
- `client-event-listeners` - Deduplicate global event listeners
- `client-passive-event-listeners` - Use passive listeners for scroll
- `client-localstorage-schema` - Version and minimize localStorage data

### 4. Re-render Optimization (MEDIUM)

- `rerender-defer-reads` - Don't subscribe to state only used in callbacks
- `rerender-memo` - Extract expensive work into memoized components
- `rerender-memo-with-default-value` - Hoist default non-primitive props
- `rerender-dependencies` - Use primitive dependencies in effects
- `rerender-derived-state` - Subscribe to derived booleans, not raw values
- `rerender-derived-state-no-effect` - Derive state during render, not effects
- `rerender-functional-setstate` - Use functional setState for stable callbacks
- `rerender-lazy-state-init` - Pass function to useState for expensive values
- `rerender-simple-expression-in-memo` - Avoid memo for simple primitives
- `rerender-split-combined-hooks` - Split hooks with independent dependencies
- `rerender-move-effect-to-event` - Put interaction logic in event handlers
- `rerender-transitions` - Use startTransition for non-urgent updates
- `rerender-use-deferred-value` - Defer expensive renders to keep input responsive
- `rerender-use-ref-transient-values` - Use refs for transient frequent values
- `rerender-no-inline-components` - Don't define components inside components

### 5. Rendering Performance (MEDIUM)

- `rendering-animate-svg-wrapper` - Animate div wrapper, not SVG element
- `rendering-content-visibility` - Use content-visibility for long lists
- `rendering-hoist-jsx` - Extract static JSX outside components
- `rendering-svg-precision` - Reduce SVG coordinate precision
- `rendering-activity` - Use Activity component for show/hide
- `rendering-conditional-render` - Use ternary, not && for conditionals
- `rendering-usetransition-loading` - Prefer useTransition for loading state
- `rendering-resource-hints` - Use React DOM resource hints for preloading
- `rendering-script-defer-async` - Use defer or async on script tags

### 6. JavaScript Performance (LOW-MEDIUM)

- `js-batch-dom-css` - Group CSS changes via classes or cssText
- `js-index-maps` - Build Map for repeated lookups
- `js-cache-property-access` - Cache object properties in loops
- `js-cache-function-results` - Cache function results in module-level Map
- `js-cache-storage` - Cache localStorage/sessionStorage reads
- `js-combine-iterations` - Combine multiple filter/map into one loop
- `js-length-check-first` - Check array length before expensive comparison
- `js-early-exit` - Return early from functions
- `js-hoist-regexp` - Hoist RegExp creation outside loops
- `js-min-max-loop` - Use loop for min/max instead of sort
- `js-set-map-lookups` - Use Set/Map for O(1) lookups
- `js-tosorted-immutable` - Use toSorted() for immutability
- `js-flatmap-filter` - Use flatMap to map and filter in one pass
- `js-request-idle-callback` - Defer non-critical work to browser idle time

### 7. Advanced Patterns (LOW)

- `advanced-effect-event-deps` - Don't put `useEffectEvent` results in effect deps
- `advanced-event-handler-refs` - Store event handlers in refs
- `advanced-init-once` - Initialize app once per app load
- `advanced-use-latest` - useLatest for stable callback refs

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/async-parallel.md
rules/rerender-no-inline-components.md
```

Each rule file contains a brief explanation, an incorrect example, a correct example, and additional context.
