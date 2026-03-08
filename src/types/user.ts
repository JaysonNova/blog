export interface User {
  id: string
  email: string
  name: string | null
  avatar: string | null
  role: 'USER' | 'ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInput {
  email: string
  name?: string
  password: string
  role?: 'USER' | 'ADMIN'
}

export interface UpdateUserInput {
  name?: string
  avatar?: string
  password?: string
}
