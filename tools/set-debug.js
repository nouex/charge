"use strict";

/**
  * Assuming we use npm debug @ 2.2.0.
  * Will only set debug namespaces for lib/
  */
  
var assert = require("assert");
var setMode = require("./helpers.js").setMode;

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
