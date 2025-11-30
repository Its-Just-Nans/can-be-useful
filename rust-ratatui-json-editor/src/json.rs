use std::io::{self, Write};

use ratatui::{
    style::{Color, Stylize},
    text::Line,
};
use serde::Serialize;
use serde_json::ser::PrettyFormatter;

#[derive(Default)]
pub struct JsonContainer<'a> {
    pub inner: serde_json::Value,
    pub lines: Vec<Line<'a>>,
    pub save_current_pos: Option<usize>,
    pub input_buffer: String,
    pub input_cursor: Option<usize>,
    pub max_cursor: Option<usize>,
}

impl<'a> JsonContainer<'a> {
    pub fn new(json: serde_json::Value) -> Self {
        Self {
            inner: json,
            ..Default::default()
        }
    }

    pub fn len(&self) -> Option<usize> {
        self.inner.as_array().map(|arr| arr.len())
    }

    pub fn check_same_current_pos(&self, current_pos: &Option<usize>) -> bool {
        self.save_current_pos == *current_pos
    }

    pub fn create_lines(&mut self, current_pos: Option<usize>) {
        if current_pos.is_some() && self.check_same_current_pos(&current_pos) {
            // no need to re-render
            return;
        }
        self.save_current_pos.clone_from(&current_pos);
        let mut writer = MyWriter::new(current_pos);
        let formatter = PrettyFormatter::with_indent(b"    ");
        let mut ser = serde_json::Serializer::with_formatter(&mut writer, formatter);
        self.inner.serialize(&mut ser).unwrap();
        writer.write_all(&[b'\n']).unwrap();
        self.lines = writer.inner
    }
}

#[derive(Default)]
pub struct MyWriter<'a> {
    pub inner: Vec<Line<'a>>,
    pub text: Vec<String>,
    internal_buf: Vec<u8>,
    current_selected: Option<usize>,
    current_idx: Option<usize>,
}

impl MyWriter<'_> {
    fn new(current_selected: Option<usize>) -> Self {
        Self {
            current_selected,
            ..Default::default()
        }
    }

    pub fn should_color(&mut self) -> bool {
        let text_to_add = self.text.last().unwrap();
        if text_to_add == "    {\n" {
            self.current_idx = match self.current_idx {
                Some(val) => Some(val + 1),
                None => Some(0),
            };
        } else if text_to_add == "]\n" {
            return false;
        } else if self.current_idx.is_none() {
            return false;
        }
        self.current_idx == self.current_selected
    }
}

impl io::Write for MyWriter<'_> {
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.internal_buf.extend_from_slice(buf);
        let newline = self.internal_buf.iter().position(|&r| r == b'\n');
        if let Some(newline_idx) = newline {
            let curr_text = String::from_utf8_lossy(&self.internal_buf[..newline_idx + 1]);
            self.text.push(curr_text.to_string());
            let should_color = self.should_color();
            let text_to_add = self.text.last().unwrap();
            let line = Line::raw(text_to_add.to_string());
            let line = if should_color {
                line.bg(Color::Blue)
            } else {
                line
            };
            self.inner.push(line);
            self.internal_buf.drain(..newline_idx + 1);
        }
        Ok(buf.len())
    }

    fn flush(&mut self) -> io::Result<()> {
        Ok(())
    }
}
