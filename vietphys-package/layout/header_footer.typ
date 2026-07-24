// Tiêu đề đầu trang
#let vp-header(
  left-text: "", 
  center-text: "", 
  right-text: "", 
  color: rgb("#000000"),
  line-width: 1pt
) = {
  block(width: 100%, stroke: (bottom: line-width + color), inset: (bottom: 5pt))[
    #grid(
      columns: (1fr, auto, 1fr),
      align(left)[#text(fill: color, size: 10pt)[#left-text]],
      align(center)[#text(fill: color, size: 10pt, weight: "bold")[#center-text]],
      align(right)[#text(fill: color, size: 10pt)[#right-text]]
    )
  ]
}

// Chân trang (Thường dùng đánh số trang)
#let vp-footer(
  left-text: "", 
  center-text: "", 
  right-text: "", 
  color: rgb("#000000"),
  line-width: 1pt
) = {
  block(width: 100%, stroke: (top: line-width + color), inset: (top: 5pt))[
    #grid(
      columns: (1fr, auto, 1fr),
      align(left)[#text(fill: color, size: 10pt)[#left-text]],
      align(center)[#text(fill: color, size: 10pt)[#center-text]],
      align(right)[#text(fill: color, size: 10pt)[#right-text]]
    )
  ]
}