"use strict";

// set debug namespace
process.env.DEBUG === undefined ? process.env.DEBUG = "" : void 0;
process.env.DEBUG_COLORS === undefined ?
  process.env.DEBUG_COLORS = "yes" : void 0;
var setMode = require("./helpers.js").setMode;
setMode("ch-arge:tools/table.js");

// imports
var fs = require("fs");
var ghmd_table = require("ghmd-table");
var mapTable = require("./map-table.js");
var debug = require("debug")("ch-arge:tools/table.js");

var tableSeparator = "<!--0000-->\r\n";
var targFile = require.resolve("../README.md");

switch (process.argv[2]) {
  case "--update":
    compare(false, true);
    freemem();
    break;

  case "--compare":
    // this is the part that's done after we set debug env
    compare(true, false);
    freemem();
    break;

  default:
    throw new Error("Unknown option:, " + process.argv[2]);
}

/**
  * @param {Boolean} abrupt If we should terminate.
  * @param {Boolean} _update If we should update when differences exist.
  * @return {Boolean} Returns only if abrupt is false.
  */
function compare (abrupt, _update) {
  var convert = ghmd_table.convert;
  var table = mapTable.table;
  var info;

  // to compare, it is necessary that bootstrap.js has loaded so we can acces
  // table which is exposed by it
  if (table === null) {
    // FIXME should we log() or debug() ???
    debug("compare(), `mapTable` inactive, loading 'bootstrap.js'");
    require("../lib/bootstrap.js");
    table = mapTable.table;
    if (table === null) throw new Error("Unexpected table -> null");
  }
  var actualTable, expectedTable;

  info = extractFromFile(targFile, /<!--0000-->(?:\n|\r\n||\r|\n\r)/);
  actualTable = info[1];
  expectedTable = convert(table);

  if (compare2(actualTable, expectedTable)) {
        if (_update) {
          log("table: no update necessary, update aborted");
        }
        else log("table: no recent update");
  } else {
    if (!_update) {
      log("table needs update, run `table.js --update` manually");
      process.exit(1);
    } else
      update(info[0], expectedTable);
      log("table: updated");
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

  return [readme, table];
}

/**
  *@param {}
  */
function update (readme, table) {
  var table = tableSeparator + table + tableSeparator,
      write, three;

  three = readme.split(tableSeparator);
  write = three[0] + table + three[2];
  fs.writeFile(targFile, write, "utf8");
}

/**
  * Set to null so mem is freed on next garbace collection.
  */
function freemem() {
  mapTable.table = null;
}

function log () {
  process.stdout.write(arguments[0] + "\r\n");
}
