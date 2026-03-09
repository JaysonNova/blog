import localFont from 'next/font/local'

export const sansFont = localFont({
  src: [
    {
      path: './fonts/Verdana-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Verdana-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
  display: 'swap',
  fallback: [
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    'WenQuanYi Micro Hei',
    'sans-serif',
  ],
})

export const monoFont = localFont({
  src: [
    {
      path: './fonts/AndaleMono.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['SF Mono', 'Menlo', 'Consolas', 'monospace'],
})
