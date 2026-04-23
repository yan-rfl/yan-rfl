import { useWindows } from "../contexts/WindowsContext";
import Window from "./Window";

export default function Desktop() {
    const {
        windows, order, closingIds, minimizedIds, isShowingDesktop,
        fullscreenId, bringToFront, closeWindow, minimizeWindow,
        enterFullscreen, exitFullscreen,
    } = useWindows();

    return (
        <>
            {windows.map((win) => (
                <Window
                    key={win.id}
                    title={win.title}
                    emoji={win.emoji}
                    initialX={win.initialX ?? 60}
                    initialY={win.initialY ?? 40}
                    accentColor={win.accentColor}
                    zIndex={20 + order.indexOf(win.id)}
                    isActive={order[order.length - 1] === win.id}
                    isClosing={closingIds.includes(win.id)}
                    isHidden={isShowingDesktop}
                    isMinimized={minimizedIds.includes(win.id)}
                    isFullscreen={fullscreenId === win.id}
                    onBringToFront={() => bringToFront(win.id)}
                    onClose={() => closeWindow(win.id)}
                    onMinimize={() => minimizeWindow(win.id)}
                    onEnterFullscreen={() => enterFullscreen(win.id)}
                    onExitFullscreen={exitFullscreen}
                >
                    <iframe src={win.src} className="size-full" style={{ border: 0 }} />
                </Window>
            ))}
        </>
    );
}
