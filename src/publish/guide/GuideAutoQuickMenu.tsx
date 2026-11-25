import {
  scrollElementIntoViewInContainer,
  useScrollSpy,
} from "@/hooks/useScrollSpy";
import { GuideQuickMenu } from "@/publish/guide/components";
import { publishGuideNavItems } from "@/publish/guide/sampleMeta";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useLocation } from "react-router-dom";

type GuideAutoQuickMenuProps = {
  hostRef: RefObject<HTMLElement | null>;
};

type QuickSection = {
  id: string;
  label: string;
};

export function GuideAutoQuickMenu({ hostRef }: GuideAutoQuickMenuProps) {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // 수집한 섹션은 수집 당시 경로와 함께 저장하고, 경로가 바뀌면 자동으로 빈 목록으로 취급합니다.
  const [collected, setCollected] = useState<{
    pathname: string;
    sections: QuickSection[];
  }>({ pathname: "", sections: [] });

  const currentNavItem = useMemo(
    () => publishGuideNavItems.find((item) => item.path === pathname),
    [pathname],
  );
  const isComponentsPage = currentNavItem?.section === "components";
  const sections = useMemo(
    () =>
      isComponentsPage && collected.pathname === pathname
        ? collected.sections
        : [],
    [collected, isComponentsPage, pathname],
  );
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeSectionId = useScrollSpy(scrollRef, sectionIds, {
    activeLineRatio: 0.22,
  });

  useEffect(() => {
    const host = hostRef.current;
    const container = host?.querySelector<HTMLDivElement>(".guide-content");
    if (
      !isComponentsPage ||
      !container ||
      container.dataset.guideQuickMenu === "off"
    ) {
      scrollRef.current = null;
      return;
    }

    scrollRef.current = container;

    const collectSections = () => {
      const sectionNodes = Array.from(
        container.querySelectorAll<HTMLElement>("section"),
      ).filter((node) => node.querySelector("h2"));

      const nextSections = sectionNodes.map((node, index) => {
        if (!node.id) {
          node.id = `guide-auto-section-${index + 1}`;
        }

        const headingText = node.querySelector("h2")?.textContent?.trim();
        return {
          id: node.id,
          label: headingText || `섹션 ${index + 1}`,
        };
      });

      setCollected({ pathname, sections: nextSections });
    };

    // 렌더 직후 DOM이 그려진 다음 프레임에서 첫 수집
    const frameId = requestAnimationFrame(collectSections);

    const observer = new MutationObserver(() => {
      collectSections();
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [hostRef, isComponentsPage, pathname]);

  const handleSelectSection = (id: string) => {
    const root = scrollRef.current;
    if (!root) return;
    scrollElementIntoViewInContainer(root, id, {
      behavior: "smooth",
      offsetTop: 8,
    });
  };

  const handleScrollTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isComponentsPage || sections.length < 2) return null;

  return (
    <GuideQuickMenu
      sections={sections}
      activeSectionId={activeSectionId}
      onSelectSection={handleSelectSection}
      onScrollTop={handleScrollTop}
      className="absolute top-4 right-4 z-20"
    />
  );
}
