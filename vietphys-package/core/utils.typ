// =================================================================
// utils.typ - CÁC HÀM TIỆN ÍCH LÕI CỦA HỌC KAGE
// =================================================================

// -----------------------------------------------------------------
// [ HỆ THỐNG TỰ ĐỘNG BẮT LỖI ẢNH PLACEHOLDER ]
// -----------------------------------------------------------------
// 1. Lưu lại hàm chèn ảnh gốc của Typst
#let real-image = image

// 2. Override hàm image để tự động vẽ khung nháp nếu đường dẫn có chữ "placeholder"
#let image(source, ..args) = {
  // `path("...")` preserves the caller's directory for real images.
  if type(source) == str and "placeholder" in source {
    let w = args.named().at("width", default: 100%)
    box(width: w, height: 4cm, fill: luma(240), stroke: 1pt + luma(200), radius: 4pt)[
      #place(center + horizon)[
        #text(fill: luma(150), style: "italic", size: 10pt)[(Khu vực chờ chèn ảnh: #source)]
      ]
    ]
  } else {
    // Nếu là ảnh thật (không có chữ placeholder), chèn bình thường
    real-image(source, ..args)
  }
}

// -----------------------------------------------------------------
// [ HÀM XỬ LÝ ĐẠI LƯỢNG VẬT LÝ & ĐƠN VỊ CỰC MẠNH ]
// -----------------------------------------------------------------
#let vp-qty(val, unit) = {
  // 1. Tự động đổi dấu chấm thập phân thành dấu phẩy (chuẩn Việt Nam)
  let v = str(val).replace(".", ",")
  
  // 2. Xử lý ký hiệu khoa học (VD: 1.5e-6 -> 1,5 x 10^-6)
  let v-content = if "e" in v {
    let parts = v.split("e")
    [#parts.at(0) $dot.c 10^#parts.at(1)$]
  } else {
    [#v]
  }

  // 3. Xử lý tự động đổi các tiền tố Micro (u -> μ)
  let u-content = unit
  if type(unit) == str {
    let clean-u = unit.replace("um", "μm")
                      .replace("uC", "μC")
                      .replace("uF", "μF")
                      .replace("us", "μs")
    u-content = [#clean-u]
  }

  // Trả về kết quả: Giá trị + Khoảng trắng mỏng + Đơn vị
  [#v-content#h(0.15em)#u-content]
}
