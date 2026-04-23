import { useState, useEffect } from "react";
import { CiBatteryFull } from "react-icons/ci";
import { HiOutlineAdjustments } from "react-icons/hi";
import { HiSun, HiMoon } from "react-icons/hi";
import { useWindows } from "../contexts/WindowsContext";

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function TopBar() {
  const now = useClock();
  const { windows, order, fullscreenId } = useWindows();
  const activeTitle = windows.find((w) => w.id === order[order.length - 1])?.title ?? "Desktop";
  const isInFullscreen = fullscreenId !== null;

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

  // TopBar is permanently hidden in fullscreen — the window's own title bar takes over.
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
      {/* Left: active window name */}
      <span className="font-semibold text-white/90 tracking-wide transition-all duration-200">{activeTitle}</span>

      {/* Right: status items */}
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