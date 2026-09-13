use std::{fs, process::Command};

use mdxjs::{Options, compile};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Compile MDX -> React module
    let mdx = r#"
# Hello

This is **MDX**.

- one
- two
- three
"#;

    let js = compile(mdx, &Options::default()).unwrap();

    fs::write("content.mjs", js)?;

    let renderer = r#"
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import MDXContent from "./content.mjs";

const body = renderToStaticMarkup(
    React.createElement(MDXContent)
);

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>MDX</title>
</head>
<body>
${body}
</body>
</html>`;

fs.writeFileSync("output.html", html);
console.log("Wrote output.html");
"#;

    fs::write("render.mjs", renderer)?;

    let status = Command::new("node").arg("render.mjs").status()?;

    if !status.success() {
        panic!("node failed");
    }

    println!("Done!");

    Ok(())
}
