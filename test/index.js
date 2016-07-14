"use strict";

var charge = require("../lib");
var types = require("../lib/types.js");
var EE = require("events");

describe ("use case", function () {
  it ("instance of", function () {
    expect(charge.bind(null, [], Array)).not.toThrow();
    expect(charge.bind(null, [], Object)).not.toThrow();
  });

  it ("instance of, use ret", function () {
    expect(charge("", Object, {shouldThrow: false})).toBe(false);
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
      charge.bind(null, "", {shouldThrow: false})
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
      charge(new EE, Array, "str Str", EE, {shouldThrow: false})
    ).toBe(true);
    // FIXME unrecognized type, should we throw??
    // exp, arg1, arg2 (unrecogznied type)
    expect(
      charge(String(), "Str, str", "blurt", {shouldThrow: false})
    ).toBe(true);
    // exp, arg1 (not it), arg2 (it), arg3 (not it)
    expect (
      charge(String(), "Str", "str", Object, {shouldThrow: false})
    ).toBe(true);
    // exp, arg1arg2, arg3arg4
    expect (
      charge(null, "Object, obj", "undefined|null", {shouldThrow: false})
    ).toBe(true);
    // doen't repeat construcor checking
    // check log
    charge(new String, String, String);
  });

  describe ("opts", function () {
    it ("`shouldThrow`", function () {
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
        charge("blah", String, {shouldThrow: false})
      ).toBe(false);
    });

    it ("`singleCheck`", function () {
      var ee = new EE;
      // default: true
      expect(
        charge.bind(null, ee, EE, "str")
      );
      // true
      expect(
        charge( ee, EE, "str",
                {singleCheck: true, shouldThrow: false}
                  )
      ).toBe(true);
      // false
      expect(
        charge( ee, EE, "str",
                {singleCheck: false, shouldThrow: false}
                  )
      ).toBe(false);
      expect(
        charge( ee, "obj", EE,
                {singleCheck: false, shouldThrow: false}
                  )
      ).toBe(true);
    });
  });

  it ("negated type", function () {
    // negated
    expect (
      charge("blah", "!null", {shouldThrow: false})
    ).toBe(true);
    // double negated
    expect (
      charge(null, "!!null", {shouldThrow: false})
    ).toBe(true);
    // triple negated
    expect (
      charge("blah", "!!!null", {shouldThrow: false})
    ).toBe(true);
  });
});

describe ("ArgError", function () {
  it ("instanceof", function () {
    expect(
      function () {
        charge([], "str", {shouldThrow: true})
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
    delete types[name];
  });

  it ("deals with no 'name'", function () {
    var nil = Object.create(null), id;
    id = newType(
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
    delete types[id];
  });

  it ("prevent name collision", function () {
    // NOTE 'name': Object already taken" is not the error mess b/c the check
    // for alias comes before this one
    expect("Object" in types).toBe(true);
    expect(newType.bind(null, function (){}, "Object")).toThrowError(
      "alias 'Object' is taken"
    );
  });

  it ("prevent alias collision", function () {
    // "obj" is an alias of Object, part of the bunbled types
    expect(newType.bind(null, function (){}, "obj")).toThrowError(
      "alias 'obj' is taken");
  });
});

function mayUseName (key) {
  return !(key in types);
}
