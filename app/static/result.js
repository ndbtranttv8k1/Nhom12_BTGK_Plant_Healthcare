(() => {
  const BOX = { x: 313, y: 190, w: 1293, h: 661, r: 119 };

  setupStage({ keep: { x: 313, y: 190, w: 1293, h: 770 } });
  setupCater({ box: BOX, inset: 2, speed: 80, startX: 1440, feet: 0 });

  const photo = document.getElementById('photo');
  const img   = document.getElementById('photo-img');

  const saved = () => {
    try { return sessionStorage.getItem('uploadedImage'); } catch (e) { return null; }
  };
  let triedSaved = false;

  img.addEventListener('error', () => {
    photo.classList.remove('has-image');
    const s = saved();
    if (!triedSaved && s) { triedSaved = true; img.src = s; }
  });
  img.addEventListener('load', () => photo.classList.add('has-image'));

  if (!img.getAttribute('src')) {

    const s = saved();
    if (s) { triedSaved = true; img.src = s; }
  }
})();
