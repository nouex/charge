"use strict";

var types = require("../lib/types.js");
var assert = require("assert");

describe("check functions", function () {// TODO counter-test
  it("pass", function () {
    var args = [
      {},
      [],
      Function,
      /blah/,
      new Date,
      Symbol(),
      new String(),
      new Number(),
      new Boolean(),
      null,
      undefined,
      "blah",
      18,
      18,
      18.5,
      true
    ];
    var nextArg, counter = 0;

    assert.equal(args.length, 16);
    // keeping it DRY
    for (var type in types) {
      if (!types.hasOwnProperty(type)) continue;

      // console.log(counter++, args[0]);
      nextArg = args.shift();
      expect(types[type][1](nextArg)).toBe(true);
    }
  });
});

describe("type regexes", function () {
  it ("work approprately", function () {
    var counter = -1;
    var args = [
      ["Object", "object", "Obj", "obj"],
      ["Array", "array", "Arr", "arr"],
      ["Function", "function", "Func", "func", "Fn", "fn"],
      ["RegExp", "regExp", "regexp", "regExp", "regex"],
      ["Date", "date"],
      ["Symbol", "symbol", "Sym", "sym"],
      ["String", "Str"],
      ["Number", "Num"],
      ["Boolean", "Bool"],
      ["null"],
      ["undefined"],
      ["string", "str"],
      ["number", "num"],
      ["integer", "int"],
      ["float", "flt"],
      ["bool", "boolean"]
    ];

    assert.equal(args.length, 16);

    // keeping it DRY
    for (var type in types) {
      if (!types.hasOwnProperty(type)) continue;

      counter += 1;
      args.shift().forEach(function (nextArg, ind) {
        expect(types[type][0].test(nextArg)).toBe(true, type,
          "@args[" + counter + "][" + ind + "]");
      }, null);
    }
  });
});
