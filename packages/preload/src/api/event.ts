import type { IpcRendererEvent } from 'electron';
import { ipcRenderer } from 'electron';

const listenerMap = new Map();

export const send = (channel: string, ...data: any[]) => {
    ipcRenderer.send(channel, ...data);
};

export const receive = (channel: string, listener: (...args: any) => void) => {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any) => listener(...args));
    const listenerList = ipcRenderer.listeners(channel);
    const newest = listenerList[listenerList.length - 1];
    const mark = Symbol();
    listenerMap.set(mark, newest);
    return mark;
};

export const sendSync = (channel: string, data?: any) => {
    return ipcRenderer.sendSync(channel, data);
};

export const invoke = (channel: string, listenerSymbol: symbol) => {
    const listener = listenerMap.get(listenerSymbol);
    if (listener) ipcRenderer.removeListener(channel, listener);
};
