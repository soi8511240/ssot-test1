# 화면 검수 체크리스트

> 퍼블리싱 결과 화면을 **브라우저에 띄운 상태로** 점검하는 기준입니다. 어떤 에이전트나 사람이든 이 문서만 보고 같은 판정을 내릴 수 있게 썼습니다.
> 기준은 공개 표준(WCAG 2.2 AA, Core Web Vitals)과 이 프로젝트 규칙(`AGENTS.md`)입니다. 작성 시 오픈소스 화면 검사 도구들의 검사 범위를 참고했습니다.
> 작성일: 2026-11-27

<!-- 근거 표기
각 표 아래 "근거" 주석에 항목마다 어디에 근거했는지 적었습니다. 화면에는 보이지 않습니다.
- renderlint 규칙 이름: renderlint v0.2.0(npm @yitec/renderlint) docs/rules.md의 규칙 이름. 검사 대상만 참고하고 문장·기준은 새로 썼습니다.
- WCAG 2.2: W3C 성공 기준 번호
- Core Web Vitals: web.dev 기준 수치
- AGENTS.md·stack/react.md·doc-history.md: 이 프로젝트 문서의 장 번호
-->


---

## 0. 사용 방법

에이전트에게 아래 문구로 요청합니다. 에이전트는 이 문서를 읽고, 브라우저로 화면을 띄워 2장 항목을 확인한 뒤 1.4 형식으로 보고합니다.

**기본 요청**

```
RULES.md 기준으로 /publish/xxx 검수해 줘
```

**범위를 좁히거나 넓힐 때** /* 자동으로 바꿀 예정. */

| 하고 싶은 것 | 요청 문구 |
| --- | --- |
| 페이지 하나 | `RULES.md 기준으로 /publish/xxx 검수해 줘` |
| 여러 페이지 | `RULES.md 기준으로 /publish/xxx, /publish/yyy 검수해 줘` |
| 전체 | `RULES.md 기준으로 publishing.ts 목록 전체 검수해 줘` |
| 특정 묶음만 | `RULES.md의 A·B 항목만 /publish/xxx 검수해 줘` |
| 필수만 | `RULES.md 기준으로 /publish/xxx 필수 항목만 검수해 줘` |
| 특정 폭·모드만 | `RULES.md 기준으로 /publish/xxx를 360px 다크모드에서만 검수해 줘` |
| 고친 뒤 재확인 | `RULES.md 기준으로 /publish/xxx 다시 검수해서 지난번 위반이 없어졌는지 알려 줘` |

**에이전트가 지킬 것**

- 검수만 하고 **코드는 고치지 않습니다.** 고치라는 요청이 따로 있을 때만 고칩니다.
- 결과 맨 위에 요약을 씁니다: `필수 N건 · 권장 N건 · 확인 못함 N건 → 합격/불합격/보류`
- 브라우저를 쓸 수 없으면 시작 전에 그 사실을 말하고, 코드로 확인할 수 있는 항목(1.3 "코드")만 진행합니다.

---

## 1. 검수 방법

### 1.1 기본 원칙

- 판정은 **렌더된 화면**으로만 합니다. 코드만 보고 "깨질 것 같다"는 위반이 아닙니다.
- 직접 재지 못한 항목은 통과로 적지 말고 `확인 못함`으로 적습니다. **이유를 반드시 함께 적습니다.**
    - `확인 못함`: 확인할 대상은 있는데 재지 못함. 예: 브라우저를 쓸 수 없음, 다크모드로 바꿀 수 없음, 드롭다운을 열 수 없음, 요청 지연을 만들 수 없음
    - `해당 없음`: 확인할 대상이 화면에 없음. 예: 이미지가 없는 화면의 D 항목, 조회 목록이 없는 화면의 G8, 목업 API가 없는 화면의 H 항목. 판정에 영향 없음
