import type { BrowserWindow } from 'electron';

export const setProxy = (mainWindow: BrowserWindow | null) => {
    mainWindow?.webContents.session.setProxy({
        mode: 'direct',
    });
};
