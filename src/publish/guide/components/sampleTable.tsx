import { useState } from "react";

import {
  Checkbox,
  Input,
  ScrollArea,
  ScrollBar,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { GuideBox } from "@/publish/guide/GuideBox";
import {
  GuidePlayground,
  GuideSampleTabs,
  PlaygroundRadioControl,
  type GuidePlaygroundControl,
} from "@/publish/guide/GuidePlayground";

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Moderator",
    status: "Active",
  },
];

type TableVariant = "default" | "sub";
type TableType = "horizontal" | "vertical";

const PLAYGROUND_FIELDS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "status", label: "Status" },
] as const;

const PLAYGROUND_USER = sampleData[0];

/** 현재 컨트롤 값으로 사용 코드를 만듭니다. */
function buildPlaygroundCode(variant: TableVariant, tableType: TableType) {
  const variantProp = variant !== "default" ? ` variant="${variant}"` : "";
  const typeProp = ` type="${tableType}"`;

  if (tableType === "horizontal") {
    const rows = PLAYGROUND_FIELDS.map(
      (field) => `    <TableRow>
      <TableHead>${field.label}</TableHead>
      <TableCell>${PLAYGROUND_USER[field.key]}</TableCell>
    </TableRow>`,
    ).join("\n");

    return `<Table${variantProp}${typeProp}>
  <TableCaption>사용자 상세 정보</TableCaption>
  <colgroup>
    <col className="w-30" />
    <col />
  </colgroup>
  <TableBody>
${rows}
  </TableBody>
</Table>`;
  }

  const headCells = PLAYGROUND_FIELDS.map(
    (field) => `      <TableHead>${field.label}</TableHead>`,
  ).join("\n");

  return `<Table${variantProp}${typeProp}>
  <TableCaption>사용자 목록</TableCaption>
  <TableHeader>
    <TableRow>
${headCells}
    </TableRow>
  </TableHeader>
  <TableBody>
    {sampleData.map((user) => (
      <TableRow key={user.id}>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>{user.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`;
}

