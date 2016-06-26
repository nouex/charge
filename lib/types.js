"use strict";

module.exports = {
  "Object": [reObject, checkObject],
  "Array": [reArray, checkArray],
  "Function": [reFunction, checkFunction],
  "RegExp": [reRegExp, checkRegExp],
  "Date": [reDate, checkDate],
  "Symbol": [reSymbol, checkSymbol],
  "String": [reString, checkString],
  "Number": [reNumber, checkNumber],
  "Boolean": [reBoolean, checkBoolean],
  "null": [renull, checkNull],
  "undefined": [reundefined, checkUndefined],
  "string": [restring, checkstring],
  "number": [renumber, checknumber],
  "integer": [reinteger, checkInteger],
  "float": [refloat, checkFloat],
  "boolean": [reboolean, checkboolean]
};

/* regexp checks */

function reObject () {
  return arguments[0].search(/(?:O|o)bject|bj/);
}

function reArray () {
  return arguments[0].search(/(?:A|a)rray|rr/);
}

function reFunction () {
  return arguments[0].search(/(?:F|f)n|unc|unction/);
}

function reRegExp () {
  return arguments[0].search(/(?:R|r)eg(?:E|e)xp?/);
}

function reDate () {
  return arguments[0].search(/(?:D|d)ate/);
}

function reSymbol () {
  return arguments[0].search(/(?:S|s)ym(?:bol)?/);
}

function reString () {
  return arguments[0].search(/Str(?:ing)?/);
}

function reNumber () {
  return arguments[0].search(/Num(?:ber)?/);
}

function reBoolean () {
  return arguments[0].search(/Bool(?:ean)?/);
}

function renull () {
  return arguments[0].search(/null/);
}

function reundefined () {
  return arguments[0].search(/undefined/);
}

function restring () {
  return arguments[0].search(/str(?:ing)?/);
}

function renumber () {
  return arguments[0].search(/num(?:ber)?/);
}

function reinteger () {
  return arguments[0].search(/int(?:eger)?/);
}

function refloat () {
  return arguments[0].search(/(?:float)|(?:flt)/);
}

function reboolean () {
  return arguments[0].search(/bool(?:ean)?/);
}


/* type checks */


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
