fn main() -> Result<(), Box<dyn std::error::Error>> {
    let input_file = std::env::args().nth(1);
    ratatui_json_editor::cli_main(input_file)
}

#[cfg(test)]
mod tests {

    #[test]
    fn test_main() {
        let input_file = Some("test.json".to_string());
        ratatui_json_editor::cli_main(input_file).unwrap();
    }
}
