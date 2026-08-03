/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
        heading: ['"Baloo 2"', 'sans-serif'],
        body: ['"Nunito"', 'sans-serif'],
        pro: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#4B9EFF', // Titkul brand primary
          hover: '#3A82DF',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#818CF8',
        },
        accent: {
          DEFAULT: '#F472B6',
        },
        student: {
          primary: '#4B9EFF',
          accent: '#818CF8',
          success: '#58CC02',
          warning: '#FFC800',
          error: '#FF8A8A',
          bg: '#F0F7FF',
          surface: '#FFFFFF',
          fg: '#1E293B',
          border: '#DCEBFF',
        },
        pro: {
          primary: '#4B9EFF',
          accent: '#818CF8',
          success: '#16A34A',
          warning: '#D97706',
          destructive: '#DC2626',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          fg: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      borderRadius: {
        'clay-sm': '14px',
        'clay-md': '24px',
        'clay-lg': '28px',
      },
      boxShadow: {
        'clay-sm': '0 2px 0 rgba(75,158,255,0.15), 0 4px 8px rgba(75,158,255,0.10)',
        'clay-md': '0 4px 0 rgba(75,158,255,0.15), 0 8px 16px rgba(75,158,255,0.12)',
        'clay-lg': '0 6px 0 rgba(129,140,248,0.18), 0 12px 24px rgba(129,140,248,0.15)',
      },
    },
  },
  plugins: [],
}
