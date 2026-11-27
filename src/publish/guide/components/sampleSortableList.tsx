import { useCallback, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import {
  Button,
  SortableList,
  sortableListDragHandleClassName,
} from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundCheckboxControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";

type Task = { id: string; label: string };

const initialTasks: Task[] = [
  { id: "1", label: "디자인 시안 검토" },
  { id: "2", label: "API 연동" },
  { id: "3", label: "E2E 테스트" },
  { id: "4", label: "배포 체크리스트" },
];

const TASK_OPTIONS = initialTasks.map((task) => ({
  value: task.id,
  label: task.label,
}));

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(items: Task[]) {
  const itemLines = items
    .map((item) => `  { id: "${item.id}", label: "${item.label}" },`)
    .join("\n");

  return `const [items, setItems] = useState<Task[]>([
${itemLines}
]);

<SortableList
  items={items}
  onReorder={setItems}
  className="w-full max-w-md"
  renderItem={({ item, dragHandleProps }) => (
    <div className="flex items-center gap-2 rounded-md border border-line02 bg-base px-4 py-2">
      <button
        type="button"
        className={sortableListDragHandleClassName}
        {...dragHandleProps}
        aria-label={\`\${item.label} 순서 변경\`}
      >
        <GripVertical size={18} aria-hidden />
      </button>
      <span className="text-sm font-medium text-font-b">{item.label}</span>
    </div>
  )}
/>`;
}

/** SortableList Playground (이 페이지에서만 사용) */
function SortableListPlayground() {
  const [items, setItems] = useState<Task[]>(initialTasks);
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const itemIds = items.map((item) => item.id);

  const handleReorderList = (nextItems: Task[]) => {
    setItems(nextItems);
    addEventLog(
      "onReorder",
      nextItems.map((item) => item.id),
    );
  };

  const handleChangeItemIds = (nextIds: string[]) => {
    // 남아 있는 항목은 현재 순서를 유지하고, 새로 켠 항목은 끝에 붙입니다.
    setItems((prev) => {
      const keptItems = prev.filter((item) => nextIds.includes(item.id));
      const addedItems = initialTasks.filter(
        (task) =>
          nextIds.includes(task.id) &&
          !prev.some((item) => item.id === task.id),
      );
      return [...keptItems, ...addedItems];
    });
  };

  const handleClickReset = () => {
    setItems(initialTasks);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "items",
      type: "{ id: string }[]",
      description:
        "목록에 보일 항목 (미리보기에서 드래그하면 onReorder로 순서가 바뀝니다. 제어형)",
      control: (
        <PlaygroundCheckboxControl
          label="items"
          value={itemIds}
          options={TASK_OPTIONS}
          onValueChange={handleChangeItemIds}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="그립 아이콘을 드래그하거나, 그립에 포커스한 뒤 Space → 방향키 → Space로 순서를 바꿉니다. Controls에서 항목을 켜고 끄면 미리보기와 코드가 바로 바뀝니다."
      code={buildPlaygroundCode(items)}
      controls={controls}
      controlsNote="renderItem(함수)·className(배치용)·dndId(여러 목록 구분용 식별자)는 값을 골라 바꾸는 Props가 아니라 Controls에 넣지 않았습니다."
      state={{
        items: items.map((item) => `${item.id}: ${item.label}`),
        order: itemIds,
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      {items.length > 0 ? (
        <SortableList
          dndId="guide-sortable-playground"
          items={items}
          onReorder={handleReorderList}
          className="w-full max-w-md"
          renderItem={({ item, dragHandleProps }) => (
            <div className="flex items-center gap-2 rounded-md border border-line02 bg-base px-4 py-2">
              <button
                type="button"
                className={sortableListDragHandleClassName}
                {...dragHandleProps}
                aria-label={`${item.label} 순서 변경`}
              >
                <GripVertical size={18} aria-hidden />
              </button>
              <span className="text-sm font-medium text-font-b">
                {item.label}
              </span>
            </div>
          )}
        />
      ) : (
        <p className="text-sm text-font-g">
          표시할 항목이 없습니다. Controls에서 items를 켜 주세요.
        </p>
      )}
    </GuidePlayground>
  );
}

function SampleSortableListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedIndex = selectedId
    ? tasks.findIndex((t) => t.id === selectedId)
    : -1;
  const canMoveUp = selectedIndex > 0;
  const canMoveDown = selectedIndex >= 0 && selectedIndex < tasks.length - 1;

  const moveSelectedUp = useCallback(() => {
    if (!selectedId) return;
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === selectedId);
      if (idx <= 0) return prev;
      return arrayMove(prev, idx, idx - 1);
    });
  }, [selectedId]);

  const moveSelectedDown = useCallback(() => {
    if (!selectedId) return;
    setTasks((prev) => {
      const idx = prev.findIndex((t) => t.id === selectedId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      return arrayMove(prev, idx, idx + 1);
    });
  }, [selectedId]);

  return (
    <div className="guide-layout">
      <h1 className="guide-title">SortableList</h1>

      <div className="guide-content">
        <GuideSampleTabs playground={<SortableListPlayground />}>
          <p className="text-muted-foreground mb-6 max-w-2xl text-sm">
            <code>@dnd-kit</code> 기반 목록입니다. <strong>그립 아이콘</strong>을
            드래그해 순서를 바꿀 수 있으며, 모바일에서는 짧게 누른 뒤 드래그하면
            스크롤과 구분됩니다. 키보드 포커스 시 방향키로도 이동할 수 있습니다.
            항목 <strong>텍스트 영역</strong>을 클릭해 선택한 뒤, 목록 밖의{" "}
            <strong>위로 / 아래로</strong> 버튼으로도 순서를 바꿀 수 있습니다.
          </p>
          <GuideBox
            title="순서 변경 (드래그 핸들 + 선택 후 버튼 이동)"
            description="dragHandleProps는 그립에만 연결하고, 라벨은 클릭 시 selectedId를 설정합니다. 외부 버튼에서 arrayMove로 onReorder와 동일하게 배열을 갱신합니다."
            code={`
const [items, setItems] = useState<Task[]>([...]);

<SortableList
  items={items}
  onReorder={setItems}
  renderItem={({ item, dragHandleProps, isDragging }) => (
    <div className={cn("flex items-center gap-2 rounded border p-3", isDragging && "bg-muted")}>
      <button
        type="button"
        className={sortableListDragHandleClassName}
        {...dragHandleProps}
        aria-label="순서 변경"
      >
        <GripVertical size={18} />
      </button>
      <span>{item.label}</span>
    </div>
  )}
/>
            `}
          >
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-xs">
                선택된 항목 이동
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={moveSelectedUp}
                disabled={!canMoveUp}
                aria-label="선택 항목 위로 이동"
              >
                <ArrowUp size={16} aria-hidden className="shrink-0" />
                <span>위로</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={moveSelectedDown}
                disabled={!canMoveDown}
                aria-label="선택 항목 아래로 이동"
              >
                <ArrowDown size={16} aria-hidden className="shrink-0" />
                <span>아래로</span>
              </Button>
            </div>
            <SortableList
              dndId="guide-sortable-tasks"
              items={tasks}
              onReorder={setTasks}
              renderItem={({ item, dragHandleProps, isDragging }) => {
                const isSelected = selectedId === item.id;
                return (
                  <div
                    className={
                      "bg-card flex items-center gap-3 rounded-md border px-3 py-2.5 shadow-sm " +
                      (isDragging ? "ring-primary ring-2 ring-offset-2 " : "") +
                      (isSelected && !isDragging
                        ? "bg-muted/60 ring-primary ring-2 ring-offset-2 "
                        : "")
                    }
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      className={
                        sortableListDragHandleClassName +
                        " text-muted-foreground hover:text-foreground inline-flex shrink-0 rounded p-1"
                      }
                      {...dragHandleProps}
                      aria-label={`${item.label} 순서 변경`}
                    >
                      <GripVertical size={18} aria-hidden />
                    </button>
                    <button
                      type="button"
                      className="hover:bg-muted/80 flex items-center min-h-9 min-w-0 flex-1 rounded px-1 py-0.5 text-left text-sm font-medium"
                      onClick={() => setSelectedId(item.id)}
                      aria-pressed={isSelected}
                      aria-label={`${item.label} 선택`}
                    >
                      {item.label}
                    </button>
                  </div>
                );
              }}
            />
          </GuideBox>

          <GuideBox
            title="현재 순서 (상태)"
            description="onReorder로 갱신된 배열입니다."
          >
            <ol className="text-muted-foreground list-decimal space-y-1 pl-5 text-sm">
              {tasks.map((t) => (
                <li key={t.id}>{t.label}</li>
              ))}
            </ol>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export default SampleSortableListPage;
