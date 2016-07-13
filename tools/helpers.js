"use strict";

/**
  * Adds namespace to `process.env.DEBUG` if not there already.
  * NOTE: namespace is typed to RegExp implicitly
  */
exports.setMode =
function setMode (namespace) {
  var DEBUG = process.env.DEBUG,
      regexp = new RegExp(escape(namespace), "i"),
      pre;

  if (undefined === DEBUG) throw new Error("`process.env.DEBUG` => undefined");
  if (regexp.test(DEBUG)) return false;
  else {
    DEBUG.length ? pre = "," : pre = "";
    process.env.DEBUG = DEBUG += pre + namespace;
    return true;
  }

  function escape (string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}
