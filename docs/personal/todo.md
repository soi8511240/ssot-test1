# 할 일 (`docs/personal/todo.md`)

> 개인 메모입니다. 프로젝트 소스나 AI 작업 규칙(SSOT)이 아닙니다.
> 날짜별로 위에 새로 추가합니다. 큰 일정은 `schedule.md`를 봅니다.

---

## 2026-11-27 (금)

### 1. 도구 테스트

- [ ] ~~mobile-agent-testers~~ — 11-27 패스: 모바일 환경 체크 불필요
- [x] safe-anything — 11-27 실행 (v1.1.0, 결과 아래)
- [x] renderlint — 11-27 실행 (v0.2.0, init 없이 단발 실행, 결과 아래)
- [ ] ~~openQodex~~ — 11-27 패스: 비슷한 검증을 이미 하고 있음 (`/code-review`, safe-anything, 화면 검수 도구). Windows 공식 지원도 없음
- [ ] ~~rederive~~ — 11-27 패스: 이 프로젝트와 맞지 않음 (복사본에서 `rdv init --dry-run`까지만 확인)

> **조사 결과 (설치 안 함, 웹 README 기준)**
>
> | 도구 | 저장소 | 하는 일 | Windows | 적합도 |
> | --- | --- | --- | --- | --- |
> | safe-anything | erkamyaman/safe-anything | 보안·시크릿·의존성·Claude 설정 스캔, 키 불필요 | 지원 | 높음 |
> | renderlint | ngocanhnckh/renderlint (npm `@yitec/renderlint`) | 실제 브라우저로 화면 넘침·겹침·대비·반응형 검사 | README에 없음 | 높음 |
> | ~~mobile-agent-testers~~ | ~~pierridotite/mobile-agent-testers~~ | ~~GitHub Actions 에뮬레이터에서 Claude가 앱 QA, 유료~~ | ~~setup.ps1 있음~~ | ~~낮음~~ → 패스 (모바일 환경 체크 불필요) |
> | ~~openQodex~~ | ~~openqodex/openqodex~~ | ~~푸시 전 로컬 코드 리뷰~~ | ~~미지원(macOS·Linux)~~ | ~~지금은 불가~~ → 패스 (비슷한 검증 이미 하는 중) |
> | ~~rederive~~ | ~~후보 2개 (rederive/rederive, EricJujianZou/rederive)~~ | ~~A: 함수 동작 잠금 / B: 코드 이해 학습 스킬~~ | ~~A: 부분~~ | ~~낮음, 어느 쪽인지 확인 필요~~ → 패스 (이 프로젝트와 맞지 않음) |
>
> - renderlint의 init, rederive의 init은 CLAUDE.md·AGENTS.md·package.json을 고칠 수 있음 → init 없이 단발 실행으로 시험
> - 복사본 저장소가 여럿 있으니 원본만 사용

> **safe-anything 실행 결과:** 46건 (치명 4, 높음 30, 중간 11, 낮음 1), 313개 파일, 의존성 1,012개 검사
>
> - 44건은 의존성 알려진 취약점 (`pnpm-lock.yaml`). 치명 4건: proxy-addr, tar, tinypool, vitest. 대부분 개발 도구 쪽 패키지
> - `.gitignore`에 `.env` 제외가 없음. 커밋된 `.env.*` 3개는 변수 이름만 보면 API 주소·목업 설정이라 비밀 값은 아닌 것으로 보임 (값은 열어 보지 않음)
> - `GuideBox.tsx:61` `dangerouslySetInnerHTML`: shiki가 만든 코드 강조 HTML이라 사용자 입력이 들어가지 않음 → 실제 위험은 낮다고 봄
>
> **renderlint 실행 결과:** 오류 599, 경고 125 (같은 문제를 묶으면 238건), 라이트 모드만, 360·768·1024·1440px
>
> - 55개 경로 중 19개만 검사 (`--max-pages 20` 제한). `/guide/ialist`와 `/publish/...` 페이지는 검사 안 됨
> - 다크모드는 `.dark` 클래스 방식이라 자동 감지가 안 됨
> - 많은 순: 대비 68, 넘침 55, 텍스트 넘침 19, 겹침 16, 가려짐 13
> - 오류가 몰린 곳: Button 42, GuideBox 25, DatePicker 19, Chip 15
> - 예: 상단 다크모드 스위치 `OFF` 글자 대비 1.81:1 (기준 4.5:1)
> - 결과가 실제 문제인지 하나하나 확인하지는 않음

### 2. View 화면 검증 도구 만들기

- [ ] 화면이 이상 없는지 검증하는 도구 만들기

> **11-27 진행:** 내부망 에이전트용 화면 검수 체크리스트 작성 → `tools/renderlint-rules/RULES.md` (renderlint 추출본을 자체 기준으로 새로 씀, 도구 설치는 취소)
>
> **방향:** renderlint를 먼저 단발 실행해 보고, 우리 규칙(hex 색, 간격 2·4·6, 목록 누락)처럼 renderlint가 못 잡는 것만 직접 만든다.

### 3. 피그마 → 코드화

- [ ] 피그마 컴포넌트를 정확하게 코드로 옮기기
- [ ] 피그마 화면을 정확하게 코드로 옮기기

