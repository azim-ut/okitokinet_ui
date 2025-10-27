import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    let dataDir = env.VITE_ROOT_PATH
    return {
        plugins: [
            vue(),
        ],
        base: '/' + dataDir,
        server: {
            host: "localhost",
            port: 3003
        },
        build: {
            chunkSizeWarningLimit: 1600,
            outDir: "../apps/okitoki",
            emptyOutDir: true
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    }
})