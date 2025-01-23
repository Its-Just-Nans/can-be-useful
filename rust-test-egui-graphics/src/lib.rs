#![warn(clippy::all, rust_2018_idioms)]

mod app;
pub use app::TemplateApp;

mod map;
pub use map::{ImageMemory, Map};
