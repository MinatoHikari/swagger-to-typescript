import type { BrowserWindow } from 'electron';
import { clipboard, ipcMain, net } from 'electron';
import {
    copyEvent,
    electronStoreGetEvent,
    electronStoreSetEvent,
    errorEvent,
    requestApiSourcesEvent,
    requestSwaggerEvent,
} from '../../../common/events';
import store from '../store';
import type { StoreType } from '../../../common/store';
import type { HomeListItem } from '../../../common/pages';
import * as path from 'path';
import * as urlResolve from 'url';

function initClient(
    client: Electron.ClientRequest,
    event: Electron.IpcMainEvent,
    requestEvent: string,
    mainWindow: BrowserWindow | null,
) {
    client.on('response', (response) => {
        console.log(response.statusCode);
        let responseData = '';
        response.on('end', () => {
            if (response.statusCode === 200)
                event.sender.send(requestEvent, JSON.parse(responseData));
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
}

export const requestSwagger = (mainWindow: BrowserWindow | null): void => {
    ipcMain.on(requestSwaggerEvent, (event, base: string, path: string) => {
        console.log(new urlResolve.URL(path, base).toString());
        const client = net.request({
            // url: new URL(url).toString(),
            url: new urlResolve.URL(path, base).toString(),
            method: 'GET',
        });
        initClient(client, event, requestSwaggerEvent, mainWindow);
    });

    ipcMain.on(requestApiSourcesEvent, (event, baseUrl: string, version: 'v2' | 'v3') => {
        if (version === 'v2') {
            const url = `${baseUrl}/swagger-resources`;
            const client = net.request(url);
            initClient(client, event, requestApiSourcesEvent, mainWindow);
        } else {
            const client = net.request(`${baseUrl}/v3/api-docs/swagger-config`);
            initClient(client, event, requestApiSourcesEvent, mainWindow);
        }
    });
};

export const getStore = (mainWindow: BrowserWindow | null) => {
    const sendStoreData = () => {
        const key = 'sourceList';
        let data = store.get(key);
        if (!data) {
            store.set(key, []);
            data = [];
        }
        mainWindow?.webContents.send(electronStoreGetEvent, data);
    };

    sendStoreData();

    ipcMain.on(electronStoreGetEvent, (event, key: keyof StoreType) => {
        let data = store.get(key);
        if (!data) {
            store.set(key, []);
            data = [];
        }
        event.sender.send(electronStoreGetEvent, data);
    });

    ipcMain.on(
        electronStoreSetEvent,
        (
            event,
            data: {
                key: keyof StoreType;
                data: Omit<HomeListItem, 'type' | 'key'>[];
            },
        ) => {
            store.set(data.key, data.data);
        },
    );
};

export const execCopy = () => {
    ipcMain.on(copyEvent, (event, str: string) => {
        clipboard.writeText(str);
    });
};
