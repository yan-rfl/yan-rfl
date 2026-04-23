import { useWindows } from "../contexts/WindowsContext";
import type { WindowConfig } from "../contexts/WindowsContext";

const dockApps: (WindowConfig & { emoji: string })[] = [
    { id: "about-me",    emoji: "🧑🏻", title: "About Me",    src: "/AboutMe",    initialX: 60,  initialY: 40  },
    { id: "my-projects", emoji: "📁",   title: "My Projects", src: "/MyProjects", initialX: 180, initialY: 100 },
    { id: "my-cv",       emoji: "📄",   title: "My CV",       src: "/MyCV",       initialX: 300, initialY: 60  },
];

const accentGradientMap: Record<string, string> = {
    violet:  "from-violet-500 to-indigo-600",
    indigo:  "from-indigo-500 to-blue-600",
    rose:    "from-rose-500 to-pink-600",
    emerald: "from-emerald-500 to-teal-600",
    amber:   "from-amber-500 to-orange-600",
    dark:    "from-zinc-700 to-zinc-900",
};

export default function Dock() {
    const {
        windows, order, bringToFront, openWindow, hideDesktop,
        minimizedIds, unminimizeWindow,
        fullscreenId, isDockVisibleInFullscreen, setDockVisibleInFullscreen,
    } = useWindows();

    const handleClick = (app: (typeof dockApps)[0]) => {
        const isOpen = windows.some((w) => w.id === app.id);
        if (isOpen) {
            bringToFront(app.id);
        } else {
            const { emoji: _emoji, ...config } = app;
            openWindow(config);
        }
        hideDesktop();
    };

    const minimizedWindows = windows.filter((w) => minimizedIds.includes(w.id));
    const isInFullscreen = fullscreenId !== null;

    const dockStyle = isInFullscreen
        ? {
            position: "fixed" as const,
            bottom: 12,
            left: "50%",
            transform: `translateX(-50%) translateY(${isDockVisibleInFullscreen ? "0" : "200%"})`,
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            zIndex: 10000,
        }
        : undefined;

    return (
        <div
            data-dock
            style={dockStyle}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-9999 flex items-end gap-0.5 px-2.5 py-2 bg-zinc-900/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
            onMouseLeave={isInFullscreen ? () => setDockVisibleInFullscreen(false) : undefined}
        >
            {dockApps.map((app) => {
                const isOpen = windows.some((w) => w.id === app.id);
                const isMinimized = minimizedIds.includes(app.id);
                const isActive = isOpen && !isMinimized && order[order.length - 1] === app.id;

                return (
                    <button
                        key={app.id}
                        onClick={() => handleClick(app)}
                        className="flex flex-col items-center gap-1 px-1.5 py-0.5 group"
                        title={app.title}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl transition-colors duration-150 ${
                            isActive
                                ? "bg-white/20 group-hover:bg-white/25"
                                : "bg-transparent group-hover:bg-white/15"
                        }`}>
                            {app.emoji}
                        </div>
                        <div className="h-1 flex items-center justify-center">
                            {isActive ? (
                                <div className="w-4 h-0.5 rounded-full bg-white transition-all duration-300" />
                            ) : isOpen ? (
                                <div className="w-1 h-1 rounded-full bg-white/50 transition-all duration-300" />
                            ) : (
                                <div className="w-0 h-0.5 rounded-full bg-transparent transition-all duration-300" />
                            )}
                        </div>
                    </button>
                );
            })}

            {/* Minimized window thumbnails */}
            {minimizedWindows.length > 0 && (
                <>
                    <div className="w-px h-8 bg-white/20 mx-1 self-center" />
                    {minimizedWindows.map((win) => {
                        const gradient = accentGradientMap[win.accentColor ?? "dark"];
                        return (
                            <button
                                key={win.id}
                                onClick={() => unminimizeWindow(win.id)}
                                className="flex flex-col items-center gap-1 px-1.5 py-0.5 group"
                                title={win.title}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-linear-to-br ${gradient} group-hover:opacity-80 transition-opacity`}>
                                    {win.emoji ?? "🗂"}
                                </div>
                                <div className="h-1 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-white/50 transition-all duration-300" />
                                </div>
                            </button>
                        );
                    })}
                </>
            )}
        </div>
    );
}
