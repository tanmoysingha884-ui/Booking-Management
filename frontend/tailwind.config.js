/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#F2FBF6',
          100: '#E1F7EA',
          200: '#B8EFD0',
          300: '#82E2B0',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#062916',
        },
        ocean: {
          50: '#F0F8FF',
          100: '#E0F0FE',
          200: '#BAE0FD',
          300: '#7CC4FA',
          400: '#38A4F6',
          500: '#0E83DC',
          600: '#0365B7',
          700: '#055193',
          800: '#094578',
          900: '#0C2B42',
          950: '#071A2A',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#E8DDCF',
          300: '#DAC6B3',
          400: '#CAAC93',
          500: '#BD9477',
          600: '#A97C5F',
        },
        deep: {
          900: '#0A0F18',
          800: '#111927',
          700: '#1E293B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(12, 43, 66, 0.15)',
        'luxury-gold': '0 10px 25px -5px rgba(74, 222, 128, 0.35)',
      }
    },
  },
  plugins: [],
}
