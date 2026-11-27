---
title: Use React Query for Automatic Deduplication
impact: MEDIUM-HIGH
impactDescription: automatic deduplication
tags: client, react-query, deduplication, data-fetching
---

## Use React Query for Automatic Deduplication

> 프로젝트 수정: 원본은 SWR을 권장하지만, 이 프로젝트에는 같은 역할의 `@tanstack/react-query`(v5)가 이미 있으므로 SWR을 추가하지 않습니다(`AGENTS.md` 2장). 퍼블리싱 단계에서는 실제 API를 호출하지 않으므로, 데이터 요청 코드가 필요할 때만 이 규칙을 적용합니다.

React Query deduplicates requests, caches results, and revalidates across component instances that use the same `queryKey`.

**Incorrect (no deduplication, each instance fetches):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

**Correct (multiple instances share one request):**

```tsx
import { useQuery } from '@tanstack/react-query'

function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
```

**For data that never changes:**

```tsx
const { data } = useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity,
})
```

**For mutations:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function UpdateButton() {
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] }),
  })
  return <button type="button" onClick={() => mutate()}>Update</button>
}
```

Reference: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
