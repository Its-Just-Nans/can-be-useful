use egui::{pos2, Color32, ColorImage, Mesh, Pos2, Rect, Response, Sense, Shape, Ui, Widget};

pub struct ImageMemory {}

impl ImageMemory {
    pub fn new() -> Self {
        Self {}
    }

    pub fn get_points(&self) -> Vec<Shape> {
        // TODO
        let segment = Shape::LineSegment {
            points: [Pos2::new(0.0, 0.0), Pos2::new(100.0, 100.0)],
            stroke: epaint::PathStroke::new(1.0, egui::Color32::WHITE),
        };
        return vec![segment];
    }
}

pub struct Map<'a> {
    memory: &'a mut ImageMemory,
}

impl<'a> Map<'a> {
    pub fn new(memory: &'a mut ImageMemory) -> Self {
        Self { memory }
    }
}

impl Widget for Map<'_> {
    fn ui(self, ui: &mut Ui) -> Response {
        let (rect, response) = ui.allocate_exact_size(ui.available_size(), Sense::click_and_drag());

        let painter = ui.painter().with_clip_rect(rect);

        for shape in self.memory.get_points() {
            painter.add(shape);
        }
        let img = ColorImage::example();
        let texture = ui.ctx().load_texture("image", img, Default::default());

        // basic display
        // ui.image((texture.id(), texture.size_vec2()));

        let mut mesh = Mesh::with_texture(texture.id());
        mesh.add_rect_with_uv(
            rect,
            Rect::from_min_max(pos2(0., 0.0), pos2(1.0, 1.0)),
            Color32::WHITE,
        );
        painter.add(mesh);
        response
    }
}
