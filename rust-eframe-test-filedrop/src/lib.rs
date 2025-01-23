#![warn(clippy::all, rust_2018_idioms)]

mod app;
pub use app::TemplateApp;
use eframe::egui;
use log::{info, warn};
use poll_promise::Promise;

impl TemplateApp {
    fn handle_dialog(&mut self) {
        #[cfg(target_arch = "wasm32")]
        {
            self.file_upload = Some(Promise::spawn_local(async {
                let file = rfd::AsyncFileDialog::new().pick_file().await;
                if let Some(file) = file {
                    let buf = file.read().await;
                    return match std::str::from_utf8(&buf) {
                        Ok(v) => Some((v.to_string(), file.file_name())),
                        Err(e) => Some((e.to_string(), "".to_string())),
                    };
                }
                Some(("No file Selected".to_string(), "".to_string()))
            }));
        }
        #[cfg(not(target_arch = "wasm32"))]
        {
            self.file_upload = Some(Promise::spawn_thread("slow", move || {
                if let Some(path) = rfd::FileDialog::new().pick_file() {
                    // read file as string
                    if let Some(path) = path.to_str() {
                        let path = path.to_string();
                        let buf = std::fs::read(path.clone());
                        let buf = match buf {
                            Ok(v) => v,
                            Err(e) => {
                                warn!("{:?}", e);
                                return Some((e.to_string(), "".to_string()));
                            }
                        };
                        return match std::str::from_utf8(&buf) {
                            Ok(v) => {
                                return Some((v.to_string(), path));
                            }
                            Err(e) => Some((e.to_string(), "".to_string())),
                        };
                    }
                }
                Some(("No file Selected".to_string(), "".to_string()))
            }))
        }
    }

    fn render_uploader(&mut self, ctx: &egui::Context, ui: &mut egui::Ui) {
        if ui.button("Open file…").clicked() {
            self.handle_dialog();
        }
        if self.picked_path.is_none() {
            if let Some(result) = self.file_upload.as_mut() {
                if let Some(ready) = result.ready() {
                    if let Some(file) = ready.clone() {
                        self.picked_path = Some(file.1);
                        match serde_xml_rs::from_str::<Java>(&file.0) {
                            Ok(v) => {
                                self.trames = transform_to_trame(v);
                                self.trame_index = 0;
                                self.file_upload = None; // force reset
                            }
                            Err(e) => {
                                info!("{:?}", e);
                            }
                        };
                    }
                }
            }
        }
        if self.trame_index != -1.0 as i64 {
            ui.group(|ui| {
                let str = format!("Trame num {}/{}", self.trame_index, self.trames.len());
                ui.label(str);
                if ui.button("Previous").clicked() {
                    self.trame_index -= 1;
                    if self.trame_index < 0 {
                        self.trame_index = 0;
                    }
                }
                if ui.button("Next").clicked() {
                    self.trame_index += 1;
                }
                if self.trames.len() > self.trame_index as usize {
                    let tram = &self.trames[self.trame_index as usize].contenu_segment;
                    ui.label(format!("{:02X?}", tram));
                    ui.label(format!(
                        "--------------------------DEBUG--------------------------------------"
                    ));
                    ui.label(format!("{:?}", self.trames[self.trame_index as usize]));
                } else {
                    self.trame_index = self.trames.len() as i64 - 1;
                }
            });
        }

        if let Some(picked_path) = &self.picked_path {
            ui.horizontal(|ui| {
                ui.label("Picked file:");
                ui.monospace(picked_path);
            });
        }

        // Show dropped files (if any):
        if !self.dropped_files.is_empty() {
            ui.group(|ui| {
                ui.label("Dropped files:");

                for file in &self.dropped_files {
                    let mut info = if let Some(path) = &file.path {
                        path.display().to_string()
                    } else if !file.name.is_empty() {
                        file.name.clone()
                    } else {
                        "???".to_owned()
                    };

                    let mut additional_info = vec![];
                    if !file.mime.is_empty() {
                        additional_info.push(format!("type: {}", file.mime));
                    }
                    if let Some(bytes) = &file.bytes {
                        additional_info.push(format!("{} bytes", bytes.len()));
                    }
                    if !additional_info.is_empty() {
                        info += &format!(" ({})", additional_info.join(", "));
                    }

                    ui.label(info);
                }
            });
        }

        preview_files_being_dropped(ctx);

        // Collect dropped files:
        ctx.input(|i| {
            if !i.raw.dropped_files.is_empty() {
                self.dropped_files = i.raw.dropped_files.clone();
            }
        });
    }
}

