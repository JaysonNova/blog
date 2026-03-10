import 'server-only'

import { R2StorageAdapter } from '@/lib/server/storage/r2-adapter'
import type { StorageAdapter } from '@/lib/server/storage/types'

let storageAdapter: StorageAdapter | null = null

export function getStorageAdapter() {
  if (!storageAdapter) {
    storageAdapter = new R2StorageAdapter()
  }

  return storageAdapter
}
