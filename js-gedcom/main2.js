import { readGedcom, parseGedcom } from "read-gedcom";
import { readFileSync, writeFileSync } from "fs";

const gedcomFile = readGedcom(readFileSync("./pres2020.ged"));

const computeGeneralStatistics = (gedcom) => ({
    families: gedcom.getFamilyRecord().length,
    individuals: gedcom.getIndividualRecord().length,
    multimedia: gedcom.getMultimediaRecord().length,
    notes: gedcom.getNoteRecord().length,
    repositories: gedcom.getRepositoryRecord().length,
    sources: gedcom.getSourceRecord().length,
});

console.log(JSON.stringify(computeGeneralStatistics(gedcomFile)));

const gedcom = parseGedcom(readFileSync("./pres2020.ged"));

const top = gedcom.children
    .filter((node) => node.tag === "INDI")
    .find((node) => {
        const index = node._index.byTag["NAME"][0];
        return typeof index === "number" && node.children[index].value.includes("Mary Ann");
    });

const createNode = (pointer) => {
    const node = gedcomFile.root().getIndividualRecord(pointer);
    const name = node.getName().value()[0];
    const sex = node.getSex().value()[0];
    const sexColor = sex === "M" ? "#0000ff" : "#cb4aaf";
    const fams = node.getFamilyAsChild();
    const famc = node.getFamilyAsSpouse();
    const conjoint = (sex === "M" ? family.getWife() : fams.getHusband()).getIndividualRecord();
    const children = famc.getChild();
    return `<g
        data-n-id="14"
        style="opacity: 1"
        transform="matrix(1,0,0,1,656.25,360)"
        class="node female right-partner"
        data-sl="2"
        data-l="3">
    <rect x="0" y="0" height="120" width="250" fill="#ffffff" stroke-width="3" stroke="${sexColor}" rx="5" ry="5"></rect>
    <rect x="0" y="0" height="20" width="250" fill="${sexColor}" stroke-width="1" stroke="${sexColor}" rx="5" ry="5"></rect>
    <line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="${sexColor}"></line>
    <text
        data-width="250"
        style="font-size: 14px"
        font-variant="all-small-caps"
        fill="white"
        x="125"
        y="16"
        text-anchor="middle"
        >P.mainmother</text
    >
    <text
        data-width="160"
        data-text-overflow="multiline"
        style="font-size: 14px"
        fill="black"
        x="100"
        y="66"
        text-anchor="start"
    >
        <tspan x="100" y="66" text-anchor="start">${name}</tspan></text
    >
    <text data-width="160" style="font-size: 10px" fill="#b1b9be" x="100" y="95" text-anchor="start"></text>
    <text data-width="60" style="font-size: 12px" fill="black" x="47" y="112" text-anchor="middle">14</text>
    <circle id="base_img_0_stroke" fill="${sexColor}" cx="45" cy="62" r="37"></circle>
    </g>
`;
};

let file = `<svg xmlns="http://www.w3.org/2000/svg">
    ${createNode(top.pointer)}
</svg>`;
writeFileSync("output.svg", file.toString());
