const fs = require("fs");

try {
    var createSVG = setInterval(() => {
        try {
            let { svg1 } = require("./base.js");
            delete require.cache[require.resolve("./base.js")];
            let { svg2 } = require("./base2.js");
            delete require.cache[require.resolve("./base2.js")];
            // we need to delete the file from the cache
            let newSVG1 = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    <title>Tool blocks logo</title>
    <desc>Logo of the tool-blocks project</desc>
    <metadata>
        <rdf:RDF xmlns:rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:dc="http://purl.org/dc/elements/1.1/" >
            <rdf:Description dc:title="tool blocks logo">
                <dc:creator>
                    <rdf:Bag>
                        <rdf:li>Its-Just-Nans - n4n5</rdf:li>
                    </rdf:Bag>
                </dc:creator>
            </rdf:Description>
        </rdf:RDF>
    </metadata>
    ${svg1}
</svg>`;
            let newSVG2 = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    <title>Tool blocks logo</title>
    <desc>Logo of the tool-blocks project</desc>
    <metadata>
        <rdf:RDF xmlns:rdf = "http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" xmlns:dc="http://purl.org/dc/elements/1.1/" >
            <rdf:Description dc:title="tool blocks logo">
                <dc:creator>
                    <rdf:Bag>
                        <rdf:li>Its-Just-Nans - n4n5</rdf:li>
                    </rdf:Bag>
                </dc:creator>
            </rdf:Description>
        </rdf:RDF>
    </metadata>
    ${svg2}
</svg>`;
            fs.writeFileSync("./tool-blocks_logo.svg", newSVG1);
            fs.writeFileSync("./tool-blocks_logo2.svg", newSVG2);
            console.log("ok");
        } catch (e) {
            console.log(e);
            clearInterval(createSVG);
        }
    }, 2000);
} catch (e) {
    console.error(e);
}
