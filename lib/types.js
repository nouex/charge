"use strict";

module.exports = {
  "Object": [/(?:O|o)bject|bj/, checkObject],
  "Array": [/(?:A|a)rray|rr/, checkArray],
  "Function": [/(?:F|f)n|unc|unction/, checkFunction],
  "RegExp": [/(?:R|r)eg(?:E|e)xp?/, checkRegExp],
  "Date": [/(?:D|d)ate/, checkDate],
  "Symbol": [/(?:S|s)ym(?:bol)?/, checkSymbol],
  "String": [/Str(?:ing)?/, checkString],
  "Number": [/Num(?:ber)?/, checkNumber],
  "Boolean": [/Bool(?:ean)?/, checkBoolean],
  "null": [/null/, checkNull],
  "undefined": [/undefined/, checkUndefined],
  "string": [/str(?:ing)?/, checkstring],
  "number": [/num(?:ber)?/, checknumber],
  "integer": [/int(?:eger)?/, checkInteger],
  "float": [/(?:float)|(?:flt)/, checkFloat],
  "boolean": [/bool(?:ean)?/, checkboolean]
};

// use if necessary
function escape (string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// complex types

function checkObject (thing) {
  return typeof thing === "object" &&
         Object.getPrototypeOf(thing) === Object.prototype;
}

function checkArray (thing) {
  return thing instanceof Array;
}

function checkFunction (thing) {
  return typeof thing === "function" &&
          Function.prototype.isPrototypeOf(thing);
}

function checkRegExp (thing) {
  return thing instanceof RegExp && RegExp.prototype.isPrototypeOf(thing);
}

function checkDate (thing) {
  return thing instanceof Date && Date.prototype.isPrototypeOf(thing);
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
  return typeof thing === "string";
}

function checknumber (thing) {
  return typeof thing === "number";
}

function checkInteger (thing) {
  return parseInt(thing) === thing;
}

function checkFloat (thing) {
  return parseInt(thing) !== thing;
}

function checkboolean (thing) {
  return typeof thing === "boolean";
}
