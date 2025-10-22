import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        plugins: [
            vue(),
        ],
        base: '/radio',
        server: {
            host: "localhost",
            port: 3005
        },
        build: {
            chunkSizeWarningLimit: 1600,
            outDir: "../apps/radio",
            emptyOutDir: true
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                // '@data': fileURLToPath(new URL('./src/data/', import.meta.url)),
            }
        }
    }
})