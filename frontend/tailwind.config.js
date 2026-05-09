/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep navy from the flyer
        navy: {
          50: '#e8eef9',
          100: '#c4d2ee',
          200: '#92aade',
          300: '#5b7fcc',
          400: '#2f5bbb',
          500: '#1e40af',
          600: '#173592',
          700: '#102871',
          800: '#0a1f5a',
          900: '#06163f',
          950: '#030b27',
        },
        // Gold/yellow from the flyer
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(135deg, #030b27 0%, #06163f 30%, #0a1f5a 65%, #173592 100%)',
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'sparkle':
          'radial-gradient(circle at 20% 30%, rgba(251,191,36,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(251,191,36,0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'gold': '0 10px 40px -10px rgba(251, 191, 36, 0.5)',
        'gold-lg': '0 20px 60px -15px rgba(251, 191, 36, 0.6)',
        'navy': '0 10px 40px -10px rgba(10, 31, 90, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'sparkle': 'sparkle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
