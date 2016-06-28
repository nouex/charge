"use strict";

typeof process.env.DEBUG === "string" ? process.env.DEBUG += ",ch-arge:index.js" :
process.env.DEBUG = "ch-arge:index.js";

var charge = require("../lib");
var types = require("../lib/types.js");
var EE = require("events");

describe ("use case", function () {
  it ("instance of", function () {
    expect(charge.bind(null, [], Array)).not.toThrow();
    expect(charge.bind(null, [], Object)).not.toThrow();
  });

  it ("instance of, use ret", function () {
    expect(charge("", Object, false)).toBe(false);
  });

  it ("aliases", function () {
    charge([], "array");
    charge([], "arr");
    charge({}, "array object");
  });
});

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

  it ("negated type", function () {
    // negated
    expect (
      charge("blah", "!null", false)
    ).toBe(true);
    // double negated
    expect (
      charge(null, "!!null", false)
    ).toBe(true);
    // triple negated
    expect (
      charge("blah", "!!!null", false)
    ).toBe(true);
  });
});

describe ("ArgError", function () {
  it ("instanceof", function () {
    expect(
      function () {
        charge([], "str", true)
      }
    ).toThrowError(charge.ArgError);
    expect((new charge.ArgError) instanceof charge.ArgError).toBe(true);
  });
});

describe ("newType()", function () {
  var newType = charge.newType;

  it ("adds a new type", function () {
    var name = "pear";
    expect(mayUseName(name)).toBe(true);
    newType(name, function () {return "fruit"}, "pear", "p");
    expect(mayUseName(name)).toBe(false);
    // type pairs work as expected
    expect(
      types[name][0]("p")
    ).toEqual(jasmine.any(Object));
    expect (
      types[name][1](void 0)
    ).toEqual("fruit");
  });

  it ("deals with no 'name'", function () {
    var nil = Object.create(null);
    newType(
      function () {
        return arguments[0] === nil;
      },
      "nill", "n", "N"
    );
    expect(
      function () {
        return charge(nil, "N")
      }()
    ).toBe(true);
  });

  it ("prevent alias collision", function () {
    expect("Object" in types).toBe(true);
    expect(newType.bind(null, function (){}, "obj")).toThrowError(
      "alias 'obj' is taken"
    );
  });
});

function mayUseName (key) {
  return !(key in types);
}
