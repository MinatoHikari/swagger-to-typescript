import { node } from '../../electron-vendors.config.json';
import { join } from 'path';
import { builtinModules } from 'module';

import { defineConfig } from 'vite';
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
    build: {
        sourcemap: 'inline',
        target: `node${node}`,
        outDir: 'dist',
        assetsDir: '.',
        lib: {
            entry: 'src/index.ts',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: [
                'electron',
                /**
                 * semver can not be bundled
                 * @see https://github.com/npm/node-semver/issues/381
                 */
                'semver',
                ...builtinModules,
            ],
            output: {
                entryFileNames: '[name].cjs',
            },
        },
        emptyOutDir: true,
    },
});
