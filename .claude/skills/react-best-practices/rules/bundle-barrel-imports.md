---
title: Barrel Imports (Project Rule Takes Precedence)
impact: LOW
impactDescription: project convention over generic advice
tags: bundle, imports, barrel-files, project-rule
---

## Barrel Imports (Project Rule Takes Precedence)

> 프로젝트 수정: 원본 규칙은 "barrel 파일(index.ts)로 묶어서 가져오지 말고 각 파일에서 직접 가져오라"입니다. 이 프로젝트에서는 **`AGENTS.md`의 규칙이 우선**합니다.

**이 프로젝트의 규칙**

- 공통 컴포넌트는 지금처럼 `@/components/ui`(`src/components/ui/index.ts`)에서 가져옵니다. 개별 파일 경로(`@/components/ui/Button/Button`)로 바꾸자고 제안하지 않습니다.
- `lucide-react` 등 외부 라이브러리도 기존처럼 이름으로 가져옵니다(`import { Check } from 'lucide-react'`). `lucide-react`는 깊은 경로 import에 타입이 없어 `strict` 설정에서 오류가 납니다.
- Next.js 전용 설정(`optimizePackageImports`)은 이 프로젝트(Vite)에 해당하지 않습니다.

**확인되지 않은 점 (애매함)**

- barrel 방식이 이 프로젝트의 번들 크기에 실제로 영향을 주는지는 측정하지 않았습니다. 특히 쓰지 않는 컴포넌트의 스타일 파일이나 `DatePicker`·`Swiper` 같은 무거운 의존성이 다른 페이지 번들에 섞이는지는 모릅니다.
- 번들 크기가 문제로 보이면 import 방식을 바꾸기 전에 `pnpm build` 결과로 먼저 확인하고, 사용자에게 보고한 뒤 결정합니다.
