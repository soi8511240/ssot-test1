import { useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { DndProvider } from "react-dnd";
import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundCheckboxControl,
  PlaygroundSwitchControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";
import { useGuideEventLog } from "@/publish/guide/useGuideEventLog";
import { Checkbox, TreeView } from "@/components/ui";
import {
  Check,
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

const initialData = [
  {
    id: 1,
    parent: 0,
    droppable: true,
    text: "Folder 1",
  },
  {
    id: 2,
    parent: 1,
    text: "File 1-1",
  },
  {
    id: 3,
    parent: 1,
    text: "File 1-2",
  },
  {
    id: 4,
    parent: 0,
    droppable: true,
    text: "Folder 2",
  },
  {
    id: 5,
    parent: 4,
    droppable: true,
    text: "Folder 2-1",
  },
  {
    id: 6,
    parent: 5,
    text: "File 2-1-1",
  },
  {
    id: 7,
    parent: 5,
    text: "File 2-1-2",
  },
  {
    id: 8,
    parent: 5,
    text: "File 2-1-3",
  },
];

type TreeNodeId = number | string;
type TreeNodeShape = {
  id: TreeNodeId;
  parent: TreeNodeId;
  droppable?: boolean;
  text: string;
};

function TreeNodeChrome({
  node,
  depth,
  isOpen,
  onToggle,
  children,
  handleRef,
  showDragHandle,
  indentPerDepthPx = 10,
}: {
  node: TreeNodeShape;
  depth: number;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  handleRef?: RefObject<HTMLDivElement | null>;
  showDragHandle?: boolean;
  indentPerDepthPx?: number;
}) {
  return (
    <div
      style={{ marginLeft: depth * indentPerDepthPx }}
      className="flex items-center gap-2"
    >
      {showDragHandle ? (
        <div
          ref={handleRef}
          className="cursor-grab text-font-g/70 hover:text-font-b"
          aria-label="drag handle"
          role="button"
          tabIndex={0}
        >
          <GripVertical size={16} aria-hidden />
        </div>
      ) : (
        <span aria-hidden className="inline-block w-[16px]" />
      )}

      {node.droppable ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={isOpen ? "접기" : "펼치기"}
          className="text-font-b hover:text-font-b"
        >
          {isOpen ? (
            <ChevronDown size={16} aria-hidden />
          ) : (
            <ChevronRight size={16} aria-hidden />
          )}
        </button>
      ) : (
        <span aria-hidden className="inline-block w-[16px]" />
      )}

      {node.droppable ? (
        isOpen ? (
          <FolderOpen size={16} aria-hidden />
        ) : (
          <Folder size={16} aria-hidden />
        )
      ) : (
        <File size={16} aria-hidden />
      )}

      {children}
    </div>
  );
}

function ReadOnlyTree() {
  return (
    <div className="rounded-lg border-line02 border bg-base p-3">
      <TreeView
        treeData={initialData}
        withDndProvider={false}
        renderNode={(node, { depth, isOpen, onToggle }) => (
          <TreeNodeChrome
            node={node as unknown as TreeNodeShape}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          >
            <span className="text-sm">{node.text}</span>
          </TreeNodeChrome>
        )}
      />
    </div>
  );
}

function DragReorderTree() {
  const [treeData, setTreeData] = useState<TreeNodeShape[]>(() =>
    initialData.map((n) => ({ ...n })),
  );

  return (
    <div className="rounded-lg border-line02 border bg-base p-3">
      <TreeView
        treeData={treeData}
        dragEnabled
        dropTargetOffsetPx={26}
        withDndProvider={false}
        onTreeDataChange={setTreeData}
        renderNode={(node, { depth, isOpen, onToggle }) => (
          <TreeNodeChrome
            node={node as unknown as TreeNodeShape}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          >
            <span className="text-sm">{node.text}</span>
          </TreeNodeChrome>
        )}
      />
    </div>
  );
}

function MultiCheckTree() {
  const [treeData] = useState<TreeNodeShape[]>(() =>
    initialData.map((n) => ({ ...n })),
  );
  const [checkedIds, setCheckedIds] = useState<TreeNodeId[]>([2, 6]);

  const checkedLabels = useMemo(() => {
    const map = new Map(treeData.map((n) => [n.id, n.text] as const));
    return checkedIds.map((id) => map.get(id)).filter(Boolean);
  }, [checkedIds, treeData]);

  return (
    <div className="rounded-lg border-line02 border bg-base p-3">
      <TreeView
        treeData={treeData}
        withDndProvider={false}
        checkedIds={checkedIds}
        onCheckedIdsChange={setCheckedIds}
        checkCascade
        renderNode={(
          node,
          { depth, isOpen, onToggle, isChecked, onCheckToggle },
        ) => (
          <TreeNodeChrome
            node={node as unknown as TreeNodeShape}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={onCheckToggle}
              aria-label={`select ${node.text}`}
              className="h-4 w-4 accent-(--color-primary,#3b82f6)"
              onClick={(e) => e.stopPropagation()}
            />
            <span className="text-sm">{node.text}</span>
          </TreeNodeChrome>
        )}
      />

      <p className="mt-3 text-xs text-font-g">
        선택 {checkedIds.length}개:{" "}
        <span className="text-font-b">{checkedLabels.join(", ")}</span>
      </p>
    </div>
  );
}

function EditableTree() {
  const [treeData, setTreeData] = useState<TreeNodeShape[]>(() =>
    initialData.map((n) => ({ ...n })),
  );
  const [editingId, setEditingId] = useState<TreeNodeId | null>(null);
  const [draftText, setDraftText] = useState("");

  const startEdit = (node: TreeNodeShape) => {
    setEditingId(node.id);
    setDraftText(node.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftText("");
  };

  const saveEdit = () => {
    if (editingId == null) return;
    setTreeData((prev) =>
      prev.map((n) => (n.id === editingId ? { ...n, text: draftText } : n)),
    );
    cancelEdit();
  };

  return (
    <div className="rounded-lg border-line02 border bg-base p-3">
      <TreeView
        treeData={treeData}
        withDndProvider={false}
        renderNode={(node, { depth, isOpen, onToggle }) => {
          const n = node as unknown as TreeNodeShape;
          const isEditing = editingId === n.id;

          return (
            <TreeNodeChrome
              node={n}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    className="h-7 w-44 rounded-md border border-line02 bg-base px-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={saveEdit}
                    aria-label="save"
                    className="text-font-b hover:text-font-b"
                  >
                    <Check size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    aria-label="cancel"
                    className="text-font-b hover:text-font-b"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm">{node.text}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(n)}
                    aria-label="edit"
                    className="text-font-b hover:text-font-b"
                  >
                    <Pencil size={16} aria-hidden />
                  </button>
                </>
              )}
            </TreeNodeChrome>
          );
        }}
      />
    </div>
  );
}

