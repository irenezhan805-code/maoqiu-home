/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Baloo 2",
          "Comic Sans MS",
          "Comic Sans",
          "Marker Felt",
          "Hannotate SC",
          "HanziPen SC",
          "Kaiti SC",
          "STKaiti",
          "FZYaoti",
          "Nunito",
          "ui-rounded",
          "Yuanti SC",
          "Hiragino Sans GB",
          "PingFang SC",
          "Microsoft YaHei",
          "Noto Sans SC",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 20px 70px rgba(24, 59, 35, 0.12)",
        lift: "0 14px 36px rgba(36, 85, 43, 0.18)",
      },
    },
  },
  plugins: [],
};