![Travis Build Status](https://travis-ci.org/reecehudson/charge.svg) ![npm version badge] (https://img.shields.io/npm/v/ch-arge.svg)

Charge
======

## Installation
```cmd
> npm install ch-arge
var charge = require("ch-arge");
```

## Example Usage
<!-- make sure it's synced with example/all-features.js-->
```js
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
```

## API

### `charge(actual, expected1[, expected2...][,opts])`
Returns a boolean, depending on the actual matching any (or all if
`opts.singleCheck` is off) of the given expected types.

* `actual`, the unknown type to be type asserted
* `expected`, may be either a Constructor or string, string may contain type
  aliases separated by `|`, `,`, or `(whitespace)`. `!` prepended to the type
  alias will match the type if it isn't of that type.  Multiple `!!` are
  supported.
* `opts`
  * `shouldThrow`, throws `ArgError` instance if actual fails to match a type.
    Defaults to true.
  * `singleCheck`, if false will pass if it matches all given expected types.
    Defaults to true.
  * `message`, if provided will override the default ArgError message.  Must be
    a string, or else will error.

### `charge.newType ([name], checkFn, alias1 [,alias2] [,alias...])`
Defines a new type known by name (if provided) and aliases.  Returns name.

* `name`, for internal use and semantic debugging, if provided acts like an
  alias
* `checkFn`, first parameter must be prepared to receive the actual being tested
  for.  The return should be boolean and determines if it is of that type.
* `alias`, A string value of names the type should be reference as.

### `charge.ArgError`
The constructor for the error thrown if `opts.shouldThrow` is on, inherits from `Error`.

## Bundled Types

<!--0000-->
Type|Aliases|
:---|:---
Object|Object object Obj obj</br>
Array|Array array Arr arr
Function|Function function</br>Fn fn Func func
RegExp|RegExp regexp regExp</br>Regexp
Date|Date date
Symbol|Symbol symbol Sym sym</br>
String|String Str
Number|Number Num
Boolean|Boolean Bool
null|null
undefined|undefined
string|string str
number|number num
integer|integer int
float|float flt
boolean|boolean bool
NaN|NaN Nan naN nan
<!--0000-->

### How Bundled Types are Determined

Thing `a` is said to be of type `A` if it passed the following checks:

1.  It must pass built-in vanilla checks (if there's any).

    e.g.

    * `Array.isArray()` is a vanilla check for type `Array`.
    * `typeof {} === "object"` is a vanilla check for type `Object`.

2. `a` must be an instance of `A` if it's a complex type or the opposite if it's
    a primitive

    `A.prototype` must be somewhere in `a`'s prototype chain.

    i.e.

    `a instanceof A`

    e.g.

    * `new String` is of type `String` because `new String instanceof String`
      yield `true`
    * `""` is of type `string` because `"" instanceof String` yeilds false

    As a general rule, bundled types that have a primitive and complex pair
    are lower-cased and capitalized on the first letter, respectively.

Exceptions and caveats to the rules are as follows:

* `typeof null === "object"` does node apply for `null`
* types `integer`, `Number`, `number`, and `float` do not include `NaN`, `NaN`
  has it's own type
* `Infinity` is of type `number`, `float`, but _not_ `integer` or `Number`
