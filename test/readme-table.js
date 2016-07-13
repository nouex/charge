"use strict";

var cp = require("child_process");
var path = require("path");
var c;

var fn = require.resolve("../tools/table.js");

describe ("...", function () {
  it ("...", function () {
    var env = process.env,
        opts = {env:env};

    env.DEBUG = "ch-arge:tools/table.js";

    fn = "" + fn + "";
    c = cp.spawnSync("node", [fn, "--compare"], opts);
    console.log("child stdout: " + c.stdout);
    console.log("child stderr: " + c.stderr);
    if (c.error) fail("child errored with:", c.error.toString());
    if (+c.status !== 0) {
      console.log("table update needed");process.exit(1);
    }
  });

});
