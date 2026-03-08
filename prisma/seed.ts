import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Tech articles and tutorials',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Life, travel, and personal stories',
      },
    }),
  ])

  console.log('✅ Created categories:', categories.length)

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
  ])

  console.log('✅ Created tags:', tags.length)

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      excerpt: 'Learn how to build modern web applications with Next.js',
      content: `# Getting Started with Next.js

Next.js is a powerful React framework that makes building web applications a breeze.

## Why Next.js?

- Server-side rendering
- Static site generation
- API routes
- File-based routing

Let's dive in!`,
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: categories[0].id,
      tags: {
        connect: [{ id: tags[0].id }, { id: tags[1].id }],
      },
    },
  })

  console.log('✅ Created sample post:', post1.title)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
