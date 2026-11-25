"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { pageTrees } from "@/generated/page-trees";
import { stripSchemePrefix, toSchemeHref } from "@/lib/style-templates";
import { useMotionPreference } from "@/ui/utils/use-motion-preference";
import { X } from "@/components/icons";
import { useSiteSkin } from "./site-skin";

const DISMISS_KEY = "litefy.motion-notice.dismissed";

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // The banner still hides for this page view when storage is unavailable.
  }
}

function NoticeBar({
  locale,
  fromApp,
  translated,
  href,
  onDismiss,
  onVisibilityChange,
}: {
  locale: "zh" | "en";
  fromApp: boolean;
  translated: boolean;
  href: string;
  onDismiss: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}) {
  const { Button } = useSiteSkin();
  const reportVisibility = useCallback((node: HTMLDivElement | null) => {
    onVisibilityChange?.(node !== null);
  }, [onVisibilityChange]);
  // 模态期间整条隐藏但保留盒子，正文不跳。
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const sync = () =>
      setModalOpen([...document.querySelectorAll("dialog")].some((d) => d.open));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ["open"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={reportVisibility}
      className="[grid-area:topbar] border-b bg-surface text-surface-fg data-[modal-open=true]:invisible"
      data-modal-open={modalOpen || undefined}
    >
      <div className="relative flex min-h-control flex-wrap items-center justify-center gap-x-2 gap-y-1 ps-4 pe-14 py-2 text-center text-sm md:ps-6 lg:ps-8 lg:pe-14">
        <span role="status">
          {fromApp
            ? locale === "zh"
              ? "已按应用内的动效设置暂停动画。"
              : "Animations paused by your app's motion setting."
            : locale === "zh"
              ? "已按系统的减少动态效果设置暂停动画。"
              : "Animations paused by your system's reduced motion setting."}
        </span>
        <Link
          to={href}
          className="underline underline-offset-4 focus-visible:focus-ring"
        >
          {locale === "zh"
            ? "查看原因与设置方法"
            : translated ? "View settings" : "View settings (Chinese)"}
        </Link>
        <Button
          type="button"
          icon={<X className="size-4" aria-hidden />}
          data-variant="text"
          onClick={onDismiss}
          aria-label={locale === "zh" ? "关闭提示" : "Dismiss notice"}
          title={locale === "zh" ? "关闭提示" : "Dismiss notice"}
          className="absolute end-1 top-1/2 -translate-y-1/2 text-surface-fg md:end-3 lg:end-5"
        />
      </div>
    </div>
  );
}

export function MotionPreferenceNotice({ onVisibilityChange }: { onVisibilityChange?: (visible: boolean) => void }) {
  const motion = useMotionPreference();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const hydratedRef = useRef(false);
  const { lang } = useParams<{ lang: string }>();
  const { pathname } = useLocation();
  const locale = lang === "zh" ? "zh" : "en";
  const translated = pageTrees[locale].data.children.some(
    (page) => page.type === "page" && page.url === `/${locale}/docs/motion`,
  );
  const targetLocale = translated ? locale : "zh";

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setDismissed(readDismissed());
    setMounted(true);
  }, []);

  if (!mounted || dismissed || !motion.reduced) return null;
  if (stripSchemePrefix(pathname).endsWith("/docs/motion")) return null;

  const dismiss = () => {
    rememberDismissed();
    setDismissed(true);
  };

  return (
    <NoticeBar
      locale={locale}
      fromApp={motion.mode === "reduce"}
      translated={translated}
      href={toSchemeHref(pathname, `/${targetLocale}/docs/motion`)}
      onDismiss={dismiss}
      onVisibilityChange={onVisibilityChange}
    />
  );
}