- 고칠 때는 `AGENTS.md`를 따릅니다.
    - 공통 컴포넌트(`src/components/ui`)는 페이지 `className`으로 색·크기·모양을 덮지 않고, 컴포넌트 스타일이나 variant에서 고칩니다.
    - 간격은 `2`(8px)·`4`(16px)·`6`(24px)만 씁니다.
    - 색은 토큰(`var(--primary)` 등)으로만 고칩니다.

### 1.2 검수 범위

| 항목 | 기준 |
| --- | --- |
| 화면 폭 | 360 / 768 / 1024 / 1440px |
| 색 모드 | 라이트, 다크. 다크는 `<html class="dark">`로 전환해서 봅니다 |
| 화면 | `/guide/*`, `/publish/*` (`publishing.ts` 목록 전체) |
| 상태 | 기본 상태와 열린 상태(Modal, 드롭다운, 아코디언). 목록 화면은 데이터 0건 상태도 봅니다 |

### 1.3 필요한 수단

| 표시 | 뜻 |
| --- | --- |
| 측정 | 요소 위치·크기·계산된 스타일을 읽어 판정 (`getBoundingClientRect`, `getComputedStyle`) |
| 색 | 화면 캡처의 실제 색으로 계산 |
| 조작 | 클릭, Tab 이동, 요청 지연·실패를 직접 만들어 봄 |
| 코드 | 소스 검색 |

### 1.4 결과 등급과 보고

- **필수**: 하나라도 있으면 검수 불합격입니다.
- **권장**: 보고만 하고, 고칠지는 사람이 정합니다.

**판정**

| 결과 | 조건 |
| --- | --- |
| 불합격 | 필수 위반이 1건이라도 있음 |
| 보류 | 필수 위반은 없지만, 필수 항목 중 `확인 못함`이 있음 |
| 합격 | 필수 위반도, 필수 항목의 `확인 못함`도 없음 (권장 위반·권장 항목의 `확인 못함`은 합격에 영향 없음) |

보고는 맨 위에 요약 한 줄을 쓰고, 그 아래 위반 1건마다 한 묶음으로 씁니다. `확인 못함`은 위반 다음에 항목마다 한 줄씩 씁니다.

```
검수: /publish/xxx · 360·768·1024·1440 · 라이트·다크
결과: 필수 2건 · 권장 3건 · 확인 못함 1건 → 불합격
```

```
[필수|권장] 항목 코드 · 화면 경로 · 폭 · 라이트/다크
대상: 선택자나 화면에 보이는 글자
상태: 무엇이 얼마나 (예: 부모 오른쪽 경계를 71px 넘음 / 대비 1.81:1)
원인 추정: 파일 (확인했을 때만)
```

```
[확인 못함] 항목 코드 · 화면 경로 · 폭 · 라이트/다크
이유: 재지 못한 까닭 (예: 다크모드 전환 수단 없음 / 드롭다운이 열리지 않음)
```

---

## 2. 체크 항목

### A. 크기와 넘침

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| A1 | 필수 | 페이지가 옆으로 스크롤되지 않는가 | 문서 폭 ≤ 화면 폭. 화면 밖으로 나간 요소 없음 | 측정 |
| A2 | 필수 | 글자가 자기 상자(버튼·카드·배지·입력칸) 밖으로 나가지 않는가 | 글자 영역이 상자 안에 있음 (가로 1~2px 정도의 반올림 오차는 무시) | 측정 |
| A3 | 필수 | 글자가 상자 안쪽 여백을 파고들어 테두리에 붙지 않는가 | 상자에 여백이 있으면 글자와 테두리 사이가 4px 이상 | 측정 |
| A4 | 필수 | 숨김 처리된 부모 때문에 글자가 잘리지 않는가 | 의도한 말줄임(`…`, 줄 수 제한)이 아니면 글자 전체가 보임 | 측정 |
| A5 | 필수 | 자식 요소가 부모 밖으로 튀어나오지 않는가 | 이미지·버튼·안쪽 카드가 부모 경계 안 | 측정 |
| A6 | 필수 | 끝까지 볼 수 없는 내용이 없는가 | 잘린 영역 아래 내용이 있으면 그 영역이나 페이지가 스크롤됨 | 측정+조작 |
| A7 | 필수 | 몇 px 때문에 생긴 불필요한 스크롤바가 없는가 | 스크롤 영역의 넘침이 0이거나 실제로 스크롤할 만큼(수십 px 이상) | 측정 |
| A8 | 필수 | `<meta name="viewport" content="width=device-width, initial-scale=1">`가 있는가 | `<head>`에 있음 | 측정 |
| A9 | 권장 | 실제 데이터가 더 길어도 버티는가 | 글자를 1.5배로, 띄어쓰기 없는 긴 이메일·URL을, 숫자에 세 자리를 더 넣어도 A1~A5 통과 | 측정+조작 |

