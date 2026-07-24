// KHỐI CHÈN HÌNH ẢNH
#let vp-image(
  path, // Đổi src: "" thành tham số vị trí bắt buộc
  caption: "",
  width: 80%,
  align-pos: center
) = {
  align(align-pos)[
    #figure(
      image(path, width: width),
      caption: caption
    )
  ]
}

// KHỐI CÔNG THỨC TOÁN HỌC ĐỘC LẬP
#let vp-formula(
  eq: "",
  numbered: false
) = {
  if numbered {
    math.equation(block: true, numbering: "(1)", eval(eq, mode: "math"))
  } else {
    math.equation(block: true, eval(eq, mode: "math"))
  }
}