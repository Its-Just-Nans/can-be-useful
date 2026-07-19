//! pdf to text

pub(crate) mod wasm;

#[cfg(target_arch = "wasm32")]
pub use crate::wasm::process_file;

pub fn process_file_raw<'a>(data: &[u8]) -> String {
    pdf_extract::extract_text_from_mem(data).unwrap_or("Failed to decode".to_string())
}

#[cfg(not(target_arch = "wasm32"))]
pub fn process_file(file_data: &[u8], filename: &str, source_url: &str) {
    let data = process_file_raw(file_data);
    println!("{}", filename);
    println!("{}", source_url);
    println!("{}", data);
}

pub fn cli_main() -> i32 {
    use std::{env, fs};

    let mut json = false;
    let mut files = Vec::new();

    let mut args = env::args().skip(1);

    while let Some(arg) = args.next() {
        match arg.as_str() {
            "--json" => json = true,
            _ => files.push(arg),
        }
    }

    if files.is_empty() {
        eprintln!("usage: pdf_to_text [--json] <files...>");
        std::process::exit(1);
    }

    #[derive(Debug, serde::Serialize)]
    struct Output {
        filename: String,
        data: String,
    }

    let outputs: Vec<Output> = files
        .into_iter()
        .map(|filename| {
            let file_data = fs::read(&filename)
                .expect("failed to read file");

            let data = process_file_raw(&file_data);
            Output {filename, data}
        })
        .collect();

    if json {
        println!(
            "{}",
            serde_json::to_string_pretty(&outputs).unwrap()
        );
    } else {
        for out in outputs {
            println!("{}", out.filename);
            println!("{}", out.data);
            println!("---");
        }
    }
    0
}
