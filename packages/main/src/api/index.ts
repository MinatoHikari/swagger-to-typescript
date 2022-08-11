import { execCopy, getStore, requestSwagger } from './swagger';
import { setProxy } from './config';
import type { BrowserWindow } from 'electron';
import { checkElement } from './menu';
import { searchShortCut } from './shortcut';

export const registerApi = (mainWindow: BrowserWindow | null): void => {
    requestSwagger(mainWindow);
    setProxy(mainWindow);
    checkElement(mainWindow);
    searchShortCut(mainWindow);
    getStore(mainWindow);
    execCopy();
};
