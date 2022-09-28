import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import lessToCssModule from 'vite-plugin-less-2cssmodule';
import autoprefixer from 'autoprefixer';
import eslintPlugin from 'vite-plugin-eslint';

const generateScopedName = '[local]___[hash:base64:5]';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    lessToCssModule(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
    eslintPlugin({
      include: ['src/**/*.tsx', 'src/**/*.ts', 'src/*.ts', 'src/*.tsx'], // eslint校验的文件类型
    }),
  ],
  css: {
    modules: {
      generateScopedName,
    },
    postcss: {
      plugins: [autoprefixer],
    },
  },
});