function collectDescendantIds(tree: TreeNodeShape[], startId: TreeNodeId) {
  const childrenByParent = new Map<TreeNodeId, TreeNodeId[]>();
  for (const n of tree) {
    const arr = childrenByParent.get(n.parent) ?? [];
    arr.push(n.id);
    childrenByParent.set(n.parent, arr);
  }

  const toRemove = new Set<TreeNodeId>();
  const stack: TreeNodeId[] = [startId];
  while (stack.length) {
    const current = stack.pop()!;
    if (toRemove.has(current)) continue;
    toRemove.add(current);
    const children = childrenByParent.get(current) ?? [];
    for (const childId of children) stack.push(childId);
  }

  return toRemove;
}

function AddDeleteTree() {
  const [treeData, setTreeData] = useState<TreeNodeShape[]>(() =>
    initialData.map((n) => ({ ...n })),
  );
  const nextIdRef = useRef<number>(
    Math.max(...treeData.map((n) => Number(n.id))) + 1,
  );

  const [addingParentId, setAddingParentId] = useState<TreeNodeId | null>(null);
  const [newChildText, setNewChildText] = useState("");
  const [newChildType, setNewChildType] = useState<"folder" | "file">("file");

  const startAdd = (parentId: TreeNodeId) => {
    setAddingParentId(parentId);
    setNewChildText("");
    setNewChildType("file");
  };

  const cancelAdd = () => {
    setAddingParentId(null);
    setNewChildText("");
  };

  const deleteNode = (targetId: TreeNodeId) => {
    const idsToRemove = collectDescendantIds(treeData, targetId);
    setTreeData((prev) => prev.filter((n) => !idsToRemove.has(n.id)));
    if (addingParentId != null && idsToRemove.has(addingParentId)) cancelAdd();
  };

  const addNode = (parentId: TreeNodeId) => {
    const text = newChildText.trim();
    if (!text) return;

    const nextId = nextIdRef.current++;
    const node: TreeNodeShape = {
      id: nextId,
      parent: parentId,
      droppable: newChildType === "folder",
      text,
    };

    setTreeData((prev) => [...prev, node]);
    cancelAdd();
  };

  return (
    <div className="rounded-lg border-line02 border bg-base p-3">
      <TreeView
        treeData={treeData}
        withDndProvider={false}
        renderNode={(node, { depth, isOpen, onToggle }) => {
          const n = node as unknown as TreeNodeShape;
          const isAddingHere = addingParentId === n.id;

          return (
            <TreeNodeChrome
              node={n}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
            >
              {isAddingHere ? (
                <>
                  <span className="text-sm">{node.text}</span>

                  <div className="flex items-center gap-2 ml-2">
                    <button
                      type="button"
                      onClick={() => setNewChildType("folder")}
                      aria-label="new folder"
                      className="text-font-b hover:text-font-b"
                    >
                      <Folder size={16} aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewChildType("file")}
                      aria-label="new file"
                      className="text-font-b hover:text-font-b"
                    >
                      <File size={16} aria-hidden />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={newChildText}
                    onChange={(e) => setNewChildText(e.target.value)}
                    placeholder="새 노드 이름"
                    className="h-7 w-44 rounded-md border border-line02 bg-base px-2 text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => addNode(n.id)}
                    aria-label="add"
                    className="text-font-b hover:text-font-b"
                  >
                    <Plus size={16} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={cancelAdd}
                    aria-label="cancel"
                    className="text-font-b hover:text-font-b"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm">{node.text}</span>

                  {node.droppable ? (
                    <button
                      type="button"
                      onClick={() => startAdd(n.id)}
                      aria-label="add child"
                      className="text-font-b hover:text-font-b"
                    >
                      <Plus size={16} aria-hidden />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => deleteNode(n.id)}
                    aria-label="delete"
                    className="text-font-b hover:text-font-b"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </>
              )}
            </TreeNodeChrome>
          );
        }}
      />
    </div>
  );
}

