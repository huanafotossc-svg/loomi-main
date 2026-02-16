/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Loomi Editorial Organic Palette
        linen: '#F6F3EE',
        porcelain: '#FAFAF9',
        ink: '#1C1C1C',
        stone: '#3D3D3D',
        forest: '#2C4A3E',
        terracotta: '#C0705B',
        coral: '#FF5A5F',
        sunshine: '#FBBF24',
        // Semantic colors
        permuta: '#22C55E',
        cache: '#3B82F6',
        hibrido: '#A855F7',
        // Supporting colors
        'warm-gray': {
          50: '#F6F3EE',
          100: '#F0EDE7',
          200: '#E4E0D9',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
        },
        'soft-coral': {
          50: '#FFF5F5',
          100: '#FFE8E8',
          200: '#FFD1D1',
          300: '#FFA8A8',
          400: '#FF7A7A',
          500: '#FF5A5F',
          600: '#E53E3E',
        },
        'lime-accent': {
          300: '#D9F99D',
          400: '#BEF264',
          500: '#A3E635',
        }
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 20px -4px rgba(0, 0, 0, 0.07)',
        'floating': '0 8px 30px -6px rgba(0, 0, 0, 0.10)',
        'glow': '0 0 20px rgba(44, 74, 62, 0.15)',
        'inner-subtle': 'inset 0 1px 3px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-soft': 'bounceSoft 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'editorial-reveal': 'editorialReveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ken-burns': 'kenBurns 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        editorialReveal: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
      },
    },
  },
  plugins: [],
}
