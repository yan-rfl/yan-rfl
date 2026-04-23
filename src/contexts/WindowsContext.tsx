import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

export interface WindowConfig {
    id: string;
    title: string;
    src: string;
    initialX?: number;
    initialY?: number;
    accentColor?: "violet" | "indigo" | "rose" | "emerald" | "amber" | "dark";
    emoji?: string;
}

interface WindowsContextValue {
    windows: WindowConfig[];
    order: string[];
    closingIds: string[];
    minimizedIds: string[];
    isShowingDesktop: boolean;
    fullscreenId: string | null;
    isTopbarVisibleInFullscreen: boolean;
    isDockVisibleInFullscreen: boolean;
    bringToFront: (id: string) => void;
    closeWindow: (id: string) => void;
    openWindow: (config: WindowConfig) => void;
    showDesktop: () => void;
    hideDesktop: () => void;
    minimizeWindow: (id: string) => void;
    unminimizeWindow: (id: string) => void;
    enterFullscreen: (id: string) => void;
    exitFullscreen: () => void;
    setTopbarVisibleInFullscreen: (v: boolean) => void;
    setDockVisibleInFullscreen: (v: boolean) => void;
}

const WindowsContext = createContext<WindowsContextValue | null>(null);

export function WindowsProvider({ initialWindows, children }: { initialWindows: WindowConfig[]; children: ReactNode }) {
    const [windows, setWindows] = useState<WindowConfig[]>(initialWindows);
    const [order, setOrder] = useState<string[]>(initialWindows.map((w) => w.id));
    const [closingIds, setClosingIds] = useState<string[]>([]);
    const [minimizedIds, setMinimizedIds] = useState<string[]>([]);
    const [isShowingDesktop, setIsShowingDesktop] = useState(false);
    const [fullscreenId, setFullscreenId] = useState<string | null>(null);
    const [isTopbarVisibleInFullscreen, setTopbarVisibleInFullscreen] = useState(false);
    const [isDockVisibleInFullscreen, setDockVisibleInFullscreen] = useState(false);

    const bringToFront = useCallback((id: string) => {
        setIsShowingDesktop(false);
        setOrder((prev) => {
            if (prev[prev.length - 1] === id) return prev;
            return [...prev.filter((i) => i !== id), id];
        });
    }, []);

    const closeWindow = useCallback((id: string) => {
        setClosingIds((prev) => [...prev, id]);
        setFullscreenId((prev) => (prev === id ? null : prev));
        setTimeout(() => {
            setWindows((prev) => prev.filter((w) => w.id !== id));
            setOrder((prev) => prev.filter((i) => i !== id));
            setClosingIds((prev) => prev.filter((i) => i !== id));
            setMinimizedIds((prev) => prev.filter((i) => i !== id));
        }, 220);
    }, []);

    const openWindow = useCallback((config: WindowConfig) => {
        setIsShowingDesktop(false);
        setWindows((prev) => {
            if (prev.find((w) => w.id === config.id)) return prev;
            return [...prev, config];
        });
        setOrder((prev) => {
            if (prev.includes(config.id)) return [...prev.filter((i) => i !== config.id), config.id];
            return [...prev, config.id];
        });
    }, []);

    const showDesktop = useCallback(() => setIsShowingDesktop(true), []);
    const hideDesktop = useCallback(() => setIsShowingDesktop(false), []);

    const minimizeWindow = useCallback((id: string) => {
        setMinimizedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    const unminimizeWindow = useCallback((id: string) => {
        setMinimizedIds((prev) => prev.filter((i) => i !== id));
        setIsShowingDesktop(false);
        setOrder((prev) => {
            if (prev[prev.length - 1] === id) return prev;
            return [...prev.filter((i) => i !== id), id];
        });
    }, []);

    const enterFullscreen = useCallback((id: string) => {
        setFullscreenId(id);
        setIsShowingDesktop(false);
        setTopbarVisibleInFullscreen(false);
        setDockVisibleInFullscreen(false);
        setOrder((prev) => {
            if (prev[prev.length - 1] === id) return prev;
            return [...prev.filter((i) => i !== id), id];
        });
    }, []);

    const exitFullscreen = useCallback(() => {
        setFullscreenId(null);
        setTopbarVisibleInFullscreen(false);
        setDockVisibleInFullscreen(false);
    }, []);

    return (
        <WindowsContext.Provider value={{
            windows, order, closingIds, minimizedIds, isShowingDesktop,
            fullscreenId, isTopbarVisibleInFullscreen, isDockVisibleInFullscreen,
            bringToFront, closeWindow, openWindow, showDesktop, hideDesktop,
            minimizeWindow, unminimizeWindow, enterFullscreen, exitFullscreen,
            setTopbarVisibleInFullscreen, setDockVisibleInFullscreen,
        }}>
            {children}
        </WindowsContext.Provider>
    );
}

export function useWindows() {
    const ctx = useContext(WindowsContext);
    if (!ctx) throw new Error("useWindows must be used within WindowsProvider");
    return ctx;
}