const MULTI_AREA_ROOT = 9000 as const;
const AREA_IDS = {
  A: 9001,
  B: 9002,
  C: 9003,
} as const;

const multiAreaInitialData: TreeNodeShape[] = [
  { id: AREA_IDS.A, parent: MULTI_AREA_ROOT, droppable: true, text: "영역 A" },
  { id: AREA_IDS.B, parent: MULTI_AREA_ROOT, droppable: true, text: "영역 B" },
  { id: AREA_IDS.C, parent: MULTI_AREA_ROOT, droppable: true, text: "영역 C" },
  // 영역 A (깊이 3)
  { id: 9100, parent: AREA_IDS.A, droppable: true, text: "A-폴더 1" },
  { id: 9101, parent: 9100, text: "A-파일 1-1" },
  { id: 9102, parent: 9100, text: "A-파일 1-2" },
  { id: 9110, parent: AREA_IDS.A, droppable: true, text: "A-폴더 2" },
  { id: 9111, parent: 9110, droppable: true, text: "A-하위폴더 2-1" },
  { id: 9112, parent: 9111, text: "A-파일 2-1-1" },
  { id: 9113, parent: 9111, text: "A-파일 2-1-2" },
  { id: 9120, parent: AREA_IDS.A, text: "A-루트파일 3" },

  // 영역 B (깊이 4)
  { id: 9200, parent: AREA_IDS.B, droppable: true, text: "B-폴더 1" },
  { id: 9201, parent: 9200, droppable: true, text: "B-하위폴더 1-1" },
  { id: 9202, parent: 9201, droppable: true, text: "B-하위폴더 1-1-1" },
  { id: 9203, parent: 9202, text: "B-파일 1-1-1-1" },
  { id: 9210, parent: AREA_IDS.B, droppable: true, text: "B-폴더 2" },
  { id: 9211, parent: 9210, text: "B-파일 2-1" },
  { id: 9212, parent: 9210, text: "B-파일 2-2" },
  { id: 9220, parent: AREA_IDS.B, text: "B-루트파일 3" },

  // 영역 C (깊이 3 + 형제 다수)
  { id: 9300, parent: AREA_IDS.C, droppable: true, text: "C-폴더 1" },
  { id: 9301, parent: 9300, text: "C-파일 1-1" },
  { id: 9302, parent: 9300, text: "C-파일 1-2" },
  { id: 9310, parent: AREA_IDS.C, droppable: true, text: "C-폴더 2" },
  { id: 9311, parent: 9310, droppable: true, text: "C-하위폴더 2-1" },
  { id: 9312, parent: 9311, text: "C-파일 2-1-1" },
  { id: 9313, parent: 9311, text: "C-파일 2-1-2" },
  { id: 9320, parent: AREA_IDS.C, text: "C-루트파일 3" },
  { id: 9321, parent: AREA_IDS.C, text: "C-루트파일 4" },
];

