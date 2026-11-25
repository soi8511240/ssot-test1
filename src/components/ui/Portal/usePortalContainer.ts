import * as React from "react";

/**
 * 특정 id를 가진 DOM 요소를 자동으로 생성·제거하며 포탈 컨테이너로 사용하는 훅.
 *
 * @example
 * const container = usePortalContainer("tooltip-root");
 * return <Portal container={container}><Tooltip /></Portal>;
 */
export function usePortalContainer(id: string): HTMLElement | null {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    let el = document.getElementById(id);
    let created = false;

    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.appendChild(el);
      created = true;
    }

    setContainer(el);

    return () => {
      if (created && el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [id]);

  return container;
}
