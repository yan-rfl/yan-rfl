import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { GoDash } from "react-icons/go";
import { MacMaximizeIcon } from "./Icons/MacMaximizeIcon";
import { MacRestoreIcon } from "./Icons/MacRestoreIcon";
import { useWindows } from "../contexts/WindowsContext";

interface Position { x: number; y: number; }
interface Size { width: number; height: number; }

interface WindowProps {
    title?: string;
    emoji?: string;
    children?: ReactNode;
    initialX?: number;
    initialY?: number;
    accentColor?: "violet" | "indigo" | "rose" | "emerald" | "amber" | "dark";
    zIndex?: number;
    isActive?: boolean;
    isClosing?: boolean;
    isHidden?: boolean;
    isMinimized?: boolean;
    isFullscreen?: boolean;
    onBringToFront?: () => void;
    onClose?: () => void;
    onMinimize?: () => void;
    onEnterFullscreen?: () => void;
    onExitFullscreen?: () => void;
}

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;
const MIN_WIDTH = 480;
const MIN_HEIGHT = 270;

const accentMap = {
    violet: { gradient: "from-violet-500 to-indigo-600", shadow: "shadow-violet-500/30", bar: "bg-violet-400/30" },
    indigo: { gradient: "from-indigo-500 to-blue-600", shadow: "shadow-indigo-500/30", bar: "bg-indigo-400/30" },
    rose: { gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-500/30", bar: "bg-rose-400/30" },
    emerald: { gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/30", bar: "bg-emerald-400/30" },
    amber: { gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/30", bar: "bg-amber-400/30" },
    dark: { gradient: "from-zinc-800 to-zinc-900", shadow: "shadow-black/40", bar: "bg-white/5" },
};

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

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const edgeCursorMap: Record<ResizeEdge, string> = {
    n: "ns-resize", s: "ns-resize", e: "ew-resize", w: "ew-resize",
    ne: "nesw-resize", nw: "nwse-resize", se: "nwse-resize", sw: "nesw-resize",
};

export default function Window({
    title = "Window",
    emoji,
    children,
    initialX = 100,
    initialY = 100,
    accentColor = "dark",
    zIndex,
    isActive = true,
    isClosing = false,
    isHidden = false,
    isMinimized = false,
    isFullscreen = false,
    onBringToFront,
    onClose,
    onMinimize,
    onEnterFullscreen,
    onExitFullscreen,
}: WindowProps) {
    const { isTopbarVisibleInFullscreen, setTopbarVisibleInFullscreen, setDockVisibleInFullscreen } = useWindows();
    const isMobile = useIsMobile();
    const [mobileDockH, setMobileDockH] = useState(0);
    const [position, setPosition] = useState<Position>({ x: initialX, y: initialY });
    const [size, setSize] = useState<Size>(() => {
        const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
        const vh = typeof window !== "undefined" ? window.innerHeight : 900;
        return {
            width: Math.min(BASE_WIDTH, Math.max(MIN_WIDTH, Math.round(vw * 0.65))),
            height: Math.min(BASE_HEIGHT, Math.max(MIN_HEIGHT, Math.round(vh * 0.60))),
        };
    });
    const [blocking, setBlocking] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [savedState, setSavedState] = useState<{ size: Size; position: Position } | null>(null);
    const accent = accentMap[accentColor];

    useEffect(() => {
        const raf1 = requestAnimationFrame(() => {
            requestAnimationFrame(() => setMounted(true));
        });
        return () => cancelAnimationFrame(raf1);
    }, []);

    useEffect(() => {
        if (!isMobile) { setMobileDockH(0); return; }
        const measure = () => {
            const el = document.querySelector("[data-dock]") as HTMLElement | null;
            if (el) setMobileDockH(el.offsetHeight);
        };
        const t = setTimeout(measure, 50);
        window.addEventListener("resize", measure);
        return () => { clearTimeout(t); window.removeEventListener("resize", measure); };
    }, [isMobile]);

    // Fullscreen hover: iframes swallow mousemove events so window.addEventListener("mousemove")
    // won't fire when the cursor is over the iframe. Instead we use thin sensor strips at the
    // top/bottom of the content area (above the iframe in z-order) plus title-bar enter/leave.
    const titleBarRef = useRef<HTMLDivElement>(null);
    const hideTopbarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideDockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showTopbar = useCallback(() => {
        if (hideTopbarTimerRef.current) { clearTimeout(hideTopbarTimerRef.current); hideTopbarTimerRef.current = null; }
        setTopbarVisibleInFullscreen(true);
    }, [setTopbarVisibleInFullscreen]);

    const scheduleHideTopbar = useCallback(() => {
        if (hideTopbarTimerRef.current) clearTimeout(hideTopbarTimerRef.current);
        hideTopbarTimerRef.current = setTimeout(() => {
            setTopbarVisibleInFullscreen(false);
            hideTopbarTimerRef.current = null;
        }, 300);
    }, [setTopbarVisibleInFullscreen]);

    const showDock = useCallback(() => {
        if (hideDockTimerRef.current) { clearTimeout(hideDockTimerRef.current); hideDockTimerRef.current = null; }
        setDockVisibleInFullscreen(true);
    }, [setDockVisibleInFullscreen]);

    // Reset visibility and clear timers when exiting fullscreen.
    useEffect(() => {
        if (isFullscreen) return;
        if (hideTopbarTimerRef.current) { clearTimeout(hideTopbarTimerRef.current); hideTopbarTimerRef.current = null; }
        if (hideDockTimerRef.current) { clearTimeout(hideDockTimerRef.current); hideDockTimerRef.current = null; }
        setTopbarVisibleInFullscreen(false);
        setDockVisibleInFullscreen(false);
    }, [isFullscreen, setTopbarVisibleInFullscreen, setDockVisibleInFullscreen]);

    useEffect(() => () => {
        if (hideTopbarTimerRef.current) clearTimeout(hideTopbarTimerRef.current);
        if (hideDockTimerRef.current) clearTimeout(hideDockTimerRef.current);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragOffset = useRef<Position>({ x: 0, y: 0 });
    const positionRef = useRef(position);
    positionRef.current = position;
    const sizeRef = useRef(size);
    sizeRef.current = size;

    // Refs so handlers can read latest values without stale closures
    const isMaximizedRef = useRef(isMaximized);
    isMaximizedRef.current = isMaximized;
    const savedStateRef = useRef(savedState);
    savedStateRef.current = savedState;

    const getBounds = useCallback(() => {
        let parent: HTMLElement | null = containerRef.current?.parentElement ?? null;
        while (parent && parent.clientWidth === 0 && parent.clientHeight === 0) {
            parent = parent.parentElement;
        }
        const boundsW = parent?.clientWidth ?? window.innerWidth;
        const boundsH = parent?.clientHeight ?? window.innerHeight;

        const dockEl = parent?.querySelector("[data-dock]") as HTMLElement | null;
        let dockTop = boundsH;
        if (dockEl && parent) {
            const parentRect = parent.getBoundingClientRect();
            dockTop = dockEl.getBoundingClientRect().top - parentRect.top;
        }

        return { boundsW, boundsH, dockTop };
    }, []);

    // --- Drag ---
    // Only clear isMaximized on first actual mouse movement, not on mousedown.
    // This prevents the double-click handler from seeing a stale isMaximized=false
    // caused by the first mousedown of the dblclick sequence.
    const handleDragMouseDown = useCallback((e: React.MouseEvent) => {
        if (isFullscreen || isMobile) return;
        e.preventDefault();

        dragOffset.current = {
            x: e.clientX - positionRef.current.x,
            y: e.clientY - positionRef.current.y,
        };

        const { boundsW, boundsH } = getBounds();
        // Minimum grab area — enough of the title bar must remain on-screen to drag back.
        const GRAB_W = 80;
        const GRAB_H = 30;
        setBlocking(true);
        let clearedMaximize = false;
        const startClientX = e.clientX;
        const startClientY = e.clientY;

        const handleMouseMove = (e: MouseEvent) => {
            if (!clearedMaximize) {
                const dx = Math.abs(e.clientX - startClientX);
                const dy = Math.abs(e.clientY - startClientY);
                if (dx <= 4 && dy <= 4) return;
                clearedMaximize = true;
                setIsMaximized(false);
                setSavedState(null);
            }
            const { width } = sizeRef.current;
            const newX = Math.min(Math.max(-(width - GRAB_W), e.clientX - dragOffset.current.x), boundsW - GRAB_W);
            const newY = Math.min(Math.max(0, e.clientY - dragOffset.current.y), boundsH - GRAB_H);
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            setBlocking(false);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }, [isFullscreen, isMobile, getBounds]);

    // --- Double-click title bar: maximize / restore ---
    const handleTitleBarDoubleClick = useCallback(() => {
        if (isFullscreen || isMobile) return;
        // Read from refs so we always get the current value even if useCallback
        // was created before the latest state update.
        if (isMaximizedRef.current) {
            const saved = savedStateRef.current;
            if (saved) {
                setSize(saved.size);
                setPosition(saved.position);
            }
            setIsMaximized(false);
            setSavedState(null);
        } else {
            const { boundsW, dockTop } = getBounds();
            setSavedState({ size: { ...sizeRef.current }, position: { ...positionRef.current } });
            setPosition({ x: 0, y: 0 });
            setSize({ width: boundsW, height: dockTop });
            setIsMaximized(true);
        }
    }, [isFullscreen, isMobile, getBounds]);

    // --- Resize ---
    const resizeStart = useRef<{
        mouseX: number; mouseY: number;
        startX: number; startY: number;
        startW: number; startH: number;
        edge: ResizeEdge;
        boundsW: number; dockTop: number;
    } | null>(null);

    const handleResizeMouseDown = useCallback((e: React.MouseEvent, edge: ResizeEdge) => {
        e.preventDefault();
        e.stopPropagation();

        const { boundsW, dockTop } = getBounds();

        resizeStart.current = {
            mouseX: e.clientX, mouseY: e.clientY,
            startX: positionRef.current.x, startY: positionRef.current.y,
            startW: sizeRef.current.width, startH: sizeRef.current.height,
            edge, boundsW, dockTop,
        };

        setBlocking(true);

        const handleMouseMove = (e: MouseEvent) => {
            if (!resizeStart.current) return;
            const { mouseX, mouseY, startX, startY, startW, startH, edge, boundsW, dockTop } = resizeStart.current;
            const dx = e.clientX - mouseX;
            const dy = e.clientY - mouseY;

            let newW = startW, newH = startH, newX = startX, newY = startY;

            if (edge.includes("e")) newW = startW + dx;
            if (edge.includes("s")) newH = startH + dy;
            if (edge.includes("w")) { newW = startW - dx; newX = startX + dx; }
            if (edge.includes("n")) { newH = startH - dy; newY = startY + dy; }

            if (newW < MIN_WIDTH) { if (edge.includes("w")) newX = startX + startW - MIN_WIDTH; newW = MIN_WIDTH; }
            if (newH < MIN_HEIGHT) { if (edge.includes("n")) newY = startY + startH - MIN_HEIGHT; newH = MIN_HEIGHT; }
            if (newW > boundsW) { if (edge.includes("w")) newX = startX + startW - boundsW; newW = boundsW; }
            if (newY < 0) { if (edge.includes("n")) newH = newH + newY; newY = 0; }
            if (newY + newH > dockTop) {
                if (edge.includes("n")) { newY = dockTop - newH; if (newY < 0) { newY = 0; newH = dockTop; } }
                else { newH = dockTop - newY; }
            }

            setSize({ width: newW, height: newH });
            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            resizeStart.current = null;
            setBlocking(false);
            if (containerRef.current) {
                setSize({ width: containerRef.current.offsetWidth, height: containerRef.current.offsetHeight });
            }
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }, [getBounds]);

    const resizeHandle = (edge: ResizeEdge) => {
        const sizeMap: Record<ResizeEdge, string> = {
            n: "top-0 left-2 right-2 h-1", s: "bottom-0 left-2 right-2 h-1",
            e: "right-0 top-2 bottom-2 w-1", w: "left-0 top-2 bottom-2 w-1",
            ne: "top-0 right-0 w-3 h-3", nw: "top-0 left-0 w-3 h-3",
            se: "bottom-0 right-0 w-3 h-3", sw: "bottom-0 left-0 w-3 h-3",
        };
        return (
            <div
                key={edge}
                className={`absolute z-10 ${sizeMap[edge]}`}
                style={{ cursor: edgeCursorMap[edge] }}
                onMouseDown={(e) => handleResizeMouseDown(e, edge)}
            />
        );
    };

    const edges: ResizeEdge[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];

    const containerStyle = isFullscreen
        ? {
            position: "fixed" as const,
            inset: 0, left: 0, top: 0,
            width: "100vw", height: "100vh",
            zIndex: 9998, borderRadius: 0,
            transform: "none", opacity: 1,
            pointerEvents: "auto" as const,
            transition: "none",
        }
        : isMobile
        ? {
            position: "absolute" as const,
            top: 0, left: 0, right: 0, bottom: mobileDockH,
            zIndex, borderRadius: 0,
            transform: isMinimized
                ? "scale(0.1) translateY(200px)"
                : mounted && !isClosing ? "scale(1)" : "scale(0.92)",
            opacity: isMinimized ? 0 : mounted && !isClosing ? 1 : 0,
            pointerEvents: (!mounted || isClosing || isMinimized) ? "none" as const : "auto" as const,
            transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
        }
        : {
            left: position.x,
            top: isHidden ? "calc(100% - 20px)" : position.y,
            width: size.width, height: size.height, zIndex,
            transform: isMinimized
                ? "scale(0.1) translateY(200px)"
                : mounted && !isClosing ? "scale(1)" : "scale(0.92)",
            opacity: isMinimized ? 0 : mounted && !isClosing ? 1 : 0,
            pointerEvents: (!mounted || isClosing || isMinimized) ? "none" as const : "auto" as const,
            transition: blocking
                ? "transform 0.2s ease-out, opacity 0.2s ease-out"
                : "top 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.3s ease-out, opacity 0.3s ease-out",
        };

    // In fullscreen the title bar slides in from the top when the mouse enters the
    // top 64 px zone (tracked via window mousemove). It needs a solid background so
    // it doesn't look transparent over the iframe content.
    const titleBarFullscreenStyle = isFullscreen
        ? {
            position: "absolute" as const,
            top: 0, left: 0, right: 0,
            zIndex: 5,
            background: "rgba(24,24,27,0.92)", // zinc-900/92 — solid enough to read over any content
            backdropFilter: "blur(12px)",
            transform: isTopbarVisibleInFullscreen ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)",
        }
        : undefined;

    return (
        <div
            ref={containerRef}
            style={containerStyle}
            onMouseDown={onBringToFront}
            className={`
                absolute select-none flex flex-col
                rounded-2xl origin-center
                bg-linear-to-br ${accent.gradient}
                shadow-xl ${accent.shadow}
                overflow-hidden
            `}
        >
            {/* Resize handles — only in normal desktop mode */}
            {!isFullscreen && !isMobile && edges.map((edge) => resizeHandle(edge))}


            {/* Title bar */}
            <div
                ref={titleBarRef}
                onMouseDown={isFullscreen ? undefined : handleDragMouseDown}
                onDoubleClick={handleTitleBarDoubleClick}
                onMouseEnter={isFullscreen ? showTopbar : undefined}
                onMouseLeave={isFullscreen ? scheduleHideTopbar : undefined}
                style={titleBarFullscreenStyle}
                className={`
                    flex items-center gap-2.5 shrink-0
                    px-4 py-2
                    ${isFullscreen ? "" : "rounded-t-2xl"}
                    ${accent.bar}
                    border-b border-white/10
                `}
            >
                <div className="flex items-center gap-1.5 group">
                    {/* Red — Close */}
                    <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-red-400" : "bg-zinc-600 group-hover:bg-red-400"}`}
                        onMouseDown={(e) => { e.stopPropagation(); onClose?.(); }}
                    >
                        <IoCloseOutline className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Yellow — Minimize */}
                    <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-yellow-400" : "bg-zinc-600 group-hover:bg-yellow-400"}`}
                        onMouseDown={(e) => { e.stopPropagation(); onMinimize?.(); }}
                    >
                        <GoDash className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {/* Green — Fullscreen / restore */}
                    <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-green-400" : "bg-zinc-600 group-hover:bg-green-400"}`}
                        onMouseDown={(e) => { e.stopPropagation(); isFullscreen ? onExitFullscreen?.() : onEnterFullscreen?.(); }}
                    >
                        {isFullscreen
                            ? <MacRestoreIcon className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                            : <MacMaximizeIcon className="text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity" />
                        }
                    </div>
                </div>
                <span className="text-white/80 text-xs font-semibold tracking-wider">
                    {emoji && <span className="mr-1">{emoji}</span>}{title}
                </span>
            </div>

            {/* Content area */}
            <div className="flex-1 min-h-0 relative overflow-hidden">
                {blocking && <div className="absolute inset-0 z-50" />}
                {!isActive && !isFullscreen && (
                    <div className="absolute inset-0 z-40" onMouseDown={onBringToFront} />
                )}
                {children}
                {/* Sensor strips: sit above the iframe (which swallows all mousemove events)
                    so we can detect the cursor entering the top/bottom zones in fullscreen. */}
                {isFullscreen && (
                    <>
                        <div
                            className="absolute top-0 left-0 right-0 z-4"
                            style={{ height: 8 }}
                            onMouseEnter={showTopbar}
                            onMouseLeave={(e) => {
                                const tb = titleBarRef.current;
                                if (tb?.contains(e.relatedTarget as Node) || tb === e.relatedTarget) return;
                                scheduleHideTopbar();
                            }}
                        />
                        <div
                            className="absolute bottom-0 left-0 right-0 z-4"
                            style={{ height: 8 }}
                            onMouseEnter={showDock}
                            onMouseLeave={(e) => {
                                const dock = document.querySelector("[data-dock]");
                                if (dock?.contains(e.relatedTarget as Node) || dock === e.relatedTarget) return;
                                setDockVisibleInFullscreen(false);
                            }}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
