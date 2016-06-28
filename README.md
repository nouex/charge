![Travis Build Status](https://travis-ci.org/reecehudson/charge.svg)

Charge
======

## Installation
```cmd
> npm install ch-arge
var charge = require("ch-arge");
```

## Usage
```js
// TODO: sync with example

function accountInfo(name, birthyear, data) {
  charge(name, String);
  charge(birthyear, Number);
  charge(data, Object);

  // use arguments as expected
}
```

## Seperators

`|`, `,`, and `(whitespace)` may be used as seperators.

```js
function accountInfo(name, birthyear, data) {
  charge(name, "str"); // shorthand "string" type
  charge(birthyear, "Date|int");
  charge(data, Object);

  // use arguments as expected
}
```

## Bundled Types


|*Type*     |*Supported As*   |*Shorthand*|
|-----------|-----------------|-----------|
|**Complex Types**                        |
|                                         |
|Object     |"Object"         |"Obj"      |
|Array      |"Array"          |"Arr"      |
|Function   |"Function"       |"Func","fn"|
|RegExp     |"RegExp"         |"Reg"      |
|Date       |"Date"           |           |
|Symbol     |"Symbol"         |"Sym"      |
|String     |"String"         |"Str"      |
|Number     |"Number"         |"Num"      |
|Boolean    |"Boolean"        |"Bool"     |
|**Primitive Types**                      |
|                                         |
|null       |"null"           |           |
|undefined  |"undefined"      |           |
|string     |"string"         |"str"      |
|number     |"number"         |"num"      |
|integer    |"integer"        |"int"      |
|float      |"float"          |"flt"      |
|boolean    |"boolean"        |"bool"     |

### How Types are Determined

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
* types `nteger`, `Number`, `number`, and `float` does not include `NaN`, `NaN`
  has it's own type
* `Infinity` is of type `number`, `float`, but _not_ `integer` or `Number`

## Defining New Types

`charge.newType ([name], checkFn, alias1 [,alias2] [,aliasn])`

## ArgError

`charge.ArgError`
