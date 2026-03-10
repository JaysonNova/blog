import { PrismaClient } from '@prisma/client'
import { loadEnvConfig } from '@next/env'
import { hash } from 'bcryptjs'

loadEnvConfig(process.cwd())

const prisma = new PrismaClient()

interface ParsedArgs {
  email: string
  password: string
  name?: string
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = new Map<string, string>()

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) {
      continue
    }

    const key = arg.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }

    args.set(key, value)
    index += 1
  }

  const email = args.get('email')?.trim()
  const password = args.get('password')?.trim()
  const name = args.get('name')?.trim()

  if (!email) {
    throw new Error('Missing required argument: --email')
  }

  if (!password) {
    throw new Error('Missing required argument: --password')
  }

  return {
    email,
    password,
    ...(name ? { name } : {}),
  }
}

async function main() {
  const { email, password, name } = parseArgs(process.argv.slice(2))
  const passwordHash = await hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: passwordHash,
      role: 'ADMIN',
      ...(name ? { name } : {}),
    },
    create: {
      email,
      password: passwordHash,
      role: 'ADMIN',
      name: name || 'Admin',
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  console.log(
    JSON.stringify(
      {
        updated: true,
        user,
      },
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
