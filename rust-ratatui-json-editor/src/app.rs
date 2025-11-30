use serde_json::Value;

use crate::json::JsonContainer;

#[derive(Default)]
pub enum CurrentScreen {
    #[default]
    Main,
    Editing,
    Exiting,
}

pub enum CurrentlyEditing {
    Key,
    Value,
}

#[derive(Debug, PartialEq, Clone, Default)]
pub enum InputFile {
    Edition(String),
    Creation(String),
    #[default]
    None,
}

#[derive(Default)]
pub struct App<'a> {
    pub input_file: InputFile,
    pub json_container: JsonContainer<'a>,
    pub index_edition: Option<usize>,
    pub current_screen: CurrentScreen, // the current screen the user is looking at, and will later determine what is rendered.
    pub currently_editing: Option<CurrentlyEditing>, // the optional state containing which of the key or value pair the user is editing. It is an option, because when the user is not directly editing a key-value pair, this will be set to `None`.
    phantom: std::marker::PhantomData<&'a ()>,
}

impl App<'_> {
    pub fn new(input_file: Option<String>) -> Self {
        let (input_file, default_json) = match input_file.clone() {
            Some(input_file) => match std::fs::read_to_string(&input_file) {
                Ok(json) => {
                    let default_json = serde_json::from_str(&json).expect("Could not parse json");
                    (InputFile::Edition(input_file), default_json)
                }
                Err(_) => (InputFile::Creation(input_file), Value::Null),
            },
            None => (InputFile::None, Value::Null),
        };

        Self {
            input_file,
            json_container: JsonContainer::new(default_json),
            ..Default::default()
        }
    }

    pub fn write_output(&self) {
        match &self.input_file {
            InputFile::Creation(filepath) => {
                std::fs::File::create(filepath).expect("Could not create file");
                self.write_json(filepath).expect("Could not write json");
            }
            InputFile::Edition(filepath) => {
                self.write_json(filepath).expect("Could not write json");
            }
            InputFile::None => {
                self.print_json().expect("Could not print json");
            }
        }
    }

    pub fn print_json(&self) -> serde_json::Result<()> {
        let output = serde_json::to_string(&self.json_container.inner)?;
        println!("{}", output);
        Ok(())
    }

    pub fn write_json(&self, path: &str) -> serde_json::Result<()> {
        let output =
            serde_json::to_string(&self.json_container.inner).expect("Could not serialize json");
        std::fs::write(path, output).expect("Could not write to file");
        Ok(())
    }

    pub fn render_json(&mut self) {
        self.json_container.create_lines(self.index_edition);
    }
}