// 렌더 중 컴포넌트를 새로 만들지 않도록 MultiAreaDragTree 밖에 선언합니다.
const AreaPanel = ({
  title,
  rootId,
  treeData,
  onTreeDataChange,
}: {
  title: string;
  rootId: TreeNodeId;
  treeData: TreeNodeShape[];
  onTreeDataChange: (tree: TreeNodeShape[]) => void;
}) => (
    <div className="rounded-lg border border-line02 bg-base p-3">
      <h4 className="mb-2 text-sm font-semibold text-font-b">{title}</h4>
      <TreeView
        treeData={treeData}
        rootId={rootId}
        withDndProvider={false}
        dragEnabled
        dropTargetOffsetPx={20}
        enablePlaceholder
        onTreeDataChange={onTreeDataChange}
        renderNode={(node, { depth, isOpen, onToggle }) => (
          <TreeNodeChrome
            node={node as unknown as TreeNodeShape}
            depth={depth}
            isOpen={isOpen}
            onToggle={onToggle}
          >
            <span className="text-sm">{node.text}</span>
          </TreeNodeChrome>
        )}
      />
    </div>
);

function MultiAreaDragTree() {
  const [treeData, setTreeData] = useState<TreeNodeShape[]>(() =>
    multiAreaInitialData.map((n) => ({ ...n })),
  );

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <AreaPanel title="영역 A" rootId={AREA_IDS.A} treeData={treeData} onTreeDataChange={setTreeData} />
      <AreaPanel title="영역 B" rootId={AREA_IDS.B} treeData={treeData} onTreeDataChange={setTreeData} />
      <AreaPanel title="영역 C" rootId={AREA_IDS.C} treeData={treeData} onTreeDataChange={setTreeData} />
    </div>
  );
}

