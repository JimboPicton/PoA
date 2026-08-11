(function () {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const canvas = $('#stage');
  const ctx = canvas.getContext('2d');
  const map = $('#actionMap');
  const mctx = map.getContext('2d');
  const controls = {
    amplitude: $('#amplitude'), duration: $('#duration'), pendulum: $('#pendulum'),
    elbowBreak: $('#elbowBreak'), elbowDelay: $('#elbowDelay'), wristFlex: $('#wristFlex'),
    wristDelay: $('#wristDelay'), follow: $('#follow')
  };
  const defaults = { amplitude: 58, duration: 260, pendulum: 86, elbowBreak: 72, elbowDelay: 2, wristFlex: 78, wristDelay: 4, follow: 68 };
  const prompts = [
    'At the reversal, which joint changes direction first—and which arrives last?',
    'Where are the drawings closest together in a pendulum swing?',
    'How does breaking the elbow turn straight bones into a flowing action?',
    'What changes when every joint reverses on the same frame?',
    'How far can you push flexibility before the arm feels rubbery?'
  ];
  const lessons = {
    arc: ['The path is curved; the timing is pendular.', 'A shoulder swing travels on an arc. Pendulum spacing slows the arm into each extreme, then lets it move fastest through the centre.', 'Reduce Pendulum spacing to zero, then restore it. Compare the mechanical reversal with the eased swing.'],
    break: ['Break the joints in succession.', 'When the upper arm reverses, the forearm can continue briefly. The elbow bends—or “breaks”—before the later sections change direction.', 'Set Elbow break to zero, then raise it while stepping through an extreme. Look for the curved line created from straight segments.'],
    overlap: ['Each connected part has its own timing.', 'The shoulder leads, the elbow follows, and the wrist and hand arrive last. This separation prevents the arm from moving as one rigid shape.', 'Increase Elbow delay and Hand delay. Turn on Show key poses and compare the silhouette at each extreme and passing position.'],
    follow: ['The hand completes the action.', 'Follow-through is visible when the lower arm and hand continue after the upper arm changes direction. Their smaller overshoot completes the swing.', 'Raise Follow-through, pause at a direction change and step forward. Identify when the shoulder, forearm and hand reverse.' ]
  };

  let fps = 12;
  let speed = 1;
  let frame = 0;
  let playing = true;
  let last = performance.now();
  let compare = false;
  let promptIndex = 0;

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function mix(a, b, amount) { return a + (b - a) * amount; }
  function durationSeconds() { return +controls.duration.value / 100; }
  function totalFrames() { return Math.max(16, Math.round(durationSeconds() * fps)); }
  function wrapUnit(value) { return ((value % 1) + 1) % 1; }
  function linearWave(u) {
    const p = wrapUnit(u);
    if (p < .5) return -1 + p * 4;
    return 3 - p * 4;
  }
  function swingWave(u) {
    const pendulum = -Math.cos(wrapUnit(u) * Math.PI * 2);
    return mix(linearWave(u), pendulum, +controls.pendulum.value / 100);
  }
  function angleFor(u) {
    const amplitude = +controls.amplitude.value * Math.PI / 180;
    return Math.PI / 2 + amplitude * swingWave(u);
  }
  function shortestAngle(value) {
    while (value > Math.PI) value -= Math.PI * 2;
    while (value < -Math.PI) value += Math.PI * 2;
    return value;
  }
  function poseAt(poseFrame, rigid = false) {
    const total = totalFrames();
    const u = wrapUnit(poseFrame / total);
    const elbowDelay = rigid ? 0 : +controls.elbowDelay.value;
    const handDelay = rigid ? 0 : +controls.wristDelay.value;
    const breakAmount = rigid ? 0 : +controls.elbowBreak.value / 100;
    const wristAmount = rigid ? 0 : +controls.wristFlex.value / 100;
    const follow = rigid ? 0 : +controls.follow.value / 100;
    const upper = angleFor(u);
    const delayedElbow = angleFor(u - elbowDelay / total);
    const delayedHand = angleFor(u - (elbowDelay + handDelay) / total);
    const elbowDifference = shortestAngle(delayedElbow - upper);
    const reversal = -Math.cos(u * Math.PI * 2);
    const reversalBreak = reversal * (24 * Math.PI / 180) * breakAmount * (.3 + elbowDelay / 6 * .7) * (.45 + follow * .55);
    const forearm = upper + elbowDifference * breakAmount * (1 + follow * .55) + reversalBreak;
    const handDifference = shortestAngle(delayedHand - forearm);
    const handCurl = -Math.cos((u - handDelay / total) * Math.PI * 2) * (20 * Math.PI / 180) * wristAmount * (handDelay / 9) * (.35 + follow * .65);
    const hand = forearm + handDifference * wristAmount * (1 + follow * .7) + handCurl;
    const velocity = swingWave(u + 1 / total) - swingWave(u - 1 / total);
    return { u, upper, forearm, hand, velocity };
  }
  function geometry(pose, width, height) {
    const shoulder = { x: width * .5, y: height * .18 };
    const scale = Math.min(width, height);
    const upperLength = scale * .23;
    const forearmLength = scale * .205;
    const handLength = scale * .115;
    const elbow = { x: shoulder.x + Math.cos(pose.upper) * upperLength, y: shoulder.y + Math.sin(pose.upper) * upperLength };
    const wrist = { x: elbow.x + Math.cos(pose.forearm) * forearmLength, y: elbow.y + Math.sin(pose.forearm) * forearmLength };
    const hand = { x: wrist.x + Math.cos(pose.hand) * handLength, y: wrist.y + Math.sin(pose.hand) * handLength };
    return { shoulder, elbow, wrist, hand, upperLength, forearmLength, handLength, scale };
  }
  function resize() {
    for (const target of [canvas, map]) {
      const dpr = devicePixelRatio || 1;
      const rect = target.getBoundingClientRect();
      target.width = Math.max(1, Math.round(rect.width * dpr));
      target.height = Math.max(1, Math.round(rect.height * dpr));
      target.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    draw();
  }
  function drawBone(c, start, end, width, colour, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.strokeStyle = colour;
    c.lineWidth = width;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(start.x, start.y);
    c.lineTo(end.x, end.y);
    c.stroke();
    c.restore();
  }
  function drawJoint(c, point, radius, fill, stroke, alpha) {
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = fill;
    c.strokeStyle = stroke;
    c.lineWidth = Math.max(2, radius * .16);
    c.beginPath();
    c.arc(point.x, point.y, radius, 0, Math.PI * 2);
    c.fill();
    c.stroke();
    c.restore();
  }
  function drawHand(c, wrist, tip, angle, scale, rigid, alpha) {
    const length = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
    c.save();
    c.globalAlpha = alpha;
    c.translate(wrist.x, wrist.y);
    c.rotate(angle);
    c.fillStyle = rigid ? '#dfe4e2' : '#ffd3c4';
    c.strokeStyle = rigid ? '#68736f' : '#7c2c20';
    c.lineWidth = Math.max(2.5, scale * .009);
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(-scale * .014, -scale * .037);
    c.quadraticCurveTo(length * .56, -scale * .06, length, -scale * .018);
    c.quadraticCurveTo(length * 1.08, 0, length, scale * .018);
    c.quadraticCurveTo(length * .58, scale * .066, -scale * .014, scale * .038);
    c.closePath();
    c.fill();
    c.stroke();
    c.restore();
  }
  function drawArm(c, pose, alpha = 1, rigid = false) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const g = geometry(pose, w, h);
    const boneWidth = g.scale * .058;
    const outlineWidth = boneWidth + g.scale * .014;
    const outline = rigid ? '#68736f' : '#7c2c20';
    const fill = rigid ? '#dfe4e2' : '#ffd3c4';
    drawBone(c, g.shoulder, g.elbow, outlineWidth, outline, alpha);
    drawBone(c, g.elbow, g.wrist, outlineWidth * .88, outline, alpha);
    drawBone(c, g.shoulder, g.elbow, boneWidth, fill, alpha);
    drawBone(c, g.elbow, g.wrist, boneWidth * .86, fill, alpha);
    drawHand(c, g.wrist, g.hand, pose.hand, g.scale, rigid, alpha);
    drawJoint(c, g.shoulder, g.scale * .046, fill, outline, alpha);
    drawJoint(c, g.elbow, g.scale * .031, '#fff7f2', outline, alpha);
    drawJoint(c, g.wrist, g.scale * .024, '#fff7f2', outline, alpha);
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = outline;
    for (const point of [g.shoulder, g.elbow, g.wrist]) {
      c.beginPath(); c.arc(point.x, point.y, Math.max(2, g.scale * .006), 0, Math.PI * 2); c.fill();
    }
    c.restore();
    return g;
  }
  function drawArcGuide(c, pointName, colour, dash) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    c.save();
    c.strokeStyle = colour;
    c.lineWidth = 2;
    c.setLineDash(dash);
    c.beginPath();
    for (let i = 0; i <= 96; i++) {
      const g = geometry(poseAt(i / 96 * totalFrames()), w, h);
      const point = g[pointName];
      if (i) c.lineTo(point.x, point.y); else c.moveTo(point.x, point.y);
    }
    c.stroke();
    c.restore();
  }
  function drawLabel(c, text, point, colour, align = 'center') {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    c.save();
    c.font = '700 10px Inter, Arial, sans-serif';
    c.textAlign = align;
    const textWidth = c.measureText(text).width;
    const x = clamp(point.x, textWidth / 2 + 12, w - textWidth / 2 - 12);
    const y = clamp(point.y, 22, h - 12);
    c.fillStyle = 'rgba(255,253,250,.94)';
    c.fillRect(x - textWidth / 2 - 7, y - 15, textWidth + 14, 23);
    c.fillStyle = colour;
    c.fillText(text, x, y + 1);
    c.restore();
  }
  function phaseInfo(pose) {
    const p = pose.u;
    const nearLeft = p < .07 || p > .93;
    const nearRight = Math.abs(p - .5) < .07;
    const movingRight = p > .02 && p < .48;
    if (nearLeft || nearRight) return ['DIRECTION CHANGE', 'The upper arm reverses first. The forearm and hand continue briefly.', nearLeft ? 'Left extreme · direction change' : 'Right extreme · direction change'];
    if (movingRight) return ['SUCCESSIVE ACTION', 'The shoulder leads through the arc. The elbow follows, then the hand.', 'Passing through · fastest spacing'];
    return ['FOLLOW-THROUGH', 'The lower arm and hand complete the previous action before catching the shoulder.', 'Return swing · overlapping action'];
  }
  function drawScene() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const pose = poseAt(frame);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#e7f0ed'; ctx.fillRect(0, 0, w, h * .89);
    ctx.fillStyle = '#ece3d2'; ctx.fillRect(0, h * .89, w, h * .11);
    ctx.strokeStyle = '#b8ad92'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, h * .89); ctx.lineTo(w, h * .89); ctx.stroke();
    if ($('#arcToggle').checked) {
      drawArcGuide(ctx, 'elbow', 'rgba(29,110,104,.3)', [5, 7]);
      drawArcGuide(ctx, 'hand', 'rgba(239,91,63,.34)', [8, 8]);
    }
    if ($('#onionToggle').checked) {
      for (const keyFrame of [0, totalFrames() * .25, totalFrames() * .5, totalFrames() * .75]) drawArm(ctx, poseAt(keyFrame), .14);
    }
    if (compare) drawArm(ctx, poseAt(frame, true), .32, true);
    const g = drawArm(ctx, pose, 1, false);
    if ($('#explainToggle').checked) {
      drawLabel(ctx, 'SHOULDER · SOURCE OF ACTION', { x: g.shoulder.x, y: g.shoulder.y - g.scale * .08 }, '#ef5b3f');
      drawLabel(ctx, `ELBOW · ${controls.elbowDelay.value} FRAME DELAY`, { x: g.elbow.x, y: g.elbow.y - g.scale * .07 }, '#1d6e68');
      drawLabel(ctx, `HAND · ${controls.wristDelay.value} FRAME DELAY`, { x: g.hand.x, y: g.hand.y + g.scale * .07 }, '#1d6e68');
    }
    const info = phaseInfo(pose);
    $('#phaseTitle').textContent = info[0];
    $('#phaseNote').textContent = info[1];
    $('#motionLabel').textContent = info[2];
  }
  function drawMap() {
    const w = map.clientWidth;
    const h = map.clientHeight;
    const total = totalFrames();
    const left = 62;
    const right = w - 12;
    const rows = [
      ['UPPER ARM', 24, 0, '#ef5b3f'],
      ['FOREARM', 55, +controls.elbowDelay.value, '#1d6e68'],
      ['HAND', 86, +controls.elbowDelay.value + +controls.wristDelay.value, '#e1a22b']
    ];
    const beats = [['LEFT', 0], ['PASS', total * .25], ['RIGHT', total * .5], ['PASS', total * .75]];
    mctx.clearRect(0, 0, w, h);
    mctx.font = '700 8px Inter, Arial, sans-serif';
    for (const [row, y, delay, colour] of rows) {
      mctx.fillStyle = '#66716e'; mctx.textAlign = 'left'; mctx.fillText(row, 4, y + 3);
      mctx.strokeStyle = '#d9d9d1'; mctx.beginPath(); mctx.moveTo(left, y); mctx.lineTo(right, y); mctx.stroke();
      for (const [name, base] of beats) {
        const beat = (base + delay) % total;
        const x = left + (right - left) * beat / total;
        mctx.fillStyle = colour; mctx.beginPath(); mctx.arc(x, y, 4.5, 0, Math.PI * 2); mctx.fill();
        if (row === 'UPPER ARM') { mctx.fillStyle = '#66716e'; mctx.textAlign = 'center'; mctx.fillText(name, x, y - 11); }
        mctx.fillStyle = '#52605d'; mctx.textAlign = 'center'; mctx.fillText(Math.round(beat) + 1, x, y + 15);
      }
    }
  }
  function draw() { drawScene(); drawMap(); }
  function syncOutputs() {
    $('#amplitudeOut').value = `${controls.amplitude.value}°`;
    $('#durationOut').value = `${(+controls.duration.value / 100).toFixed(2)} s`;
    $('#pendulumOut').value = `${controls.pendulum.value}%`;
    $('#elbowBreakOut').value = `${controls.elbowBreak.value}%`;
    $('#elbowDelayOut').value = `${controls.elbowDelay.value} ${+controls.elbowDelay.value === 1 ? 'frame' : 'frames'}`;
    $('#wristFlexOut').value = `${controls.wristFlex.value}%`;
    $('#wristDelayOut').value = `${controls.wristDelay.value} ${+controls.wristDelay.value === 1 ? 'frame' : 'frames'}`;
    $('#followOut').value = `${controls.follow.value}%`;
    const total = totalFrames();
    frame = ((frame % total) + total) % total;
    $('#scrubber').max = total - 1;
    $('#scrubber').value = Math.floor(frame);
    draw();
  }
  function setFps(value) {
    const progress = frame / totalFrames();
    fps = value;
    frame = progress * totalFrames();
    $('#fpsOut').value = `${value} fps`;
    $$('[data-fps]').forEach(button => button.classList.toggle('active', +button.dataset.fps === value));
    syncOutputs();
  }
  function setSpeed(value) {
    speed = value;
    $('#speedOut').value = value === 1 ? 'Normal' : value === .5 ? '½ speed' : '¼ speed';
    $$('[data-speed]').forEach(button => button.classList.toggle('active', +button.dataset.speed === value));
  }
  function reset() {
    for (const [name, value] of Object.entries(defaults)) controls[name].value = value;
    fps = 12; speed = 1; frame = 0; playing = true; compare = false;
    $('#arcToggle').checked = true; $('#onionToggle').checked = false; $('#explainToggle').checked = false;
    $('#compareBtn').textContent = 'Compare rigid arm'; $('#playBtn').textContent = 'Ⅱ';
    $('#fpsOut').value = '12 fps'; setSpeed(1);
    $$('[data-fps]').forEach(button => button.classList.toggle('active', +button.dataset.fps === 12));
    syncOutputs();
  }
  function tick(now) {
    if (playing) frame = (frame + Math.min(100, now - last) / 1000 * fps * speed) % totalFrames();
    last = now;
    $('#scrubber').value = Math.floor(frame);
    $('#frameReadout').textContent = `Frame ${String(Math.floor(frame) + 1).padStart(2, '0')} / ${totalFrames()}`;
    $('#timeReadout').textContent = `${(frame / fps).toFixed(2)} s`;
    draw();
    requestAnimationFrame(tick);
  }

  Object.values(controls).forEach(control => control.addEventListener('input', syncOutputs));
  $$('[data-fps]').forEach(button => button.addEventListener('click', () => setFps(+button.dataset.fps)));
  $$('[data-speed]').forEach(button => button.addEventListener('click', () => setSpeed(+button.dataset.speed)));
  $('#playBtn').addEventListener('click', () => { playing = !playing; $('#playBtn').textContent = playing ? 'Ⅱ' : '▶'; });
  $('#prevFrame').addEventListener('click', () => { playing = false; frame = (Math.floor(frame) - 1 + totalFrames()) % totalFrames(); $('#playBtn').textContent = '▶'; draw(); });
  $('#nextFrame').addEventListener('click', () => { playing = false; frame = (Math.floor(frame) + 1) % totalFrames(); $('#playBtn').textContent = '▶'; draw(); });
  $('#scrubber').addEventListener('input', event => { playing = false; frame = +event.target.value; $('#playBtn').textContent = '▶'; draw(); });
  $('#compareBtn').addEventListener('click', () => { compare = !compare; $('#compareBtn').textContent = compare ? 'Hide rigid arm' : 'Compare rigid arm'; draw(); });
  $('#fullscreenBtn').addEventListener('click', () => $('#canvasWrap').requestFullscreen?.());
  $('#arcToggle').addEventListener('change', draw);
  $('#onionToggle').addEventListener('change', draw);
  $('#explainToggle').addEventListener('change', () => { if ($('#explainToggle').checked) setSpeed(.25); draw(); });
  $('#resetAll').addEventListener('click', reset);
  $('#resetControls').addEventListener('click', reset);
  $('#newPrompt').addEventListener('click', () => { promptIndex = (promptIndex + 1) % prompts.length; $('#promptText').textContent = prompts[promptIndex]; });
  $$('.week5-tabs .tab').forEach(button => button.addEventListener('click', () => {
    $$('.week5-tabs .tab').forEach(item => item.classList.toggle('active', item === button));
    const [title, copy, exercise] = lessons[button.dataset.focus];
    $('#lessonTitle').textContent = title; $('#lessonCopy').textContent = copy; $('#tryThis').textContent = exercise;
  }));
  $('#week5Question').addEventListener('keydown', event => event.stopPropagation());
  addEventListener('keydown', event => {
    if (event.target.matches('input, textarea')) return;
    if (event.code === 'Space') { event.preventDefault(); $('#playBtn').click(); }
    if (event.key === 'ArrowLeft') $('#prevFrame').click();
    if (event.key === 'ArrowRight') $('#nextFrame').click();
  });
  addEventListener('resize', resize);
  document.addEventListener('fullscreenchange', () => requestAnimationFrame(resize));
  reset();
  resize();
  requestAnimationFrame(tick);
}());
