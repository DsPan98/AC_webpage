import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import legacy from '@vitejs/plugin-legacy'

export default ({ mode }) => {
  // process patch
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_PORT, VITE_BASE_URL } = loadEnv(mode, process.cwd());
  return defineConfig({
    define: {
      "process.env": env,
    },
    base: VITE_BASE_URL,
    plugins: [
      vue2(),
      legacy({
        targets: ['Chrome 64'],
        modernPolyfills: true
      })],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${resolve('src/style/variables.less')}";`,
          },
          math: 'strict',
          javascriptEnabled: true,
        },
      },
    },
    server: {
  
      https: false,
  
      port: VITE_PORT,
   
      host: '0.0.0.0',
      
      open: true,
      
      cors: true,
      
      proxy: {

      },
    },
    build: {
      target: 'es2015',
      sourcemap: false,
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      minify: true
    },
  });
};
