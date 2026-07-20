// Import màu sắc từ thư mục themes
#import "../themes/colors.typ": *

#let vp-build-header(
  left: none,
  center: none,
  right: none,
  border-color: vp-colors.border,
  border-width: 0.5pt,
  bg-image: none
) = {
  if bg-image != none {
    box(width: 100%, height: 1.2cm)[
      #image(bg-image, width: 100%, height: 100%)
      #place(center + horizon)[#center]
      #place(left + horizon, dx: 1.5cm)[#left]
      #place(right + horizon, dx: -1.5cm)[#right]
    ]
  } else {
    block(width: 100%, stroke: (bottom: border-width + border-color), inset: (bottom: 8pt))[
      #grid(
        columns: (1fr, auto, 1fr),
        align: (left + horizon, center + horizon, right + horizon),
        left, center, right
      )
    ]
  }
}

#let vp-build-footer(
  left: none,
  center: none,
  right: none,
  border-color: vp-colors.border,
  border-width: 0.5pt
) = {
  set block(spacing: 0pt)
  line(length: 100%, stroke: border-width + border-color)
  v(4pt)
  grid(
    columns: (1fr, auto, 1fr),
    align: (left + horizon, center + horizon, right + horizon),
    left, center, right
  )
}

#let layout-custom-page(
  header-content: none,
  footer-content: none,
  body
) = {
  set page(
    paper: "a4",
    margin: (top: 2.5cm, bottom: 2cm, left: 1.5cm, right: 1.5cm),
    header: header-content,
    footer: footer-content,
    footer-descent: 30%,
  )
  set text(font: "Times New Roman", size: 12pt, lang: "vi")
  set par(justify: true)
  body
}