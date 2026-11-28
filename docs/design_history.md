# 설계 결정 기록 (`docs/design_history.md`)

> `docs/design.md` 8장(결정 기록)의 내용입니다. 새 결정은 아래 표에 한 줄씩 추가합니다.

| 날짜 | 결정 | 이유 |
|---|---|---|
| 2026-11-25 | publishTemplate(https://github.com/codoly83/publishTemplate)을 프로젝트 기반으로 채택하고, 문서 규칙을 템플릿 방식에 맞춤 | 디자인 원본이 없는 상태에서 검증된 공통 컴포넌트·가이드를 바로 사용 |
| 2026-11-25 | 스타일 방식을 일반 CSS 3파일 → Tailwind + SCSS/CSS Modules 혼용으로 변경 | 템플릿의 스타일 전략(`/guide/tailwind-strategy`) 유지 |
| 2026-11-25 | 패키지 매니저 npm → pnpm | 템플릿 `pnpm-lock.yaml` 기준으로 동일 버전 설치 |
| 2026-11-25 | IA(`/Ia`)·Guide(`/Guide`) 자체 구현을 템플릿의 `/guide/ialist`·`/guide/*`로 대체 | 템플릿에 같은 역할의 화면이 이미 있음 |
| 2026-11-25 | 공통 컴포넌트 `className`은 배치·간격에만, 간격은 `2`·`4`·`6` 세 단계만 (`AGENTS.md` 5.1.1) | 페이지마다 컴포넌트 모양·간격이 달라지는 것 방지 |
| 2026-11-25 | 컴포넌트 사용 규칙 문서 `docs/components/{이름}.md`를 필요한 것부터 작성 | 전체를 한 번에 만들면 문서끼리 어긋나기 쉬움 |
| 2026-11-25 | `vite.config.ts`의 `base`를 `/publishTemplate/` → `/`로 변경, GitHub Pages 배포 워크플로 제외 | 원본 저장소 배포용 설정이므로 이 프로젝트에 맞지 않음 |