<!-- 근거
A1 renderlint viewport-overflow
A2 renderlint text-overflow
A3 renderlint text-crowding
A4 renderlint text-clipped
A5 renderlint content-overflow
A6 renderlint unreachable-content
A7 renderlint accidental-scrollbar
A8 renderlint missing-viewport-meta
A9 renderlint fragile-layout
-->

**자주 쓰는 해결:** 고정 폭·높이 제거, flex·grid 자식에 `min-w-0`, 줄바꿈 허용(`break-words`), 작은 화면에서 열 수 줄이기, 고정 헤더 높이만큼 위 여백.

### B. 겹침과 가려짐

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| B1 | 필수 | 글자끼리 겹쳐 그려지지 않는가 | 보이는 글자 영역끼리 겹치지 않음 | 측정 |
| B2 | 필수 | 나란히 놓인 카드·버튼·이미지가 겹치지 않는가 | 같은 줄 요소끼리 겹치지 않음 (음수 여백 등 의도한 겹침 제외) | 측정 |
| B3 | 필수 | 글자나 버튼이 다른 요소 밑에 가려지지 않는가 | 해당 위치 맨 위 요소가 자기 자신이나 자식 (`elementFromPoint`) | 측정 |
| B4 | 필수 | 연 드롭다운·메뉴·툴팁이 잘리거나 가려지지 않는가 | 연 상태에서 전체가 화면 안에 보이고 다른 요소 위에 있음 | 조작 |
| B5 | 권장 | 겹쳐 올린 층(absolute·fixed)의 글자가 다른 글자와 붙어 있지 않은가 | 다른 폭에서도 부딪히지 않을 만큼 떨어져 있거나 일반 흐름에 있음 | 측정 |

<!-- 근거
B1 renderlint text-overlap
B2 renderlint element-overlap
B3 renderlint obscured-content
B4 renderlint popup-obscured
B5 renderlint text-near-overlap
-->

**자주 쓰는 해결:** 메뉴는 Radix `Portal`로 부모 밖에 렌더링, z-index 정리, 고정 높이 제거.

### C. 색과 글자

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| C1 | 필수 | 글자 대비가 충분한가 | WCAG 1.4.3: 일반 글자 4.5:1, 큰 글자(24px 이상, 또는 약 18.7px 이상 굵은 글씨) 3:1. **라이트·다크 각각** | 색 |
| C2 | 권장 | 너무 작은 글자가 없는가 | 12px 이상 (본문 14~16px) | 측정 |
| C3 | 권장 | 문단 한 줄이 너무 길지 않은가 | 한 줄 약 120자 이하 (`max-w-prose` 권장) | 측정 |

<!-- 근거
C1 renderlint contrast, WCAG 2.2 1.4.3 (기준 수치), AGENTS.md 9.2 (라이트·다크 각각)
C2 renderlint font-size-min
C3 renderlint line-length
-->

**해결:** 색 토큰 교체. hex로 직접 고치지 않습니다.

