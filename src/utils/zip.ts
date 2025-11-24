import { set as idbSet } from 'idb-keyval';
import JSZip from 'jszip';
import type { PageEntry, TocItem } from '../types';
import { clearPageCache, putPageBlob } from './pageCache';

const imageExtensions = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.bmp',
];

const isImage = (name: string) =>
  imageExtensions.some((ext) => name.toLowerCase().endsWith(ext));

const naturalCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export type LoadedZip = {
  pages: PageEntry[];
  toc: TocItem[];
};

type CacheManifest = {
  fileKey: string;
  pages: { name: string; cacheKey?: string }[];
  toc: TocItem[];
};

const buildFileKey = (file: File) =>
  `${file.name}-${file.size}-${file.lastModified}`;

export async function loadZipFile(file: File): Promise<LoadedZip> {
  const fileKey = buildFileKey(file);
  const cacheSupported = typeof caches !== 'undefined';
  if (cacheSupported) {
    await clearPageCache();
  }

  const zip = await JSZip.loadAsync(file);
  const cachePrefix = `__zip-cache/${fileKey}/`;

  const imageEntries = Object.values(zip.files)
    .filter((entry) => !entry.dir && isImage(entry.name))
    .sort((a, b) => naturalCompare(a.name, b.name));

  const pages: PageEntry[] = [];
  // sequential to avoid memory spikes
  for (const entry of imageEntries) {
    const blob = await entry.async('blob');
    const url = URL.createObjectURL(blob);
    const cacheKey = cacheSupported ? `${cachePrefix}${entry.name}` : undefined;
    if (cacheKey) {
      await putPageBlob(cacheKey, blob);
    }
    const dataUrl = cacheSupported ? undefined : await blobToDataUrl(blob);
    pages.push({ name: entry.name, url, cacheKey, dataUrl });
  }

  const tocEntry = zip.file(/toc\.json$/i)?.[0];
  let toc: TocItem[] = [];
  if (tocEntry) {
    try {
      const json = await tocEntry.async('text');
      const parsed = JSON.parse(json) as TocItem[];
      toc = parsed.map((item) => ({
        title: item.title,
        page: Math.min(Math.max(item.page, 0), pages.length - 1),
      }));
    } catch (err) {
      console.warn('Failed to parse toc.json', err);
    }
  } else {
    toc = pages.map((p, idx) => ({
      title: p.name.split('/').pop() ?? `Page ${idx + 1}`,
      page: idx,
    }));
  }

  if (cacheSupported) {
    const manifest: CacheManifest = {
      fileKey,
      pages: pages.map((p) => ({ name: p.name, cacheKey: p.cacheKey })),
      toc,
    };
    await idbSet('zip-cache-manifest', manifest);
  }

  return { pages, toc };
}
