declare global {
    import type { IpcRenderer } from 'electron';

    type ElectronIpcRender = IpcRenderer;
}

interface ElectronApi {
    readonly versions: Readonly<NodeJS.ProcessVersions>;
    readonly send: (channel: string, data?: any) => void;
    readonly sendSync: (channel: string, data?: any) => any;
    readonly receive: (channel: string, listener: (...args: any) => void) => symbol;
    readonly invoke: (channel: string, listenerSymbol: symbol) => void;
}

declare interface Window {
    electron: Readonly<ElectronApi>;
    electronRequire?: NodeRequire;
}
