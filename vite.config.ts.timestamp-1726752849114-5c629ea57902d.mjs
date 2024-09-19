// vite.config.ts
import { defineConfig } from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
import AutoImport from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/@vant/auto-import-resolver/dist/index.esm.mjs";
import { NaiveUiResolver } from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/unplugin-vue-components/dist/resolvers.js";
import Pages from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/vite-plugin-pages/dist/index.js";
import Layouts from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import VueSetupExtend from "file:///C:/Users/WT/Desktop/BurgerKing/node_modules/vite-plugin-vue-setup-extend/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\WT\\Desktop\\BurgerKing";
var vite_config_default = defineConfig({
  base: "/",
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/,
        // .vue
        /\.md$/
        // .md
      ],
      imports: ["vue", "vue-router", "pinia"],
      resolvers: [VantResolver(), NaiveUiResolver()],
      dts: "types/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "types/.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    }),
    Components({
      dts: "types/components.d.ts",
      extensions: ["vue"],
      dirs: ["src/components"],
      resolvers: [VantResolver(), NaiveUiResolver()]
    }),
    Pages({
      dirs: "src/views",
      // 需要生成路由的文件目录
      exclude: ["**/components/*.vue"],
      // 排除在外的目录，即不将所有 components 目录下的 .vue 文件生成路由,
      routeBlockLang: "json",
      // 路由块的语言，yaml 或 json
      extendRoute(route) {
        if (route.path === "/") {
          return { ...route, redirect: "/404" };
        }
      },
      importMode: "async"
    }),
    Layouts({
      layoutsDirs: "src/layouts",
      // 布局文件存放目录
      pagesDirs: "src/views",
      // 页面文件存放目录
      defaultLayout: "Index"
      // 默认布局，对应 src/layout/Index.vue
    }),
    VueSetupExtend()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  css: {
    devSourcemap: true
  },
  server: {
    hmr: true,
    // ← ← ← ← ← ←
    host: "0.0.0.0",
    // ← 新增内容 ←
    port: 5174,
    proxy: {
      "^/api": {
        target: "http://122.51.67.196:12002/hanbao",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxXVFxcXFxEZXNrdG9wXFxcXEJ1cmdlcktpbmdcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXFdUXFxcXERlc2t0b3BcXFxcQnVyZ2VyS2luZ1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvV1QvRGVza3RvcC9CdXJnZXJLaW5nL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcclxuaW1wb3J0IHtWYW50UmVzb2x2ZXJ9IGZyb20gJ0B2YW50L2F1dG8taW1wb3J0LXJlc29sdmVyJztcclxuaW1wb3J0IHsgTmFpdmVVaVJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgUGFnZXMgZnJvbSAndml0ZS1wbHVnaW4tcGFnZXMnXHJcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xyXG5pbXBvcnQgVnVlU2V0dXBFeHRlbmQgZnJvbSAndml0ZS1wbHVnaW4tdnVlLXNldHVwLWV4dGVuZCdcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgYmFzZTogXCIvXCIsXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgIC9cXC5bdGpdc3g/JC8sIC8vIC50cywgLnRzeCwgLmpzLCAuanN4XHJcbiAgICAgICAgL1xcLnZ1ZSQvLFxyXG4gICAgICAgIC9cXC52dWVcXD92dWUvLCAvLyAudnVlXHJcbiAgICAgICAgL1xcLm1kJC8gLy8gLm1kXHJcbiAgICAgIF0sXHJcbiAgICAgIGltcG9ydHM6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInLCAncGluaWEnXSxcclxuICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCksTmFpdmVVaVJlc29sdmVyKCldLFxyXG4gICAgICBkdHM6ICd0eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICBmaWxlcGF0aDogJ3R5cGVzLy5lc2xpbnRyYy1hdXRvLWltcG9ydC5qc29uJyxcclxuICAgICAgICBnbG9iYWxzUHJvcFZhbHVlOiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH0pLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIGR0czogJ3R5cGVzL2NvbXBvbmVudHMuZC50cycsXHJcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXHJcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcclxuICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCksTmFpdmVVaVJlc29sdmVyKCldXHJcbiAgICB9KSxcclxuICAgIFBhZ2VzKHtcclxuICAgICAgZGlyczogJ3NyYy92aWV3cycsIC8vIFx1OTcwMFx1ODk4MVx1NzUxRlx1NjIxMFx1OERFRlx1NzUzMVx1NzY4NFx1NjU4N1x1NEVGNlx1NzZFRVx1NUY1NVxyXG4gICAgICBleGNsdWRlOiBbJyoqL2NvbXBvbmVudHMvKi52dWUnXSwgLy8gXHU2MzkyXHU5NjY0XHU1NzI4XHU1OTE2XHU3Njg0XHU3NkVFXHU1RjU1XHVGRjBDXHU1MzczXHU0RTBEXHU1QzA2XHU2MjQwXHU2NzA5IGNvbXBvbmVudHMgXHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0IC52dWUgXHU2NTg3XHU0RUY2XHU3NTFGXHU2MjEwXHU4REVGXHU3NTMxLFxyXG4gICAgICByb3V0ZUJsb2NrTGFuZzogJ2pzb24nLCAvLyBcdThERUZcdTc1MzFcdTU3NTdcdTc2ODRcdThCRURcdThBMDBcdUZGMEN5YW1sIFx1NjIxNiBqc29uXHJcbiAgICAgIGV4dGVuZFJvdXRlKHJvdXRlKSB7XHJcbiAgICAgICAgaWYgKHJvdXRlLnBhdGggPT09ICcvJykge1xyXG4gICAgICAgICAgcmV0dXJuIHsgLi4ucm91dGUsIHJlZGlyZWN0OiAnLzQwNCcgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaW1wb3J0TW9kZTogJ2FzeW5jJ1xyXG4gICAgfSksXHJcbiAgICBMYXlvdXRzKHtcclxuICAgICAgbGF5b3V0c0RpcnM6ICdzcmMvbGF5b3V0cycsIC8vIFx1NUUwM1x1NUM0MFx1NjU4N1x1NEVGNlx1NUI1OFx1NjUzRVx1NzZFRVx1NUY1NVxyXG4gICAgICBwYWdlc0RpcnM6ICdzcmMvdmlld3MnLCAvLyBcdTk4NzVcdTk3NjJcdTY1ODdcdTRFRjZcdTVCNThcdTY1M0VcdTc2RUVcdTVGNTVcclxuICAgICAgZGVmYXVsdExheW91dDogJ0luZGV4JyAvLyBcdTlFRDhcdThCQTRcdTVFMDNcdTVDNDBcdUZGMENcdTVCRjlcdTVFOTQgc3JjL2xheW91dC9JbmRleC52dWVcclxuICAgIH0pLFxyXG4gICAgVnVlU2V0dXBFeHRlbmQoKVxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgZGV2U291cmNlbWFwOiB0cnVlLFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBobXI6IHRydWUsXHRcdFx0Ly8gXHUyMTkwIFx1MjE5MCBcdTIxOTAgXHUyMTkwIFx1MjE5MCBcdTIxOTBcclxuICAgIGhvc3Q6ICcwLjAuMC4wJyxcdC8vIFx1MjE5MCBcdTY1QjBcdTU4OUVcdTUxODVcdTVCQjkgXHUyMTkwXHJcbiAgICBwb3J0OjUxNzQsXHJcbiAgICBwcm94eToge1xyXG4gICAgICAnXi9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzEyMi41MS42Ny4xOTY6MTIwMDIvaGFuYmFvJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNSLFNBQVEsb0JBQW1CO0FBQ2pULE9BQU8sU0FBUztBQUNoQixTQUFRLGVBQWM7QUFDdEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUSxvQkFBbUI7QUFDM0IsU0FBUyx1QkFBdUI7QUFDaEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sYUFBYTtBQUNwQixPQUFPLG9CQUFvQjtBQVQzQixJQUFNLG1DQUFtQztBQVl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxTQUFTO0FBQUEsUUFDUDtBQUFBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLFFBQ0E7QUFBQTtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFNBQVMsQ0FBQyxPQUFPLGNBQWMsT0FBTztBQUFBLE1BQ3RDLFdBQVcsQ0FBQyxhQUFhLEdBQUUsZ0JBQWdCLENBQUM7QUFBQSxNQUM1QyxLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUEsUUFDVCxVQUFVO0FBQUEsUUFDVixrQkFBa0I7QUFBQSxNQUNwQjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsS0FBSztBQUFBLE1BQ0wsWUFBWSxDQUFDLEtBQUs7QUFBQSxNQUNsQixNQUFNLENBQUMsZ0JBQWdCO0FBQUEsTUFDdkIsV0FBVyxDQUFDLGFBQWEsR0FBRSxnQkFBZ0IsQ0FBQztBQUFBLElBQzlDLENBQUM7QUFBQSxJQUNELE1BQU07QUFBQSxNQUNKLE1BQU07QUFBQTtBQUFBLE1BQ04sU0FBUyxDQUFDLHFCQUFxQjtBQUFBO0FBQUEsTUFDL0IsZ0JBQWdCO0FBQUE7QUFBQSxNQUNoQixZQUFZLE9BQU87QUFDakIsWUFBSSxNQUFNLFNBQVMsS0FBSztBQUN0QixpQkFBTyxFQUFFLEdBQUcsT0FBTyxVQUFVLE9BQU87QUFBQSxRQUN0QztBQUFBLE1BQ0Y7QUFBQSxNQUNBLFlBQVk7QUFBQSxJQUNkLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNOLGFBQWE7QUFBQTtBQUFBLE1BQ2IsV0FBVztBQUFBO0FBQUEsTUFDWCxlQUFlO0FBQUE7QUFBQSxJQUNqQixDQUFDO0FBQUEsSUFDRCxlQUFlO0FBQUEsRUFDakI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxjQUFjO0FBQUEsRUFDaEI7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLEtBQUs7QUFBQTtBQUFBLElBQ0wsTUFBTTtBQUFBO0FBQUEsSUFDTixNQUFLO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDTCxTQUFTO0FBQUEsUUFDUCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
