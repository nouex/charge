// NOTE no strict
var charge = require("ch-arge");

function accountInfo(name, birthyear, data1, data2, userData) {
  // add new type that only accepts a or b
  charge.newType("ab", function (actual) {
    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== "a" or actual[i] !== "b") return false;
    }
  }, "ba");

  charge.newType("userData", function (actual) {
    return actual.length < 10;
  }, "ud");

  charge(name, String, {shouldThrow: false});
  charge(birthyear, "num Num|str,Str Date");
  charge(data1, "ab", {shouldThrow: true});
  charge(data2, "ba", {shouldThrow: true});
  charge(userData, "!null !undefined ud", {singleCheck: false});

  // logic that makes use of args
}
