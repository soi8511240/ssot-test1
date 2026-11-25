# Chart

> 파일: `src/components/ui/Chart/Chart.tsx` (Recharts 기반) · 가이드: `/guide/chart`
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import { ChartLine, ChartArea, ChartBar, ChartPie, ChartRadar } from "@/components/ui";
```

## Props

**ChartLine · ChartArea · ChartBar** — 가로축이 있는 차트

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `data` | 객체 배열 | — (필수) | 예: `[{ month: "1월", premium: 52000 }]` |
| `xKey` | `data`의 키 | — (필수) | 가로축에 쓸 키 |
| `series` | `{ dataKey, name?, color?, strokeWidth? }[]` | — (필수) | 그릴 값 목록. `color` 생략 시 `var(--primary)`. `strokeWidth`(기본 `2`)는 `ChartLine`만 |
| `height` | `number` (px) | `280` | 차트 높이 |
| `showGrid` | `boolean` | `true` | 배경 격자선 |
| `showLegend` | `boolean` | `true` | 범례 |
| `yDomain` | `[최소, 최대]` · `["auto", "auto"]` | — | 세로축 범위 (`ChartLine`·`ChartArea`만) |

**ChartPie** — 비율

| Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `data` | 객체 배열 | — (필수) | |
| `series` | `{ dataKey, nameKey?, innerRadius?, outerRadius? }` (배열 아님) | — (필수) | `nameKey` 기본 `"name"`, `outerRadius` 기본 `90`. `innerRadius`를 주면 도넛형 |
| `colors` | `string[]` | 초록·파랑·보라·빨강·갈색 5색 | 조각 색 (순서대로 반복) |
| `height` · `showLegend` | | `280` · `true` | |

**ChartRadar** — 여러 지표 비교: `data`, `angleKey`(둘레 항목 키), `series`, `height`(기본 **`320`**), `showLegend`(기본 `true`)

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 차트 | 용도 | 보험 설계 예 |
| --- | --- | --- |
| `ChartLine` | 시간에 따른 변화 (선 1~2개) | 나이별 예상 보험료 추이 |
| `ChartArea` | 변화량을 면적으로 | 납입 기간 누적 보험료 |
| `ChartBar` | 항목끼리 크기 비교 | 상품별 월 보험료 비교 |
| `ChartPie` | 전체 중 비율 | 주계약·특약 보험료 구성 |
| `ChartRadar` | 여러 지표를 한눈에 비교 (현재 vs 목표) | 보장 영역별 보장 수준 (사망·암·입원·수술) |

## 접근성

- 차트는 그림(SVG)이라 화면낭독기가 숫자를 읽지 못하고, 컴포넌트에 대체 텍스트 기능도 없습니다. **페이지에서 반드시 글로 된 대안을 함께 둡니다.**
    - 차트 위에 무엇을 보여 주는지 제목(예: `<h3>상품별 월 보험료</h3>`)
    - 같은 숫자를 담은 표(`Table`) 또는 핵심 요약 문장 (예: "A 상품이 월 52,000원으로 가장 저렴합니다.")
- 값의 차이를 색으로만 구분하지 않습니다. `series`마다 `name`을 넣어 범례에 이름이 보이게 하고, `showLegend={false}`로 범례를 끄지 않습니다.
- 마우스를 올려야 보이는 툴팁에만 중요한 숫자를 두지 않습니다. (키보드로는 툴팁을 열 수 없음)
- 금액·단위는 데이터가 아닌 제목이나 요약 문장에 적습니다 (예: "단위: 원").

## 하면 안 되는 것

- 차트 테두리·배경·모서리를 바꾸기 → 각 차트는 `className`을 받지 않습니다. 감싸는 부모로 배치만 합니다.
    - 금지: `<div className="[&_svg]:rounded-xl bg-gray-100"><ChartBar … /></div>`
    - 허용: `<div className="grid grid-cols-2 gap-4"><ChartBar … /><ChartPie … /></div>`
- 차트 높이를 화면마다 제각각 정하기 → 기본 `280`(Radar `320`)을 쓰고, 바꿔야 하면 사용자에게 확인합니다.
- `recharts`를 페이지에서 직접 불러 새 차트 만들기 → 필요한 형태가 없으면 이 파일에 먼저 추가합니다.
- `series`의 `color`에 아무 색이나 쓰기 → 가이드에 쓰인 색(`#00997a`, `#2b7bd6`, `#a63ac0`)이나 생략(`--primary`)만 씁니다.
