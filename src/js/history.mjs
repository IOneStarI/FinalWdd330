import {
  getHistory,
  deleteImage,
  clearHistory,
  getHistoryImageUrl
} from './historyService.mjs';

const historyTableBody = document.querySelector('#history-table tbody');
const clearBtn = document.getElementById('clear-history');

async function downloadHistoryImage(url, filename) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    alert('Download failed');
  }
}

function renderHistory() {
  const history = getHistory();

  if (history.length === 0) {
    historyTableBody.innerHTML =
      '<tr><td colspan="6" style="text-align: center; padding: 2rem;">No images generated yet</td></tr>';
    return;
  }

  historyTableBody.innerHTML = history
    .map(item => {
      let previewUrl;
      let size = '-';
      let format = '-';
      let typeLabel;

      if (item.type === 'placeholder') {
        previewUrl = getHistoryImageUrl(
          item.imageId,
          item.width,
          item.height,
          item.format
        );
        size = `${item.width}×${item.height}`;
        format = item.format.toUpperCase();
        typeLabel = 'Placeholder';
      } else {
        previewUrl = item.url;
        typeLabel = `AI (${item.model || 'unknown'})`;
      }

      const filename = item.filename || 'image.jpg';

      return `
        <tr>
          <td>${new Date(item.timestamp).toLocaleString()}</td>
          <td>${typeLabel}</td>
          <td><img src="${previewUrl}" alt="Preview" width="80" height="60" style="object-fit: cover; border-radius: 4px;"></td>
          <td>${size}</td>
          <td>${format}</td>
          <td>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="secondary-btn" onclick="window.previewImage('${previewUrl}')">Preview</button>
              <button class="primary-btn" onclick="window.downloadHistoryImage('${previewUrl}', '${filename}')">Download</button>
              <button class="secondary-btn" style="background: #ff4444; color: white;" onclick="window.deleteHistoryImage(${item.id})">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

window.previewImage = url => window.open(url, '_blank');
window.downloadHistoryImage = (url, filename) =>
  downloadHistoryImage(url, filename);
window.deleteHistoryImage = id => {
  if (confirm('Delete this image from history?')) {
    deleteImage(id);
    renderHistory();
  }
};

clearBtn?.addEventListener('click', () => {
  if (confirm('Clear all history?')) {
    clearHistory();
    renderHistory();
  }
});

document.addEventListener('DOMContentLoaded', renderHistory);

