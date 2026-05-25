/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAFAF8',
        sage: {
          50: '#F0F4F0',
          100: '#E2EBE2',
          200: '#C4D5C5',
          500: '#3D5A40',
          600: '#2E4430',
          700: '#1F2E20',
        },
        charcoal: '#111311',
        stone: '#6B7280',
        pebble: '#E5E7EB',
        muted: '#6B7280',
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'system-ui', '-apple-system', 'sans-serif'],
        // Keep serif as fallback for quotes/italics
        serif: ['Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '0.65rem',
        xl: 'calc(0.65rem + 4px)',
        '2xl': 'calc(0.65rem + 8px)',
      },
      maxWidth: {
        container: '80rem',
      },
      height: {
        100: '25rem',
      },
      spacing: {
        35: '8.75rem',
        45: '11.25rem',
      },
    },
  },
  plugins: [],
}
