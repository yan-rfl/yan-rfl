import { useEffect, useRef } from "react";
import { useWindows } from "../contexts/WindowsContext";
import type { WindowConfig } from "../contexts/WindowsContext";
import Desktop from "./Desktop";
import Dock from "./Dock";

export default function DesktopArea() {
    const { isShowingDesktop, showDesktop, hideDesktop, openWindow, bringToFront, windows } = useWindows();

    const windowsRef = useRef(windows);
    windowsRef.current = windows;

    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.data?.type !== "open-window") return;
            const { id, title, src, emoji } = e.data as WindowConfig & { type: string };
            if (!id || !title || !src) return;
            if (windowsRef.current.some((w) => w.id === id)) {
                bringToFront(id);
            } else {
                openWindow({ id, title, src, emoji });
            }
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, [openWindow, bringToFront]);

    return (
        <div className="relative flex-1 overflow-hidden">
            {/* Background click target — sits below everything */}
            <div
                className="absolute inset-0 z-0"
                onMouseDown={() => (isShowingDesktop ? hideDesktop() : showDesktop())}
            />

            {/* Wallpaper text */}
            <div className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none select-none">
                <p className="text-[clamp(3rem,8vw,7rem)] font-black leading-none tracking-tighter"
                   style={{ color: "rgba(0,0,0,0.055)" }}>
                    Ryan Rafael
                </p>
            </div>
            <Desktop />
            <Dock />
        </div>
    );
}
