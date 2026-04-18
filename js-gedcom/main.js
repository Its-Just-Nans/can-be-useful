import { readGedcom, parseGedcom } from "read-gedcom";
import { readFileSync, writeFileSync } from "fs";

// Read the GEDCOM file
const gedcomFile = readGedcom(readFileSync("./pres2020.ged"));
const gedcom = parseGedcom(readFileSync("./pres2020.ged"));

// Compute general statistics
const computeGeneralStatistics = (gedcom) => ({
    families: gedcom.getFamilyRecord().length,
    individuals: gedcom.getIndividualRecord().length,
    multimedia: gedcom.getMultimediaRecord().length,
    notes: gedcom.getNoteRecord().length,
    repositories: gedcom.getRepositoryRecord().length,
    sources: gedcom.getSourceRecord().length,
});
console.log(JSON.stringify(computeGeneralStatistics(gedcomFile)));

// Function to create an SVG node for an individual
const createNode = ({ pointer }, x, y) => {
    const node = gedcomFile.root().getIndividualRecord(pointer);
    const name = node.getName().value()[0];
    const sex = node.getSex().value()[0];
    const sexColor = sex === "M" ? "#0000ff" : "#cb4aaf";
    return `
    <g transform="translate(${x},${y})">
        <rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="3" stroke="${sexColor}" rx="5" ry="5"></rect>
        <rect x="0" y="0" height="20" width="250" fill="${sexColor}" stroke-width="1" stroke="${sexColor}" rx="5" ry="5"></rect>
        <line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="${sexColor}"></line>
        <text data-width="250" style="font-size: 14px" font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">${name}</text>
        <text data-width="160" data-text-overflow="multiline" style="font-size: 14px" fill="black" x="100" y="66" text-anchor="start">${name}</text>
        <circle fill="${sexColor}" cx="45" cy="62" r="37"></circle>
    </g>`;
};

const createTree = (topAncestor) => {
    const nodeQueue = [{ node: topAncestor, x: 0, y: 0, level: 0 }];
    const spacingX = 300;
    const spacingY = 200;
    let svgContent = "";

    while (nodeQueue.length > 0) {
        const {
            node: { pointer },
            x,
            y,
            level,
        } = nodeQueue.shift();
        const node = gedcomFile.root().getIndividualRecord(pointer);
        svgContent += createNode(node, x, y);

        const familiesAsSpouse = node.getFamilyAsSpouse();
        for (let i = 0; i < familiesAsSpouse.length; i++) {
            const spouse = familiesAsSpouse.getWife();
            const children = familiesAsSpouse.getChild();

            if (spouse) {
                nodeQueue.push({ node: spouse, x: x + (i + 1) * spacingX, y, level });
            }

            for (let j = 0; j < children.length; j++) {
                const child = children[j];
                nodeQueue.push({
                    node: child,
                    x: x + (j + 1) * spacingX,
                    y: y + (level + 1) * spacingY,
                    level: level + 1,
                });
            }
        }
    }

    return svgContent;
};

// Find the top-level ancestor (you can change this logic to find your specific ancestor)
const topAncestor = gedcom.children
    .filter((node) => node.tag === "INDI")
    .find((node) => {
        const index = node._index.byTag["NAME"][0];
        return typeof index === "number" && node.children[index].value.includes("Mary Ann");
    });

// Generate the SVG content
let svgContent = `<svg xmlns="http://www.w3.org/2000/svg">${createTree(topAncestor)}</svg>`;

// Write the SVG content to a file
writeFileSync("output.svg", svgContent);
