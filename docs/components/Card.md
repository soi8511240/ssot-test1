# Card

> 파일: `src/components/ui/Card/Card.tsx` (+ `Card.module.css`) · 가이드: `/guide/card`
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter,
} from "@/components/ui";
```

## Props

모든 조각은 variant가 없는 `<div>`입니다. `<div>` 속성(`id`, `aria-*` 등)을 그대로 전달합니다.

| 컴포넌트 | 위치 | 설명 |
| --- | --- | --- |
| `Card` | 바깥 상자 | 테두리·배경이 있는 묶음 |
| `CardHeader` | 위 | `CardTitle`, `CardDescription`, `CardAction`을 담음 |
| `CardTitle` | 헤더 안 | 카드 제목 (태그는 `<div>`) |
| `CardDescription` | 헤더 안 | 제목 아래 보조 설명 |
| `CardAction` | 헤더 오른쪽 | 작은 버튼 하나 (예: 전체 읽음) |
| `CardContent` | 가운데 | 본문 |
| `CardFooter` | 아래 | 버튼 영역 |

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 기본 | `Header(Title + Description)` + `Content` + `Footer` | 상품 카드: 상품명 · 한 줄 설명 · 월 보험료 · [설계하기] |
| 헤더 액션 | `Header(Title + Action)` + `Content` | 최근 설계 목록 + [전체 보기] |

- `CardAction` 안 버튼은 가이드처럼 `variant="outline" size="sm"`, 푸터 버튼은 `size="sm"`을 씁니다.

## 접근성

- `CardTitle`은 제목 태그가 아닌 `<div>`입니다. 화면 구조상 제목이 필요하면 안에 제목 태그를 넣습니다.
    - 예: `<CardTitle><h3>무배당 건강보험</h3></CardTitle>` (단계는 페이지 제목 순서에 맞춤)
- 카드 전체를 클릭 영역으로 만들지 않습니다. `<Card onClick>`은 키보드로 누를 수 없습니다. 이동이 필요하면 카드 안에 링크 버튼(`<Button asChild><Link>`)을 둡니다.
- 같은 버튼 글자("설계하기")가 카드마다 반복되면 `aria-label="무배당 건강보험 설계하기"`처럼 어느 카드인지 알 수 있게 합니다.
- 카드 목록은 `<ul>`/`<li>`로 감싸 개수를 알 수 있게 합니다.

## 하면 안 되는 것

- `className`으로 테두리·배경·그림자·모서리·제목 글자 크기 바꾸기
    - 금지: `<Card className="shadow-lg rounded-2xl bg-blue-50">`, `<CardTitle className="text-xl">`
    - 허용: `<Card className="max-w-[420px]">` (폭), `<CardContent className="grid gap-2">`, `<CardFooter className="justify-end">` (배치)
- 카드 안·카드 사이 간격에 `2`·`4`·`6` 외의 값 쓰기 → 카드 사이는 `gap-4`가 기본입니다.
- 카드 안에 카드 넣기
- 카드를 레이아웃 칸 나누기 용도로만 쓰기 (테두리 없는 영역은 그냥 `<div>`/`<section>`)
