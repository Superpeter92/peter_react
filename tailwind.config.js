/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        yellow: "#ffd52d",
        purplue: "#6b9bff",
        darkPurplue: "#bd34fe",
        grey: "#d9d8d4"
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
