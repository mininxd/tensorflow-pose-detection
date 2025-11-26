import { defineConfig } from 'vite';
import { resolve } from 'path';
import { builtinModules } from 'module';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: 'globalThis',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'poseDetection',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => `pose-detection.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: [
        '@tensorflow/tfjs-core',
        '@tensorflow/tfjs-converter',
        '@tensorflow/tfjs-backend-webgpu',
        '@tensorflow/tfjs-backend-webgl',
        '@mediapipe/pose',
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`), // For Node.js built-in modules
      ],
      output: {
        globals: {
          '@tensorflow/tfjs-core': 'tf',
          '@tensorflow/tfjs-converter': 'tf',
          '@mediapipe/pose': 'globalThis',
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});