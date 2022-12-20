import { node } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';

import { defineConfig } from 'vite';

const PACKAGE_ROOT = __dirname;

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
    mode: process.env.MODE,
    envDir: process.cwd(),
    root: PACKAGE_ROOT,
    resolve: {
        alias: {
            '/@/': join(PACKAGE_ROOT, 'src') + '/',
        },
    },
    build: {
        ssr: true,
        sourcemap: 'inline',
        target: `node${node}`,
        outDir: 'dist',
        assetsDir: '.',
        minify: process.env.MODE !== 'development',
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs'],
        },
        rollupOptions: {
            output: {
                entryFileNames: '[name].cjs',
            },
        },
        emptyOutDir: true,
        reportCompressedSize: false,
    },
});
