---
title: Deduplicate Global Event Listeners
impact: LOW
impactDescription: single listener for N components
tags: client, event-listeners, subscription
---

## Deduplicate Global Event Listeners

> 프로젝트 수정: 원본은 `swr/subscription`을 사용하지만, 이 프로젝트는 SWR을 쓰지 않으므로 모듈 수준 리스너 하나를 공유하는 방식으로 바꿨습니다.

Share one global event listener across component instances instead of registering one per instance.

**Incorrect (N instances = N listeners):**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

When using the `useKeyboardShortcut` hook multiple times, each instance will register a new listener.

**Correct (N instances = 1 listener):**

```tsx
// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

function handleKeydownGlobal(e: KeyboardEvent) {
  if (e.metaKey && keyCallbacks.has(e.key)) {
    keyCallbacks.get(e.key)!.forEach(cb => cb())
  }
}

function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    // Attach the single shared listener when the first callback registers
    if (keyCallbacks.size === 0) {
      window.addEventListener('keydown', handleKeydownGlobal)
    }
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
      // Detach when the last callback unregisters
      if (keyCallbacks.size === 0) {
        window.removeEventListener('keydown', handleKeydownGlobal)
      }
    }
  }, [key, callback])
}

function Profile() {
  // Multiple shortcuts share the same listener
  useKeyboardShortcut('p', () => { /* ... */ })
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```
