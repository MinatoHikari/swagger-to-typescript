import type { BrowserWindow } from 'electron';
import { ipcMain } from 'electron';
import { searchShortcut, closeSearchShortcut } from '../../../common/events';

export const searchShortCut = (mainWindow: BrowserWindow | null) => {
    mainWindow?.webContents.on('before-input-event', (event, input) => {
        if (input.key.toLowerCase() === 'escape') mainWindow?.webContents.send(closeSearchShortcut);
        if ((input.meta || input.control) && input.key.toLowerCase() === 'f')
            mainWindow?.webContents.send(searchShortcut);
    });
};
