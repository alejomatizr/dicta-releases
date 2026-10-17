// Dicta · página de descarga. El motor (scroll-craft) fija los actos y publica su progreso;
// aquí viven las escenas por capas, la pantalla del portátil, las demos y el punto que viaja.
(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.documentElement.classList.add('reduce');

  var CANVAS = { desk: [2880, 1620], mobile: [1290, 2293] };
  var isMobile = function () { return innerWidth <= 860; };
  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var range = function (p, a, b) { return clamp01((p - a) / (b - a)); };
  var smooth = function (t) { return t * t * (3 - 2 * t); };
  var nums = function (s) { return (s || '').trim().split(/\s+/).map(parseFloat); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var engine = window.ScrollCraft.mount(document.body);
  var actOf = function (el) {
    var host = el.closest('[data-sc-act]');
    for (var i = 0; i < engine.acts.length; i++) if (engine.acts[i].el === host) return engine.acts[i];
    return null;
  };

  // ---- imágenes por tamaño de pantalla ------------------------------------
  var mode = null;
  function pickSources() {
    var next = isMobile() ? 'mobile' : 'desk';
    if (next === mode) return false;
    mode = next;
    $$('img[data-desk]').forEach(function (img) { img.src = img.getAttribute('data-' + mode); });
    return true;
  }

  // ---- escenas: lienzo que cubre el escenario, con foco y empuje de cámara --
  var scenes = $$('[data-scene]').map(function (el) {
    return {
      el: el,
      act: actOf(el),
      stage: el.closest('[data-sc-stage]'),
      canvases: $$('.scene__canvas', el),
      layers: $$('.layer, .hero__group', el),
      push: parseFloat(el.getAttribute('data-push')) || 0,
      p: -1,
    };
  });

  function layoutScenes() {
    var size = CANVAS[mode];
    scenes.forEach(function (S) {
      var W = S.stage.clientWidth, H = S.stage.clientHeight;
      var f = nums(S.el.getAttribute('data-focus-' + mode));
      var cx = isNaN(f[0]) ? size[0] / 2 : f[0], cy = isNaN(f[1]) ? size[1] / 2 : f[1];
      var vx = isNaN(f[2]) ? 0.5 : f[2], vy = isNaN(f[3]) ? 0.5 : f[3];
      var s = Math.max(W / size[0], H / size[1]) * (f[4] || 1);
      // El punto de foco va a (vx, vy) del escenario sin dejar ver los bordes del lienzo.
      var tx = Math.min(0, Math.max(W - size[0] * s, vx * W - cx * s));
      var ty = Math.min(0, Math.max(H - size[1] * s, vy * H - cy * s));
      var t = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(5) + ')';
      S.canvases.forEach(function (c) {
        c.style.setProperty('--w', size[0] + 'px');
        c.style.setProperty('--h', size[1] + 'px');
        c.style.transform = t;
      });
      var o = nums(S.el.getAttribute('data-origin-' + mode));
      var origin = (isNaN(o[0]) ? cx : o[0]) + 'px ' + (isNaN(o[1]) ? cy : o[1]) + 'px';
      S.layers.forEach(function (l) { l.style.transformOrigin = origin; });
      S.p = -1;
      S.el.classList.add('is-laid');
    });
  }

  // Profundidad de cada capa: lo de atrás se mueve menos que lo de delante.
  function depthOf(layer) {
    if (layer.classList.contains('layer--primer-plano') || layer.classList.contains('layer--auriculares')) return 1.7;
    if (layer.closest('.scene__canvas--front')) return 1;
    return 0.55;
  }
  scenes.forEach(function (S) { S.depths = S.layers.map(depthOf); });

  function driveScenes() {
    scenes.forEach(function (S) {
      if (!S.act || !S.act.live || reduce) return;
      var p = S.act.p;
      if (Math.abs(p - S.p) < 0.0005) return;
      S.p = p;
      var e = smooth(p);
      S.layers.forEach(function (l, i) {
        l.style.transform = 'scale(' + (1 + S.push * e * S.depths[i]).toFixed(4) + ')';
      });
    });
  }

  // Muestra cada escena cuando sus capas ya cargaron (el póster cubre mientras tanto).
  function watchReady() {
    scenes.forEach(function (S) {
      S.stage.classList.remove('scene-ready');
      var imgs = $$('img.layer', S.el).filter(function (i) { return !i.classList.contains('layer--poster'); });
      Promise.all(imgs.map(function (i) { return i.decode ? i.decode().catch(function () {}) : null; }))
        .then(function () { S.stage.classList.add('scene-ready'); });
    });
  }

  // ---- la pantalla del portátil: la interfaz real deformada en perspectiva --
  var QUAD = {
    desk: [[1238, 418], [2088, 366], [1963, 1104], [1084, 996]],
    mobile: [[354, 540], [995, 586], [940, 1042], [308, 958]],
  };
  var screen = document.querySelector('[data-screen]');
  function squareToQuad(w, h, q) {
    var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
    var dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
    var sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3;
    var den = dx1 * dy2 - dx2 * dy1;
    var g = (sx * dy2 - dx2 * sy) / den, k = (dx1 * sy - sx * dy1) / den;
    var a = x1 - x0 + g * x1, b = x3 - x0 + k * x3, d = y1 - y0 + g * y1, e = y3 - y0 + k * y3;
    return 'matrix3d(' + [a / w, d / w, 0, g / w, b / h, e / h, 0, k / h, 0, 0, 1, 0, x0, y0, 0, 1].map(function (n) { return +n.toFixed(8); }).join(',') + ')';
  }
  function layoutScreen() {
    if (screen) screen.style.transform = squareToQuad(screen.offsetWidth, screen.offsetHeight, QUAD[mode]);
  }

  // ---- anclas del punto dentro de las escenas (px del lienzo) ---------------
  function layoutAnchors() {
    $$('.dot-anchor-scene').forEach(function (a) {
      var v = nums(a.getAttribute('data-' + mode));
      a.style.left = (v[0] - v[2] / 2) + 'px';
      a.style.top = (v[1] - v[2] / 2) + 'px';
      a.style.width = a.style.height = v[2] + 'px';
    });
  }

  // ---- demos ligadas al scroll ---------------------------------------------
  var heroAct = actOf(document.getElementById('inicio'));
  var screenText = document.querySelector('[data-screen-text]');
  var screenFull = screenText ? screenText.textContent : '';
  var lastTyped = -1;

  var dictadoAct = actOf(document.getElementById('dictado'));
  var dictadoText = document.querySelector('[data-dictado-text]');
  var dictadoHint = document.querySelector('[data-dictado-hint]');
  var edgePill = document.querySelector('[data-edge-pill]');
  var HINTS = ['Mantén <kbd>fn</kbd> y habla…', 'Escuchando… suelta <kbd>fn</kbd> para pegar', 'Pegado en Notas ✓'];
  var hintState = -1;

  var comandoAct = actOf(document.getElementById('comando'));
  var comando = document.querySelector('[data-comando]');

  var clasesAct = actOf(document.getElementById('clases'));
  var notes = document.querySelector('[data-notes]');
  var notesLines = $$('.notes__transcript li', notes);
  var notesSummary = notes.querySelector('.notes__summary');
  var notesClock = notes.querySelector('[data-notes-clock]');
  var notesStatus = notes.querySelector('[data-notes-status]');

  function toggle(el, cls, on) { if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on); }

  function driveDemos() {
    // Héroe: el portátil escribe solo mientras la píldora escucha.
    var hp = reduce ? 1 : heroAct.p;
    var n = Math.round(screenFull.length * range(hp, 0.16, 0.62));
    if (n !== lastTyped) { screenText.textContent = screenFull.slice(0, n); lastTyped = n; }
    toggle(screen, 'is-live', hp > 0.14 && hp < 0.64);

    // Dictado: escucha mientras se mantiene fn y pega todo al soltar, como la app.
    var dp = reduce ? 1 : dictadoAct.p;
    var h = dp < 0.14 ? 0 : dp < 0.6 ? 1 : 2;
    if (h !== hintState) {
      hintState = h;
      dictadoHint.innerHTML = HINTS[h];
      dictadoText.style.opacity = h === 2 ? '1' : '0';
      toggle(edgePill, 'is-live', h === 1);
    }

    // Comando: seleccionar → pedir → reescribir.
    var cp = reduce ? 1 : comandoAct.p;
    toggle(comando, 'is-selected', cp > 0.12 && cp < 0.56);
    toggle(comando, 'is-ordered', cp > 0.3);
    toggle(comando, 'is-rewritten', cp > 0.56);

    // Clases: la transcripción avanza y los apuntes aparecen solos.
    var kp = reduce ? 1 : clasesAct.p;
    [0.06, 0.18, 0.3, 0.42].forEach(function (at, i) { if (notesLines[i]) toggle(notesLines[i], 'is-on', kp > at); });
    var done = kp > 0.62;
    toggle(notesSummary, 'is-on', done);
    toggle(notes, 'is-done', done);
    var secs = Math.round(52 * range(kp, 0, 0.62)) + 2840;
    var clock = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
    if (notesClock.textContent !== clock) notesClock.textContent = clock;
    var status = done ? 'Apuntes listos · Cálculo I' : 'Grabando · Cálculo I';
    if (notesStatus.textContent !== status) notesStatus.textContent = status;
  }

  // ---- el punto: viaja de ancla en ancla ------------------------------------
  // Cada ancla tiene un tramo de reposo (en progreso de su acto). Entre el final de un
  // reposo y el inicio del siguiente, la esfera vuela entre las dos posiciones vivas.
  var dot = document.getElementById('dot');
  var SPHERE = 0.683;                 // la esfera ocupa el 68,3 % de la imagen
  var FADE_PX = 70;
  var anchors = $$('[data-dot]').map(function (el) {
    var rest = nums(el.getAttribute('data-dot-rest') || '0.24 0.9');
    var layerSel = el.getAttribute('data-dot-layer');
    return { el: el, act: actOf(el), a: rest[0], b: rest[1], layer: layerSel ? document.querySelector(layerSel) : null };
  });

  function stations() {
    var vh = innerHeight;
    anchors.forEach(function (A) {
      var travel = Math.max(A.act.height - vh, 1);
      A.y0 = A.act.top + A.a * travel;
      A.y1 = A.act.top + A.b * travel;
    });
  }

  function rectOf(A) {
    var r = A.el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width };
  }

  var lastDot = '';
  function driveDot() {
    if (reduce) return;
    var y = scrollY;
    var i = 0;
    while (i < anchors.length - 1 && y > anchors[i].y1) i++;
    // i es la primera ancla cuyo reposo no ha terminado; si aún no llegamos a su reposo, venimos volando desde i-1.
    var from, to, t, A = anchors[i];
    if (i > 0 && y < A.y0) { from = anchors[i - 1]; to = A; t = (y - from.y1) / Math.max(A.y0 - from.y1, 1); }
    else { from = to = A; t = 0; }
    t = clamp01(t);

    var p0 = rectOf(from), p1 = to === from ? p0 : rectOf(to);
    var e = smooth(t);
    var x = p0.x + (p1.x - p0.x) * e;
    var yy = p0.y + (p1.y - p0.y) * e - Math.sin(Math.PI * t) * innerHeight * 0.08;
    var d = p0.d + (p1.d - p0.d) * e;
    if (from !== to) {
      // En vuelo la esfera se queda en pantalla: te va siguiendo.
      var m = Math.max(d, 40);
      x = Math.min(Math.max(x, m), innerWidth - m);
      yy = Math.min(Math.max(yy, m + 40), innerHeight - m);
    }

    // Sobre una escena, la esfera fotografiada (con su sombra real) sustituye a la que vuela.
    var flyOpacity = 1;
    anchors.forEach(function (B) {
      if (!B.layer) return;
      var o;
      if (y < B.y0) o = 1 - clamp01((B.y0 - y) / FADE_PX);
      else if (y > B.y1) o = 1 - clamp01((y - B.y1) / FADE_PX);
      else o = 1;
      if (B === anchors[0] && y < B.y0) o = 1;
      B.layer.style.opacity = o.toFixed(3);
      if (B === from || B === to) flyOpacity = Math.min(flyOpacity, 1 - o);
    });
    if (from === to && !from.layer) flyOpacity = 1;

    var size = d / SPHERE;
    var css = 'translate3d(' + (x - size / 2).toFixed(1) + 'px,' + (yy - size / 2).toFixed(1) + 'px,0) scale(' + (size / 100).toFixed(4) + ')';
    var op = flyOpacity.toFixed(3);
    if (css + op !== lastDot) {
      dot.style.transform = css;
      dot.style.transformOrigin = '0 0';
      dot.style.opacity = op;
      lastDot = css + op;
    }
  }

  // ---- bucle ---------------------------------------------------------------
  function relayout() {
    pickSources() && watchReady();
    layoutScenes();
    layoutScreen();
    layoutAnchors();
    engine.layout();
    stations();
  }
  relayout();
  addEventListener('resize', function () { requestAnimationFrame(relayout); }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { engine.layout(); stations(); });
  addEventListener('load', function () { engine.layout(); stations(); });

  (function frame() {
    driveScenes();
    driveDemos();
    driveDot();
    requestAnimationFrame(frame);
  })();

  // ---- descarga: versión y tamaño reales desde GitHub ------------------------
  fetch('https://api.github.com/repos/alejomatizr/dicta-releases/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel) return;
      var version = String(rel.tag_name || '').replace(/^v/, '');
      if (version) $$('[data-version]').forEach(function (el) { el.textContent = 'Versión ' + version; });
      var dmg = (rel.assets || []).filter(function (a) { return a.name === 'Dicta.dmg'; })[0];
      if (dmg) $$('[data-size]').forEach(function (el) { el.textContent = '.dmg · ' + Math.round(dmg.size / 1048576) + ' MB'; });
    })
    .catch(function () {});

  // ---- tutorial ------------------------------------------------------------
  var dialog = document.querySelector('[data-tutorial]');
  var video = dialog.querySelector('video');
  document.querySelector('[data-open-tutorial]').addEventListener('click', function () {
    dialog.showModal();
    video.play().catch(function () {});
  });
  dialog.querySelector('[data-close-tutorial]').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { video.pause(); });

  // ---- copiar el comando de ayuda -------------------------------------------
  var copyBtn = document.querySelector('[data-copy]');
  copyBtn.addEventListener('click', function () {
    var text = document.querySelector('[data-copy-source]').textContent;
    navigator.clipboard.writeText(text).then(function () {
      copyBtn.textContent = 'Copiado';
      setTimeout(function () { copyBtn.textContent = 'Copiar'; }, 1600);
    });
  });
})();
