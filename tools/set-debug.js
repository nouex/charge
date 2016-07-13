"use strict";

var assert = require("assert");

/**
  * Assuming npm debug @ 2.2.0
  */

process.env.DEBUG === undefined ? process.env.DEBUG = "" : void 0;
process.env.DEBUG_COLORS === undefined ?
  process.env.DEBUG_COLORS = "yes" : void 0;
assert.strictEqual(true, setMode("ch-arge:lib/bootstrap.js"));
assert.strictEqual(true, setMode("ch-arge:lib/index.js"));
// NOTE currently this one isn't used at all
assert.strictEqual(true, setMode("ch-arge:lib/types.js"));
// NOTE not used in par process (is set for child in test/readme-table.js tho)
// but when it's set debug() will log in the first color again b/c it's been
// loaded again (i think cyan)
// assert.strictEqual(true, setMode("ch-arge:tools/table.js"));

/**
  * Adds namespace to `process.env.DEBUG` if not there already.
  * NOTE: namespace is typed to RegExp implicitly
  */
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
