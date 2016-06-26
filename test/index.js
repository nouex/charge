"use strict";

typeof process.env.DEBUG === "string" ? process.env.DEBUG += ",ch-arge:index.js" :
process.env.DEBUG = "ch-arge:index.js";

var charge = require("../lib");
var assert = require("assert");
var EE = require("events");

// charge with arg as expected instance of constructor
assert(charge([], Array));

assert.doesNotThrow(function(){charge([], Object)});

assert.equal(charge([], Object, false), true);

assert.equal(charge("", Object, false), false);

// charge with string as second arg
assert.ok(charge([], "array"));

// same with shorthand
assert.ok(charge([], "arr"));

// same with more possibilites
assert(charge({}, "array object"));

// arg error
assert.throws(function() {charge([], "str")}, charge.ArgError);
// argError instanceof Error
assert.equal(true, (new charge.ArgError) instanceof Error);

// argError instanceof ArgError
assert.equal(true, (new charge.ArgError) instanceof charge.ArgError);

describe("parameters", function () {
  it ("arg", function () {
    // required
    expect(
      charge.bind(null)
    ).toThrowError("Requires an actual");
  });

  it ("arg2...[argn]", function () {
    // at least one is required
    expect(
      charge.bind(null, "", false)
    ).toThrowError("No type seen");

    expect(
      charge.bind(null, "")
    ).toThrowError("No type seen");
    // exp, args...
    expect(
            charge.bind(null, "", Object, Array, "str", "arr")
          ).not.toThrow();
    // exp, args... shouldTrhow
    expect(
      charge(new EE, Array, "str Str", EE, false)
    ).toBe(true);
    // FIXME unrecognized type, should we throw??
    // exp, arg1, arg2 (unrecogznied type)
    expect(
      charge(String(), "Str, str", "blurt", false)
    ).toBe(true);
    // exp, arg1 (not it), arg2 (it), arg3 (not it)
    expect (
      charge(String(), "Str", "str", Object, false)
    ).toBe(true);
    // exp, arg1arg2, arg3arg4
    expect (
      charge(null, "Object, obj", "undefined|null", false)
    ).toBe(true);
    // negated
    expect (
      charge("blah", "!null", false)
    ).toBe(true);
    // doen't repeat construcor checking
    // check log
    charge(new String, String, String);
  });

  it ("boolean should throw", function () {
    // default
    expect(
      function () {charge("blah", String)}
    ).toThrow();
    // true
    expect(
      function () {charge("blah", String, true)}
    ).toThrow();
    // false
    expect(
      charge("blah", String, false)
    ).toBe(false);
  });
});
