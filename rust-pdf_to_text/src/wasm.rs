//! Wasm process_file

#![cfg(target_arch = "wasm32")]

use crate::process_file_raw;
use wasm_bindgen::prelude::wasm_bindgen;
use web_sys::Element;

#[wasm_bindgen]
pub fn process_file(file_data: &[u8], filename: &str, source_url: &str) {
    let data = process_file_raw(file_data);
    let document = web_sys::window().unwrap().document().unwrap();
    let element = if let Some(el) = document.get_element_by_id("table_result") {
        el
    } else {
        let div = document.create_element("div").unwrap();
        div.set_id("table_wrapper");
        let table = document.create_element("table").unwrap();
        table.set_id("table_result");
        div.append_child(&table).unwrap();
        document.body().unwrap().append_child(&div).unwrap();
        table
    };
    render_output(data, filename, source_url, &element);
    if let Some(element) = document.get_element_by_id("dropHandler") {
        element.remove();
    }
}

fn render_output(data: String, filename: &str, source_url: &str, table_element: &Element) {
    let document = web_sys::window().unwrap().document().unwrap();
    let row = document.create_element("tr").unwrap();
    let name = document.create_element("td").unwrap();
    let div1 = document.create_element("div").unwrap();
    div1.set_inner_html(&filename);
    name.append_child(&div1).unwrap();
    let div2 = document.create_element("div").unwrap();
    div2.set_inner_html(&source_url);
    name.append_child(&div2).unwrap();
    row.append_child(&name).unwrap();

    let data_td = document.create_element("td").unwrap();
    let pre = document.create_element("pre").unwrap();
    pre.set_inner_html(&data);
    data_td.append_child(&pre).unwrap();
    row.append_child(&data_td).unwrap();

    table_element.append_child(&row).unwrap();
}
