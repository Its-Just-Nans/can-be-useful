export const modifyDOM = () => {
    const forms = document.querySelectorAll("form");
    const interrestings = ["for", "value", "name", "type", "pattern", "placeholder", "localName", "id"];
    const destroyItem = (item) => {
        let res = {};
        if (item.children) {
            res.children = [];
            for (const oneChild of item.children) {
                res.children.push(destroyItem(oneChild));
            }
        }
        for (const oneInterest of interrestings) {
            if (item[oneInterest]) {
                res[oneInterest] = item[oneInterest];
            }
        }
        return res;
    };
    const results = [];
    for (const oneForm of forms) {
        results.push(destroyItem(oneForm));
    }
    return results;
};

export const fillDOM = (results) => {
    let toReturn = [];
    const forms = document.querySelectorAll("form");
    const destroyAndFillItem = (data, formsElements) => {
        if (formsElements.children) {
            [...formsElements.children].forEach((children, index) => {
                destroyAndFillItem(data.children[index], children);
            });
        }
        if (formsElements.localName === "input" && data.value) {
            formsElements.value = data.value;
            toReturn.push({ name: formsElements.name, value: data.value });
        }
    };
    [...forms].forEach((oneForm, index) => {
        destroyAndFillItem(results[index] || null, oneForm);
    });
    return toReturn;
};
