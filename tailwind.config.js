/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Cormorant Garamond', 'serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        ui: ['Inter', 'sans-serif'],
      },
      colors: {
        obsidian: {
          50: '#f8f7f6',
          100: '#ebe9e6',
          200: '#d6d2cc',
          300: '#bdb5ac',
          400: '#9a8f83',
          500: '#7d7062',
          600: '#66594d',
          700: '#544940',
          800: '#473e36',
          900: '#3d352f',
          950: '#211a16',
        },
        gold: {
          50: '#fdfbf5',
          100: '#faf5e3',
          200: '#f5e9c1',
          300: '#edd992',
          400: '#e4c460',
          500: '#d4a83a',
          600: '#c18d28',
          700: '#9d6e22',
          800: '#7f5822',
          900: '#684920',
          950: '#38250f',
        },
        champagne: {
          50: '#fdfbf7',
          100: '#faf6ed',
          200: '#f4ebd9',
          300: '#eadab2',
          400: '#dfc685',
          500: '#d2ad5c',
          600: '#be9144',
          700: '#9a7136',
          800: '#7e5c31',
          900: '#664c2d',
          950: '#362714',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'slide-down': 'slideDown 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 58, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 168, 58, 0.6)' },
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '4xl': '72px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-hover': '0 16px 48px 0 rgba(31, 38, 135, 0.25)',
        'gold-glow': '0 0 30px rgba(212, 168, 58, 0.4)',
        'gold-glow-lg': '0 0 60px rgba(212, 168, 58, 0.5)',
        'inner-glass': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4a83a 0%, #f5e9c1 50%, #d4a83a 100%)',
        'obsidian-gradient': 'linear-gradient(135deg, #211a16 0%, #3d352f 50%, #211a16 100%)',
        'champagne-gradient': 'linear-gradient(135deg, #fdfbf7 0%, #eadab2 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
      },
    },
  },
  plugins: [],
}