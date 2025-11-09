// ====== Config & Elements ======
const LOGO_MAX_RATIO = 0.28;                 // <= 0.30 recommended
const LOGO_MIN_PX = 64;
const LOGO_MAX_PX = 1024;
const FILE_SIZE_MAX = 2 * 1024 * 1024;       // 2 MB

const urlInput = document.getElementById('urlInput');
const logoInput = document.getElementById('logoInput');
const bgTransparent = document.getElementById('bgTransparent');
const bgColor = document.getElementById('bgColor');
const clipStyle = document.getElementById('clipStyle');
const cornerRadius = document.getElementById('cornerRadius');
const cornerRadiusLabel = document.getElementById('cornerRadiusLabel');
const radiusRow = document.getElementById('radiusRow');

const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');

const messages = document.getElementById('messages');
const qrcodeContainer = document.getElementById('qrcode');      // hidden QR render target
const compositeCanvas = document.getElementById('compositeCanvas');
const compositeCtx = compositeCanvas.getContext('2d');

let logoImage = null;
let logoMeta  = null;
let qrInstance = null;

// ====== Helpers ======
function showMessage(html, type='ok') { messages.innerHTML = `<div class="${type}">${html}</div>`; }
function clearMessage() { messages.innerHTML = ''; }
function clearQRBase() { qrcodeContainer.innerHTML = ''; }

function getDynamicQRSize() {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  return Math.min(Math.max(Math.floor(vw * 0.9), 256), 512);
}

function getCanvasSizes() {
  const css = getDynamicQRSize();                           // CSS px
  const dpr = Math.max(1, window.devicePixelRatio || 1);    // device pixel ratio
  const px  = Math.ceil(css * dpr);                         // backing resolution
  return { css, px, dpr };
}

function validateLogoFile(file) {
  if (!file) return { ok: false, reason: 'No file selected.' };
  const typeOk = file.type?.startsWith('image/');
  if (!typeOk) return { ok:false, reason:`Unsupported file type: ${file.type || 'unknown'}. Please upload an image.` };
  if (file.size > FILE_SIZE_MAX) return { ok:false, reason:`File too large (${(file.size/1024/1024).toFixed(2)} MB). Max allowed is ${(FILE_SIZE_MAX/1024/1024)} MB.` };
  return { ok:true };
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image.')); };
    img.src = url;
  });
}

// ====== UI Wiring ======
(function initUI(){
  function updateRadiusVisibility() {
    radiusRow.style.display = (clipStyle.value === 'rounded') ? 'flex' : 'none';
  }
  clipStyle.addEventListener('change', updateRadiusVisibility);
  updateRadiusVisibility();

  cornerRadius.addEventListener('input', () => {
    cornerRadiusLabel.textContent = `Corner radius: ${cornerRadius.value} px`;
  });

  function updateBgColorVisibility() {
    const hidden = bgTransparent.checked;
    bgColor.style.display = hidden ? 'none' : '';
    bgColor.disabled = hidden;
  }
  updateBgColorVisibility();
  bgTransparent.addEventListener('change', updateBgColorVisibility);
})();

logoInput.addEventListener('change', async () => {
  clearMessage();
  const file = logoInput.files?.[0];
  if (!file) { logoImage = null; logoMeta = null; showMessage('No logo selected. You can generate the QR without a logo.', 'ok'); return; }

  const basic = validateLogoFile(file);
  if (!basic.ok) { showMessage(basic.reason, 'error'); logoImage = null; logoMeta = null; return; }

  try {
    const img = await loadImageFromFile(file);
    const w = img.naturalWidth, h = img.naturalHeight;

    if (w < LOGO_MIN_PX || h < LOGO_MIN_PX) { showMessage(`Logo is too small (${w}×${h}). Minimum is ${LOGO_MIN_PX}×${LOGO_MIN_PX}px.`, 'error'); logoImage=null; logoMeta=null; return; }
    if (w > LOGO_MAX_PX || h > LOGO_MAX_PX) { showMessage(`Logo is too large (${w}×${h}). Maximum is ${LOGO_MAX_PX}×${LOGO_MAX_PX}px. Please resize and upload again.`, 'error'); logoImage=null; logoMeta=null; return; }

    logoImage = img;
    logoMeta = { width: w, height: h, sizeBytes: file.size, type: file.type };
    showMessage(`Logo OK: ${w}×${h}px, ${(file.size/1024).toFixed(0)} KB, ${file.type}.`, 'ok');
  } catch (err) {
    showMessage(`Could not read image: ${err.message}`, 'error');
    logoImage = null; logoMeta = null;
  }
});

