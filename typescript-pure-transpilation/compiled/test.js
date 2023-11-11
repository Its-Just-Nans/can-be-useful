"use strict";
exports.__esModule = true;
exports.greeter = void 0;
var greeter = function (person) {
    return "Hello, " + person;
};
exports.greeter = greeter;
var user = "Jane User";
document.body.textContent = greeter(user);
