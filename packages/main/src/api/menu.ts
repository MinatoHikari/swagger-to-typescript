import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { checkElementEvent } from '../../../common/events';

export const checkElement = (mainWindow: BrowserWindow | null) => {
    ipcMain.on(checkElementEvent, (event, data: { x: number; y: number }) => {
        const { x, y } = data;
        mainWindow?.webContents.inspectElement(x, y);
    });
};
