const PICSUM_BASE_URL = 'https://picsum.photos'; 
import { saveImageToHistory } from './historyService.mjs'

export function buildPicsumUrl(width, height, format = 'jpg') {
  const w = Number(width);
  const h = Number(height);
  if (!w || !h) throw new Error('Width and height are required');

  const imageId = Math.floor(Math.random() * 1000);
  const cacheBuster = Date.now();
  const url = `${PICSUM_BASE_URL}/${w}/${h}.${format}?image=${imageId}&random=${cacheBuster}`;
  
  saveImageToHistory(imageId, w, h, format);
  
  return url;
}

export async function downloadImage(url, fileName = 'image.jpg') {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to download image');

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}