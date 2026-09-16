// main — bootstraps the app
window.addEventListener('DOMContentLoaded', () => {
  AudioManager.init();
  InputManager.init([CONFIG.DEFAULT_CONTROLS[0], CONFIG.DEFAULT_CONTROLS[1]]);
  Assets.init();
  UI.init();
});
