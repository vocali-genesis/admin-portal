import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-blue": "#1C364B",
      },
      flex: {
        "2": "2 2 0%",
      },
      screens: {
        custom: { max: "750px" },
      },
      fontFamily: {
<<<<<<< HEAD
        montserrat: ['Montserrat', 'sans-serif'],
=======
        montserrat: ["Montserrat", "sans-serif"],
>>>>>>> 6ca6a36 (Updated editor)
      },
    },
  },
  plugins: [],
};

export default config;
