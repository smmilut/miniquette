const dictProto = {
  init() {
    this.content = Object.create(null);
  },
  get(key) {
    return this.content[key];
  },
  set(key, value) {
    this.content[key] = value;
  },
};

export function newDict() {
  const d = Object.create(dictProto);
  d.init();
  return d;
}

/**
 * @param {*} x 
 * @param {Number} numZeros 
 * @returns {String} padded with "0"
 */
export function padZeros(x, numZeros) {
  return x.toString().padStart(numZeros, "0");
}

/** return formatted time string */
export function getTimestampStr(d) {
  const h = padZeros(d.getHours(), 2);
  const m = padZeros(d.getMinutes(), 2);
  const s = padZeros(d.getSeconds(), 2);
  const ms = padZeros(d.getMilliseconds(), 3);
  return `${h}:${m}:${s}.${ms}`;
}
export function getUrlParameter(paramKey) {
  const urlParameters = new URLSearchParams(window.location.search);
  return urlParameters.get(paramKey);
}