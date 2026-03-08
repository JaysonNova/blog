import { describe, it, expect } from 'vitest'
import { generateSlug } from '@/lib/utils/slug'

describe('generateSlug', () => {
  it('should convert title to slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('should handle multiple spaces', () => {
    expect(generateSlug('Hello   World')).toBe('hello-world')
  })

  it('should remove special characters', () => {
    expect(generateSlug('Hello@World!')).toBe('helloworld')
  })

  it('should handle empty string', () => {
    expect(generateSlug('')).toBe('')
  })

  it('should trim leading and trailing spaces', () => {
    expect(generateSlug('  Hello World  ')).toBe('hello-world')
  })
})
