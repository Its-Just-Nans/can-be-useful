const sql = (re = null) => {
    if (re === null) {
        re = {
            from: [],
            fields: [],
            where: [],
        };
    }
    return {
        select: (...fields) => {
            re.fields.push(fields.map((el) => sql_connector.escape(el)));
            return sql(re);
        },
        from: (...newFrom) => {
            re.from.push(newFrom.map((el) => el));
            return sql(re);
        },
        where: (value, equal) => {
            re.where.push(`${value} = ${sql_connector.escape(equal)}`);
            return sql(re);
        },
        and: (value, equal) => {
            if (re.where.length == 0) {
                throw new Error("ADD need a WHERE first");
            }
            re.where.push(`AND ${value} = ${sql_connector.escape(equal)}`);
            return sql(re);
        },
        or: (value, equal) => {
            if (re.where.length == 0) {
                throw new Error("OR need a WHERE first");
            }
            re.where.push(`OR ${value} = ${sql_connector.escape(equal)}`);
            return sql(re);
        },
        end: () => {
            return `SELECT ${re.fields} FROM ${re.from} WHERE ${re.where.join(" ")};`;
        },
    };
};
