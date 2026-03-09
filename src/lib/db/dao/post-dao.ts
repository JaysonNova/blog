import { prisma } from '../prisma'
import type { CreatePostInput, UpdatePostInput } from '@/types/post'

export class PostDAO {
  async findById(id: string) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }

  async findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })
  }

  async findMany(params: {
    page?: number
    limit?: number
    published?: boolean
    categoryId?: string
    tagId?: string
    authorId?: string
  }) {
    const { page = 1, limit = 20, published, categoryId, tagId, authorId } = params

    const where = {
      ...(published !== undefined && { published }),
      ...(categoryId && { categoryId }),
      ...(authorId && { authorId }),
      ...(tagId && {
        tags: {
          some: {
            id: tagId,
          },
        },
      }),
    }

    const [items, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(data: CreatePostInput & { authorId: string; slug: string }) {
    const { tagIds, ...postData } = data

    return prisma.post.create({
      data: {
        ...postData,
        ...(tagIds && {
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async update(id: string, data: UpdatePostInput) {
    const { tagIds, ...postData } = data

    return prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(tagIds && {
          tags: {
            set: tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    })
  }

  async delete(id: string) {
    return prisma.post.delete({
      where: { id },
    })
  }

  async incrementViewCount(id: string) {
    return prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }

  async incrementLikeCount(id: string) {
    return prisma.post.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })
  }
}

export const postDAO = new PostDAO()
