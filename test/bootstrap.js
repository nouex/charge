"use strict";

typeof process.env.DEBUG === "string" ?
  process.env.DEBUG += ",ch-arge:bootstrap.js" :
  process.env.DEBUG = "ch-arge:bootstrap.js";

var bootstrap = require("../lib/bootstrap.js");
var types = require("../lib/types.js");

function noop () {

}

function mayUseName (key) {
  return !(key in types);
}

describe ("exports", function () {
  describe ("mkRegExp()", function () {
    var mkRegExp = bootstrap.mkRegExp;

    it ("match single word", function () {
      var re = mkRegExp("apple");

      expect(re.test("apple")).toBe(true);
      expect(re.test("orange")).toBe(false);
    });

    it ("match with two", function () {
      var re = mkRegExp("apple", "banana");

      expect(re.test("apple")).toBe(true);
      expect(re.test("banana")).toBe(true);
      expect(re.test("orange")).toBe(false);
    });

    describe ("match with seperators", function () {
      var re;

      beforeEach(function () {
        re = mkRegExp("apple", "banana");
      });

      it (", (comma)", function () {
        expect(re.test("orange,apple")).toBe(true);
        expect(re.test("orange,banana")).toBe(true);
        // multiple
        expect(re.test("orange        apple")).toBe(true);
      });

      it (" (white space)", function () {
        expect(re.test("orange apple")).toBe(true);
        expect(re.test("orange banana")).toBe(true);
        // horizontal tab
        expect(re.test("orange\tapple")).toBe(true);
        // vertical tab
        expect(re.test("orange\vapple")).toBe(true);
        // multiple
        expect(re.test("orange\v\t\u0020apple")).toBe(true);
      });

      it ("| (pipe)", function () {
        expect(re.test("orange|apple")).toBe(true);
        expect(re.test("orange|banana")).toBe(true);
        // multiple
        expect(re.test("orange|||||apple")).toBe(true);
      });

      it ("combined", function () {
        expect(re.test("orange|,\u0020apple")).toBe(true);
      });

      it ("multiple patterns", function () {
        expect(re.test("orange,apple|banan grape")).toBe(true);
      });

      it ("match beginning", function () {
        var re = mkRegExp("apple");

        expect(re.test("apple,orange")).toBe(true);
      });

      it ("match end", function () {
        var re = mkRegExp("apple");

        expect(re.test("orange,apple")).toBe(true);
      });

      it ("match negation", function () {
        var re = mkRegExp("apple");

        expect(re.test("!apple")).toBe(true);
        expect(re.test("!!!apple")).toBe(true);
      });
    });

    describe ("throws on", function () {
      it ("no alias given", function () {
        expect(
          mkRegExp.bind(null)
        ).toThrowError(/at least one/);
      });

      it ("alias not type string", function () {
        expect (
          mkRegExp.bind(null, null)
        ).toThrowError(/type string/);
      });
    });
  });

  describe ("newType()", function () {
    var newType = bootstrap.newType;

    describe("throws on bad args", function () {
      it ("'name'", function () {
        expect(
          newType.bind(null, Object.create(null), function () {}, ["one"])
        ).toThrowError(/must be a string/);
      });

      it ("'checkFn'", function () {
        expect(
          newType.bind(null, "someType", {}, ["one"])
        ).toThrowError(/must be an fn/);
      });

      it ("'aliases'", function () {
        expect(
          newType.bind(null, "someType", function () {}, {})
        ).toThrowError(/not array/);
      });
    });

    it ("adds to types", function () {
      var name = "a", typeO;
      expect(mayUseName(name)).toBe(true);
      newType("a", noop, ["aa", "apple", "A"]);
      expect(mayUseName(name)).toBe(false);
      // btw, extraneous to the curr test suite
      expect(
        newType.bind(null, name, noop, ["a"])
      ).toThrowError(/already taken/);
      typeO = types[name];
      expect(typeO[0]("A")).not.toBeNull();
      expect(typeO[1]()).toBeUndefined();
      });
  });

});
