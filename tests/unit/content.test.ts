import { describe, expect, it } from 'vitest'
import { createExcerpt } from '@/lib/utils/content'

describe('createExcerpt', () => {
  it('strips markdown syntax into plain text', () => {
    const markdown = `# Title

This is **content** with [a link](https://example.com) and \`code\`.
`

    expect(createExcerpt(markdown, 200)).toBe(
      'Title This is content with a link and code.'
    )
  })

  it('truncates long content safely', () => {
    const longMarkdown = 'a'.repeat(200)

    expect(createExcerpt(longMarkdown, 20)).toBe('aaaaaaaaaaaaaaaaaaaa...')
  })
})
