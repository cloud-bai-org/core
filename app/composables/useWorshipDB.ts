import type { WorshipMode } from '~/stores/worship'

const DB_NAME = 'cloud-bai-worship'
const DB_VERSION = 1
const STORE_NAME = 'progress'
const PROGRESS_KEY = 'activeWorship'

export interface WorshipProgress {
  mode: WorshipMode
  currentStepIndex: number
  selectedDeityId: string | null
  ancestorName: string
  ancestorLocation: string
  prayerContent: string
  timestamp: number
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export function useWorshipDB() {
  async function saveProgress(progress: WorshipProgress): Promise<void> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).put(progress, PROGRESS_KEY)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    }
    catch {
      // IndexedDB 不可用時靜默失敗
    }
  }

  async function getProgress(): Promise<WorshipProgress | null> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly')
        const request = tx.objectStore(STORE_NAME).get(PROGRESS_KEY)
        request.onsuccess = () => resolve(request.result ?? null)
        request.onerror = () => reject(request.error)
      })
    }
    catch {
      return null
    }
  }

  async function clearProgress(): Promise<void> {
    try {
      const db = await openDB()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite')
        tx.objectStore(STORE_NAME).delete(PROGRESS_KEY)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    }
    catch {
      // IndexedDB 不可用時靜默失敗
    }
  }

  return { saveProgress, getProgress, clearProgress }
}
