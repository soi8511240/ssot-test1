---
title: Dependency-Based Parallelization
impact: CRITICAL
impactDescription: 2-10× improvement
tags: async, parallelization, dependencies
---

## Dependency-Based Parallelization

> 프로젝트 수정: 원본은 `better-all` 라이브러리를 권하지만, 새 라이브러리 없이 `Promise.all`만으로 처리하는 방법만 남겼습니다(`AGENTS.md` 2장).

For operations with partial dependencies, start each promise as early as possible and await them together.

**Incorrect (profile waits for config unnecessarily):**

```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

**Correct (config and profile run in parallel):**

Create all the promises first, and do `Promise.all()` at the end.

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```
