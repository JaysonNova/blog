import { prisma } from '../prisma'
import type { CreateVideoInput, UpdateVideoInput } from '@/types/video'

export class VideoDAO {
  async findById(id: string) {
    return prisma.video.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
  }

  async findMany(params: {
    page?: number
    limit?: number
    published?: boolean
    authorId?: string
  }) {
    const { page = 1, limit = 20, published, authorId } = params

    const where = {
      ...(published !== undefined && { published }),
      ...(authorId && { authorId }),
    }

    const [items, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.video.count({ where }),
    ])

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async create(data: CreateVideoInput & { authorId: string }) {
    return prisma.video.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
  }

  async update(id: string, data: UpdateVideoInput) {
    return prisma.video.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
  }

  async delete(id: string) {
    return prisma.video.delete({
      where: { id },
    })
  }

  async incrementViewCount(id: string) {
    return prisma.video.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
  }

  async incrementLikeCount(id: string) {
    return prisma.video.update({
      where: { id },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })
  }
}

export const videoDAO = new VideoDAO()
