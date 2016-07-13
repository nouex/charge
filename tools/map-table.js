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

function mapTable (type, aliases) {
  var aliasesConcat = "";

  curry += 1;
  table.addEntry(1, curry, type);
  aliases.forEach(function (alias, ind) {
    aliasesConcat += alias + "</br>";
  }, null);
  table.addEntry(2, curry, aliasesConcat);
}

function initTable () {
  table.addHeader("Type", "left");
  table.addHeader("Aliases", "left");
}

function saveTable () {
  module.exports.table = table;
}

function NOP () {}
