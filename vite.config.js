import { defineConfig } from 'vite';
import { resolve } from 'path';
import { globSync } from 'glob';

// Get all HTML files inside src/pages*/index.html
const subPages = globSync('src/*/*.html',
    {
    absolute: true
});

// Add the root index.html manually
const inputFiles = [resolve(__dirname, 'index.html'), ...subPages];

// Map each input to a named entry
const input = inputFiles.reduce((acc, file) =>
{
    const relativePath = file.replace(__dirname + '\\', '').replace(/\.html$/, '');

    // Use the relative path (with slashes converted) as the key
    const name = relativePath.replace(/\\/g, '/');
    acc[name] = file;
    return acc;
}, {});

export default defineConfig({
    base: '/', // Or '/Aurelius/' if for GitHub Pages
    appType: 'mpa',
    build: {
        rollupOptions: {
            input
        }
    }
});
