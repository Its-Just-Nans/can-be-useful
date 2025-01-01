def draw_rect(x, y, width, height, fill, stroke, stroke_width):
    return f'<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}" />'


def draw_text(x, y, text, fill):
    return f'<text x="{x}" y="{y}" fill="{fill}">{text}</text>'


def draw_line(x1, y1, x2, y2, stroke, stroke_width):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{stroke_width}" />'


def draw_circle(cx, cy, r, fill, stroke, stroke_width):
    return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_width}" />'


def write_svg(width, height, svg_content, output):
    header = (
        f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">'
    )
    with open(output, "w") as f:
        f.write(header + "\n".join(svg_content) + "</svg>")
