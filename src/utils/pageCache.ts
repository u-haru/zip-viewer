export const PAGE_CACHE_NAME = 'zip-viewer-pages';

export const clearPageCache = async () => {
  if (typeof caches === 'undefined') return;
  const cache = await caches.open(PAGE_CACHE_NAME);
  const keys = await cache.keys();
  await Promise.all(keys.map((k) => cache.delete(k)));
};

export const putPageBlob = async (key: string, blob: Blob) => {
  if (typeof caches === 'undefined') return;
  const cache = await caches.open(PAGE_CACHE_NAME);
  await cache.put(
    key,
    new Response(blob, {
      headers: { 'Content-Type': blob.type || 'application/octet-stream' },
    })
  );
};

export const getPageBlob = async (key: string) => {
  if (typeof caches === 'undefined') return undefined;
  const cache = await caches.open(PAGE_CACHE_NAME);
  const res = await cache.match(key);
  if (!res) return undefined;
  return res.blob();
};
