use std::io;

use ratatui::{
    backend::Backend,
    crossterm::event::{self, Event, KeyCode, KeyEventKind},
    Terminal,
};

use crate::app::{App, CurrentScreen, CurrentlyEditing};

impl App<'_> {
    pub fn run_app<B: Backend>(&mut self, terminal: &mut Terminal<B>) -> io::Result<bool> {
        loop {
            self.render_json();
            terminal.draw(|f| self.ui(f))?;
            if let Some(res) = self.handle_event() {
                return Ok(res);
            }
        }
    }

    fn reset_cursor(&mut self) {
        self.json_container.input_cursor = None;
        self.json_container.max_cursor = None;
    }

    pub fn handle_event(&mut self) -> Option<bool> {
        let event = match event::read() {
            Ok(event) => event,
            Err(e) => {
                eprintln!("Error: {:?}", e);
                return None;
            }
        };
        if let Event::Key(key) = event {
            if key.kind == event::KeyEventKind::Release {
                // Skip events that are not KeyEventKind::Press
                return None;
            }
            match self.current_screen {
                CurrentScreen::Main => match key.code {
                    KeyCode::Right => {
                        self.current_screen = CurrentScreen::Editing;
                        self.currently_editing = Some(CurrentlyEditing::Key);
                    }
                    KeyCode::Tab => {
                        self.current_screen = CurrentScreen::Editing;
                        self.currently_editing = Some(CurrentlyEditing::Key);
                    }
                    KeyCode::Up => match self.index_edition {
                        Some(val) => {
                            if val == 0 {
                                return None;
                            } else {
                                self.index_edition = Some(val.saturating_sub(1));
                            }
                        }
                        None => {
                            self.index_edition = Some(0);
                        }
                    },
                    KeyCode::Down => match self.index_edition {
                        Some(val) => match self.json_container.len() {
                            Some(len) => {
                                if val == (len - 1) {
                                    return None;
                                }
                                self.index_edition = Some(val.saturating_add(1));
                            }
                            None => {
                                return None;
                            }
                        },
                        None => match self.json_container.len() {
                            Some(_len) => {
                                self.index_edition = Some(0);
                            }
                            None => {
                                return None;
                            }
                        },
                    },
                    KeyCode::Char('q') => {
                        self.current_screen = CurrentScreen::Exiting;
                    }
                    _ => {}
                },

                CurrentScreen::Exiting => match key.code {
                    KeyCode::Char('y') => {
                        return Some(true);
                    }
                    KeyCode::Char('n') | KeyCode::Char('q') => {
                        return Some(false);
                    }
                    _ => {}
                },

                CurrentScreen::Editing if key.kind == KeyEventKind::Press => match key.code {
                    KeyCode::Up => match self.json_container.input_cursor {
                        Some(current_input) => {
                            if current_input == 1 {
                                return None;
                            } else {
                                self.json_container.input_cursor =
                                    Some(current_input.saturating_sub(1));
                            }
                        }
                        None => {
                            self.json_container.input_cursor = Some(1);
                        }
                    },
                    KeyCode::Down => match self.json_container.input_cursor {
                        Some(current_input) => match self.json_container.max_cursor {
                            Some(max_cursor) => {
                                if current_input == max_cursor {
                                    return None;
                                }
                                self.json_container.input_cursor =
                                    Some(current_input.saturating_add(1));
                            }
                            None => {
                                return None;
                            }
                        },
                        None => match self.json_container.max_cursor {
                            Some(_max_cursor) => {
                                self.json_container.input_cursor = Some(1);
                            }
                            None => {
                                return None;
                            }
                        },
                    },
                    KeyCode::Left => {
                        self.current_screen = CurrentScreen::Main;
                        self.currently_editing = None;
                        self.reset_cursor();
                    }
                    KeyCode::Tab => {
                        self.current_screen = CurrentScreen::Main;
                        self.currently_editing = None;
                    }
                    KeyCode::Enter => {
                        if let Some(editing) = &self.currently_editing {
                            match editing {
                                CurrentlyEditing::Key => {
                                    self.currently_editing = Some(CurrentlyEditing::Value);
                                }
                                CurrentlyEditing::Value => {
                                    // self.save_key_value();
                                    self.current_screen = CurrentScreen::Main;
                                }
                            }
                        }
                    }

                    KeyCode::Backspace => {
                        if let Some(editing) = &self.currently_editing {
                            match editing {
                                CurrentlyEditing::Key => {
                                    self.json_container.input_buffer.pop();
                                }
                                CurrentlyEditing::Value => {
                                    self.json_container.input_buffer.pop();
                                }
                            }
                        }
                    }
                    KeyCode::Esc => {
                        self.current_screen = CurrentScreen::Main;
                        self.currently_editing = None;
                    }
                    KeyCode::Char('q') => {
                        self.current_screen = CurrentScreen::Exiting;
                    }
                    KeyCode::Char(value) => {
                        if let Some(editing) = &self.currently_editing {
                            match editing {
                                CurrentlyEditing::Key => {
                                    self.json_container.input_buffer.push(value);
                                }
                                CurrentlyEditing::Value => {
                                    self.json_container.input_buffer.push(value);
                                }
                            }
                        }
                    }
                    _ => {}
                },
                _ => {}
            }
        }
        None
    }
}
