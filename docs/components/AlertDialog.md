# AlertDialog

> 파일: `src/components/ui/AlertDialog/AlertDialog.tsx` (+ `AlertDialog.module.css`) · 가이드: `/guide/alert-dialog`
> 기준: 템플릿 코드 (2026-11-25). 규칙: `AGENTS.md` 5.1.1

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui";
```

## Props

| 컴포넌트 | Props | 값 | 기본값 | 설명 |
| --- | --- | --- | --- | --- |
| `AlertDialog` | `open` + `onOpenChange` | `boolean` / 함수 | — | 바깥 상태로 열고 닫을 때 (트리거 없이) |
| `AlertDialogTrigger` | `asChild` | `boolean` | `false` | `<Button>`을 열기 버튼으로 쓸 때 `asChild` |
| `AlertDialogContent` | `showCloseButton` | `boolean` | `true` | 오른쪽 위 닫기(×) 버튼. `aria-label="닫기"`가 이미 붙어 있음 |
| `AlertDialogContent` | `size` | `default` · `sm` | `default` | **`sm`은 현재 스타일이 없어 모양이 같습니다. 쓰지 않습니다.** |
| `AlertDialogAction` | `variant` · `size` | `Button`과 같음 | `default` · `default` | 확인 버튼 (누르면 닫힘) |
| `AlertDialogCancel` | `variant` · `size` | `Button`과 같음 | **`outline`** · `default` | 취소 버튼 (누르면 닫힘) |
| `AlertDialogTitle` | — | | | **화면에는 보이지 않고(`sr-only`) 화면낭독기만 읽습니다.** 그래도 반드시 넣습니다 |
| `AlertDialogDescription` | — | | | 화면에 보이는 본문 |

## 쓸 수 있는 형태 (가이드에 있는 것만)

| 형태 | 구성 | 보험 설계 예 |
| --- | --- | --- |
| 알림 (버튼 1개) | `AlertDialogAction`만 | "설계 내용이 저장되었습니다." |
| 확인 (버튼 2개) | `AlertDialogCancel` + `AlertDialogAction` | "이 설계안으로 가입을 진행하시겠습니까?" |
| 트리거로 열기 | `AlertDialogTrigger asChild` + `<Button>` | 가입 진행 버튼 |
| 상태로 열기 | `open={…} onOpenChange={…}` | 저장 실패 등 코드에서 띄우는 경고 |

- 입력 폼이 들어가는 창은 AlertDialog가 아니라 `Modal`을 씁니다. AlertDialog는 "알림·확인"만 담습니다.

## 접근성

- Radix가 `role="alertdialog"`, 포커스 가두기, 닫힌 뒤 원래 버튼으로 포커스 돌려주기, `Esc`로 닫기를 자동으로 처리합니다.
- **`AlertDialogTitle`과 `AlertDialogDescription`은 둘 다 필수입니다.** 빠지면 화면낭독기가 창 이름·내용을 읽지 못하고 콘솔에 경고가 뜹니다. 제목은 화면에 안 보이므로 "알림"보다 "가입 진행 확인"처럼 내용을 알 수 있게 씁니다.
- 바깥(어두운 배경)을 눌러도 닫히지 않습니다. 반드시 버튼으로 닫힙니다.
- 버튼 글자는 동작을 씁니다. 되돌릴 수 없는 동작은 "확인"보다 "삭제", "가입 진행"이 낫습니다.
- 확인 버튼은 `AlertDialogAction`, 취소는 `AlertDialogCancel`을 씁니다. 일반 `Button`으로 바꾸면 눌러도 닫히지 않습니다.

```tsx
<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>가입 진행 확인</AlertDialogTitle>
    <AlertDialogDescription>이 설계안으로 청약을 진행하시겠습니까?</AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>취소</AlertDialogCancel>
    <AlertDialogAction onClick={handleApply}>가입 진행</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>
```

## 하면 안 되는 것

- `className`으로 창 폭·모서리·배경·버튼 색 바꾸기
    - 금지: `<AlertDialogContent className="max-w-[600px] rounded-none">`, `<AlertDialogAction className="bg-red-500">`
    - 허용: 본문 안 묶음의 배치(`flex flex-col gap-2`)
- 버튼을 3개 이상 두기 → 선택지가 많으면 화면 흐름을 다시 설계합니다.
- `AlertDialogTitle`을 빼거나 빈 문자열로 두기
