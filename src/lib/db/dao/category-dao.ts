import { prisma } from '../prisma'

export class CategoryDAO {
  async findAll() {
    return prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    })
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    })
  }

  async create(data: { name: string; slug: string; description?: string }) {
    return prisma.category.create({
      data,
    })
  }

  async update(id: string, data: { name?: string; slug?: string; description?: string }) {
    return prisma.category.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    })
  }
}

export const categoryDAO = new CategoryDAO()
