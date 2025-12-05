import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget = env.API_PROXY_TARGET || 'http://localhost:4005';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/app': path.resolve(__dirname, './src/app'),
        '@/features': path.resolve(__dirname, './src/features'),
        '@/shared': path.resolve(__dirname, './src/shared'),
        '@/layouts': path.resolve(__dirname, './src/layouts'),
        '@/routes': path.resolve(__dirname, './src/routes'),
        '@/i18n': path.resolve(__dirname, './src/i18n'),
        '@/styles': path.resolve(__dirname, './src/styles'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5175,
      strictPort: true,
      watch: {
        usePolling: true, // Required for Docker
      },
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 8081,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/_variables.scss" as *;\n`,
          silenceDeprecations: [
            'legacy-js-api',
            'import',
            'global-builtin',
            'color-functions',
            'if-function',
          ],
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            ui: ['react-bootstrap', 'bootstrap'],
            charts: ['recharts'],
            i18n: ['i18next', 'react-i18next'],
          },
        },
      },
    },
  };
});
