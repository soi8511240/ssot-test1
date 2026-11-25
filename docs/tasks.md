# 작업 목록 (Tasks)

> AI와 사람이 **지금 무엇을 할 차례인지** 확인하는 문서입니다.
> 위에서부터 순서대로 하나씩 진행하고, 끝나면 `[x]`로 체크합니다.
> Phase 순서는 `AGENTS.md` 6.4절(초기 구성 → 화면 분석 → 공통 컴포넌트·가이드 → 페이지)을 따릅니다.
> 각 작업 옆의 `(US-xx)`는 `requirements.md`의 사용자 스토리 번호입니다.

---

## 진행 상태
- **현재 단계**: Phase 1 완료 → Phase 2 대기
- **다음 작업**: 2-1
- **막힌 부분**: `requirements.md` 6장(디자인 원본) 없음

---

## Phase 1. 초기 구성

- [x] 1-1. publishTemplate 가져오기 (`.git`, `.github` 제외), 패키지 이름 `ssort-test1`
- [x] 1-2. `vite.config.ts` `base`를 `/`로 변경
- [x] 1-3. `pnpm install`로 의존성 설치 (`pnpm-lock.yaml` 기준)
- [x] 1-4. 빌드 통과 확인 (`pnpm build`)
- [x] 1-5. 프로젝트 정보 반영: `index.html` `<title>`과 `RouteTitleSync.tsx` `APP_TITLE`을 `보험가입설계 서비스`로 변경. 가이드 로고 `Publish Guide`는 가이드 도구 이름이라 유지
- [x] 1-6. 템플릿 예시 페이지(홈, 로그인, 대시보드) 유지 결정, 탭 제목을 `publishing.ts` 이름으로 표시
- [x] 1-7. 린트 오류 정리 (`pnpm lint` 0건)

## Phase 2. 화면 분석 (코드 작성 없음)

- [ ] 2-1. 디자인 원본(`requirements.md` 6장) 전체 페이지 확인
- [ ] 2-2. 필요한 UI를 템플릿 컴포넌트(`design.md` 2장)와 대조하고, 부족한 컴포넌트·variant를 `제안`으로 기록
- [ ] 2-3. 제안 목록 사용자 승인 → 상태 `승인`으로 변경
- [ ] 2-4. 승인된 항목을 Phase 3에 작업으로 등록

> 시안이 페이지별로 순차 전달되면, 새 시안마다 이 Phase를 다시 수행하고 Phase 3에 작업을 추가합니다.

## Phase 3. 공통 컴포넌트 + 가이드

> 컴포넌트마다 "구현 → 가이드 샘플 갱신 → 수동 검수(`AGENTS.md` 9.2)"를 마쳐야 체크합니다.

- [ ] 3-1. {Phase 2에서 승인된 컴포넌트} + 가이드 샘플

## Phase 4. 페이지

> 페이지마다 `src/publish/pages/`에 만들고 `publishing.ts` 등록까지 같은 작업에서 완료합니다. 공통 컴포넌트가 부족하면 멈추고 Phase 2로 돌아갑니다.

- [ ] 4-1. {페이지명} (`/publish/{경로}`, US-xx)

## Phase 5. 마무리

- [ ] 5-1. 반응형 점검 (360px / 768px / 1024px / 1440px)
- [ ] 5-2. 다크모드 점검
- [ ] 5-3. 접근성 점검 (`alt`, 키보드 포커스)
- [ ] 5-4. 하드코딩된 색상을 토큰으로 정리
- [ ] 5-5. `console.log` 제거, 린트 확인 (`pnpm lint`)
- [ ] 5-6. 빌드 최종 확인 (`pnpm build`)
- [ ] 5-7. 문서와 실제 코드가 일치하는지 확인 (requirements, design 업데이트)
- [ ] 5-8. `publishing.ts`의 목록·경로·상태가 실제 라우트와 tasks.md 완료 기록과 일치하는지 확인

---

## 완료 기록

| 날짜 | 작업 | 메모 |
|---|---|---|
| 2026-11-25 | 1-1 ~ 1-4 | publishTemplate 적용. 직전에 만든 Vite 기본 구성(자체 `/Ia`, `/Guide`)은 템플릿으로 대체 |
| 2026-11-25 | 1-6, 1-7 | 예시 페이지 3개 유지·화면 확인. 템플릿 원본 린트 오류 29건·경고 2건 정리(variants·훅 파일 분리, Tooltip 훅 순서, TreeView·퀵메뉴 effect 내 setState 제거 등) |

## 나중에 할 것 (Backlog)

- [ ] 빌드 CSS 경고 (`VariantBtn` 선택자 중첩 문법) 검토
- [ ] 컴포넌트 문서 작성 중 찾은 코드 문제 17건 (2026-11-25, 보류)
    - 접근성: DatePicker 월·연 이동 버튼 이름 없음, 지우기(×) 키보드 불가, 기간 선택 라벨 연결 불가 / InputStepper −·+ 버튼 이름 고정 / Chart 대체 설명 불가 / Icon `aria-hidden` 기본값 없음 / Accordion 포커스 시 크기 흔들림
    - 스타일 미적용: Accordion variant·size 11개, AlertDialog `size="sm"`, Icon 색 지정(27개 SVG 색 고정, 글자색 덮어씀), Chart 원형 차트 고정 색
    - 동작·타입: DatePicker 기간 비우기 반영 안 됨, InputStepper 직접 입력 범위 제한 없음, AccordionContent className 이중 적용, Checkbox children 사용 시 ref 미연결, Chip `color` 아무 문자열 허용
    - 가이드 샘플의 5.1.1 위반(Accordion 커스텀 예시, Chip·Collapsible·Icon 샘플 일부) 정리
- [ ] 빌드 결과 번들 크기 경고(가이드의 shiki 언어 번들 등) 검토
- [ ] 실제 API 연동
