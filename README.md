Charge
======

#####Installation
```cmd
> npm install ch-arge
var charge = require("charge");
```

#####Usage
```js
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
* `!` negates a type
* `,` seperates possibilities

```js
function accountInfo(name, birthyear, data) {
  charge(name, "str"); // shorthand "string" type
  charge(birthyear, "Date|int");
  charge(data, Object);

  // use arguments as expected
}
```

#####Supported Types


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
