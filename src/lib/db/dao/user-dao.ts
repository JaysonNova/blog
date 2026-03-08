import { prisma } from '../prisma'
import type { CreateUserInput, UpdateUserInput } from '@/types/user'

export class UserDAO {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  async create(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    })
  }
}

export const userDAO = new UserDAO()
