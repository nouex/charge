"use strict";

var types = require("../lib/types.js");

describe("check functions", function () {// TODO counter-test
  it("pass", function () {
    var goodArgs, badArgs, nextArgs, checkFn;

    goodArgs = {
      "Object": [
        {},
        [],
        Object.create(Object.prototype)
      ],
      "Array": [
        [],
        new Array,
        Array(10)
      ],
      "Function": [
        Function,
        function () {},
        Object
      ],
      "RegExp": [
        /blah/,
        new RegExp,
        RegExp(),
        Object.create(RegExp.prototype)
      ],
      "Date": [
        new Date,
        Object.create(Date.prototype)
      ],
      "Symbol": [
        Symbol()
      ],
      "String": [
        new String(),
        Object.create(String.prototype)
      ],
      "Number": [
        new Number(),
        Object.create(Object.getPrototypeOf(4))
      ],
      "Boolean": [
        new Boolean(),
        Object.create(Boolean.prototype)
      ],
      "null": [
        null
      ],
      "undefined": [
        undefined,
        root.undefined
      ],
      "string": [
        "blah",
        "",
        String(),
        String(144)
      ],
      "number": [
        18,
        18.8,
        Infinity
      ],
      "integer": [
        18,
        -18
      ],
      "float": [
        18.5,
        -18.5,
        Infinity,
        -Infinity
      ],
      "boolean": [
        true,
        false,
        true,
        Boolean(0),
        Boolean(""),
        Boolean(new Boolean)
      ]
    };

    badArgs = {
      "Object": [
        Object.create(null),
        null
      ],
      "Array": [
        {},
        null,
        undefined,
        Object.create(Array.prototype)
      ],
      "Function": [
        {},
        [],
        Object.create(Function.prototype),
        Function.prototype
      ],
      "RegExp": [
        {},
        []
      ],
      "Date": [
        [],
        {},
        Date()// -> string format
      ],
      "String": [
        String(),
        ""
      ],
      "Number": [
        Number(),
        4,
        4.4,
        Infinity,
        -Infinity,
        NaN
      ],
      "Boolean": [
        true,
        false,
        Boolean(0),
        Boolean("true")
      ],
      "null": [
        {},
        undefined,
        "",
        0
      ],
      "undefined": [
        null,
        0,
        "",
        false
      ],
      "string": [
        new String,
        Object.create(Object.getPrototypeOf(""))
      ],
      "number": [
        new Number,
        Object.create(Number.prototype),
        NaN
      ],
      "integer": [
        3.3,
        NaN,
        Infinity
      ],
      "float": [
        3,
        NaN
      ],
      "boolean": [
        new Boolean(0),
        Infinity,
        0,
        NaN,
        ""
      ]
    };

    // keeping it DRY
    for (var type in types) {
      if (!types.hasOwnProperty(type)) continue;

      checkFn = types[type][1];
      nextArgs = goodArgs[type];
      for (var arg in nextArgs) {
        if (!nextArgs.hasOwnProperty(arg)) continue;

        debug("checks", true, type, checkFn, nextArgs[arg]);
        expect(checkFn(nextArgs[arg])).toBe(true);
      }

      nextArgs = badArgs[type];
      for (var arg in nextArgs) {
        if (!nextArgs.hasOwnProperty(arg)) continue;

        debug("checks", false, type, checkFn, nextArgs[arg]);
        expect(checkFn(nextArgs[arg])).toBe(false);
      }
    }
  });
});

describe("type regexes", function () {
  it ("work approprately", function () {
    var goodStrs = {
      "Object": ["Object", "object", "Obj", "obj"],
      "Array": ["Array", "array", "Arr", "arr"],
      "Function": ["Function", "function", "Func", "func", "Fn", "fn"],
      "RegExp": ["RegExp", "regExp", "regexp", "regExp", "regex"],
      "Date": ["Date", "date"],
      "Symbol": ["Symbol", "symbol", "Sym", "sym"],
      "String": ["String", "Str"],
      "Number": ["Number", "Num"],
      "Boolean": ["Boolean", "Bool"],
      "null": ["null"],
      "undefined": ["undefined"],
      "string": ["string", "str"],
      "number": ["number", "num"],
      "integer": ["integer", "int"],
      "float": ["float", "flt"],
      "boolean": ["bool", "boolean"]
    };

    var badStrs = {
      "Object": ["", "o"]
    };

    var strs, str, reFn;

    // keeping it DRY
    for (var type in types) {
      if (!types.hasOwnProperty(type)) continue;

      reFn = types[type][0];
      strs = goodStrs[type];

      for (var ind in strs) {
        if (!strs.hasOwnProperty(ind)) continue;

        str = strs[ind];
        debug("regexp", true, "<void>", reFn, str);
        expect(reFn(str) >= 0).toBe(true);// 0 - Infinity
      }

      strs = badStrs[type];
      for (var ind in strs) {
        if (!strs.hasOwnProperty(ind)) continue;

        str = strs[ind];
        debug("regexp", false, "<void>", reFn, str);
        expect(reFn(str)).toBeLessThan(0);// -1
      }
    }
  });
});

function debug (section, goodArg, expType, checkFn, subj) {
  var util = require("util");
  if (process.env.no_debug) return;
  var com = ",",
      crlf = "\r\n",
      sp = "\u0020",
      arrow = "->",
      subjString,
      subjTypeof = typeof subj,
      checkFnRet = checkFn(subj);

      try {
        subjString = null != subj && subj.toString !== undefined ?
                      subj.toString() :
                      util.inspect(subj, {depth: 1, colors: false});
      } catch (e) {
        subjString = "";
      }

  console.error(
    section + crlf +
    (goodArg ? "good" : "bad") + crlf +
    "type" + sp + arrow + sp + expType + crlf +
    "fn" + sp + arrow + sp + checkFn.name + crlf +
    "subj as string" + sp + arrow + sp + subjString + crlf +
    "typeof subj" + sp + arrow + sp + typeof subj + crlf +
    "fn result" + sp + arrow + sp + checkFn(subj) + crlf
    + crlf
  );
}