const PLAYGROUND_DEFAULT_CHECKED_IDS: TreeNodeId[] = [];

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildTreeViewPlaygroundCode(
  isDragEnabled: boolean,
  isPlaceholderEnabled: boolean,
  isCheckCascade: boolean,
  checkedIds: TreeNodeId[],
) {
  const optionProps = [
    isDragEnabled ? "dragEnabled" : "",
    isDragEnabled && isPlaceholderEnabled ? "enablePlaceholder" : "",
    isCheckCascade ? "checkCascade" : "",
  ]
    .filter(Boolean)
    .map((prop) => `\n  ${prop}`)
    .join("");
  const handleCode = isDragEnabled
    ? `
      <div ref={handleRef} className="cursor-grab" aria-label="drag handle">
        <GripVertical size={16} aria-hidden />
      </div>`
    : "";

  return `import { useState } from "react";
import { Checkbox, TreeView, type TreeViewNodeId } from "@/components/ui";

const [treeData, setTreeData] = useState(initialData);
const [checkedIds, setCheckedIds] = useState<TreeViewNodeId[]>(${JSON.stringify(checkedIds)});

// 바깥에서 이미 DndProvider로 감쌌다면 withDndProvider={false}를 추가합니다.
<TreeView
  treeData={treeData}
  onTreeDataChange={setTreeData}${optionProps}
  checkedIds={checkedIds}
  onCheckedIdsChange={setCheckedIds}
  renderNode={(node, { depth, isOpen, onToggle, isChecked, onCheckToggle${isDragEnabled ? ", handleRef" : ""} }) => (
    <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">${handleCode}
      {node.droppable ? (
        <button type="button" onClick={onToggle} aria-label={isOpen ? "접기" : "펼치기"}>
          {isOpen ? <ChevronDown size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />}
        </button>
      ) : (
        <span aria-hidden className="inline-block w-[16px]" />
      )}
      <Checkbox label={node.text} checked={isChecked} onCheckedChange={onCheckToggle} />
    </div>
  )}
/>`;
}

