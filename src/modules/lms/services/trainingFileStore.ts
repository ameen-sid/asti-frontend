/**
 * trainingFileStore.ts
 * --------------------
 * Stores training file blobs (PPT, video) in IndexedDB so they don't
 * hit the ~5 MB localStorage quota.
 *
 * Usage:
 *   await trainingFileStore.save('tf-123', blob);
 *   const blob = await trainingFileStore.get('tf-123');
 *   const url  = URL.createObjectURL(blob);   // use as <video src> etc.
 *   await trainingFileStore.remove('tf-123');
 */

const DB_NAME = 'asti_training_files';
const STORE_NAME = 'blobs';
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME); // keyed by file id string
      }
    };

    req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
    req.onerror  = (e) => reject((e.target as IDBOpenDBRequest).error);
  });
}

export const trainingFileStore = {
  /** Persist a Blob under the given id */
  async save(id: string, blob: Blob): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(blob, id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  },

  /** Retrieve a Blob by id, or null if not found */
  async get(id: string): Promise<Blob | null> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => resolve((req.result as Blob) ?? null);
      req.onerror   = () => reject(req.error);
    });
  },

  /** Delete a blob by id */
  async remove(id: string): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror   = () => reject(req.error);
    });
  },

  /** Remove all blobs whose ids are NOT in the provided set */
  async pruneOrphans(activeIds: string[]): Promise<void> {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const keysReq = store.getAllKeys();
      keysReq.onsuccess = () => {
        const keys = keysReq.result as string[];
        const toDelete = keys.filter((k) => !activeIds.includes(k));
        toDelete.forEach((k) => store.delete(k));
        resolve();
      };
      keysReq.onerror = () => reject(keysReq.error);
    });
  },
};
