"use strict";

typeof process.env.DEBUG === "string" ? process.env.DEBUG += ",ch-arge:index.js" :
process.env.DEBUG = "ch-arge:index.js";

var charge = require("../lib");
var assert = require("assert");

// charge with arg as expected instance of constructor
assert(charge([], Array));

// fail on purpose and throws
assert.throws(function(){charge([], Object)});

// fail on purpose with return instead of throw
assert.equal(charge([], Object, false), false);

// charge with string as second arg
assert.ok(charge([], "array"));

// same with shorthand
assert.ok(charge([], "arr"));

// same with more possibilites
assert(charge({}, "array object"));

// arg error
assert.throws(function() {charge([], "str")}, charge.ArgError);
