import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from '@vant/auto-import-resolver';
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [VantResolver()],
      dts: 'types/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: 'types/.eslintrc-auto-import.json',
        globalsPropValue: true
      }
    }),
    Components({
      dts: 'types/components.d.ts',
      extensions: ['vue'],
      dirs: ['src/components'],
      resolvers: [VantResolver()]
    }),
    Pages({
      dirs: 'src/views', // 需要生成路由的文件目录
      exclude: ['**/components/*.vue'], // 排除在外的目录，即不将所有 components 目录下的 .vue 文件生成路由,
      routeBlockLang: 'json', // 路由块的语言，yaml 或 json
      extendRoute(route) {
        if (route.path === '/') {
          return { ...route, redirect: '/404' }
        }
      },
      importMode: 'async'
    }),
    Layouts({
      layoutsDirs: 'src/layouts', // 布局文件存放目录
      pagesDirs: 'src/views', // 页面文件存放目录
      defaultLayout: 'index' // 默认布局，对应 src/layout/Index.vue
    }),
    VueSetupExtend()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    devSourcemap: true,
  },
  server: {
    hmr: true,			// ← ← ← ← ← ←
    host: '0.0.0.0',	// ← 新增内容 ←
    port:5173,
    proxy: {
      '^/api': {
        target: 'http://122.51.67.196:8081/coffee',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  }
})
