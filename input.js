// InputManager — tracks keydown/up state and supports remapping + rebind capture
const InputManager = {
  keys: Object.create(null),
  playersControls: [],
  _rebindCallback: null,

  init(playersControls) {
    this.playersControls = playersControls;
    window.addEventListener('keydown', (e) => this._onKeyDown(e));
    window.addEventListener('keyup', (e) => this._onKeyUp(e));
  },

  setControls(playersControls) {
    this.playersControls = playersControls;
  },

  _onKeyDown(e) {
    const key = e.key.toLowerCase();
    if (this._rebindCallback) {
      e.preventDefault();
      const cb = this._rebindCallback;
      this._rebindCallback = null;
      cb(key);
      return;
    }
    // don't hijack typing in text fields
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    // prevent page scroll for game keys
    if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'enter'].includes(key)) {
      e.preventDefault();
    }
    this.keys[key] = true;
  },

  _onKeyUp(e) {
    const tag = e.target && e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const key = e.key.toLowerCase();
    this.keys[key] = false;
  },

  isDown(key) {
    if (!key) return false;
    return !!this.keys[key.toLowerCase()];
  },

  // returns { left, right, shoot } booleans for player index
  getPlayerState(index) {
    const c = this.playersControls[index];
    if (!c) return { left: false, right: false, shoot: false };
    return {
      left: this.isDown(c.left),
      right: this.isDown(c.right),
      shoot: this.isDown(c.shoot) || (c.shootAlt && this.isDown(c.shootAlt)),
    };
  },

  // capture next keypress for remapping; calls callback(keyName)
  captureNextKey(callback) {
    this._rebindCallback = callback;
  },

  clearAll() {
    this.keys = Object.create(null);
  },
};
