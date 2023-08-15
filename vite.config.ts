import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // can change this to @vitejs/plugin-react if you want to use babel as the transpiler instead
import dns from 'dns';
import EnvironmentPlugin from 'vite-plugin-environment';

dns.setDefaultResultOrder('verbatim'); // makes it use localhost instead of 127.0.0.1 (can get rid of this if we add 127.0.0.1 to the allowed origins in AAD)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all', { prefix: 'REACT_APP_' })],
  server: {
    open: process.argv.indexOf('--no-open') < 0,
    port: 3000,
  },
  build: {
	  outDir: 'build'
  }
});
