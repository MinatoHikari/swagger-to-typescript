/* eslint-env node */

import { chrome } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { renderer } from 'unplugin-auto-expose';

const PACKAGE_ROOT = __dirname;

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    mode: process.env.MODE,
    envDir: process.cwd(),
    base: '',
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@/': join(PACKAGE_ROOT, 'src') + '/',
        },
    },
    plugins: [
        vue({
            reactivityTransform: true,
        }),
        vueJsx({}),
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/head', '@vueuse/core'],
            dts: 'src/auto-imports.d.ts',
        }),
        renderer.vite({
            preloadEntry: join(PACKAGE_ROOT, '../preload/src/index.ts'),
        }),
    ],
    build: {
        sourcemap: true,
        target: `chrome${chrome}`,
        outDir: 'dist',
        assetsDir: '.',
        rollupOptions: {
            external: [...builtinModules],
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
});
