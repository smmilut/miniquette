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