/// Preview hovering files:
fn preview_files_being_dropped(ctx: &egui::Context) {
    use egui::*;
    use std::fmt::Write as _;

    if !ctx.input(|i| i.raw.hovered_files.is_empty()) {
        let text = ctx.input(|i| {
            let mut text = "Dropping files:\n".to_owned();
            for file in &i.raw.hovered_files {
                if let Some(path) = &file.path {
                    write!(text, "\n{}", path.display()).ok();
                } else if !file.mime.is_empty() {
                    write!(text, "\n{}", file.mime).ok();
                } else {
                    text += "\n???";
                }
            }
            text
        });

        let painter =
            ctx.layer_painter(LayerId::new(Order::Foreground, Id::new("file_drop_target")));

        let screen_rect = ctx.screen_rect();
        painter.rect_filled(screen_rect, 0.0, Color32::from_black_alpha(192));
        painter.text(
            screen_rect.center(),
            Align2::CENTER_CENTER,
            text,
            TextStyle::Heading.resolve(&ctx.style()),
            Color32::WHITE,
        );
    }
}
use chrono::{DateTime, Utc};
use std::time::{Duration, UNIX_EPOCH};

pub fn transform_to_trame(doc: Java) -> Vec<Trame> {
    let mut trames: Vec<Trame> = Vec::new();
    for object in doc.objects {
        let mut trame = Trame {
            fn_id: None,
            logical_canal: 0,
            contenu_segment: Vec::new(),
            freq: 0,
            date: Utc::now(),
            localisation: None,
            length: 0,
            sub_type: 0,
        };
        for void in object.voids {
            match void.property.as_str() {
                "FN" => trame.fn_id = void.long,
                "canal_Logique" => {
                    if let Some(t) = void.int {
                        trame.logical_canal = t
                    }
                }
                "contenuSegment" => {
                    if let Some(i) = void.array {
                        if let Some(v) = i.voids {
                            for void in v {
                                trame.contenu_segment.push(void.byte as u8)
                            }
                        }
                    }
                }
                "heure" => {
                    if let Some(d) = void.object {
                        if let Some(l) = d.long {
                            let d = UNIX_EPOCH + Duration::from_millis(l as u64);
                            let d = DateTime::<Utc>::from(d);
                            trame.date = d;
                        }
                    }
                }
                "longueur" => trame.length = void.int.unwrap(),
                "subType" => trame.sub_type = void.byte.unwrap(),
                _ => (),
            }
        }
        trames.push(trame);
    }
    return trames;
}

use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename = "java")]
pub struct Java {
    #[serde(rename = "version")]
    pub version: String,
    #[serde(rename = "class")]
    pub class: String,
    #[serde(rename = "object")]
    pub objects: Vec<JavaObject>,
}

#[derive(Debug, Deserialize)]
pub struct JavaObject {
    #[serde(rename = "class")]
    pub class: String,

    #[serde(rename = "void")]
    pub voids: Vec<JavaVoid>,
}

#[derive(Debug, Deserialize)]
pub struct JavaVoid {
    #[serde(rename = "property")]
    pub property: String,

    #[serde(rename = "string")]
    #[serde(default)]
    pub string: Option<String>,

    #[serde(rename = "int")]
    #[serde(default)]
    pub int: Option<i32>,

    #[serde(rename = "array")]
    #[serde(default)]
    pub array: Option<JavaArray>,

    #[serde(default)]
    pub byte: Option<i32>,

    #[serde(default)]
    pub long: Option<i32>,

    #[serde(rename = "object")]
    #[serde(default)]
    pub object: Option<JavaDate>,
}

#[derive(Debug, Deserialize)]
pub struct JavaArray {
    #[serde(rename = "class")]
    pub class: Option<String>,

    #[serde(rename = "length")]
    pub length: Option<i32>,

    #[serde(rename = "void")]
    pub voids: Option<Vec<VoidIndex>>,
}

#[derive(Debug, Deserialize)]
pub struct VoidIndex {
    pub index: String,
    pub byte: i8,
}

#[derive(Debug, Deserialize)]
pub struct JavaDate {
    #[serde(rename = "class")]
    pub class: Option<String>,

    #[serde(rename = "long")]
    pub long: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct Trame {
    pub fn_id: Option<i32>,
    pub logical_canal: i32,
    pub contenu_segment: Vec<u8>,
    pub freq: i32,
    pub localisation: Option<i32>,
    pub length: i32,
    pub sub_type: i32,
    #[serde(skip)]
    pub date: DateTime<Utc>,
}
