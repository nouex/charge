Charge
======

#####Installation
```
> npm install charge
var charge = require("charge");
```

#####Usage
```
// TODO: sync with example

function accountInfo(name, birthyear, data) {
  charge(name, String);
  charge(birthyear, Number);
  charge(data, Object);

  // use arguments as expected
}
```

#####Basic RegExp Supported

In order to enable easy checkup of a value, if a string is used as the
second arguments to `charge`, it is parsed using the supported types.
This way, a single argument may be multiple types. `!` negates, `|` is or.

```
function accountInfo(name, birthyear, data) {
  charge(name, "str"); // shorthand "string" type
  charge(birthyear, "Date|int");
  charge(data, Object);

  // use arguments as expected
}
```

#####Supported Types


|Type       |Supported As | Shorthand |
|-----------|-------------|-----------|
|Object     |"Object"     |"Obj"      |
|Array      |"Array"      |"Arr"      |
|Function   |"Function"   |"Func"     |
|RegExp     |"RegExp"     |"Reg"      |
|Date       |"Date"       |           |
|Symbol     |"Symbol"     |"Str"      |
|null       |"null"       |           |
|undefined  |"undefined"  |           |
|string     |"string"     |"str"      |
|number     |"number"     |"num"      |
|integer    |"integer"    |"int"      |
|float      |"float"      |"flt"      |
|boolean    |"boolean"    |"bool"     |
