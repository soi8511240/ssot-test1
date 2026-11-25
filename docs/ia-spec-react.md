# 퍼블리싱 목록 명세 (`docs/ia-spec-react.md`)

> 퍼블리싱 페이지 목록(IA) 화면 `/guide/ialist`의 명세입니다 (`AGENTS.md` 6.2절). publishTemplate의 `PublishingList`를 그대로 사용합니다.

## 1. 개요

| 파일 | 내용 |
| --- | --- |
| `src/publish/guide/PublishingList.tsx` | 목록 화면 (Table + Chip) |
| `src/publish/guide/publishing.ts` | 목록 데이터 `publishingList` |

- 경로: `/guide/ialist` (가이드 셸 `Guide.tsx` 안에서 렌더링). `/`와 `/guide`로 접속하면 이 화면으로 이동합니다.
- 가이드 사이드바 상단의 **Publish ialist** 링크로 이동할 수 있습니다.
- 표 열: 페이지 / 경로 / 이동(`보기`, 새 창) / 날짜 / 상태

## 2. 데이터 구조

```ts
export const publishingList = [
  {
    name: "홈",                 // 페이지 이름
    path: "/publish/home",      // 실제 라우트 경로 (src/publish/pages 기준 자동 라우트)
    status: "완료",             // "완료" | "작업중"
    date: "2026-03-13",         // YYYY-MM-DD
  },
];
```

- `status`가 `"완료"`이면 초록 Chip, 그 외는 회색 Chip으로 표시됩니다.
- 사용하는 상태 값은 `"완료"`, `"작업중"` 두 가지입니다. 다른 값이 필요하면 `PublishingList.tsx`의 표시 규칙과 이 문서를 함께 갱신합니다.

## 3. 관리 규칙

- `src/publish/pages/`에 페이지를 만들면 **같은 작업에서** `publishingList`에 항목을 추가합니다.
- `path`는 실제 라우트와 같아야 합니다. (`docs/stack/react.md` 3장 자동 라우팅 규칙)
- 검증되지 않은 페이지를 `"완료"`로 표시하지 않습니다. `docs/tasks.md`에서 검증 완료된 페이지만 `"완료"`로 바꿉니다.
- `docs/tasks.md`와 상태가 다르면 사용자에게 확인하며 임의로 덮어쓰지 않습니다.
- 템플릿 예시 페이지(홈, 로그인, 대시보드)는 실제 프로젝트 페이지가 확정되면 사용자 확인 후 교체하거나 삭제합니다.

## 4. 확인 항목

- `/guide/ialist`에 모든 퍼블리싱 페이지가 보인다.
- `보기` 링크가 새 창으로 해당 페이지를 연다.
- 날짜·상태가 `docs/tasks.md` 완료 기록과 일치한다.
