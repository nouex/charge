"use strict";

// made with a functional design, not `this` related api


ArgError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: ArgError
  }
});

function ArgError () {
  Error.apply(this, arguments);
}