### D. 이미지와 아이콘

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| D1 | 필수 | 깨진 이미지가 없는가 | 모든 `img`가 불러와짐 (`naturalWidth > 0`) | 측정 |
| D2 | 필수 | 이미지 비율이 찌그러지지 않았는가 | 표시 비율 = 원본 비율, 아니면 `object-fit` 지정 | 측정 |
| D3 | 필수 | 아이콘이 크기 지정 없이 커지지 않았는가 | 아이콘 SVG에 폭·높이가 있음 | 측정 |
| D4 | 필수 | 이모지를 아이콘 대신 쓰지 않았는가 | UI에 이모지 없음. 아이콘은 `src/assets/icons/` → `lucide-react` | 측정+코드 |
| D5 | 권장 | 아이콘이 옆 글자와 세로 중앙이 맞는가 | 눈에 띄게 위아래로 어긋나지 않음 (`items-center`) | 측정 |
| D6 | 필수 | 이미지에 `alt`가 있는가 (`AGENTS.md` 5.4) | `alt` 속성 존재. 정보 전달 이미지는 의미 있는 글, 장식이면 `alt=""` | 측정 |

<!-- 근거
D1 renderlint broken-image
D2 renderlint image-distortion
D3 renderlint oversized-icon
D4 renderlint emoji, AGENTS.md 5.4 (아이콘 위치·순서)
D5 renderlint icon-misaligned
D6 renderlint missing-alt, AGENTS.md 5.4 (등급 필수, alt 작성법)
-->

### E. 폼 컨트롤

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| E1 | 필수 | 입력칸 높이가 글자보다 작아 잘리지 않는가 | 높이 − 위아래 여백 ≥ 글자 줄 높이 | 측정 |
| E2 | 필수 | 입력칸 속 아이콘이 입력 글자 자리를 덮지 않는가 | 아이콘 쪽 여백이 아이콘 너비보다 큼 | 측정 |
| E3 | 필수 | 체크박스·라디오가 라벨 옆에 제 크기로 있는가 | 늘어나지 않고 라벨과 같은 줄 | 측정 |
| E4 | 필수 | 선택 상자 화살표가 테두리에 붙지 않았는가 | 화살표 오른쪽 여백이 글자 왼쪽 여백과 비슷 | 색 |
| E5 | 권장 | 같은 줄 컨트롤 높이가 같은가 | 입력칸+버튼 등 나란한 컨트롤 높이 차이 없음 (같은 `size` prop) | 측정 |
| E6 | 권장 | 버튼이 서로·테두리에 어정쩡하게 붙지 않았는가 | 간격이 0(의도한 묶음)이거나 8px 이상 (`gap-2`) | 측정 |
| E7 | 권장 | 짧은 버튼 글자가 두 줄로 꺾이지 않는가 | 한 줄 | 측정 |

<!-- 근거
E1 renderlint squashed-control
E2 renderlint input-icon-overlap
E3 renderlint checkbox-layout
E4 renderlint dropdown-arrow
E5 renderlint control-height-mismatch
E6 renderlint cramped-control, AGENTS.md 5.1.1 (8px = gap-2)
E7 renderlint button-text-wrap
-->