/** TreeView Playground (이 페이지에서만 사용) */
function TreeViewPlayground() {
  const [treeData, setTreeData] = useState<TreeNodeShape[]>(() =>
    initialData.map((n) => ({ ...n })),
  );
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isPlaceholderEnabled, setIsPlaceholderEnabled] = useState(false);
  const [isCheckCascade, setIsCheckCascade] = useState(false);
  const [checkedIds, setCheckedIds] = useState<TreeNodeId[]>(
    PLAYGROUND_DEFAULT_CHECKED_IDS,
  );
  const { eventLogs, addEventLog, clearEventLogs } = useGuideEventLog();

  const nodeOptions = treeData.map((node) => ({
    value: String(node.id),
    label: node.text,
  }));

  const handleChangeTreeData = (nextTreeData: TreeNodeShape[]) => {
    setTreeData(nextTreeData);
    addEventLog(
      "onTreeDataChange",
      nextTreeData.map((node) => `${node.id}→${node.parent}`),
    );
  };

  const handleChangeCheckedIds = (nextCheckedIds: TreeNodeId[]) => {
    setCheckedIds(nextCheckedIds);
    addEventLog("onCheckedIdsChange", nextCheckedIds);
  };

  const handleChangeCheckedControl = (nextValues: string[]) => {
    // Controls 값은 문자열이라 원래 노드 id(숫자)로 되돌립니다.
    setCheckedIds(
      treeData
        .filter((node) => nextValues.includes(String(node.id)))
        .map((node) => node.id),
    );
  };

  const handleClickReset = () => {
    setTreeData(initialData.map((n) => ({ ...n })));
    setIsDragEnabled(false);
    setIsPlaceholderEnabled(false);
    setIsCheckCascade(false);
    setCheckedIds(PLAYGROUND_DEFAULT_CHECKED_IDS);
    clearEventLogs();
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "dragEnabled",
      type: "boolean",
      description:
        "드래그로 노드 순서·위치 변경 (폴더 노드 안으로만 넣을 수 있음). 바뀐 트리는 onTreeDataChange로 받습니다.",
      control: (
        <PlaygroundSwitchControl
          label="dragEnabled"
          checked={isDragEnabled}
          onCheckedChange={setIsDragEnabled}
        />
      ),
    },
    {
      name: "enablePlaceholder",
      type: "boolean",
      description:
        "드래그 중 놓일 위치를 선으로 미리 표시 (dragEnabled일 때만 적용)",
      control: (
        <PlaygroundSwitchControl
          label="enablePlaceholder"
          checked={isDragEnabled && isPlaceholderEnabled}
          onCheckedChange={setIsPlaceholderEnabled}
          disabled={!isDragEnabled}
        />
      ),
    },
    {
      name: "checkCascade",
      type: "boolean",
      description:
        "부모를 체크하면 자식 전체 체크, 자식이 모두 체크되면 부모도 체크",
      control: (
        <PlaygroundSwitchControl
          label="checkCascade"
          checked={isCheckCascade}
          onCheckedChange={setIsCheckCascade}
        />
      ),
    },
    {
      name: "checkedIds",
      type: "TreeViewNodeId[]",
      description:
        "체크된 노드 (onCheckedIdsChange와 함께 제어형). 여기서 바꾸면 checkCascade 연동 없이 그대로 반영됩니다.",
      control: (
        <PlaygroundCheckboxControl
          label="checkedIds"
          value={checkedIds.map(String)}
          options={nodeOptions}
          onValueChange={handleChangeCheckedControl}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. 미리보기에서 체크하거나 드래그해도 State가 함께 바뀝니다(제어형). 폴더 열기/닫기는 TreeView 내부 상태라 renderNode의 onToggle로만 기록합니다."
      code={buildTreeViewPlaygroundCode(
        isDragEnabled,
        isPlaceholderEnabled,
        isCheckCascade,
        checkedIds,
      )}
      controls={controls}
      controlsNote="dropTargetOffsetPx(드롭 판정 여백 px)는 화면에서 차이를 확인하기 어려워 Samples 예시를 참고합니다. indentPerDepthPx는 renderNode를 쓰지 않는 기본 렌더에서만 적용되어 제외했습니다(들여쓰기는 renderNode에서 depth로 직접 지정). rootId·withDndProvider는 데이터 구조·환경 설정이라 제외했습니다."
      state={{
        dragEnabled: isDragEnabled,
        enablePlaceholder: isDragEnabled && isPlaceholderEnabled,
        checkCascade: isCheckCascade,
        checkedIds,
        treeData: treeData.map((node) => `${node.id}(${node.text}) → parent ${node.parent}`),
      }}
      eventLogs={eventLogs}
      onReset={handleClickReset}
    >
      <div className="w-full max-w-md rounded-lg border-line02 border bg-base p-4">
        <TreeView
          treeData={treeData}
          onTreeDataChange={handleChangeTreeData}
          dragEnabled={isDragEnabled}
          enablePlaceholder={isDragEnabled && isPlaceholderEnabled}
          withDndProvider={false}
          checkedIds={checkedIds}
          onCheckedIdsChange={handleChangeCheckedIds}
          checkCascade={isCheckCascade}
          renderNode={(
            node,
            { depth, isOpen, onToggle, isChecked, onCheckToggle, handleRef },
          ) => (
            <TreeNodeChrome
              node={node as unknown as TreeNodeShape}
              depth={depth}
              isOpen={isOpen}
              onToggle={() => {
                onToggle();
                addEventLog("onToggle", node.id, !isOpen);
              }}
              handleRef={handleRef}
              showDragHandle={isDragEnabled}
            >
              <Checkbox
                label={node.text}
                checked={isChecked}
                onCheckedChange={onCheckToggle}
              />
            </TreeNodeChrome>
          )}
        />
      </div>
    </GuidePlayground>
  );
}

