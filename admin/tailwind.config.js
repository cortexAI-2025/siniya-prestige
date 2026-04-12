/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#022C22',
          50: '#f0fdf6',
          100: '#dcfce9',
          light: '#034a3a',
          dark: '#011a15',
          muted: '#1a4a3a',
        },
        gold: {
          DEFAULT: '#B45309',
          light: '#D97706',
          dark: '#92400E',
          shimmer: '#F59E0B',
          pale: '#FEF3C7',
        },
        silk: '#FDFaf6',
        'card-bg': '#FFFEF9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(2,44,34,0.08), 0 4px 16px rgba(2,44,34,0.06)',
        'card-hover': '0 4px 24px rgba(2,44,34,0.14)',
        gold: '0 4px 14px rgba(180,83,9,0.25)',
      },
      backgroundImage: {
        'emerald-gradient': 'linear-gradient(135deg, #011a15 0%, #022C22 50%, #034a3a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #D97706 100%)',
        'silk-gradient': 'linear-gradient(180deg, #FDFaf6 0%, #F5EED6 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-16px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        pulseGold: { '0%, 100%': { boxShadow: '0 0 0 0 rgba(180,83,9,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(180,83,9,0)' } },
      },
    },
  },
  plugins: [],
};
