import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    //base: '/Aurelius/', // Github repository name
    base: '/', // Github repository name

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                gamerules: resolve(__dirname, 'gamerules/index.html'),
                chronicon: resolve(__dirname, 'chronicon.html'),


                // Add other entry points if needed
            }
        }
    }
});

