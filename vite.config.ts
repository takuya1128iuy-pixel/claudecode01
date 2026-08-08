import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // 相対パスで出力し、GitHub Pages のサブディレクトリ配信でもそのまま動くようにする
  base: './',
  plugins: [react()],
})
