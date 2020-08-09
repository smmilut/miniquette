/* jshint module:true */
/*
 * Utilities module
 */

export const createTerminal = function createTerminalFunc(el) {
  return {
    element : el,
    write : function(content) {
      this.element.innerHTML += "<p class=\"termentry\"># " + content + "</p>";
    }
  };
};


export const CssUtils = (function build_CssUtils() {
  function restart_animation(el) {
    /* restart CSS animation */
    el.style.animation = 'none';
    el.offsetHeight; // magic to trigger reflow
    el.style.animation = null;  // must be null, not undefined, because magic
  }
  
  return {
    restart_animation : restart_animation
  };
})();

export const DateUtils = (function build_DateUtils() {
  function padZero(x, n) {
    /* pad n zeroes to the left of x if necessary */
    while (x.toString().length < n) {
      x = "0" + x;
    }
    return x;
  }

  function getTimestampStr(d) {
    var h = padZero(d.getHours(), 2);
    var m = padZero(d.getMinutes(), 2);
    var s = padZero(d.getSeconds(), 2);
    var ms = padZero(d.getMilliseconds(), 3);
    return h + ":" + m + ":" + s + "." + ms;
  }
  
  return {
    getTimestampStr : getTimestampStr
  };

})();
