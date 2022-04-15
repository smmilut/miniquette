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

export const DateUtils = (function build_DateUtils() {
  function padZero(x, n) {
    /* pad n zeroes to the left of x if necessary */
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  function getTimestampStr(d) {
    /* return formatted time string */
    var h = padZero(d.getHours(), 2);
    var m = padZero(d.getMinutes(), 2);
    var s = padZero(d.getSeconds(), 2);
    var ms = padZero(d.getMilliseconds(), 3);
    return h + ":" + m + ":" + s + "." + ms;
  }

  return {
    getTimestampStr: getTimestampStr
  };

})();
