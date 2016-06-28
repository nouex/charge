"use strict";

var debug = require("debug")("ch-arge:index.js");
var inherits = require("util").inherits;

require("./bootstrap.js");
var types = require("./types.js");
var newType = require("./bootstrap.js").newType;

inherits(ArgError, Error);
// ArgError definition
function ArgError () {
  if (!(this instanceof ArgError)) return ArgError.apply(this, arguments);
  this.name = "ArgError";
}

/**
  * @api public
  * @param {Mixed} arg
  * @param {Function|String} arg1...[argn]
  * @return {Boolean} ret
  */
module.exports = function (arg) {
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
  var fn, reRes, res, lastArg, lastArgBool, shouldThrow, exp, _arguments;

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

        if ((reRes = types[type][0](exp)) && !(~already.indexOf(type))) {
          fn = (function () {
            var check, negated, negLength;

            check = types[type][1];
            negLength = reRes[1].length;

            negated = negLength ? !!(negLength % 2) : false;
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

/**
  * @api public
  * @param {String} [name]
  * @param {Function} checkFn
  * @param {String} ...
  * @return {void}
  */
module.exports.newType = function (name, checkFn) {
  if ("string" !== typeof name) {
    checkFn = name;
    name = "type" + idCount();
    sliceAt = 1;
  } else {
    sliceAt = 2;
  }

  aliases = [].slice.call(arguments, sliceAt);

  var aliases, sliceAt, taken;

  if (false !== (taken = aliasesTaken(aliases)))
    throw new Error("alias '" + taken + "' is taken");
  newType(name, checkFn, aliases);
};

var id = 1;
function idCount () {
  return id++;
}

// return false if _any_ one of them is in use
function aliasesTaken (arr) {
  var taken
  for (var ind in arr) {
    if (!arr.hasOwnProperty(ind)) continue;
    if (aliasTaken(arr[ind]) !== false) return arr[ind];
  }
  return false;
}

function aliasTaken () {
  for (var name in types) {
    if (!types.hasOwnProperty(name)) continue;

    debug("aliasTaken() name %s, types[name] %j", name, types[name]);
    if (types[name][0](arguments[0])) return name;
  }

  return false;
}


module.exports.ArgError = ArgError;
