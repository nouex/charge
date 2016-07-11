"use strict";
// NOTE a sneaky bug is when lib/bootstrap.js executes before we set the debug
// env below, make sure we execute before the initial require("./bootstrap.js").
// As of now, we do this in helpers of jasmine.json

typeof process.env.DEBUG === "string" ?
  process.env.DEBUG += ",ch-arge:table.js" :
  process.env.DEBUG = "ch-arge:table.js";
  typeof process.env.DEBUG === "string" ?
    process.env.DEBUG += ",ch-arge:bootstrap.js" :
    process.env.DEBUG = "ch-arge:bootstrap.js";
process.env.DEBUG_COLORS = "true";

var fs = require("fs");
var path = require("path");
var tableSeparator = "<!--0000-->\r\n";
var targFile = require.resolve("../README.md");
var ghmd_table = require("ghmd-table");
var mapTable = require("./map-table.js");
var debug = require("debug")("ch-arge:table.js");

switch (process.argv[2]) {
  case "--update":
    compare(false, true);
    //freemem();
    break;

  case "--compare":
    // this is the part that's done after we set debug env
    compare(true, false);
    //freemem();
    break;

  case undefined:
    // NOP since this will be ran again by jasmine we just need to set debug
    // before any script reguires bootstrap.js
    break;

}
console.log("'ch-arge:table.js' debug mode set");

/**
  * @param {Boolean} abrupt If we should terminate.
  * @return {Boolean} If abrupt is false.
  */
function compare (abrupt, _update) {
  var convert = ghmd_table.convert;
  var table = mapTable.table;
  var info, debugEnabled;

  if (table === null) {
    debugEnabled = debug.enabled;
    debug(
          "compare(), mapTable inactive, loading 'bootstrap.js' %s",
          debugEnabled ? "in debug mode" : ""
        );
    if (debugEnabled)
    typeof process.env.DEBUG === "string" ?
      process.env.DEBUG += ",ch-arge:bootstrap.js" :
      process.env.DEBUG = "ch-arge:bootstrap.js";
    require("../lib/bootstrap.js");
    table = mapTable.table;
    debug("table loaded:", !!table);
    if (table === null) throw new Error("Unexpected table -> null");
  }
  var actualTable, expectedTable;

  info = extractFromFile(targFile, /<!--0000-->(?:\n|\r\n||\r|\n\r)/);
  actualTable = info[1];
  expectedTable = convert(table);

  if (compare2(actualTable, expectedTable)) {
    debug("acutalTable === expectedTable => true");
        if (_update) {
          console.log("table: no update necessary, update aborted");
        }
        else console.log("table: no recent update");
  } else {
    debug("acutalTable === expectedTable => false");
    debug("actualTable", actualTable);
    debug("expectedTable", expectedTable);
    if (!_update) {
      console.log("table needs update, run `table.js --update` manually");
      process.exit(1);
    } else
      update(info[0], expectedTable, info[2], info[3]);
      console.log("table: updated");
  }

  function compare2 ($1, $2) {
    var i, j, last = false;
    var _1, _2, opp = null;

    i = j = 0;

    for (; i < $1.length; i++, j++) {
      _1 = $1[i];
      _2 = $2[j];

      if (i === ($1.length -1)) last = true;

      // A NL (new line) is valid if it's CR|LF|CRLF|LFCR
      // Without this flexible NL compare, travis-ci fails b/c (I'm surmising)
      // travis changes our (CRLF) to (CR, or LF).  We are aware that git's def
      // behavior when commiting is to commit with LF instead of CRLF but when
      // it is checked out, it replaces them with the intended NL, so I dont
      // think it's a git err but a travis err.
      if (_1 === "\n" || _1 === "\r") {
        opp = opposite(_1);
        if ($1[i+1] === opp) i++;
        opp = null;
        if (i === ($1.length -1)) last = true;

        if (_2 !== "\n" && _2 !== "\r") {
          return false;
        } else {
          opp = opposite(_2);
          if ($2[j+1] === opp) j++;
          opp = null;
          if (last && j !== $2.length -1) {
            return false;
          }
        }
      } else {
        if (_1 !== _2) {
          return false;
        }
        // $2 has matched all along but keeps going
        if (last && j !== $2.length -1) {
          return false;
        }
      }
    }

    return true;

    function opposite (char) {
      return char === "\n" ?
          "\r" :
          "\n";
    }
  }
}

/**
  * @param {String} filname
  * @param {String|RegExp} sep
  * @return {Array} ret readme, Table and pair of indecees it sliced from
  */
function extractFromFile(filename, sep) {
  var readme, table, i1, i2, ret = [];

  readme = fs.readFileSync(filename, "utf8");
  table = readme.split(sep)[1];
  debug("extractFromFile(): readme file len: %d", readme.length);
  debug("readme contents: %s", readme);
  debug("extractFromFile(): index of sep: %d", i1);
  debug("extractFromFile(): last index of sep: %d", i2);
  debug("extractFromFile(): table len: %d", table.length);

  return [readme, table];
}

/**
  *@param {}
  */
function update (readme, table, i1, i2) {
  var table = tableSeparator + table + tableSeparator,
      write, three;

  three = readme.split(tableSeparator);
  write = three[0] + table + three[2];
  fs.writeFile(targFile, write, "utf8");
}

function freemem() {
  mapTable.table = null;
}
