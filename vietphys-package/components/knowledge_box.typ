// KHỐI ĐỊNH LÝ, ĐỊNH NGHĨA, LƯU Ý
#let vp-knowledge-box(
  title: "",
  content: [],
  type: "definition", // Hỗ trợ: definition, theorem, warning, note
  color: rgb("#1890FF")
) = {
  let bg-color = color.lighten(90%)
  
  if type == "definition" {
    // Khung Định Nghĩa: Kín 4 viền, viền trái nhấn đậm
    block(
      width: 100%,
      fill: bg-color,
      stroke: (left: 4pt + color, top: 1pt + color, right: 1pt + color, bottom: 1pt + color),
      radius: (right: 4pt),
      inset: 12pt
    )[
      #if title != "" {
        text(fill: color, weight: "bold", size: 12pt)[#title]
        v(4pt)
      }
      #content
    ]
  } else if type == "theorem" {
    // Khung Định Lý: Nền nhạt, không viền, nội dung in nghiêng
    block(width: 100%, fill: bg-color, radius: 4pt, inset: 12pt)[
      #if title != "" {
        text(fill: color, weight: "bold", size: 12pt)[#title]
        v(4pt)
      }
      #text(style: "italic")[#content]
    ]
  } else if type == "warning" {
    // Khung Cảnh Báo: Chữ đỏ, có Icon dấu chấm than
    let warn-color = rgb("#FF3B1D")
    block(width: 100%, stroke: 1pt + warn-color, radius: 4pt, inset: 10pt)[
      #grid(
        columns: (auto, 1fr),
        column-gutter: 8pt,
        align: (center+top, left+top),
        text(fill: warn-color, size: 14pt, weight: "bold")[!], 
        [
          #if title != "" { text(fill: warn-color, weight: "bold")[#title #linebreak()] }
          #content
        ]
      )
    ]
  } else {
    // Mặc định (Note): Chỉ có viền dọc bên trái
    block(width: 100%, stroke: (left: 3pt + color), inset: (left: 10pt))[
      #if title != "" { text(fill: color, weight: "bold")[#title #linebreak()] }
      #content
    ]
  }
}