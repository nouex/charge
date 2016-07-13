"use strict";

var cp = require("child_process");
var path = require("path");
var c;

var fn = require.resolve("../tools/table.js");

describe ("...", function () {
  it ("...", function () {
    var env = process.env,
        opts = {env:env};

    // So we don't repeat debug() logs in child that were logged in parent
    // we reset DEBUG.
    env.DEBUG = "";

    fn = "" + fn + "";
    c = cp.spawnSync("node", [fn, "--compare"], opts);
    console.log("child stdout: " + c.stdout);
    console.log("child stderr: " + c.stderr);
    if (c.error) fail("child errored with:", c.error.toString());
    else if (+c.status === 111) {
      console.log("table update needed");
      // relay the status code
      // NOTE: Travis-CI shows that it exited with 1, not 111
      process.exit(111);
    } else if (+c.status !== 0) {
      fail("child exited with status code: " + c.status);
    }
  });

});
