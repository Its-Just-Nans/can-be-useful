const test = (funcToTest) => {
    console.log("------" + funcToTest.name);
    try {
        ["toto likes the sauerkraut", "SPOT THE BUG :SOLUTION", "SPOT THE    multiple space"].forEach((el) =>
            console.log(funcToTest(el))
        );
    } catch (e) {
        console.log(e);
    }
    console.log("------------------------");
};

const getCapitalizedInitials_1 = (name) =>
    name
        .trim()
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase();
test(getCapitalizedInitials_1);

const getCapitalizedInitials_2 = (name) =>
    name
        .trim()
        .split(" ")
        .map((name) => name.match(/[a-zA-Z]/).pop())
        .join("")
        .toUpperCase();
test(getCapitalizedInitials_2);

const getCapitalizedInitials_3 = (name) =>
    name
        .trim()
        .split(" ")
        .map((name) => (name.match(/[a-zA-Z]/) || [""]).pop())
        .join("")
        .toUpperCase();
test(getCapitalizedInitials_3);
