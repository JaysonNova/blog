import { prisma } from '../prisma'
import type { CreateCommentInput } from '@/types/comment'

export class CommentDAO {
  async findById(id: string) {
    return prisma.comment.findUnique({
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

  async findByPostId(postId: string) {
    return prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only root comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
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
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async create(data: CreateCommentInput & { authorId: string }) {
    return prisma.comment.create({
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
    return prisma.comment.delete({
      where: { id },
    })
  }

  async countByPostId(postId: string) {
    return prisma.comment.count({
      where: { postId },
    })
  }
}

export const commentDAO = new CommentDAO()
