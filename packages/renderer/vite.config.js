/* eslint-env node */

import { chrome } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { loadAndSetEnv } from '../../scripts/loadAndSetEnv.mjs';

const PACKAGE_ROOT = __dirname;

/**
 * Vite looks for `.env.[mode]` files only in `PACKAGE_ROOT` directory.
 * Therefore, you must manually load and set the environment variables from the root directory above
 */
loadAndSetEnv(process.env.MODE, process.cwd());

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@/': join(PACKAGE_ROOT, 'src') + '/',
        },
    },
    plugins: [vue(), vueJsx({})],
    base: '',
    server: {
        fsServe: {
            root: join(PACKAGE_ROOT, '../../'),
        },
    },
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            external: [...builtinModules],
        },
        emptyOutDir: true,
    },
});
