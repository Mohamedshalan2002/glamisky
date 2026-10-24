/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: '#1A1022',
        paper: '#FAF6F9',
        blush: '#F3DDE8',
        lilac: '#E4DAF5',
        magenta: { DEFAULT: '#C8196E', dark: '#A8125A' },
        mute: '#6B5C73',
        line: '#E6D9E2',
      },
      borderRadius: { arch: '999px 999px 0 0' },
      maxWidth: { page: '80rem' },
    },
  },
  plugins: [],
};
