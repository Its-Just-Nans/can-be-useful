let string =
    "<return><codeDepot><codeService>123</codeService><codeService>456</codeService></codeDepot><codeService>789</codeService><DSort>123</DSort><destinationDepot>456</destinationDepot><errorCode>0</errorCode><errorMessage></errorMessage><geoPostCodeBarre>132456789</geoPostCodeBarre><geoPostNumeroColis>11111</geoPostNumeroColis><groupingPriorityLabel>test</groupingPriorityLabel><OSort>test</OSort><reservationNumber>test11111</reservationNumber><serviceMark></serviceMark><serviceName>test1111</serviceName><signaletiqueProduit>1H</signaletiqueProduit><skybillNumber>123456789</skybillNumber></return>";

const parseString = function (string) {
    var firstRegex = /<[^<>]*>/gm;
    var [wrapperWord] = string.match(firstRegex);
    wrapperWord = wrapperWord.substring(1, wrapperWord.length - 1);
    string = string.substring(wrapperWord.length + 2, string.length - (wrapperWord.length + 3));
    var stringSplitted = string.split(/<\/[^\/<>]*>/gm);
    var restOfString = string;
    var returnObject = {
        [wrapperWord]: {},
    };
    //first we remove tag with tag in
    for (let one of stringSplitted) {
        const regex = /<[^<>]*>/gm;
        let count = one.match(regex);
        if (count) {
            if (count.length > 1) {
                let nameOfObject = count[0].substring(1, count[0].length - 1);
                let regex2 = new RegExp(`<${nameOfObject}>.*<\/${nameOfObject}>`, "gm");
                let [toRemove] = string.match(regex2);
                let subObject = parseString(toRemove);
                returnObject[wrapperWord] = { ...returnObject[wrapperWord], ...subObject };
                restOfString = restOfString.replace(toRemove, "");
            }
        }
    }
    // next we parse the rest
    var restOfStringSplitted = restOfString.split(/<\/[^\/<>]*>/gm);
    for (let one of restOfStringSplitted) {
        const regex = /<[^<>]*>/gm;
        let count = one.match(regex);
        if (count) {
            if (count.length == 1) {
                let name = count[0].substring(1, count[0].length - 1);
                let variable = one.replace(count[0], "");
                returnObject[wrapperWord][name] = variable;
            }
        }
    }
    return returnObject;
};

res = parseString(string);

console.log("RESULT", res);
