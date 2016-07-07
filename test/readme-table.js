"use strict";

var cp = require("child_process");
var path = require("path");
var c;

var fn = require.resolve("../tools/table.js");

describe ("...", function () {
  it ("...", function () {
    try {
      c = cp.execSync(
        "node \"" + fn + "\" --compare"
      );
    } catch (_) {
      fail("either debug state was not set in boostrap.js or table needs update, run `table.js --update` manually")


    }
  });

});
