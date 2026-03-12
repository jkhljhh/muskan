/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: '#e8436a',
        blush: '#f7c5d0',
        deep: '#1a0a10',
        gold: '#d4a853',
        cream: '#fff8f0',
        wine: '#6b1a2e',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        playfair: ['Playfair Display', 'serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}
