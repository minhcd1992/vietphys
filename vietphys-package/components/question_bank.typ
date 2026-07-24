// =================================================================
// TÊN GÓI: ENGINE CÂU HỎI VÀ LỜI GIẢI (Core Logic - v1.0 Final)
// =================================================================

#import "../themes/default_theme.typ": *

// -----------------------------------------------------------------
// 1. KHỞI TẠO STATE & COUNTER
// -----------------------------------------------------------------
#let vp-q-counter = counter("vp-question")
#let vp-show-ans = state("vp-show-ans", false)
#let vp-show-sol = state("vp-show-sol", false)
#let vp-show-level = state("vp-show-level", true)
#let vp-show-source = state("vp-show-source", true)
#let vp-sol-store = state("vp-sol-store", ())

#let vp-question-theme = (
  mcq: (bg: none, border: none, lines: 0, ans-color: vp-colors.danger, ans-shape: "circle", ans-mark-bg: none, ans-mark-border: rgb("#333"), ans-mark-width: 0.8pt, ans-text-color: rgb("#333"), level-color: vp-colors.primary, source-color: vp-colors.text-muted),
  tf: (bg: none, border: none, lines: 0, tf-header: rgb("#F5F5F5"), tf-correct-color: vp-colors.success, tf-wrong-color: vp-colors.danger, ans-mark-bg: none, ans-mark-border: rgb("#333"), ans-mark-width: 0.8pt, level-color: vp-colors.primary, source-color: vp-colors.text-muted),
  short: (bg: none, border: none, lines: 0, ans-color: vp-colors.danger, level-color: vp-colors.primary, source-color: vp-colors.text-muted),
  essay: (bg: none, border: none, lines: 5, ans-color: vp-colors.danger, level-color: vp-colors.primary, source-color: vp-colors.text-muted),
)
#let vp-theme-state = state("vp-theme-state", vp-question-theme)


// -----------------------------------------------------------------
// 2. CÁC HÀM UI PHỤ TRỢ
// -----------------------------------------------------------------
#let _typst-type = type

#let _render-dotlines(lines-count) = {
  if lines-count > 0 {
    v(8pt)
    for i in range(lines-count) {
      line(length: 100%, stroke: (paint: luma(120), thickness: 0.8pt, dash: "dotted"))
      v(1.2em)
    }
  }
}

#let _render-short-boxes(border-color, bg-color, ans-str, show-ans, ans-color) = {
  v(8pt)
  let chars = ()
  if show-ans and ans-str != none { chars = str(ans-str).clusters() }
  while chars.len() < 4 { chars.push("") }
  chars = chars.slice(0, 4)
  align(right)[
    #stack(dir: ltr, spacing: 6pt,
      ..chars.map(c => box(
        width: 1.8em, height: 1.8em,
        stroke: 1.2pt + if c != "" { ans-color } else { border-color },
        fill: if c != "" { bg-color } else { bg-color },
        radius: 2pt,
        align(center + horizon)[#text(fill: ans-color, weight: "bold", size: 14pt)[#c]]
      ))
    )
  ]
}

#let bg-color-or(c) = if _typst-type(c) == color { c.lighten(85%) } else { rgb("#FFF1F0") }

