const greeter = function (person: string) {
    return "Hello, " + person;
};

let user = "Jane User";

document.body.textContent = greeter(user);

export { greeter };
