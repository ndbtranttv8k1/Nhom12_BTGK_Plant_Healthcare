window.setupStage = function (opts) {
  const keep   = opts.keep;
  const MARGIN = opts.margin || 0.94;
  const stage  = document.getElementById('stage');
  const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const fit = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const cover = Math.max(vw / 1920, vh / 1080);
    const s = Math.min(cover, MARGIN * vw / keep.w, MARGIN * vh / keep.h);
    const maxDx = Math.max(0, (1920 * s - vw) / 2);
    const maxDy = Math.max(0, (1080 * s - vh) / 2);
    const dx = clamp((960 - (keep.x + keep.w / 2)) * s, -maxDx, maxDx);
    const dy = clamp((540 - (keep.y + keep.h / 2)) * s, -maxDy, maxDy);

    stage.style.transform =
      `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${s})`;
    stage.classList.toggle('feather', s < cover - 0.001);
  };
  window.addEventListener('resize', fit);
  fit();
};

window.setupCater = function (opts) {
  const BOX     = opts.box;
  const INSET   = opts.inset  ?? 2;
  const SPEED   = opts.speed  ?? 80;
  const START_X = opts.startX;
  const FEET    = opts.feet   ?? 0;

  const cater = document.getElementById('cater');
  const img   = cater.querySelector('img');

  const x0 = BOX.x + INSET, y0 = BOX.y + INSET;
  const w  = BOX.w - 2 * INSET, h = BOX.h - 2 * INSET, r = BOX.r - INSET;
  const sx = w - 2 * r, sy = h - 2 * r, arc = Math.PI * r / 2;

  const rad = d => d * Math.PI / 180;
  const straight = (len, px, py, dx, dy, ang) =>
    ({ len, at: t => ({ x: px + dx * t, y: py + dy * t, a: ang }) });
  const corner = (cx, cy, from, to) =>
    ({ len: arc, at: t => {
        const phi = rad(from + (to - from) * (t / arc));
        return {
          x: cx + r * Math.cos(phi),
          y: cy + r * Math.sin(phi),
          a: Math.atan2(-Math.cos(phi), Math.sin(phi)) * 180 / Math.PI
        };
    }});

  const segments = [
    straight(sx, x0 + r,     y0 + h,     1,  0,   0),   
    corner(x0 + w - r, y0 + h - r,   90,    0),         
    straight(sy, x0 + w,     y0 + h - r, 0, -1, -90),   
    corner(x0 + w - r, y0 + r,        0,  -90),         
    straight(sx, x0 + w - r, y0,        -1,  0, 180),   
    corner(x0 + r,     y0 + r,      -90, -180),         
    straight(sy, x0,         y0 + r,     0,  1,  90),   
    corner(x0 + r,     y0 + h - r,  180,   90)         
  ];
  const total = segments.reduce((sum, s) => sum + s.len, 0);

  const pointAt = dist => {
    let s = ((dist % total) + total) % total;
    for (const seg of segments) {
      if (s <= seg.len) return seg.at(s);
      s -= seg.len;
    }
    return segments[0].at(0);
  };

  const START_S = START_X - BOX.x - BOX.r;

  const place = dist => {
    const p = pointAt(dist);
    const cw = cater.offsetWidth, ch = cater.offsetHeight;
    cater.style.transform =
      `translate(${p.x}px, ${p.y}px) rotate(${p.a}deg) translate(${-cw / 2}px, ${-ch + FEET}px)`;
  };

  const run = () => {
    place(START_S);
    cater.classList.add('ready');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t0 = performance.now();
    const loop = now => {
      place(START_S + SPEED * (now - t0) / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };

  if (img.complete && img.naturalWidth) run();
  else img.addEventListener('load', run);
};