#let _render-tf(statements, style, header-bg, header-color, border-color, row-bg, ans-tf, show-ans, correct-color, wrong-color, box-bg, box-border, box-width) = {
  if statements.len() > 0 {
    v(8pt)
    let fill-val = if box-bg == auto { none } else { box-bg }
    let stroke-color = if box-border == auto { luma(150) } else { box-border }
    let stroke-size = if box-width == auto { 0.8pt } else { box-width }
    
    let empty-box = box(width: 12pt, height: 12pt, fill: fill-val, stroke: stroke-size + stroke-color, radius: 2pt)

    if style == "table" {
      table(
        columns: (1fr, 35pt, 35pt), align: (left+horizon, center+horizon, center+horizon), stroke: 0.5pt + border-color,
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[Phát biểu]),
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[Đ]),
        table.cell(fill: header-bg, align: center, text(fill: header-color, weight: "bold")[S]),
        ..statements.enumerate().map(((i, s)) => {
          let is-d = show-ans and ans-tf.len() > i and ans-tf.at(i) == "Đ"
          let is-s = show-ans and ans-tf.len() > i and ans-tf.at(i) == "S"
          (
            table.cell(fill: row-bg, align: left, [ *#("abcd".at(i)))* #s ]),
            table.cell(fill: if is-d { bg-color-or(correct-color) } else { row-bg })[#if is-d { text(fill: correct-color, weight: "bold")[✓] } else { empty-box }],
            table.cell(fill: if is-s { bg-color-or(wrong-color) } else { row-bg })[#if is-s { text(fill: wrong-color, weight: "bold")[✗] } else { empty-box }],
          )
        }).flatten()
      )
    } else {
      for (i, s) in statements.enumerate() [
        *#("abcd".at(i)))*
        #if show-ans and ans-tf.len() > i [
          #let correct = ans-tf.at(i) == "Đ"
          #text(fill: if correct { correct-color } else { wrong-color }, weight: "bold")[ (#if correct [✓ Đ] else [✗ S])]
        ] else [ #h(4pt) #empty-box Đ #h(4pt) #empty-box S ]
        #s \ #v(4pt)
      ]
    }
  }
}

#let _render-mcq-marker(letter, shape, mark-bg, mark-border, mark-width, text-color) = {
  let fill-val = if mark-bg == auto { none } else { mark-bg }
  let r = if shape == "square" { 3pt } else { 50% }
  box(width: 1.6em, height: 1.6em, fill: fill-val, stroke: mark-width + mark-border, radius: r, align(center + horizon)[#text(fill: text-color, weight: "bold")[#letter]])
}

#let _render-essay-answer(ans, show-ans, ans-color) = {
  if show-ans and ans != none {
    v(8pt)
    text(fill: ans-color, weight: "bold")[➜ Đáp số: #ans]
  }
}


// -----------------------------------------------------------------
// 3. COMPONENT CHÍNH: CÂU HỎI
// -----------------------------------------------------------------
#let vp-question(
  stem, type: "mcq", options: (), statements: (), ans: none, ans-tf: (), sol: none, level: none, source: none,
  lines: auto, q-bg: auto, q-border: auto, tf-header-bg: auto, ans-color: auto, tf-correct-color: auto, tf-wrong-color: auto, ans-shape: auto, ans-mark-bg: auto, ans-mark-border: auto, ans-mark-width: auto, ans-text-color: auto, level-color: auto, source-color: auto,
  q-radius: 5pt, q-padding: 12pt, q-margin: 6pt, lbl-color: rgb("#1890FF"), lbl-bg: none, lbl-radius: 0pt, lbl-padding: 0pt, icon-before: none, icon-after: none, opt-color: rgb("#333333"), opt-bg: none, opt-border: none, opt-radius: 0pt, opt-padding: 0pt, tf-style: "table", tf-header-color: white, tf-border: rgb("#E8E8E8"), tf-row-bg: none, short-border: rgb("#333333"), short-bg: none, image: none, image-ratio: 0.65, image-gap: 4%, image-side: "right", image-valign: top,
) = {
  vp-q-counter.step()
  context {
    let num = vp-q-counter.get().first()
    let is-ans = vp-show-ans.get()
    let is-sol = vp-show-sol.get()
    let is-level = vp-show-level.get()
    let is-source = vp-show-source.get()
    
    let theme-dict = vp-theme-state.get()
    let theme = theme-dict.at(type, default: theme-dict.mcq)

    let final-bg = if q-bg == auto { theme.at("bg", default: none) } else { q-bg }
    let final-border = if q-border == auto { theme.at("border", default: none) } else { q-border }
    let final-lines = if lines == auto { theme.at("lines", default: 0) } else { lines }
    let final-tf-header = if tf-header-bg == auto { theme.at("tf-header", default: rgb("#F5F5F5")) } else { tf-header-bg }
    let final-ans-color = if ans-color == auto { theme.at("ans-color", default: vp-colors.danger) } else { ans-color }
    let final-tf-correct = if tf-correct-color == auto { theme.at("tf-correct-color", default: vp-colors.success) } else { tf-correct-color }
    let final-tf-wrong = if tf-wrong-color == auto { theme.at("tf-wrong-color", default: vp-colors.danger) } else { tf-wrong-color }
    let final-ans-shape = if ans-shape == auto { theme.at("ans-shape", default: "circle") } else { ans-shape }
    let final-ans-mark-bg = if ans-mark-bg == auto { theme.at("ans-mark-bg", default: none) } else { ans-mark-bg }
    let final-ans-mark-border = if ans-mark-border == auto { theme.at("ans-mark-border", default: rgb("#333")) } else { ans-mark-border }
    let final-ans-mark-width = if ans-mark-width == auto { theme.at("ans-mark-width", default: 0.8pt) } else { ans-mark-width }
    let final-ans-text-color = if ans-text-color == auto { theme.at("ans-text-color", default: rgb("#333")) } else { ans-text-color }
    let final-level-color = if level-color == auto { theme.at("level-color", default: vp-colors.primary) } else { level-color }
    let final-source-color = if source-color == auto { theme.at("source-color", default: vp-colors.text-muted) } else { source-color }

    vp-sol-store.update(arr => {
      arr.push((num: num, type: type, ans: ans, ans-tf: ans-tf, sol: sol, shown_inline: is-sol))
      arr
    })

    let has-visible-source = is-source and source != none
    let final-inset = if final-bg == none and final-border == none { 0pt } else { q-padding }
    let final-outset = if final-bg == none and final-border == none { 0pt } else { q-margin }

    let header-items = ()
    header-items.push(text(weight: "bold", fill: lbl-color)[#if icon-before != none [#icon-before ] Câu #num:#if icon-after != none [ #icon-after]])
    if is-level and level != none { header-items.push(text(fill: final-level-color, weight: "bold")[\[#level\]]) }
    if has-visible-source { header-items.push(text(fill: final-source-color, style: "italic")[\[#source\]]) }

    let q-body = [
      #block(spacing: 8pt)[#header-items.join("  ")]
      #block(spacing: 12pt)[#stem]
      
      #if type == "mcq" and options.len() > 0 [
        #let max-w = 0pt
        #for (i, opt) in options.enumerate() {
          let size = measure(opt)
          if size.width > max-w { max-w = size.width }
        }
        #let total-w = max-w + 40pt 
        #let cols-count = if total-w > 7.5cm { 1 } else if total-w > 3.5cm { 2 } else { 4 }

        #grid(
          columns: (1fr,) * cols-count, gutter: 12pt,
          ..options.enumerate().map(((i, opt)) => {
            let is-correct = is-ans and ans == str("ABCD".at(i))
            let letter = str("ABCD".at(i)) + "."
            let marker = if is-correct {
              _render-mcq-marker(letter, final-ans-shape, final-ans-mark-bg, final-ans-mark-border, final-ans-mark-width, final-ans-text-color)
            } else {
              box(width: 1.6em, height: 1.6em, fill: opt-bg, stroke: opt-border, radius: opt-radius, align(center + horizon)[#text(weight: "bold", fill: opt-color)[#letter]])
            }
            let opt-content = if is-correct { text(fill: final-ans-text-color, weight: "bold")[#opt] } else { opt }
            [ #grid(columns: (auto, 1fr), gutter: 8pt, align: top, marker, box(inset: (top: 0.25em))[#opt-content]) ]
          })
        )
      ] else if type == "tf" [
        #_render-tf(statements, tf-style, final-tf-header, tf-header-color, tf-border, tf-row-bg, ans-tf, is-ans, final-tf-correct, final-tf-wrong, final-ans-mark-bg, final-ans-mark-border, final-ans-mark-width)
      ] else if type == "short" [
        #_render-short-boxes(short-border, short-bg, ans, is-ans, final-ans-color)
      ] else if type == "essay" [
        #_render-essay-answer(ans, is-ans, final-ans-color)
      ]
    ]

    let layout-with-image = if image != none {
      let left-col = if image-side == "left" { 1fr * image-ratio } else { 1fr }
      let right-col = if image-side == "left" { 1fr } else { 1fr * image-ratio }
      grid(columns: (left-col, right-col), gutter: image-gap, align: image-valign,
        if image-side == "left" { image } else { q-body },
        if image-side == "left" { q-body } else { image }
      )
    } else { q-body }

    let final-content = [
      #layout-with-image
      #if not is-sol [ #_render-dotlines(final-lines) ]
      #if is-sol and sol != none [
        #v(12pt)
        #block(fill: rgb("#F6FFED"), stroke: (left: 3pt + vp-colors.success), radius: (right: 4pt), inset: 12pt, width: 100%, breakable: true)[
          #text(fill: vp-colors.success, weight: "bold")[Lời giải:] \ #v(4pt) #sol
        ]
      ]
    ]

    block(fill: final-bg, stroke: final-border, radius: q-radius, inset: final-inset, outset: final-outset, width: 100%)[#final-content]
  }
}


// -----------------------------------------------------------------
// 4. CÁC HÀM XUẤT ĐÁP ÁN CUỐI SÁCH
// -----------------------------------------------------------------
#let vp-print-solutions(title: "HƯỚNG DẪN GIẢI CHI TIẾT") = {
  context {
    let arr = vp-sol-store.get().filter(item => item.sol != none and not item.shown_inline)
    if arr.len() > 0 {
      let c-success = vp-colors.at("success", default: rgb("#52C41A"))
      heading(level: 1)[#text(fill: c-success)[#title]]
      for item in arr {
        block(fill: rgb("#F6FFED"), stroke: 1pt + c-success, radius: 4pt, inset: 12pt, width: 100%, breakable: true)[
          *Câu #item.num:* \ #v(4pt) #item.sol
        ]
        v(10pt)
      }
    }
  }
}

#let vp-print-keys(title: "BẢNG ĐÁP ÁN NHANH") = {
  context {
    let store = vp-sol-store.get()
    let mcqs = store.filter(x => x.type == "mcq" and x.ans != none)
    let tfs = store.filter(x => x.type == "tf" and x.ans-tf != ())
    let shorts = store.filter(x => (x.type == "short" or x.type == "essay") and x.ans != none)

    let c-border = vp-colors.at("border", default: rgb("#E8E8E8"))
    let c-danger = vp-colors.at("danger", default: rgb("#FF4D4F"))
    let c-primary = vp-colors.at("primary", default: rgb("#1890FF"))
    let c-success = vp-colors.at("success", default: rgb("#52C41A"))
    let table-stroke = 0.5pt + c-border

    if store.len() > 0 {
      heading(level: 1)[#text(fill: c-danger)[#title]]
      
      if mcqs.len() > 0 {
        heading(level: 2)[#text(fill: c-primary)[PHẦN I. TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN]]
        table(
          columns: (1fr,) * 5, stroke: table-stroke, align: center + horizon,
          ..mcqs.map(it => [ *#it.num.* #text(fill: c-danger, weight: "bold")[#it.ans] ])
        )
      }
      
      if tfs.len() > 0 {
        heading(level: 2)[#text(fill: c-primary)[PHẦN II. TRẮC NGHIỆM ĐÚNG/SAI]]
        table(
          columns: (auto, 1fr, 1fr, 1fr, 1fr), stroke: table-stroke, align: center + horizon,
          table.cell(fill: rgb("#FAFAFA"))[*Câu*], table.cell(fill: rgb("#FAFAFA"))[*a)*], table.cell(fill: rgb("#FAFAFA"))[*b)*], table.cell(fill: rgb("#FAFAFA"))[*c)*], table.cell(fill: rgb("#FAFAFA"))[*d)*],
          ..tfs.map(it => {
            let cells = (table.cell(fill: rgb("#FAFAFA"))[*#it.num*],)
            let ans = it.ans-tf
            while ans.len() < 4 { ans.push("") }
            for a in ans.slice(0, 4) {
              let c = if a == "Đ" { c-success } else if a == "S" { c-danger } else { black }
              cells.push(text(fill: c, weight: "bold")[#a])
            }
            cells
          }).flatten()
        )
      }
      
      if shorts.len() > 0 {
        heading(level: 2)[#text(fill: c-primary)[PHẦN III. TRẢ LỜI NGẮN]]
        table(
          columns: (1fr,) * 4, stroke: table-stroke, align: center + horizon,
          ..shorts.map(it => [ *#it.num.* #text(fill: c-danger, weight: "bold")[#it.ans] ])
        )
      }
    }
  }
}