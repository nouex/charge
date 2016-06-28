"use strict";

var types = require("./types.js");
var debug = require("debug")("ch-arge:bootstrap.js");
var debugMode = process.env.DEBUG ?
                false :
                !!(~process.env.DEBUG.search(/ch-arge/i));

exports.newType = newType;
exports.mkRegExp = mkRegExp;

newType("Object", checkObject, ["Object", "object", "Obj", "obj"]);
newType("Array", checkArray, ["Array", "array", "Arr", "arr"]);
newType("Function", checkFunction, ["Function", "function", "Fn", "fn", "Func",
        "func"]);
newType("RegExp", checkRegExp, ["RegExp", "regexp", "regExp", "Regexp"]);
newType("Date", checkDate, ["Date", "date"]);
newType("Symbol", checkSymbol, ["Symbol", "symbol", "Sym", "sym"]);
newType("String", checkString, ["String", "Str"]);
newType("Number", checkNumber, ["Number", "Num"]);
newType("Boolean", checkBoolean, ["Boolean", "Bool"]);
newType("Null", checkNull, ["null"]);
newType("undefined", checkUndefined, ["undefined"]);
newType("string", checkstring, ["string", "str"]);
newType("number", checknumber, ["number", "num"]);
newType("integer", checkInteger, ["integer", "int"]);
newType("float", checkFloat, ["float", "flt"]);
newType("boolean", checkboolean, ["boolean", "bool"]);


/* type checks */

// use if necessary
function escape (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// complex types

function checkObject (thing) {
  return typeof thing === "object" &&
         thing !== null &&
         ( Object.getPrototypeOf(thing) === Object.prototype ||
           thing instanceof Object);
}

function checkArray (thing) {
  return Array.isArray(thing) && thing instanceof Array;
}

function checkFunction (thing) {
  return typeof thing === "function" &&
          Function.prototype.isPrototypeOf(thing);
}

function checkRegExp (thing) {
  return thing instanceof RegExp;
}

function checkDate (thing) {
  return thing instanceof Date;
}

function checkSymbol (thing) {
  return typeof thing === "symbol";
}

function checkString (thing) {
  return typeof thing === "object" && thing instanceof String;
}

function checkNumber (thing) {
  return typeof thing === "object" && thing instanceof Number;
}

function checkBoolean (thing) {
  return typeof thing === "object" && thing instanceof Boolean;
}

// primitives

function checkNull (thing) {
  return thing === null;
}

function checkUndefined (thing) {
  return thing === undefined;
}

function checkstring (thing) {
  return typeof thing === "string" && !(thing instanceof String);
}

function checknumber (thing) {
  return typeof thing === "number" &&
         !isNaN(thing) && !(thing instanceof Number);
}

// NOTE: integer is both comlex and primitive aka integer === Integer
function checkInteger (thing) {
  return parseInt(thing) === thing && !isNaN(thing);
}

// NOTE: float is both complex and primitive aka float === Float
function checkFloat (thing) {
  return parseInt(thing) !== thing && !isNaN(thing);
}

function checkboolean (thing) {
  return typeof thing === "boolean" && !(thing instanceof Boolean);
}

function newType (name, checkFn, aliases) {
  if (typeof name !== "string")
    throw new TypeError("'name' must be a string");
  if (name in types)
    throw new Error("'name': " + name + " already taken");
  if ("function" !== typeof checkFn)
    throw new TypeError("'checkFn' must be an fn");
  if (!Array.isArray(aliases))
    throw new TypeError("'aliases' not array");

  var re, reFn;

  re = mkRegExp.apply(null, aliases);
  if (!(re instanceof RegExp))
    throw new Error("failed to make reg exp from aliases");
  reFn = function (str) {
    str = str.trim();
    return str.match(re);
  };
  if (debugMode) reFn._name = "re" + name[0].toUpperCase() + name.slice(1);

  types[name] = [reFn, checkFn];
};

function mkRegExp () {
  var aliases, regExp, inner, alias, sep, pattern, lastAlias;

  aliases = Array.prototype.slice.call(arguments, 0, arguments.length);
  lastAlias = aliases.length -1;
  inner = "";
  sep = "[|\\s,]+";

  if (aliases.length === 0)
    throw new Error("at least one alias is required");

  for (var ind in aliases) {
    if (!aliases.hasOwnProperty(ind)) continue; // avoid props in [[prototype]]
    alias = aliases[ind];
    if (typeof alias !== "string")
      throw new TypeError("'alias' must be of type string");
    debug ("mkRegExp() alias #%d: %s", ind, alias);
    inner += alias + (+ind === lastAlias ? "" : "|");
  }

  pattern =
    "(?:" + "^" + "|" + sep + ")" +
    "(!*)" + "(?:" + inner + ")" +
    "(?:" + sep + "|" + "$" + ")";
  regExp = new RegExp(pattern);

  return regExp;
}
