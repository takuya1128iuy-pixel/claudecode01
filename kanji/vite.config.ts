import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 相対パス出力にして、GitHub Pages の /claudecode01/kanji/ 配下でもそのまま動くようにする
export default defineConfig({
  base: './',
  plugins: [react()],
})