### F. 접근성

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| F1 | 필수 | 버튼·링크 안에 또 버튼·링크가 없는가 | 중첩 없음 | 측정 |
| F2 | 필수 | 아이콘만 있는 버튼, 입력칸에 이름이 있는가 (`AGENTS.md` 5.4·6.1) | `aria-label` 또는 연결된 `<label>`. placeholder만으로는 불합격 | 측정 |
| F3 | 필수 | 포커스가 눈에 보이는가 (WCAG 2.4.7, `AGENTS.md` 6.1) | Tab으로 갔을 때 테두리·링 등 변화가 있음 | 조작 |
| F4 | 권장 | 터치 영역이 충분한가 (WCAG 2.5.8) | 24×24px 이상, 주요 버튼 44×44px 권장 | 측정 |
| F5 | 필수 | `aria-labelledby`·`aria-describedby`·`<label for>`가 실제 id를 가리키는가 (`AGENTS.md` 6.1) | 가리키는 요소가 있음. React는 `useId()` | 측정 |
| F6 | 권장 | 보이는 글자와 접근 이름이 맞는가 (WCAG 2.5.3) | `aria-label`이 보이는 글자를 포함 | 측정 |
| F7 | 권장 | 툴팁이 키보드로도 열리고 Esc로 닫히는가 (WCAG 2.1.1, 1.4.13) | 포커스 시 열림, Esc로 닫힘 | 조작 |
| F8 | 권장 | Tab으로 간 요소가 고정 헤더·하단 바에 완전히 가려지지 않는가 (WCAG 2.4.11) | 일부라도 보임 (`scroll-padding-top`) | 조작 |
| F9 | 권장 | 모달이 포커스를 제대로 다루는가 | 열면 안으로 이동, Esc로 닫힘, 닫으면 연 버튼으로 복귀 (`Modal`·`AlertDialog` 사용) | 조작 |
| F10 | 필수 | 모든 `<button>`에 `type`이 있는가 (`AGENTS.md` 6.1) | `type` 속성이 `button`·`submit`·`reset` 중 하나로 적혀 있음. 속성 값으로 확인 (`getAttribute("type")`, `button.type`은 없어도 `submit`이 나옴) | 측정+코드 |

<!-- 근거
F1 renderlint nested-interactive
F2 renderlint unlabeled-control, AGENTS.md 5.4·6.1 (등급 필수)
F3 renderlint focus-indicator, WCAG 2.2 2.4.7, AGENTS.md 6.1 (등급 필수)
F4 renderlint tap-target, WCAG 2.2 2.5.8
F5 renderlint aria-reference, AGENTS.md 6.1 (등급 필수), stack/react.md 5장 (useId)
F6 renderlint label-in-name, WCAG 2.2 2.5.3
F7 renderlint tooltip-keyboard, WCAG 2.2 2.1.1 (키보드로 열기), 1.4.13 (Esc로 닫기)
F8 renderlint focus-obscured, WCAG 2.2 2.4.11
F9 renderlint dialog-focus, WCAG 2.2 2.4.3 (포커스 순서), AGENTS.md 9.2 (오버레이)
F10 자체 추가, AGENTS.md 6.1 (버튼 type) / doc-history.md 4장 리허설 위반 기준
-->

### G. 내용과 동작

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| G1 | 필수 | 깨진 데이터 표시가 없는가 | 화면에 `undefined`, `NaN`, `[object Object]`, `Invalid Date`, `{{…}}`, `lorem ipsum`, `TODO` 없음 | 측정 |
| G2 | 필수 | 스크롤해도 나타나지 않는 빈 영역이 없는가 | 끝까지 스크롤한 뒤 모든 본문 글자가 보임 | 조작 |
| G3 | 필수 | 브라우저 기본 `alert`·`confirm`·`prompt`를 쓰지 않는가 | 앱의 토스트·`AlertDialog`·`Modal` 사용 | 조작+코드 |
| G4 | 필수 | 콘솔 오류가 없는가 | 렌더 중 오류·`console.error` 없음 | 측정 |
| G5 | 필수 | 불러오지 못한 CSS·JS·글꼴·이미지가 없는가 | 같은 출처 요청에 404/500 없음 | 측정 |
| G6 | 필수 | 페이지가 열리는가 | 이동 성공, 4xx/5xx 아님 | 측정 |
| G7 | 권장 | 아무 데도 안 가는 링크·버튼이 없는가 | `href="#"`만 있는 링크 없음, 눌렀을 때 보이는 변화 있음 | 조작 |
| G8 | 필수 | 조회 목록이 0건일 때 안내가 있는가 (`AGENTS.md` 6.4) | 검색 결과 0건에서 "데이터 없음" 영역 표시. 조회 목록이 없는 화면은 해당 없음 | 조작 |

