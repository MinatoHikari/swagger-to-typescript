import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { registerApi } from '/@/api';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
    app.quit();
    process.exit(0);
}

app.disableHardwareAcceleration();

/**
 * Workaround for TypeScript bug
 * @see https://github.com/microsoft/TypeScript/issues/41468#issuecomment-727543400
 */
const env = import.meta.env;

// Install "Vue.js devtools"
if (env.MODE === 'development') {
    app.whenReady()
        .then(() => import('electron-devtools-installer'))
        .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
            installExtension(VUEJS3_DEVTOOLS, {
                loadExtensionOptions: {
                    allowFileAccess: true,
                },
            }),
        )
        .catch((e) => console.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;
let quit = false;

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        show: false, // Use 'ready-to-show' event to show window
        webPreferences: {
            preload: join(__dirname, '../../preload/dist/index.cjs'),
            contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
            enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
        },
        width: 1280,
        height: 720,
    });

    /**
     * If you install `show: true` then it can cause issues when trying to close the window.
     * Use `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    mainWindow.on('ready-to-show', () => {
        mainWindow?.show();

        if (env.MODE === 'development') {
            mainWindow?.webContents.openDevTools();
        }
    });

    mainWindow.on('close', (e) => {
        if (quit) {
            return (mainWindow = null);
        }
        e.preventDefault();
        mainWindow?.hide();
    });

    /**
     * URL for main window.
     * Vite dev server for development.
     * `file://../renderer/index.html` for production and test
     */
    const pageUrl =
        env.MODE === 'development'
            ? env.VITE_DEV_SERVER_URL
            : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    await mainWindow.loadURL(pageUrl as string);
};

app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => (quit = true));

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    } else {
        console.log();
        if (mainWindow.isDestroyed()) {
            createWindow();
        } else {
            mainWindow.restore();
            mainWindow.show();
        }
    }
});

app.whenReady()
    .then(createWindow)
    .then(() => {
        registerApi(mainWindow);
    })
    .catch((e) => console.error('Failed create window:', e));

// Auto-updates
if (env.PROD) {
    app.whenReady()
        .then(() => import('electron-updater'))
        .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
        .catch((e) => console.error('Failed check updates:', e));
}