// ====== Generate & Draw ======
function drawComposite(qrSource, logoImg, opts) {
  const { cssSize, pixelSize, dpr, bgTransparent, bgColor, clip, cornerRadius } = opts;

  // Set backing resolution to device pixels, display at CSS size
  compositeCanvas.width = pixelSize;
  compositeCanvas.height = pixelSize;
  compositeCanvas.style.width = cssSize + 'px';
  compositeCanvas.style.height = cssSize + 'px';

  const ctx = compositeCanvas.getContext('2d');

  // Reset transform, clear in device pixels, then draw in CSS coords via scale
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, pixelSize, pixelSize);
  ctx.scale(dpr, dpr); // all coords now in CSS pixels

  // Background
  if (!bgTransparent) {
    ctx.fillStyle = bgColor || '#ffffff';
    ctx.fillRect(0, 0, cssSize, cssSize);
  }

  // Draw QR (keep modules crisp)
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qrSource, 0, 0, cssSize, cssSize);

  if (!logoImg) return;

  // Logo sizing
  const maxLogoW = cssSize * LOGO_MAX_RATIO;
  const maxLogoH = cssSize * LOGO_MAX_RATIO;
  const lw = logoImg.naturalWidth, lh = logoImg.naturalHeight;
  const scale = Math.min(maxLogoW / lw, maxLogoH / lh, 1);
  const drawW = Math.round(lw * scale);
  const drawH = Math.round(lh * scale);
  const dx = Math.round((cssSize - drawW) / 2);
  const dy = Math.round((cssSize - drawH) / 2);

  const pad = 6;

  ctx.save();

  // Contrast pad + optional clipping
  if (clip === 'circle') {
    ctx.beginPath();
    ctx.arc(dx + drawW/2, dy + drawH/2, Math.max(drawW, drawH)/2 + pad, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(dx + drawW/2, dy + drawH/2, Math.min(drawW, drawH)/2, 0, Math.PI * 2);
    ctx.clip();
  } else if (clip === 'rounded') {
    roundRect(ctx, dx - pad, dy - pad, drawW + pad*2, drawH + pad*2, cornerRadius);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    roundRect(ctx, dx, dy, drawW, drawH, cornerRadius);
    ctx.clip();
  } else {
    roundRect(ctx, dx - pad, dy - pad, drawW + pad*2, drawH + pad*2, Math.min(16, Math.round(Math.min(drawW, drawH) * 0.2)));
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Draw logo with smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(logoImg, dx, dy, drawW, drawH);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  const m = Math.min(w, h);
  if (r > m/2) r = m/2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function generateQR() {
  clearMessage();
  clearQRBase();

  const url = urlInput.value.trim();
  if (!url) { showMessage('Please enter a valid URL.', 'error'); return; }

  const { css, px, dpr } = getCanvasSizes();

  // Make the hidden QR as large as backing canvas or >=1024 for crisp downscaling
  const INTERNAL_QR_SIZE = Math.max(1024, px);
  const lightColor = bgTransparent.checked ? 'rgba(255,255,255,0)' : bgColor.value;

  new QRCode(qrcodeContainer, {
    text: url,
    width:  INTERNAL_QR_SIZE,
    height: INTERNAL_QR_SIZE,
    colorDark: "#000000",
    colorLight: lightColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  requestAnimationFrame(() => {
    const qrEl = qrcodeContainer.querySelector('canvas') || qrcodeContainer.querySelector('img');
    if (!qrEl) { showMessage('Failed to render QR. Please try again.', 'error'); return; }

    drawComposite(qrEl, logoImage, {
      cssSize: css,
      pixelSize: px,
      dpr,
      bgTransparent: bgTransparent.checked,
      bgColor: bgColor.value,
      clip: clipStyle.value,
      cornerRadius: parseInt(cornerRadius.value, 10) || 16
    });

    compositeCanvas.style.display = 'block';
    downloadBtn.disabled = false;
    clearBtn.disabled = false;

    if (!logoImage) showMessage('QR generated without a logo (no logo uploaded).', 'ok');
  });
}

function downloadPNG() {
  const link = document.createElement('a');
  link.download = 'qr-with-logo.png';
  link.href = compositeCanvas.toDataURL('image/png');
  link.click();
}

function clearOutput() {
  clearMessage();
  clearQRBase();
  compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
  compositeCanvas.style.display = 'none';
  downloadBtn.disabled = true;
  clearBtn.disabled = true;
}

// ====== Events ======
generateBtn.addEventListener('click', generateQR);
downloadBtn.addEventListener('click', downloadPNG);
clearBtn.addEventListener('click', clearOutput);

// Optional: live preview of background color (if not transparent)
bgColor.addEventListener('input', () => {
  if (!bgTransparent.checked) generateQR();
});
