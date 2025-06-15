const rtl = require('tailwindcss-rtl');
const dir = require('tailwindcss-dir');

module.exports = {
  darkMode: "class",
  plugins: [
    rtl,
    dir,
  ],
  extend: {
    height: {
      screen: ['100vh', '100dvh'], // fallback for older browsers
    },
  },
};