/** Table Playground (이 페이지에서만 사용) */
function TablePlayground() {
  const [variant, setVariant] = useState<TableVariant>("default");
  const [tableType, setTableType] = useState<TableType>("horizontal");

  const handleClickReset = () => {
    setVariant("default");
    setTableType("horizontal");
  };

  const controls: GuidePlaygroundControl[] = [
    {
      name: "variant",
      type: '"default" | "sub"',
      description: "default: 바깥 테두리·둥근 모서리, 셀 높이 48px / sub: 바깥 테두리 없음, 진한 헤더, 셀 높이 40px",
      control: (
        <PlaygroundRadioControl
          label="variant"
          value={variant}
          options={["default", "sub"]}
          onValueChange={(next) => setVariant(next as TableVariant)}
        />
      ),
    },
    {
      name: "type",
      type: '"horizontal" | "vertical"',
      description:
        "horizontal: 행마다 TableHead(왼쪽 제목) + TableCell / vertical: TableHeader(위쪽 제목) + 데이터 행",
      control: (
        <PlaygroundRadioControl
          label="type"
          value={tableType}
          options={["horizontal", "vertical"]}
          onValueChange={(next) => setTableType(next as TableType)}
        />
      ),
    },
  ];

  return (
    <GuidePlayground
      description="Controls에서 Props를 바꾸면 미리보기와 코드가 바로 바뀝니다. type에 따라 마크업 구조(TableHeader 사용 여부)도 달라집니다."
      code={buildPlaygroundCode(variant, tableType)}
      controls={controls}
      controlsNote="Table은 이벤트가 없는 표시용 컴포넌트라 이벤트 로그를 두지 않았습니다. TableCaption은 화면에 표시되지 않고(display: none), TableFooter는 전용 스타일이 없어 Controls에 넣지 않았습니다."
      state={{ variant, type: tableType }}
      onReset={handleClickReset}
    >
      {tableType === "horizontal" ? (
        <Table variant={variant} type="horizontal">
          <TableCaption>사용자 상세 정보</TableCaption>
          <colgroup>
            <col className="w-30" />
            <col />
          </colgroup>
          <TableBody>
            {PLAYGROUND_FIELDS.map((field) => (
              <TableRow key={field.key}>
                <TableHead>{field.label}</TableHead>
                <TableCell>{PLAYGROUND_USER[field.key]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Table variant={variant} type="vertical">
          <TableCaption>사용자 목록</TableCaption>
          <TableHeader>
            <TableRow>
              {PLAYGROUND_FIELDS.map((field) => (
                <TableHead key={field.key}>{field.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((user) => (
              <TableRow key={user.id}>
                {PLAYGROUND_FIELDS.map((field) => (
                  <TableCell key={field.key}>{user[field.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </GuidePlayground>
  );
}

function SampleTablePage() {
  return (
    <div className="guide-layout">
      <h1 className="guide-title">Table Samples</h1>
      <div className="guide-content">
        <GuideSampleTabs playground={<TablePlayground />}>
          <GuideBox
            title="Horizontal Table"
            description="가로형 테이블입니다. 각 행이 레코드를 나타냅니다."
            code={`
  <Table type="horizontal">
    <TableCaption>A list of users in horizontal layout.</TableCaption>
    <TableBody>
      {sampleData.map((user) => (
        <TableRow key={user.id}>
          <TableHead>Name</TableHead>
          <TableCell>{user.name}</TableCell>
          <TableHead>Email</TableHead>
          <TableCell>{user.email}</TableCell>
          <TableHead>Role</TableHead>
          <TableCell>{user.role}</TableCell>
          <TableHead>Status</TableHead>
          <TableCell>{user.status}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
            `}
          >
            <ScrollArea className="rounded-lg bg-base border rounded-2xl">
              <Table type="horizontal">
                <TableCaption>A list of users in horizontal layout.</TableCaption>
                <TableBody>
                  {sampleData.map((user) => (
                    <TableRow key={user.id}>
                      <TableHead>Name</TableHead>
                      <TableCell>{user.name}</TableCell>
                      <TableHead>Email</TableHead>
                      <TableCell>{user.email}</TableCell>
                      <TableHead>Role</TableHead>
                      <TableCell>{user.role}</TableCell>
                      <TableHead>Status</TableHead>
                      <TableCell>{user.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </GuideBox>
          <GuideBox
            title="Horizontal Table"
            description="가로형 입력폼 테이블입니다. 각 행이 레코드를 나타냅니다."
            code={`
  <Table type="horizontal">
    <TableCaption>A list of users in horizontal layout.</TableCaption>
     <colgroup>
        <col className="w-30" />
        <col />
      </colgroup>
    <TableBody>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableCell>
          <Input placeholder="이름을 입력하세요" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead>Email</TableHead>
        <TableCell>
          <Input placeholder="이메일을 입력하세요" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
            `}
          >
            <Table type="horizontal">
              <TableCaption>A list of users in horizontal layout.</TableCaption>
              <colgroup>
                <col className="w-30" />
                <col />
              </colgroup>
              <TableBody>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableCell>
                    <Input placeholder="이름을 입력하세요" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableCell>
                    <Input placeholder="이메일을 입력하세요" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GuideBox>

          <GuideBox
            title="Vertical Table"
            description="세로형 테이블입니다."
            code={`
  <Table type="vertical">
    <TableCaption>A list of users.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sampleData.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.role}</TableCell>
          <TableCell>{user.status}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
            `}
          >
            <Table type="vertical">
              <TableCaption>A list of users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GuideBox>
          <GuideBox
            title="Vertical Table"
            description="세로형 입력폼 테이블입니다."
            code={`
  <Table type="vertical">
    <TableCaption>A list of users.</TableCaption>
    <colgroup>
      <col className="w-50" />
      <col />
    </colgroup>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <Input placeholder="이름을 입력하세요" />
        </TableCell>
        <TableCell>
          <Input placeholder="이메일을 입력하세요" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
            `}
          >
            <Table type="vertical">
              <TableCaption>A list of users.</TableCaption>
              <colgroup>
                <col className="w-50" />
                <col />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Input placeholder="이름을 입력하세요" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="이메일을 입력하세요" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GuideBox>

          <GuideBox
            title="sub Vertical Table"
            description="테두리가 없는 서브타입 세로형 테이블입니다."
            code={`
  <Table variant="sub" type="vertical">
    <TableCaption>A list of users in sub vertical layout.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {sampleData.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>{user.role}</TableCell>
          <TableCell>{user.status}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
            `}
          >
            <Table variant="sub" type="vertical">
              <TableCaption>A list of users in sub vertical layout.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GuideBox>
          <GuideBox
            title="sub Vertical Table"
            description="테두리가 없는 서브타입 세로형 입력폼 테이블입니다."
            code={`
  <Table variant="sub" type="vertical">
    <TableCaption>A list of users in sub vertical layout.</TableCaption>
    <colgroup>
      <col className="w-6" />
      <col />
      <col />
    </colgroup>
    <TableHeader>
      <TableRow>
        <TableHead>
          <Checkbox />
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Input placeholder="이름을 입력하세요" />
        </TableCell>
        <TableCell>
          <Input placeholder="이메일을 입력하세요" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Checkbox />
        </TableCell>
        <TableCell>
          <Input placeholder="이름을 입력하세요" />
        </TableCell>
        <TableCell>
          <Input placeholder="이메일을 입력하세요" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
            `}
          >
            <Table variant="sub" type="vertical">
              <TableCaption>A list of users in sub vertical layout.</TableCaption>
              <colgroup>
                <col className="w-6" />
                <col />
                <col />
              </colgroup>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="이름을 입력하세요" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="이메일을 입력하세요" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="이름을 입력하세요" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="이메일을 입력하세요" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </GuideBox>
        </GuideSampleTabs>
      </div>
    </div>
  );
}

export { SampleTablePage };
export default SampleTablePage;
