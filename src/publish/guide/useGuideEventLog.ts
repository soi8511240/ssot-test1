import { useCallback, useState } from "react";

const DEFAULT_MAX_EVENT_LOG_COUNT = 5;

function formatLogTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
}

/**
 * Playground 이벤트 로그(Storybook Actions 역할)를 관리합니다.
 * addEventLog("onValueChange", nextValue) → `12:00:00  onValueChange("item-1")`
 */
function useGuideEventLog(maxCount = DEFAULT_MAX_EVENT_LOG_COUNT) {
  const [eventLogs, setEventLogs] = useState<string[]>([]);

  const addEventLog = useCallback(
    (eventName: string, ...args: unknown[]) => {
      const payload = args.map((arg) => JSON.stringify(arg)).join(", ");
      const message = `${formatLogTime(new Date())}  ${eventName}(${payload})`;
      setEventLogs((prev) => [message, ...prev].slice(0, maxCount));
    },
    [maxCount],
  );

  const clearEventLogs = useCallback(() => setEventLogs([]), []);

  return { eventLogs, addEventLog, clearEventLogs, maxCount };
}

export { useGuideEventLog };
