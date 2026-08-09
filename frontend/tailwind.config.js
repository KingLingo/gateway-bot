/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF5F0',
          100: '#DDEBE2',
          200: '#BBD7C4',
          300: '#94C2A5',
          400: '#79B891',
          500: '#69B086',
          600: '#438B65',
          700: '#1F6B4A',
          800: '#1B563E',
          900: '#174534',
          950: '#0C281E'
        },
        accent: {
          50: '#F8F7F2',
          100: '#F0EEE7',
          200: '#E2DFD5',
          300: '#C7C5BB',
          400: '#9B9D95',
          500: '#70736B',
          600: '#575B54',
          700: '#42463F',
          800: '#30342F',
          900: '#242521',
          950: '#171815'
        },
        gray: {
          50: '#F8F7F2',
          100: '#F0EEE7',
          200: '#D8D5CC',
          300: '#C1BEB5',
          400: '#969990',
          500: '#70736B',
          600: '#575B54',
          700: '#42463F',
          800: '#30342F',
          900: '#242521',
          950: '#171815'
        },
        dark: {
          50: '#F2F0EA',
          100: '#E4E3DD',
          200: '#C9CEC8',
          300: '#B2BCB5',
          400: '#94A198',
          500: '#77847C',
          600: '#4A5850',
          700: '#303C35',
          800: '#171F1B',
          900: '#131A17',
          950: '#0F1512'
        },
        paper: '#F5F3ED',
        clay: '#C76D4E',
        surface: {
          DEFAULT: '#FCFBF7',
          muted: '#F0EEE7',
          brand: '#26352D'
        }
      },
      fontFamily: {
        sans: [
          'Geist Variable',
          'Noto Sans SC',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['Geist Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 18px 48px rgba(15, 21, 18, 0.14)',
        'glass-sm': '0 8px 24px rgba(15, 21, 18, 0.10)',
        glow: '0 0 0 1px rgba(105, 176, 134, 0.22)',
        'glow-lg': '0 0 0 1px rgba(105, 176, 134, 0.28)',
        card: '0 1px 2px rgba(15, 21, 18, 0.04)',
        'card-hover': '0 8px 24px rgba(15, 21, 18, 0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #69B086 0%, #1F6B4A 100%)',
        'gradient-dark': 'linear-gradient(135deg, #171F1B 0%, #0F1512 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(242,240,234,0.08) 0%, rgba(242,240,234,0.03) 100%)',
        'mesh-gradient':
          'linear-gradient(135deg, rgba(105,176,134,0.045), transparent 42%), radial-gradient(circle at 82% 8%, rgba(199,109,78,0.035), transparent 28%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { opacity: '0.85' },
          '100%': { opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
