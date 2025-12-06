const HISTORY_KEY = 'picsum-history';

export function saveImageToHistory(imageId, width, height, format) {
  const history = getHistory();
  const timestamp = new Date().toISOString();

  const imageRecord = {
    id: Date.now(),
    type: 'placeholder',
    imageId,
    width,
    height,
    format,
    timestamp,
    filename: `placeholder-${width}x${height}.${format}`
  };

  history.unshift(imageRecord);
  history.splice(20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return imageRecord;
}

export function saveAiImageToHistory(url, prompt, model) {
  const history = getHistory();
  const timestamp = new Date().toISOString();

  const imageRecord = {
    id: Date.now(),
    type: 'ai',
    url,
    prompt,
    model,
    timestamp,
    filename: `ai-image-${Date.now()}.jpg`
  };

  history.unshift(imageRecord);
  history.splice(20);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return imageRecord;
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
}

export function deleteImage(id) {
  const history = getHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getHistoryImageUrl(imageId, width, height, format) {
  return `https://picsum.photos/${width}/${height}.${format}?image=${imageId}`;
}
