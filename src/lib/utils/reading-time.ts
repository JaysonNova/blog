import readingTime from 'reading-time'

/**
 * 计算文章阅读时间
 * @param content - 文章内容（Markdown 或纯文本）
 * @returns 阅读时间（分钟）
 */
export function getReadingTime(content: string): number {
  const stats = readingTime(content, {
    wordsPerMinute: 200, // 中文约 200 字/分钟，英文约 200 词/分钟
  })
  return Math.ceil(stats.minutes)
}

/**
 * 格式化阅读时间为友好的字符串
 * @param minutes - 阅读时间（分钟）
 * @returns 格式化的字符串，如 "5 分钟阅读"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '少于 1 分钟'
  }
  return `${minutes} 分钟阅读`
}