> **조사 결과:** 시도 순서 ① Figma 공식 플러그인(원격 MCP, Dev/Full 좌석 필요) ② 공통 컴포넌트를 만든 뒤 Code Connect ③ 안 되면 Framelink MCP(PAT) 또는 `get-components-from-figma` 방식을 스킬로 감싸기
>
> - 먼저 확인할 것: 피그마 요금제와 좌석 (View/Collab 좌석이면 MCP 월 20회)
> - `get-components-from-figma`: REST(PAT) 또는 자체 플러그인으로 JSON을 받아 컴포넌트를 생성함. cva·Tailwind·간격 규칙은 우리와 다름
> - 디자인 원본(`requirements.md` 6장)이 아직 없음 → 코드는 Phase 2 승인 뒤

> **11-27 추출 품질 점검** (`D:\workspace\get-components-from-figma`, 피그마 파일 `transfer html`, 비교 갤러리로 눈으로 확인 + 코드 집계. 픽셀 단위 비교는 안 함)
>
> **겉모습:** 자동 생성 Btn(22개 조합)·Cell(21개)·Top과 손질한 `ui/Button`은 피그마 캡처와 거의 같아 보임
>
> - Top: `총 9,999,000건`의 숫자만 파란색인데 React는 전부 검정 → 한 글자 레이어 안의 부분 색·굵기를 생성기가 못 옮김
> - 채움 버튼 글자가 React 쪽이 더 굵어 보이나 계산된 굵기는 둘 다 400 → 렌더링 차이로 추정 (확인 안 됨)
>
> **구조:** 자동 생성 코드는 그대로 가져올 수 없음 (참고·치수 확인용)
>
> | 문제 | 내용 |
> | --- | --- |
> | 시맨틱·접근성 | 버튼이 전부 `<div>` (Btn div 22, `<button>` 0). `type`·포커스·키보드 없음 |
> | variant 방식 | 조합마다 JSX를 따로 만들어 `switch` (Btn 21, Cell 21 case). cva 아님 |
> | 상태를 prop으로 | hover·disable·open·close가 `state` 값 → `:hover`·`disabled`로 바꿔야 함 |
> | 피그마 이름 그대로 | 오타 `nomal`·`bese`, 한글 섞인 값 `green-전결`·`red-반려`, 상태와 용도가 섞인 `Search`·`Reset` |
> | 문구 고정 | 조합별로 글자가 박혀 있음 (Btn 11, Cell 15, Top 8곳). `buttonName` prop이 무시되는 조합 있음 |
> | 토큰 이름 불일치 | 피그마 변수 `--primary-7-bese`, `--neutral-warm-9-1` 등 ↔ 우리 `--primary`, `--font-b`, `--line01`. 우리 `--primary`는 초록(#00997a), 피그마 주색은 파랑 → 토큰 대응표 필요 |
> | hex | `var(--x, #hex)` 대체값 Btn 53·Cell 77·Top 18, var 밖 hex Cell 5·Top 3 |
> | 간격 2·4·6 밖 | 디자인 자체가 1·2·4·6·10·12px를 씀 (Cell: 4px 28회, 12px 24회, 2px 15회) → 규칙 예외를 정할지 디자인과 협의 |
>
> - 손질한 `ui/Button`은 `<button>`, `type="button"`, `disabled`를 갖춰 방향은 맞음. 다만 cva가 아니고 템플릿 `Button`(variant `default/outline/ghost/text`, color `default/gray/black/grayBg`)과 API가 달라, 가져올 때는 새 컴포넌트가 아니라 **템플릿 Button에 variant·color 추가**로 가야 함 (`AGENTS.md` 5.1)
>
> **결론:** 생성기는 "치수·색·변형 목록을 뽑는 도구"로 쓰고, 코드는 그 데이터를 보고 우리 규칙대로 새로 쓴다. 남은 결정: ① `transfer html`이 이 프로젝트 디자인 원본인지(`requirements.md` 6장) ② 피그마 변수 ↔ 우리 토큰 대응표 ③ 4·12px 등 간격 예외

### 4. SSOT 수정 기록

- [ ] SSOT 문서가 수정될 때 로그와 변경 내용 남기기

> **현재 기록 위치 (확인함)**
>
> | 위치 | 기록 내용 | 방식 | 마지막 기록 |
> | --- | --- | --- | --- |
> | `docs/personal/doc-history.md` 3장 | 문제 → 변경 → 반영 문서 | 손으로 한 줄씩 | 11-25 |
> | `docs/design.md` 8장 | 결정(ADR) | 손으로 | 11-25 |
> | git 커밋 | 파일 변경 | 자동 | SSOT 문서는 `첫날 푸시` 1건뿐 (11-25 작업 전체가 한 커밋) |
>
> - 자동 기록 장치(훅) 없음, `AGENTS.md`에 "SSOT를 고치면 기록하라"는 규칙도 없음
> - `AGENTS.md`가 `docs/personal/`을 "작업 기준으로 읽지 않음"으로 정해서, AI는 `doc-history.md`를 스스로 채우지 않음
> - 11-27에 추가된 `.claude/skills/react-best-practices`는 어디에도 기록되지 않음
