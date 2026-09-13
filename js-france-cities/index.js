import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const buildOneRegion = async (oneRegion, departementPerRegions) => {
  console.log(`Building ${oneRegion.nom}`);
  let htmlRegion = `<h3>${oneRegion.nom}</h3>`;
  htmlRegion += (
    await Promise.all(
      departementPerRegions[oneRegion.code].map((oneDep) =>
        buildOneDepartement(oneDep),
      ),
    )
  ).join("\n");
  return htmlRegion;
};

const buildOneDepartement = async (oneDep) => {
  console.log(`Building departement ${oneDep.nom}`);
  let htmlDep = "<details>";
  htmlDep += `<summary><h4>${oneDep.nom} - ${oneDep.code}</h4></summary>`;
  htmlDep += "<div>";
  const communes = await (
    await fetch(
      `https://geo.api.gouv.fr/departements/${oneDep.code}/communes?fields=code,nom,population,centre,codeRegion,codeDepartement,codesPostaux`,
    )
  ).json();
  htmlDep += communes
    .sort((a, b) => b.population - a.population)
    .filter((c) => c.population > 500)
    .map((c) => {
        const geo = `geo:${c.centre.coordinates[1]},${c.centre.coordinates[0]}`
      return `<p>
    <span>${c.nom} (${c.population} hab.)</span> <a href="${geo}">${geo}</a>
</p>`;
    })
    .join("\n");
  return htmlDep + `</div></details>`;
};

const main = async () => {
  const regions = await (await fetch("https://geo.api.gouv.fr/regions")).json();
  const departements = await (
    await fetch("https://geo.api.gouv.fr/departements")
  ).json();

  const departementPerRegions = departements.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.codeRegion]: [...(acc[curr.codeRegion] || []), curr],
    };
  }, {});

  let html = (
    await Promise.all(
      regions.map((r) => buildOneRegion(r, departementPerRegions)),
    )
  ).join("\n");

  if (!existsSync("dist")) {
    mkdirSync("dist");
  }
  writeFileSync("dist/index.html", htmlBootStrap(html));
};

const htmlBootStrap = (content) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>France</title>
    <style>
    h4 {
        display: inline-block;
        margin: 0;
    }
    p {
        margin: 0;
    }
    summary:hover {
        cursor: pointer;
    }
    </style>
</head>
<body>
    ${content}
</body>`;
};

main();
