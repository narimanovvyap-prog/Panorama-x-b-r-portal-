/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#10151C',
        ink2: '#1B222C',
        bg: '#FAFAF7',
        panel: '#F1F0EA',
        blue: '#1D4E89',
        blueDeep: '#123457',
        crimson: '#B23A2E',
        line: '#DEDBD1',
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
