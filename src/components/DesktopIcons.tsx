import { useState, useEffect, useRef } from "react";
import { useWindows } from "../contexts/WindowsContext";
import type { WindowConfig } from "../contexts/WindowsContext";

export const desktopApps: (WindowConfig & { emoji: string })[] = [
    { id: "about-me",    emoji: "🧑🏻", title: "About Me",    src: "/AboutMe",    initialX: 60,  initialY: 40  },
    { id: "my-projects", emoji: "📁",   title: "My Projects", src: "/MyProjects", initialX: 180, initialY: 100 },
    { id: "my-cv",       emoji: "📄",   title: "My CV",       src: "/MyCV",       initialX: 300, initialY: 60  },
];

export default function DesktopIcons() {
    const { windows, bringToFront, openWindow, hideDesktop } = useWindows();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setSelectedId(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleDoubleClick = (app: (typeof desktopApps)[0]) => {
        const isOpen = windows.some((w) => w.id === app.id);
        if (isOpen) {
            bringToFront(app.id);
        } else {
            const { emoji: _emoji, ...config } = app;
            openWindow(config);
        }
        hideDesktop();
    };

    return (
        <div
            ref={containerRef}
            className="absolute top-3 right-3 z-10 flex flex-col gap-1"
        >
            {desktopApps.map((app) => (
                <button
                    key={app.id}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl w-18 transition-colors duration-150 ${
                        selectedId === app.id ? "bg-blue-500/30 ring-1 ring-blue-400/40" : "hover:bg-white/10"
                    }`}
                    onMouseDown={(e) => { e.stopPropagation(); setSelectedId(app.id); }}
                    onDoubleClick={() => handleDoubleClick(app)}
                >
                    <span className="text-4xl drop-shadow-md">{app.emoji}</span>
                    <span className="text-white text-xs text-center leading-tight drop-shadow font-medium px-1">
                        {app.title}
                    </span>
                </button>
            ))}
        </div>
    );
}
