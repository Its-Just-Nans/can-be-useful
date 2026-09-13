fn main() {
    let html = mdx_to_html("# Hello world").unwrap();
    println!("{html}");
}

fn mdx_to_html(value: &str) -> Result<String, String> {
    let options = satteri_mdxjs::Options::default();
    let parse_options = satteri_pulldown_cmark::MDX_OPTIONS;
    let convert_options = satteri_ast::hast::ConvertOptions::default();
    let (arena, mdx_errors) = satteri_pulldown_cmark::parse(value, parse_options);
    if let Some((offset, msg)) = mdx_errors.first() {
        return Err("ERROR".to_string());
    }
    let mut hast_arena =
        satteri_ast::hast::mdast_arena_to_hast_arena_with_options(&arena, &convert_options);
    // The conversion doesn't carry the flag over.
    hast_arena.mdx = parse_options.contains(satteri_pulldown_cmark::Options::ENABLE_MDX);
    let res = satteri_mdxjs::compile_hast_arena(&hast_arena, &options).unwrap();
    Ok(res)
}
