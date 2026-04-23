import { WindowsProvider } from "../contexts/WindowsContext";
import type { WindowConfig } from "../contexts/WindowsContext";
import TopBar from "./TopBar";
import DesktopArea from "./DesktopArea";

interface AppProps {
    initialWindows: WindowConfig[];
}

export default function App({ initialWindows }: AppProps) {
    return (
        <WindowsProvider initialWindows={initialWindows}>
            <div className="flex flex-col w-dvw h-dvh">
                <TopBar />
                <DesktopArea />
            </div>
        </WindowsProvider>
    );
}
