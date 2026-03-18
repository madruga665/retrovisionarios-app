/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './components/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#ff8c00',
        'background-light': '#121212',
        'background-dark': '#000000',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '0.5rem', lg: '0.5rem', xl: '0.75rem', full: '9999px' },
    },
  },
  plugins: [],
};
