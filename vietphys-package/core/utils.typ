// 1. Lưu lại hàm chèn ảnh gốc của Typst
#let real-image = image

// 2. Override hàm image để tự động bắt lỗi placeholder
#let image(path, ..args) = {
  if "placeholder" in path {
    let w = args.named().at("width", default: 100%)
    box(width: w, height: 4cm, fill: luma(240), stroke: 1pt + luma(200), radius: 4pt)[
      #place(center + horizon)[
        #text(fill: luma(150), style: "italic", size: 10pt)[(Khu vực chờ chèn ảnh: #path)]
      ]
    ]
  } else {
    real-image(path, ..args)
  }
}

#let vp-qty(val, unit) = {
  let v = str(val).replace(".", ",")
  let v-content = if "e" in v {
    let parts = v.split("e")
    [#parts.at(0) $dot.c 10^#parts.at(1)$]
  } else {
    [#v]
  }

  let u-content = unit
  if type(unit) == str {
    let clean-u = unit.replace("um", "μm")
                      .replace("uC", "μC")
                      .replace("uF", "μF")
                      .replace("us", "μs")
    u-content = [#clean-u]
  }

  [#v-content#h(0.15em)#u-content]
}