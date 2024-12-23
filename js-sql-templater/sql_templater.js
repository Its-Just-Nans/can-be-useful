const sqlProtect = (field) => {
    // do better and safer !
    return `'${field}'`;
};

const sql = (a, ...params) => {
    if (!Array.isArray(a)) {
        throw new Error("incorrect usage");
    }
    return a.reduce((acc, val, index) => {
        const last = params[index] ? sqlProtect(params[index]) : "";
        return `${acc}${val}${last}`;
    }, "");
};

const TABLE = "USERS";
const user = "n4n5";
const query = sql`SELECT name FROM ${TABLE} where name = ${user}`;

console.log(query);