function SampleTreeViewPage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">TreeView Samples</h1>
      <div className="guide-content">
        {/* Playground의 TreeView도 같은 DndProvider를 쓰도록 탭 바깥에서 감쌉니다. */}
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <GuideSampleTabs playground={<TreeViewPlayground />}>
            <div className="flex flex-col gap-4">
              <GuideBox
                title="기본 (드래그 비활성)"
                description="기본은 드래그로 형제 노드 순서를 변경할 수 없습니다."
                code={`
import { TreeView } from "@/components/ui";
import { ChevronDown, ChevronRight, File, Folder, FolderOpen } from "lucide-react";

const treeData = [
  { id: 1, parent: 0, droppable: true, text: "Folder 1" },
  { id: 2, parent: 1, text: "File 1-1" },
  { id: 3, parent: 1, text: "File 1-2" },
];

export default function BasicTreeViewExample() {
  return (
    <TreeView
      treeData={treeData}
      withDndProvider={false}
      renderNode={(node, { depth, isOpen, onToggle }) => (
        <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">
          {node.droppable ? (
            <button type="button" onClick={onToggle}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block w-[16px]" />
          )}

          {node.droppable ? (
            isOpen ? <FolderOpen size={16} /> : <Folder size={16} />
          ) : (
            <File size={16} />
          )}

          <span>{node.text}</span>
        </div>
      )}
    />
  );
}
              `}
              >
                <ReadOnlyTree />
              </GuideBox>

              <GuideBox
                title="드래그 순서 변경 (옵션)"
                description="`dragEnabled`를 켰을 때만 순서 변경이 가능합니다."
                code={`
import { useState } from "react";
import { TreeView } from "@/components/ui";
import { GripVertical } from "lucide-react";

const [treeData, setTreeData] = useState(initialData);

export default function DragTreeViewExample() {
  return (
    <TreeView
      treeData={treeData}
      withDndProvider={false}
      dragEnabled
      enablePlaceholder
      dropTargetOffsetPx={26}
      onTreeDataChange={setTreeData}
      renderNode={(node, { depth, isOpen, onToggle, handleRef }) => (
        <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">
          <div ref={handleRef} className="cursor-grab text-font-g/70 hover:text-font-b">
            <GripVertical size={16} />
          </div>
          {node.droppable ? (
            <button type="button" onClick={onToggle}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block w-[16px]" />
          )}
          <span>{node.text}</span>
        </div>
      )}
    />
  );
}
              `}
              >
                <DragReorderTree />
              </GuideBox>

              <GuideBox
                title="멀티 체크 (checkbox)"
                description="여러 노드를 동시에 선택할 수 있는 체크 예시입니다."
                code={`
import { useState } from "react";
import { TreeView, type TreeViewNodeId } from "@/components/ui";

const [checkedIds, setCheckedIds] = useState<(number | string)[]>([2, 6]);

export default function CheckedTreeViewExample() {
  const [checkedIds, setCheckedIds] = useState<TreeViewNodeId[]>([2, 6]);

  return (
    <TreeView
      treeData={treeData}
      withDndProvider={false}
      checkedIds={checkedIds}
      onCheckedIdsChange={setCheckedIds}
      checkCascade
      renderNode={(node, { depth, isOpen, onToggle, isChecked, onCheckToggle }) => (
        <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">
          {node.droppable ? (
            <button type="button" onClick={onToggle}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block w-[16px]" />
          )}
          <input type="checkbox" checked={isChecked} onChange={onCheckToggle} />
          <span>{node.text}</span>
        </div>
      )}
    />
  );
}
              `}
              >
                <MultiCheckTree />
              </GuideBox>

              <GuideBox
                title="수정 가능"
                description="노드 텍스트를 인라인으로 수정할 수 있습니다."
                code={`
import { useState } from "react";
import { TreeView } from "@/components/ui";

const [treeData, setTreeData] = useState(initialData);
const [editingId, setEditingId] = useState<number | string | null>(null);
const [draftText, setDraftText] = useState("");

export default function EditableTreeViewExample() {
  const [treeData, setTreeData] = useState(initialData);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [draftText, setDraftText] = useState("");

  const save = () => {
    if (editingId == null) return;
    setTreeData((prev) =>
      prev.map((n) => (n.id === editingId ? { ...n, text: draftText } : n)),
    );
    setEditingId(null);
    setDraftText("");
  };

  return (
    <TreeView
      treeData={treeData}
      withDndProvider={false}
      renderNode={(node, { depth, isOpen, onToggle }) => (
        <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">
          {node.droppable ? (
            <button type="button" onClick={onToggle}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block w-[16px]" />
          )}

          {editingId === node.id ? (
            <>
              <input value={draftText} onChange={(e) => setDraftText(e.target.value)} />
              <button type="button" onClick={save}>save</button>
              <button type="button" onClick={() => setEditingId(null)}>cancel</button>
            </>
          ) : (
            <>
              <span>{node.text}</span>
              <button
                type="button"
                onClick={() => {
                  setEditingId(node.id);
                  setDraftText(node.text);
                }}
              >
                edit
              </button>
            </>
          )}
        </div>
      )}
    />
  );
}
              `}
              >
                <EditableTree />
              </GuideBox>

              <GuideBox
                title="추가 / 삭제"
                description="노드를 추가하고(폴더/파일 선택) 서브 트리를 삭제할 수 있습니다."
                code={`
import { useRef, useState } from "react";
import { TreeView } from "@/components/ui";

const [treeData, setTreeData] = useState(initialData);
const [addingParentId, setAddingParentId] = useState<number | string | null>(null);
const [newText, setNewText] = useState("");
const nextIdRef = useRef(100);

const removeWithChildren = (targetId: number | string) => {
  const childrenByParent = new Map<number | string, (number | string)[]>();
  for (const n of treeData) {
    const arr = childrenByParent.get(n.parent) ?? [];
    arr.push(n.id);
    childrenByParent.set(n.parent, arr);
  }
  const removeIds = new Set<number | string>();
  const stack = [targetId];
  while (stack.length) {
    const id = stack.pop()!;
    if (removeIds.has(id)) continue;
    removeIds.add(id);
    (childrenByParent.get(id) ?? []).forEach((c) => stack.push(c));
  }
  setTreeData((prev) => prev.filter((n) => !removeIds.has(n.id)));
};

export default function AddDeleteTreeViewExample() {
  return (
    <TreeView
      treeData={treeData}
      withDndProvider={false}
      renderNode={(node, { depth, isOpen, onToggle }) => (
        <div style={{ marginLeft: depth * 10 }} className="flex items-center gap-2">
          {node.droppable ? (
            <button type="button" onClick={onToggle}>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="inline-block w-[16px]" />
          )}

          <span>{node.text}</span>

          {addingParentId === node.id ? (
            <>
              <input value={newText} onChange={(e) => setNewText(e.target.value)} />
              <button
                type="button"
                onClick={() => {
                  if (!newText.trim()) return;
                  setTreeData((prev) => [
                    ...prev,
                    { id: nextIdRef.current++, parent: node.id, text: newText },
                  ]);
                  setAddingParentId(null);
                  setNewText("");
                }}
              >
                add
              </button>
              <button type="button" onClick={() => setAddingParentId(null)}>
                cancel
              </button>
            </>
          ) : (
            <>
              {node.droppable ? (
                <button type="button" onClick={() => setAddingParentId(node.id)}>
                  add child
                </button>
              ) : null}
              <button type="button" onClick={() => removeWithChildren(node.id)}>
                delete
              </button>
            </>
          )}
        </div>
      )}
    />
  );
}
              `}
              >
                <AddDeleteTree />
              </GuideBox>

              <GuideBox
                title="3영역 드래그 이동"
                description="세 개의 영역 사이에서 노드를 드래그로 이동하는 예시입니다."
                code={`
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { TreeView } from "@/components/ui";

const ROOT = 9000;
const AREA_A = 9001;
const AREA_B = 9002;
const AREA_C = 9003;

const initialData = [
  { id: AREA_A, parent: ROOT, droppable: true, text: "영역 A" },
  { id: AREA_B, parent: ROOT, droppable: true, text: "영역 B" },
  { id: AREA_C, parent: ROOT, droppable: true, text: "영역 C" },
  { id: 1, parent: AREA_A, text: "A-파일 1" },
  { id: 2, parent: AREA_B, text: "B-파일 1" },
  { id: 3, parent: AREA_C, text: "C-파일 1" },
];

export default function MultiAreaExample() {
  const [treeData, setTreeData] = useState(initialData);

  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <div className="grid gap-3 md:grid-cols-3">
        {[AREA_A, AREA_B, AREA_C].map((areaRootId) => (
          <TreeView
            key={areaRootId}
            treeData={treeData}
            rootId={areaRootId}
            withDndProvider={false}
            dragEnabled
            enablePlaceholder
            onTreeDataChange={setTreeData}
          />
        ))}
      </div>
    </DndProvider>
  );
}
              `}
              >
                <MultiAreaDragTree />
              </GuideBox>
            </div>
          </GuideSampleTabs>
        </DndProvider>
      </div>
    </div>
  );
}

export { SampleTreeViewPage };
export default SampleTreeViewPage;
