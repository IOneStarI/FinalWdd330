import { buildPicsumUrl } from './placeHolderService.mjs';
import { saveAiImageToHistory } from './historyService.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const sharedPreview = document.getElementById('sharedPreview');
  const sharedImg = document.getElementById('sharedImg');
  const sharedActions = document.getElementById('sharedActions');
  const previewBtn = document.getElementById('preview-btn');
  const downloadBtn = document.getElementById('download-btn');

  function showSharedImage(url, filenameHint) {
    sharedImg.src = url;
    sharedImg.dataset.downloadUrl = url;
    sharedImg.dataset.filename = filenameHint || `image-${Date.now()}.jpg`;
    sharedPreview.style.display = 'block';
    sharedActions.style.display = 'flex';
  }

  const widthInput = document.getElementById('width');
  const heightInput = document.getElementById('height');
  const formatSelect = document.getElementById('format');
  const generateBtn = document.getElementById('generate-btn');

  generateBtn.addEventListener('click', () => {
    try {
      const url = buildPicsumUrl(
        widthInput.value,
        heightInput.value,
        formatSelect.value
      );
      const filename = `placeholder-${widthInput.value}x${heightInput.value}.${formatSelect.value}`;
      showSharedImage(url, filename);
    } catch (err) {
      alert(err.message);
    }
  });

  const promptInput = document.getElementById('imagePrompt');
  const aiModelSelect = document.getElementById('aiModel');
  const aiQualitySelect = document.getElementById('aiQuality');
  const aiGenerateBtn = document.getElementById('aiGenerateBtn');

  aiGenerateBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter an image description');
      return;
    }

    aiGenerateBtn.textContent = 'Generating...';
    aiGenerateBtn.disabled = true;

    try {
      const options = {
        model: aiModelSelect.value,
        quality: aiQualitySelect.value
      };

      const imgElement = await window.puter.ai.txt2img(prompt, options);
      const url = imgElement.src;
      const filename = `ai-image-${Date.now()}.jpg`;
      showSharedImage(url, filename);
      saveAiImageToHistory(url, prompt, aiModelSelect.value);
    } catch (error) {
      console.error(error);
      alert('AI generation failed. Check DevTools Network for details.');
    } finally {
      aiGenerateBtn.textContent = 'Generate AI image';
      aiGenerateBtn.disabled = false;
    }
  });

  previewBtn.addEventListener('click', () => {
    const url = sharedImg.dataset.downloadUrl;
    if (!url) {
      alert('Generate an image first');
      return;
    }
    window.open(url, '_blank');
  });

  downloadBtn.addEventListener('click', async () => {
    const url = sharedImg.dataset.downloadUrl;
    if (!url) {
      alert('Generate an image first');
      return;
    }

    const filename = sharedImg.dataset.filename || `image-${Date.now()}.jpg`;

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
      console.error(err);
      alert('Download failed');
    }
  });
});
