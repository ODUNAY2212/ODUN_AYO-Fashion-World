tailwind.config = {
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0A0A0A',
          charcoal: '#121212',
          gold: '#D4AF37',
          goldLight: '#F3E5AB',
          goldDark: '#AA7C11',
          goldMuted: '#B89B48',
          gray: '#8E8E93',
          lightGray: '#F2F2F7',
          border: '#2A2A2A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.15)',
        'gold-glow-strong': '0 0 25px rgba(212, 175, 55, 0.35)',
      },
      spacing: {
        '128': '32rem',
      }
    }
  }
}
