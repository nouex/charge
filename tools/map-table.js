"use strict";

var table, curry = 0, fs, ghmd_table;

if (/ch-arge:tools\/table.js/i.test(process.env.DEBUG || "")) {
  module.exports = {
    mapTable: mapTable,
    saveTable: saveTable,
    initTable: initTable,
    table: null
  };

  // lazy load
  ghmd_table = require("ghmd-table");
  table = new ghmd_table.Table;
  fs = require("fs");
} else {
  module.exports = {
    mapTable: NOP,
    saveTable: NOP,
    initTable: NOP,
    table: null
  };
}

var headers = ["Type", "Aliases"];

function mapTable (type, aliases) {
  var aliasesConcat = "", rowLen = type.length,
      needsBr = false, maxRowLen = Math.max(headers[1].length, 25);

  curry += 1;
  table.addEntry(1, curry, type);
  aliases.forEach(function (alias, ind) {
    rowLen += alias.length;
    if (rowLen > maxRowLen) needsBr = true;
    // consider space
    !needsBr ? rowLen += 1 : void 0;
    if (rowLen > maxRowLen) needsBr = true;
    aliasesConcat += alias + (needsBr ? "</br>" : "\u0020");
    if (needsBr) {
      needsBr = false;
      rowLen = 0;
    }
  }, null);
  table.addEntry(2, curry, aliasesConcat);
}

function initTable () {
  table.addHeader(headers[0], "left");
  table.addHeader(headers[1], "left");
}

function saveTable () {
  module.exports.table = table;
}

function NOP () {}
