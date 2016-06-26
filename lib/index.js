"use strict";

var debug;
try {
  debug = require("debug")("ch-arge:index.js");
} catch (e) {
  debug = function(){};
}

var types = require("./types.js");
var inherits = require("util").inherits;

inherits(ArgError, Error);
// ArgError definition
function ArgError () {
  if (!(this instanceof ArgError)) return ArgError.apply(this, arguments);
  this.name = "ArgError";
}

// main

module.exports = function (arg, expected, shouldThrow) {
  shouldThrow = "2" in arguments ? !!shouldThrow : true;

  var checkQueue = [], already = [];
  var fn, at, res;

  // constructor
  if (typeof expected === "function") {
    res = arg instanceof expected &&
    Object.getPrototypeOf(arg) === expected.prototype;

    if (shouldThrow && res === false) throw new ArgError("Invalid arg: " + arg);
    else return res;

  } else if (typeof expected !== "string") {

    throw new TypeError("`expected` must be a construtor or string");

  } else { // fill checkQueue

    debug("main: in string parsing section");

    for (var type in types) {
      if (!types.hasOwnProperty(type)) continue;

      if (~(at = types[type][0](expected)) && !(~already.indexOf(type))) {
        fn = (function () {
          var check, negated;

          check = types[type][1];

          (at > 0) ? expected[at-1] === "!" ? negated = true : negated = false
           : negated = false;
           debug("negated ", negated);

          return function () {
            return negated ? !check(arg) : check(arg);
          };
        }());

        already.push(type);
        checkQueue.push(fn);
      }
    }

    debug("checkQueue: " + checkQueue);
    debug("already: " + already);
    res = checkQueue.some(function(fn) {
      return fn();
    });
    debug("res " + res);

    if (shouldThrow && false === res) throw new ArgError("Invalid arg: " + arg);
    else return res;
  }
};

module.exports.ArgError = ArgError;
