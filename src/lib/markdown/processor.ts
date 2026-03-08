import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

/**
 * 将 Markdown 转换为 HTML
 * @param markdown - Markdown 字符串
 * @returns HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['anchor'],
      },
    })
    .use(rehypePrettyCode, {
      theme: {
        dark: 'github-dark',
        light: 'github-light',
      },
      keepBackground: false,
    })
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}

/**
 * 从 Markdown 中提取标题（用于目录）
 * @param markdown - Markdown 字符串
 * @returns 标题数组
 */
export function extractHeadings(markdown: string): Array<{
  level: number
  text: string
  id: string
}> {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: Array<{ level: number; text: string; id: string }> = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')

    headings.push({ level, text, id })
  }

  return headings
}
