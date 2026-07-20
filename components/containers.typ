#let vp-css-box(
  body,
  width: 100%,
  icon: none,
  bg: none,
  border: none,
  radius: 0pt,
  padding: 12pt,
  shadow: none,          
  text-color: black,
  text-size: 14pt,
  text-weight: "bold",
  icon-box: none,        
  label-top-left: none   
) = {
  let icon-content = if icon != none {
    if icon-box != none {
      box(
        fill: icon-box.at("bg", default: none),
        radius: icon-box.at("radius", default: 0pt),
        inset: icon-box.at("padding", default: 4pt),
        baseline: 20%
      )[#text(fill: icon-box.at("color", default: black))[#icon]]
    } else {
      box(baseline: 15%)[#icon]
    }
  } else { none }

  let inner-content = [
    #if icon-content != none [#icon-content #h(8pt)]
    #text(fill: text-color, size: text-size, weight: text-weight)[#body]
  ]

  let main-block = block(
    width: width,
    fill: bg,
    stroke: border,
    radius: radius,
    inset: padding,
  )[#inner-content]

  let shadowed-block = if shadow != none {
    block(width: width)[
      #place(
        dx: shadow.at("dx", default: 3pt), 
        dy: shadow.at("dy", default: 3pt)
      )[
        #block(
          width: width, 
          fill: shadow.at("color", default: black), 
          stroke: none, 
          radius: radius, 
          inset: padding
        )[#hide[#inner-content]]
      ]
      #main-block
    ]
  } else {
    main-block
  }

  if label-top-left != none {
    block(width: width, breakable: false)[
      #shadowed-block
      #place(
        top + left, 
        dx: label-top-left.at("dx", default: 15pt), 
        dy: label-top-left.at("dy", default: -14pt) 
      )[
        #block(
          fill: label-top-left.at("bg", default: rgb("#1890FF")),
          inset: label-top-left.at("padding", default: (x: 12pt, y: 6pt)),
          radius: label-top-left.at("radius", default: 2pt)
        )[
          #text(
            fill: label-top-left.at("color", default: white),
            size: label-top-left.at("size", default: 12pt),
            weight: label-top-left.at("weight", default: "bold")
          )[#label-top-left.at("text")]
        ]
      ]
    ]
  } else {
    shadowed-block
  }
}

#let vp-row(cols: (1fr, 1fr, 1fr, 1fr), gap: 10pt, ..items) = {
  grid(columns: cols, gutter: gap, ..items)
}

#let vp-block(bg: none, border: none, radius: 0pt, padding: 0pt, margin: 0pt, body) = {
  v(margin)
  block(fill: bg, stroke: border, radius: radius, inset: padding, width: 100%, breakable: true, body)
  v(margin)
}

#let vp-img-side(
  image-content,
  ratio: 0.65,
  gap: 4%,
  side: "right",
  valign: top,
  body,
) = {
  let content-col = align(valign + left, body)
  let image-col = align(valign + center, image-content)
  let cols = (ratio * 1fr, (1 - ratio) * 1fr)
  if side == "left" {
    grid(columns: cols.rev(), column-gutter: gap, image-col, content-col)
  } else {
    grid(columns: cols, column-gutter: gap, content-col, image-col)
  }
}