<!-- 근거
G1 renderlint placeholder-text
G2 renderlint invisible-content
G3 renderlint native-dialog
G4 renderlint console-error
G5 renderlint broken-resource
G6 renderlint page-error, page-not-shown
G7 renderlint dead-link, dead-control
G8 renderlint empty-state, AGENTS.md 6.4 (등급 필수, 조회 목록 데이터 없음)
-->

### H. 로딩과 응답 (목업 API가 있는 화면만)

| 코드 | 등급 | 확인할 것 | 합격 조건 | 수단 |
| --- | --- | --- | --- | --- |
| H1 | 권장 | 불러오는 동안 빈칸으로 두지 않는가 | 응답을 1초 늦춰도 `Loading`·스켈레톤이 보임 | 조작 |
| H2 | 권장 | 클릭 후 바로 반응하는가 | 응답을 1초 늦춰도 버튼이 대기 상태로 바뀜 | 조작 |
| H3 | 권장 | 요청 실패를 알려 주는가 | 응답을 500으로 바꾸면 오류 문구나 알림이 나옴 | 조작 |
| H4 | 권장 | 저장 버튼 두 번 클릭에 두 번 보내지 않는가 | 대기 중 버튼 비활성 | 조작 |
| H5 | 권장 | 로딩 중 화면이 덜컹거리지 않는가 | CLS 0.1 이하 (Core Web Vitals "좋음") | 조작 |
| H6 | 권장 | 주요 내용이 늦게 뜨지 않는가 | LCP 4초 이하 (4초 초과는 Core Web Vitals "나쁨") | 조작 |
| H7 | 권장 | 화면이 멈추지 않는가 | 반응 지연 500ms 미만 (INP 500ms 초과는 "나쁨") | 조작 |
| H8 | 권장 | 뒤로 가기가 이전 화면을 보여 주는가 | 라우터 `<Link>`·`navigate()` 사용, `replace`는 리다이렉트에만 | 조작 |

<!-- 근거
H1 renderlint loading-state
H2 renderlint action-feedback
H3 renderlint error-feedback
H4 renderlint double-submit
H5 renderlint layout-shift, Core Web Vitals CLS
H6 renderlint slow-render, Core Web Vitals LCP
H7 renderlint ui-freeze, Core Web Vitals INP
H8 renderlint back-navigation
-->

---

## 3. 예외 표시

의도한 경우에는 요소에 표시하고 이유를 반드시 남깁니다. 이유가 없으면 위반으로 봅니다.

```html
<div data-check-ignore="D4" data-check-reason="사용자가 입력한 채팅 내용">…</div>
```

- `data-check-ignore`에 항목 코드를 띄어쓰기로 여러 개 넣을 수 있고, 그 요소와 하위 요소 전체에 적용됩니다.
- 소스 검색 항목(D4, G3, F10)은 해당 줄이나 윗줄에 주석을 답니다. 위치에 따라 문법이 다릅니다.

```tsx
// check-ignore G3 이유               ← 일반 코드(.ts, .tsx의 JSX 밖)

{/* check-ignore D4 이유 */}           ← JSX 안
<span>👍</span>

/* check-ignore D4 이유 */             ← CSS·SCSS
```

## 4. 이 문서 밖의 규칙

다음은 화면이 아니라 코드로 확인하므로 `AGENTS.md`를 봅니다.

- hex 색 직접 사용 금지 (5.3)
- 간격 `2`·`4`·`6`, 공통 컴포넌트 `className` 덮어쓰기 금지 (5.1.1)
- 새 페이지 퍼블리싱 목록 등록 (6.2)
- `<button>`에 `type` 지정 (6.1). 화면에서는 F10으로 보고, 코드에서는 `<button`에 `type`이 빠진 곳을 찾습니다. 공통 `Button`은 기본값이 `button`이라 따로 적지 않아도 됩니다
