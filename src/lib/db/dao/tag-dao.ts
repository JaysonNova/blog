import { prisma } from '../prisma'

export class TagDAO {
  async findAll() {
    return prisma.tag.findMany({
      orderBy: {
        name: 'asc',
      },
    })
  }

  async findById(id: string) {
    return prisma.tag.findUnique({
      where: { id },
    })
  }

  async findBySlug(slug: string) {
    return prisma.tag.findUnique({
      where: { slug },
    })
  }

  async create(data: { name: string; slug: string }) {
    return prisma.tag.create({
      data,
    })
  }

  async delete(id: string) {
    return prisma.tag.delete({
      where: { id },
    })
  }
}

export const tagDAO = new TagDAO()
