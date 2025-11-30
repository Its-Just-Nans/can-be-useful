use ratatui::{
    layout::{Constraint, Direction, Layout, Rect},
    style::{Color, Style},
    text::{Line, Span, Text},
    widgets::{Block, Borders, Clear, Paragraph, Widget, Wrap},
    Frame,
};

use crate::app::{App, CurrentScreen, CurrentlyEditing, InputFile};

impl<'a> App<'a> {
    pub fn render_title(&self) -> impl Widget {
        let widget_style = Block::default()
            .borders(Borders::ALL)
            .style(Style::default());

        let text = match &self.input_file {
            InputFile::Creation(file) => format!("Creating {}", file),
            InputFile::Edition(file) => format!("Editing {}", file),
            InputFile::None => "Creating json".to_string(),
        };

        let text = match &self.index_edition {
            Some(val) => format!("{} (index {})", text, val),
            None => text,
        };

        let widget = Paragraph::new(Text::styled(text, Style::default()))
            .centered()
            .block(widget_style);

        widget
    }

    fn render_json_struct(
        value: &mut serde_json::Value,
        input_cursor: Option<usize>,
        prefix: String,
        idx: &mut usize,
    ) -> Vec<Line<'a>> {
        let style = if input_cursor == Some(*idx) {
            Style::default().bg(Color::LightYellow)
        } else {
            Style::default()
        };
        match value {
            serde_json::Value::Array(array) => {
                let mut text = Vec::new();
                for (i, value) in array.iter_mut().enumerate() {
                    let new_prefix = format!("{}.{}", prefix, i + 1);
                    let array_idx =
                        Span::styled(new_prefix.clone(), Style::default().bg(Color::LightBlue));
                    text.push(Line::from(array_idx));
                    *idx += 1;
                    text.extend_from_slice(&Self::render_json_struct(
                        value,
                        input_cursor,
                        new_prefix,
                        idx,
                    ));
                }
                text
            }
            serde_json::Value::Object(obj) => {
                let mut text = Vec::new();
                for (key, value) in obj.iter_mut() {
                    let key = format!("{}.{}", prefix, key);
                    if !value.is_array() {
                        let key_span =
                            Span::styled(key.clone(), Style::default().bg(Color::LightBlue));
                        text.push(Line::from(key_span));
                        *idx += 1;
                    }
                    text.extend_from_slice(&Self::render_json_struct(
                        value,
                        input_cursor,
                        key,
                        idx,
                    ));
                }
                text
            }
            serde_json::Value::String(string) => {
                let string = Span::styled(format!("\"{}\"", string), style);
                vec![Line::from(string)]
            }
            serde_json::Value::Number(number) => {
                let number = Span::styled(number.to_string(), style);
                vec![Line::from(number)]
            }
            serde_json::Value::Bool(boolean) => {
                let boolean = Span::styled(boolean.to_string(), style);
                vec![Line::from(boolean)]
            }
            serde_json::Value::Null => {
                let null = Span::styled("null", style);
                vec![Line::from(null)]
            }
        }
    }

    pub fn render_edition(&mut self) -> impl Widget + use<'a> {
        let border_color = match self.current_screen {
            CurrentScreen::Editing => Color::Green,
            _ => Color::White,
        };

        let widget_style = Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(border_color))
            .style(Style::default());

        let widget = match self.index_edition {
            Some(idx_json) => {
                let value = match self.json_container.inner.as_array_mut() {
                    Some(arr) => arr.get_mut(idx_json),
                    None => None,
                };
                let value = match value {
                    Some(curr_val) => {
                        let mut idx = 0;
                        let input_cursor = self.json_container.input_cursor;
                        let res = Self::render_json_struct(
                            curr_val,
                            input_cursor,
                            idx_json.to_string(),
                            &mut idx,
                        );
                        self.json_container.max_cursor = Some(idx);
                        res
                    }
                    None => {
                        vec![Line::from(Span::styled(
                            "No value selected",
                            Style::default(),
                        ))]
                    }
                };
                Paragraph::new(value)
            }
            None => Paragraph::new(Text::styled("No value selected", Style::default())),
        };
        widget.block(widget_style)
    }

    fn render_json_view(&self) -> impl Widget + 'a {
        let border_color = match self.current_screen {
            CurrentScreen::Main => Color::Green,
            _ => Color::White,
        };

        let widget_style = Block::default()
            .borders(Borders::ALL)
            .border_style(Style::default().fg(border_color))
            .style(Style::default());
        let lines = self.json_container.lines.clone();
        let json_para = Paragraph::new(lines).block(widget_style);
        json_para
    }

    fn render_footer_mode(&self) -> impl Widget {
        let current_navigation_text = vec![
            // The first half of the text
            match self.current_screen {
                CurrentScreen::Main => Span::styled("View Mode", Style::default().fg(Color::Green)),
                CurrentScreen::Editing => {
                    Span::styled("Editing Mode", Style::default().fg(Color::Green))
                }
                CurrentScreen::Exiting => {
                    Span::styled("Exiting", Style::default().fg(Color::LightRed))
                }
            }
            .to_owned(),
            // A white divider bar to separate the two sections
            Span::styled(" | ", Style::default().fg(Color::White)),
            // The final section of the text, with hints on what the user is editing
            {
                if self.currently_editing.is_some() {
                    Span::styled(
                        "Left Arrow to view mode",
                        Style::default().fg(Color::DarkGray),
                    )
                } else {
                    Span::styled(
                        "Right Arrow to edit mode",
                        Style::default().fg(Color::DarkGray),
                    )
                }
            },
        ];

        let current_navigation_text = match self.current_screen {
            CurrentScreen::Main => current_navigation_text,
            CurrentScreen::Editing => current_navigation_text.into_iter().rev().collect(),
            CurrentScreen::Exiting => current_navigation_text,
        };

        let mode_footer = Paragraph::new(Line::from(current_navigation_text))
            .block(Block::default().borders(Borders::ALL));

        let mode_footer = match self.current_screen {
            CurrentScreen::Main => mode_footer.left_aligned(),
            CurrentScreen::Editing => mode_footer.right_aligned(),
            CurrentScreen::Exiting => mode_footer.centered(),
        };

        mode_footer
    }

    fn render_key_hint(&self) -> impl Widget {
        let key_hint = match self.currently_editing {
            Some(CurrentlyEditing::Key) => "Editing Key",
            Some(CurrentlyEditing::Value) => "Editing Value",
            None => "Viewing",
        };

        let key_hint = Paragraph::new(Text::styled(key_hint, Style::default()))
            .block(Block::default().borders(Borders::ALL));

        key_hint
    }

    pub fn ui(&mut self, frame: &mut Frame) {
        // Create the layout sections.

        let chunks = Layout::default()
            .direction(Direction::Vertical)
            .constraints([
                Constraint::Length(3),
                Constraint::Min(1),
                Constraint::Length(3),
            ])
            .split(frame.area());

        frame.render_widget(self.render_title(), chunks[0]);

        let screens = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
            .split(chunks[1]);

        frame.render_widget(self.render_json_view(), screens[0]);
        frame.render_widget(self.render_edition(), screens[1]);

        let footer_chunks = Layout::default()
            .direction(Direction::Horizontal)
            .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
            .split(chunks[2]);

        frame.render_widget(self.render_footer_mode(), footer_chunks[0]);
        frame.render_widget(self.render_key_hint(), footer_chunks[1]);

        // if let Some(editing) = &self.currently_editing {
        //     let popup_block = Block::default()
        //         .title("Enter a new key-value pair")
        //         .borders(Borders::NONE)
        //         .style(Style::default().bg(Color::DarkGray));

        //     let area = centered_rect(60, 25, frame.area());
        //     frame.render_widget(popup_block, area);

        //     let popup_chunks = Layout::default()
        //         .direction(Direction::Horizontal)
        //         .margin(1)
        //         .constraints([Constraint::Percentage(50), Constraint::Percentage(50)])
        //         .split(area);

        //     let mut key_block = Block::default().title("Key").borders(Borders::ALL);
        //     let mut value_block = Block::default().title("Value").borders(Borders::ALL);

        //     let active_style = Style::default().bg(Color::LightYellow).fg(Color::Black);

        //     match editing {
        //         CurrentlyEditing::Key => key_block = key_block.style(active_style),
        //         CurrentlyEditing::Value => value_block = value_block.style(active_style),
        //     };

        //     let key_text =
        //         Paragraph::new(self.json_container.input_buffer.clone()).block(key_block);
        //     frame.render_widget(key_text, popup_chunks[0]);

        //     let value_text =
        //         Paragraph::new(self.json_container.input_buffer.clone()).block(value_block);
        //     frame.render_widget(value_text, popup_chunks[1]);
        // }

        if let CurrentScreen::Exiting = self.current_screen {
            frame.render_widget(Clear, frame.area()); //this clears the entire screen and anything already drawn
            let popup_block = Block::default()
                .title("Y/N")
                .borders(Borders::NONE)
                .style(Style::default().bg(Color::DarkGray));

            let exit_text = Text::styled(
                "Would you like to output the buffer as json? (y/n)",
                Style::default().fg(Color::Red),
            );
            // the `trim: false` will stop the text from being cut off when over the edge of the block
            let exit_paragraph = Paragraph::new(exit_text)
                .block(popup_block)
                .wrap(Wrap { trim: false });

            let area = centered_rect(60, 25, frame.area());
            frame.render_widget(exit_paragraph, area);
        }
    }
}
/// helper function to create a centered rect using up certain percentage of the available rect `r`
fn centered_rect(percent_x: u16, percent_y: u16, r: Rect) -> Rect {
    // Cut the given rectangle into three vertical pieces
    let popup_layout = Layout::default()
        .direction(Direction::Vertical)
        .constraints([
            Constraint::Percentage((100 - percent_y) / 2),
            Constraint::Percentage(percent_y),
            Constraint::Percentage((100 - percent_y) / 2),
        ])
        .split(r);

    // Then cut the middle vertical piece into three width-wise pieces
    Layout::default()
        .direction(Direction::Horizontal)
        .constraints([
            Constraint::Percentage((100 - percent_x) / 2),
            Constraint::Percentage(percent_x),
            Constraint::Percentage((100 - percent_x) / 2),
        ])
        .split(popup_layout[1])[1] // Return the middle chunk
}
