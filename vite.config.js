import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

// Get all .html files in src/ recursively
const htmlFiles = globSync('src/**/*.html', {
    absolute: true
});

// Include root index.html manually
const inputFiles = [resolve(__dirname, 'index.html'), ...htmlFiles];

// Flatten each HTML file to output as dist/<flattenedname>.html
const input = inputFiles.reduce((acc, file) => {
    // Extract just the filename (e.g., "chronicon.html" or "page1.html")
    const name = file.match(/src[\\/](.+)\.html$/);
    const key = name ? name[1].replace(/[\\/]/g, '_') : 'index'; // fallback for root

    acc[key] = file;
    return acc;
}, {});

export default defineConfig({
    base: '/',
    appType: 'mpa',
    build: {
        rollupOptions: {
            input
        }
    }
});
