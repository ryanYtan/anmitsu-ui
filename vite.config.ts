import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// `yarn dev` serves the demo page in demo/, which imports the library's source directly.
export default defineConfig({ root: 'demo', base: './', plugins: [react()], server: { host: true } })
