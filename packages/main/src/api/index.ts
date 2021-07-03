import { requestSwagger } from './swagger';
import { setProxy } from './config';
import type { BrowserWindow } from 'electron';
import { checkElement } from './menu';

export const registerApi = (mainWindow: BrowserWindow | null): void => {
    requestSwagger(mainWindow);
    setProxy(mainWindow);
    checkElement(mainWindow);
};