/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Siniya Prestige Design System
        silk: '#FDFaf6',
        emerald: {
          DEFAULT: '#022C22',
          light: '#034a3a',
          dark: '#011a15',
          50: '#f0fdf6',
          100: '#dcfce9',
          600: '#034a3a',
          700: '#022C22',
          800: '#011a15',
          900: '#010e0c',
        },
        gold: {
          DEFAULT: '#B45309',
          light: '#D97706',
          dark: '#92400E',
          50: '#fffbeb',
          100: '#fef3c7',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        },
        cream: '#FDFaf6',
        'card-bg': '#FFFEF9',
      },
      fontFamily: {
        cinzel: ['Cinzel-Regular'],
        'cinzel-bold': ['Cinzel-Bold'],
        'cinzel-semibold': ['Cinzel-SemiBold'],
        montserrat: ['Montserrat-Regular'],
        'montserrat-bold': ['Montserrat-Bold'],
        'montserrat-semibold': ['Montserrat-SemiBold'],
        'montserrat-medium': ['Montserrat-Medium'],
        'montserrat-light': ['Montserrat-Light'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(2, 44, 34, 0.08)',
        'card-hover': '0 8px 30px rgba(2, 44, 34, 0.15)',
        'gold': '0 2px 10px rgba(180, 83, 9, 0.3)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
