const DB_NAME = "HighlightDB";
const STORE_NAME = "highlights";

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveHighlight = async (text: string, color: string) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  store.add({ text, color, timestamp: Date.now() });
};

export const removeHighlight = async (text: string) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const highlights = await getHighlights();
  const itemToDelete = highlights.find((h) => h.text === text);
  if (itemToDelete) {
    store.delete(itemToDelete.id);
  }
};
export const getHighlights = async (): Promise<
  { id: number; text: string; color: string }[]
> => {
  return new Promise(async (resolve) => {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve([]);
  });
};
