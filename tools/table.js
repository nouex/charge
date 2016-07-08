"use strict";
// NOTE a sneaky bug is when lib/bootstrap.js executes before we set the debug
// env below, make sure we execute before the initial require("./bootstrap.js").
// As of now, we do this in helpers of jasmine.json

typeof process.env.DEBUG === "string" ?
  process.env.DEBUG += ",ch-arge:table.js" :
  process.env.DEBUG = "ch-arge:table.js";

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
  var info;

  if (table === null) {
    require("../lib/bootstrap.js");
    table = mapTable.table;
    if (table === null) throw new Error("Unexpected table -> null");
  }
  var actualTable, expectedTable;

  info = extractFromFile(targFile, "<!--0000-->\r\n");
  actualTable = info[1];
  expectedTable = convert(table);

  if (actualTable === expectedTable) {
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
}

/**
  * @param {String} filname
  * @param {String} sep
  * @return {Array} ret readme, Table and pair of indecees it sliced from
  */
function extractFromFile(filename, sep) {
  var readme, table, i1, i2, ret = [];

  readme = fs.readFileSync(filename, "utf8");
  i1 = readme.indexOf(sep);
  i2 = readme.lastIndexOf(sep);
  table = readme.slice(i1 + sep.length, i2);

  return [readme, table, i1, i2];
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
