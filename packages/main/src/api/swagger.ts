import type { BrowserWindow } from 'electron';
import { ipcMain, net } from 'electron';
import {errorEvent, requestSwaggerEvent} from '../../../common/events';

export const requestSwagger = (mainWindow: BrowserWindow | null): void => {
    ipcMain.on(requestSwaggerEvent, (event, url: string) => {
        console.log(url);
        const client = net.request(url);
        client.on('response', (response) => {
            console.log(response.statusCode);
            let responseData = '';
            response.on('end', () => {
                if (response.statusCode === 200)
                    event.sender.send(requestSwaggerEvent, JSON.parse(responseData));
            });
            response.on('data', (data) => {
                responseData += data;
            });

        });

        client.on(errorEvent, (err) => {
            console.log(err);
            mainWindow?.webContents.send(errorEvent, err);
        });

        client.end();
    });
};
