(function () {
  'use strict';

  function applyWeek2Theory() {
    document.querySelectorAll('.principle-tabs .tab').forEach(tab => tab.classList.toggle('active', tab.id === 'week2ArcsTab'));
    document.getElementById('lessonTitle').textContent = 'Arcs guide the movement. Staging guides the eye.';
    document.getElementById('lessonCopy').textContent = 'Most organic action travels along a curved path. The arc should make direction, momentum and the gradual loss of energy easy to read. Staging arranges the ball, ground, path and empty space so the audience notices the important action without confusion.';
    document.getElementById('tryThis').innerHTML = 'Drag the <b>first apex</b> and <b>end</b> handles. Keep every contact on the ground, make each bounce smaller, and leave clear space in the direction of travel. Then hide the path and check that the action still reads.';
    document.getElementById('sourceNote').textContent = 'Further reading: Richard Williams, path of action and arcs (PDF pp. 96–98); Preston Blair, paths of action and staging/composition (PDF pp. 125 and 156).';
    document.getElementById('stageNote').innerHTML = '<strong>Arcs &amp; staging</strong><span>A clear path shows momentum. Clear staging makes the changing bounces easy to read.</span>';
    document.getElementById('promptText').textContent = 'How do the decreasing arcs and the space ahead of the ball help communicate momentum?';
  }

  function resetWeek2Activity() {
    loadArcStagingDefaults();
    document.getElementById('advancedControls').open = true;
    document.getElementById('sourceAnswer').classList.add('hidden');
    document.getElementById('controlsCard').scrollTop = 0;
    applyWeek2Theory();
  }

  resetWeek2Activity();
  document.getElementById('resetAll').onclick = resetWeek2Activity;
  document.getElementById('resetFocus').onclick = resetWeek2Activity;

  const arcButton = document.querySelector('[data-path="arc"]');
  const openArcActivity = arcButton.onclick;
  arcButton.onclick = () => {
    openArcActivity();
    applyWeek2Theory();
  };

  document.getElementById('week2ArcsTab').onclick = () => {
    setPath('arc');
    document.getElementById('advancedControls').open = true;
    applyWeek2Theory();
  };
}());
