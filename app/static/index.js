(() => {
  const BOX = { x: 326, y: 292, w: 1268, h: 401, r: 108 };

  setupStage({ keep: BOX });               
  setupCater({ box: BOX, inset: 2, speed: 80, startX: 1434, feet: 0 });

  const fileInput = document.getElementById('file');
  const fileName  = document.getElementById('file-name');

  fileInput.addEventListener('change', () => {
    fileName.textContent = fileInput.files.length
      ? fileInput.files[0].name
      : 'Chưa có tệp nào được chọn';
    try { sessionStorage.removeItem('uploadedImage'); } catch (e) {}
    const f = fileInput.files[0];
    if (!f) return;

    const url = URL.createObjectURL(f);
    const im  = new Image();
    im.onload = () => {
      const k = Math.min(1, 900 / Math.max(im.width, im.height));  
      const c = document.createElement('canvas');
      c.width  = Math.round(im.width * k);
      c.height = Math.round(im.height * k);
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#fff';                                       
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(im, 0, 0, c.width, c.height);
      try { sessionStorage.setItem('uploadedImage', c.toDataURL('image/jpeg', 0.85)); } catch (e) {}
      URL.revokeObjectURL(url);
    };
    im.onerror = () => URL.revokeObjectURL(url);
    im.src = url;
  });
})();
