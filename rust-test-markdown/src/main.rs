use std::io::Write;
use std::{error::Error, fs::File, io::read_to_string};

use markdown::mdast::{Html, Node};

const BASE_HTML: &str = r#"  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css" integrity="sha384-vlBdW0r3AcZO/HboRPznQNowvexd3fY8qHOWkBi5q7KGgqJ+F48+DceybYmrVbmB" crossorigin="anonymous">

    <!-- The loading of KaTeX is deferred to speed up page rendering -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.js" integrity="sha384-AtrdNsnxl/75rvBneBVH7DtOvCxSVahR2zWqle1coBKd8DEmLoviqNeJSx64gNAs" crossorigin="anonymous"></script>

    <!-- To automatically render math in text elements, include the auto-render extension: -->
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/contrib/auto-render.min.js" integrity="sha384-bjyGPfbij8/NDKJhSGZNP/khQVgtHUE5exjm4Ydllo42FwIgYsdLO2lXGmRBf5Mz" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
  </head>
"#;

fn main() -> Result<(), Box<dyn Error>> {
    use markdown::{ParseOptions, to_mdast};
    let file = File::open("index.mdx")?;
    let file = read_to_string(file)?;
    let mut tree = to_mdast(&file, &ParseOptions::default()).unwrap();

    println!("{:#?}", tree);

    // change katex
    replace_math(&mut tree);

    println!("-------------------------");
    println!("AST to Markdown");
    println!("-------------------------");

    let options = mdast_util_to_markdown::Options::default();
    let markdown_text = mdast_util_to_markdown::to_markdown_with_options(&tree, &options).unwrap();
    //    println!("{markdown_text}");
    let mut out = File::create("out.md")?;
    out.write_all(markdown_text.as_bytes())?;

    println!("-------------------------");
    println!("Markdown to HTML");
    println!("-------------------------");
    let html = markdown::to_html_with_options(
        &markdown_text,
        &markdown::Options {
            compile: markdown::CompileOptions {
                allow_dangerous_html: true,
                ..Default::default()
            },
            ..Default::default()
        },
    )
    .unwrap();
    //   println!("{html}");

    let mut out = File::create("out.html")?;
    out.write_all(BASE_HTML.as_bytes())?;
    out.write_all(html.as_bytes())?;
    Ok(())
}

fn replace_math(node: &mut Node) {
    let mut new_childs = vec![];
    if let Some(childs) = node.children() {
        for one_child in childs {
            match one_child {
                Node::Code(c) => {
                    if c.lang.as_ref().is_some_and(|l| l == "math") {
                        let opts = katex::Opts::builder().display_mode(true).build().unwrap();
                        let html_in_display_mode =
                            katex::render_with_opts(&c.value, &opts).unwrap();
                        new_childs.push(Node::Html(Html {
                            value: html_in_display_mode,
                            position: None,
                        }));
                    }
                }
                n => {
                    let new_node = if n.children().is_some() {
                        let mut c = n.clone();
                        replace_math(&mut c);
                        c
                    } else {
                        n.clone()
                    };
                    new_childs.push(new_node)
                }
            }
        }
    }
    if let Some(childs_mut) = node.children_mut() {
        *childs_mut = new_childs;
    }
}
