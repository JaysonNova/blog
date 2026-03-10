import { PrismaClient } from '@prisma/client'
import { loadEnvConfig } from '@next/env'

loadEnvConfig(process.cwd())

const prisma = new PrismaClient()

async function main() {
  const admins = await prisma.user.findMany({
    where: {
      role: 'ADMIN',
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      password: true,
    },
  })

  console.log(
    JSON.stringify(
      admins.map((admin) => ({
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        createdAt: admin.createdAt.toISOString(),
        updatedAt: admin.updatedAt.toISOString(),
        hasPassword: Boolean(admin.password),
      })),
      null,
      2
    )
  )
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
