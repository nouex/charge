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

module.exports = function (arg, expected) {
  if ("0" in arguments === false) throw new TypeError("Requires an actual")
  // NOTE we are using `arguments` in strict mode, so none of that magic occurs
  lastArg = arguments[arguments.length -1];
  lastArgBool = lastArg === true || lastArg === false;
  if (lastArgBool && arguments.length === 2 || arguments.length === 1)
    throw new TypeError("No type seen");
  shouldThrow = lastArg === false ? false : true;
  _arguments = lastArgBool ?
              [].slice.call(arguments, 0, arguments.length -1) :
              [].slice.call(arguments, 0, arguments.length);

  var checkQueue = [], already = [], alreadyC = [];
  var fn, at, res, lastArg, lastArgBool, shouldThrow, exp, _arguments;

  for (var i = 1; i < _arguments.length; i++) {
    exp = _arguments[i];

    if (typeof exp === "function") {
      debug("constructor already in", !!(~alreadyC.indexOf(exp)));
      if (!(~alreadyC.indexOf(exp))) {
        checkQueue.push(function () {
          var exp2 = exp;
          return function () {
            debug("instanceof Const", arg, exp2);
            return arg instanceof exp2;
          };
        }());
        alreadyC.push(exp);
      }
    } else if (typeof exp !== "string") {
      throw new TypeError("`expected` must be a constructor or string");
    } else {
      for (var type in types) {
        if (!types.hasOwnProperty(type)) continue;

        if (~(at = types[type][0](exp)) && !(~already.indexOf(type))) {
          fn = (function () {
            var check, negated;

            check = types[type][1];

            (at > 0) ? exp[at-1] === "!" ? negated = true : negated = false
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
};

module.exports.ArgError = ArgError;
