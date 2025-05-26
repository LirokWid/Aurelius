import { defineConfig } from 'vite';
import { resolve } from 'path';


export default defineConfig({
    base: '/',
    appType: 'mpa',
    build: {
        rollupOptions: {
            input: {
                home: resolve(__dirname, 'index.html'),
                page1: resolve(__dirname, 'src/page1/index.html'),
                page2: resolve(__dirname, 'src/page2/index.html'),
                gamerules: resolve(__dirname, 'src/gamerules/index.html'),
                codex: resolve(__dirname, 'src/codex/codex hermetica.html'),
                fragment: resolve(__dirname, 'src/fragment/fragment aurelius 232.html'),
                chronicon: resolve(__dirname, 'src/chronicon/chronicon.html'),
                notFound: resolve(__dirname, 'src/404.html')
            }
        }
    }
});
