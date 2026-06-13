export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fadeEffect: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
         tooltipIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-4px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        marquee: "marquee 12s linear infinite",
        fade: "fadeEffect 0.3s ease-in-out",
        tooltipIn: "tooltipIn 0.3s ease-in-out",
      },
    },
  },

  plugins: [require("tailwind-scrollbar-hide")],
};