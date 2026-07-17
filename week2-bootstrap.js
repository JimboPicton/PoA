(function () {
  'use strict';

  function resetWeek2Activity() {
    loadArcStagingDefaults();
    document.getElementById('advancedControls').open = true;
    document.getElementById('sourceAnswer').classList.add('hidden');
    document.getElementById('controlsCard').scrollTop = 0;
  }

  resetWeek2Activity();
  document.getElementById('resetAll').onclick = resetWeek2Activity;
  document.getElementById('resetFocus').onclick = resetWeek2Activity;
}());
