/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F5F1',
          100: '#DFE9E0',
          200: '#C5D8C7',
          300: '#A5C1A9',
          400: '#7FA286',
          500: '#66866D',
          600: '#526E59',
          700: '#405647',
          800: '#324337',
          900: '#28362D',
          950: '#172018'
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
          50: '#F7F8F9',
          100: '#EEF0F2',
          200: '#DDE1E5',
          300: '#C8CED4',
          400: '#98A1AA',
          500: '#6B757F',
          600: '#515B65',
          700: '#3C454E',
          800: '#292F35',
          900: '#1C2126',
          950: '#111417'
        },
        dark: {
          50: '#F5F7F8',
          100: '#E4E8EB',
          200: '#CCD3D9',
          300: '#B2BBC3',
          400: '#9DA6AE',
          500: '#737D86',
          600: '#4D565E',
          700: '#32393F',
          800: '#1C2126',
          900: '#14181C',
          950: '#0B0D0F'
        },
        paper: '#F4F6F8',
        clay: '#B8684F',
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#EEF0F2',
          brand: '#28362D'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans SC',
          'Segoe UI',
          'sans-serif'
        ],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 18px 48px rgba(20, 24, 28, 0.13)',
        'glass-sm': '0 8px 24px rgba(20, 24, 28, 0.09)',
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
