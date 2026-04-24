import { useState, useEffect } from "react";
import { CiBatteryFull } from "react-icons/ci";
import { useWindows } from "../contexts/WindowsContext";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function TopBar() {
  const isMobile = useIsMobile();
  const now = useClock();
  const { fullscreenId } = useWindows();
  const isInFullscreen = fullscreenId !== null;

  if (isMobile) return null;

  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const fullscreenStyle = isInFullscreen
    ? {
      position: "fixed" as const,
      top: 0, left: 0, right: 0,
      zIndex: 10000,
      transform: "translateY(-100%)",
    }
    : undefined;

  return (
    <div
      className="h-7 bg-zinc-900 flex items-center justify-between px-4 text-white text-xs font-medium select-none shrink-0 border-b border-white/10 z-50"
      style={fullscreenStyle}
    >
      <div className="flex items-center gap-4">
        <img className="size-3" src="/favicon.svg" alt="" />
        <span className="font-semibold text-white/90 tracking-wide">Ryan Rafael</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-white/75">
          <CiBatteryFull size={20} />
        </div>
        <span className="text-white/75">
          {dateStr}&nbsp;&nbsp;{timeStr}
        </span>
      </div>
    </div>
  );
}
