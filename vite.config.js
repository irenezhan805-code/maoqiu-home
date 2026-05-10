import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const base = "/maoqiu-home/";
const withBase = (path) => {
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\/+/, "")}`;
};

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/apple-touch-icon.png",
      ],
      manifest: {
        name: "毛球在家",
        short_name: "小井在家",
        description: "毛球在家 - 小井专属体验版",
        start_url: base,
        scope: base,
        display: "standalone",
        orientation: "portrait",
        theme_color: "#DDEED5",
        background_color: "#DDEED5",
        lang: "zh-CN",
        icons: [
          {
            src: withBase("icons/icon-192.png"),
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: withBase("icons/icon-512.png"),
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: withBase("icons/apple-touch-icon.png"),
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,webm,mp4,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /\/.*\.(?:png|jpg|jpeg|webp|gif|svg|webm|mp4)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "maoqiu-home-media",
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});