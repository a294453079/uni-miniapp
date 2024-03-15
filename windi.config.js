import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#386ee8',
        primaryLight: '#5a8df0',
        primaryDark: '#1a4db7',
        secondary: '#f5f5f5',
        secondaryLight: '#f8f8f8',
        secondaryDark: '#c2c2c2'
      },
      fontSize: {
        base: '28rpx',
        lg: '30rpx',
        xl: '32rpx',
        '2xl': '36rpx',
        sm: '26rpx',
        xs: '24rpx',
        '2xs': '22rpx'
      },
      lineHeight: {
        base: '42rpx',
        lg: '46rpx',
        xl: '48rpx',
        '2xl': '56rpx',
        sm: '36rpx',
        xs: '32rpx',
        '2xs': '28rpx'
      },
      textColor: {
        primary: '#386ee8',
        first: '#333333',
        second: '#666666',
        third: '#999999',
        fourth: '#cccccc'
      },
      spacing: {
        base: '30rpx',
        sm: '20rpx',
        bs: 'var(--safe-area-inset-bottom)',
        ts: 'var(--safe-area-inset-top)',
        ls: 'var(--safe-area-inset-left)',
        rs: 'var(--safe-area-inset-right)',
        sb: 'var(--status-bar-height)'
      }
    }
  },
  purge: ['./src/**/*.{vue}'],
  darkMode: false,
  plugins: [require('windicss/plugin/line-clamp')],
  corePlugins: {
    preflight: false,
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
    divideOpacity: false
  }
})
