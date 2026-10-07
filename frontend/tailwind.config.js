/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        // ── Themeable via CSS vars ─────────────────────────
        canvas:   'var(--canvas)',
        card:     'var(--card)',
        surface:  'var(--surface)',
        elevated: 'var(--elevated)',
        sidebar:  'var(--sidebar)',
        'input-bg': 'var(--input-bg)',
        ink: {
          DEFAULT:   'var(--ink)',
          secondary: 'var(--ink-sec)',
          muted:     'var(--ink-mut)',
        },
        border: 'var(--border)',

        // ── Fixed accent palette ───────────────────────────
        accent: { DEFAULT: '#2563EB', light: '#EFF6FF', muted: '#BFDBFE' },
        violet: { DEFAULT: '#7C3AED', light: '#F5F3FF', muted: '#DDD6FE' },
        rose:   { DEFAULT: '#EC4899', light: '#FDF2F8', muted: '#FBCFE8' },
        amber:  { DEFAULT: '#F59E0B', light: '#FFFBEB', muted: '#FDE68A' },
        success:{ DEFAULT: '#16A34A', light: '#F0FDF4', muted: '#BBF7D0' },
        warning:{ DEFAULT: '#F59E0B', light: '#FFFBEB', muted: '#FDE68A' },
        danger: { DEFAULT: '#EF4444', light: '#FEF2F2', muted: '#FECACA' },
      },
      borderRadius: { xl: '12px', '2xl': '16px', '3xl': '20px' },
      boxShadow: {
        card:      '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md': '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
        'card-lg': '0 8px 28px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.07)',
      },
      animation: {
        'fade-in':  'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float':    'float 6s ease-in-out infinite',
        'spin-slow':'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' },                                '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.96)' },      '100%': { opacity: '1', transform: 'scale(1)' } },
        float:   { '0%,100%': { transform: 'translateY(0px)' },            '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
