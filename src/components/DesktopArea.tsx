import { useEffect, useRef } from "react";
import { useWindows } from "../contexts/WindowsContext";
import type { WindowConfig } from "../contexts/WindowsContext";
import Desktop from "./Desktop";
import Dock from "./Dock";
import DesktopIcons from "./DesktopIcons";

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
            <DesktopIcons />
            <Desktop />
            <Dock />
        </div>
    );
}
