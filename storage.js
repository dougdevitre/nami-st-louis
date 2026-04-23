/**
 * Storage abstraction for NAMI Community Hub
 * Uses localStorage for GitHub Pages deployment.
 * All shared community data is prefixed with 'nami_'.
 * Designed to be swappable with a real backend later.
 */
const Store = {
  _prefix: "nami_",

  _key(name) {
    return this._prefix + name;
  },

  get(key) {
    try {
      const raw = localStorage.getItem(this._key(key));
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  delete(key) {
    localStorage.removeItem(this._key(key));
  },

  list(prefix) {
    const full = this._key(prefix || "");
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith(full)) {
        keys.push(k.replace(this._prefix, ""));
      }
    }
    return keys;
  },

  // Convenience: get array, push item, save
  push(key, item) {
    const arr = this.get(key) || [];
    arr.push(item);
    this.set(key, arr);
    return arr;
  },

  // Remove item from array by id
  removeById(key, id) {
    const arr = this.get(key) || [];
    const filtered = arr.filter((item) => item.id !== id);
    this.set(key, filtered);
    return filtered;
  },

  // Generate a simple unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  },
};
