export const VP_COLORS = [
  { name: 'Trong suốt', val: 'none', hex: 'transparent' },
  { name: 'NiceBlue', val: 'NiceBlue', hex: '#1890FF' },
  { name: 'FlameRed', val: 'FlameRed', hex: '#FF3B1D' },
  { name: 'FireOrange', val: 'FireOrange', hex: '#FF7A1D' },
  { name: 'NiceGreen', val: 'NiceGreen', hex: '#52C41A' },
  { name: 'NiceViolet', val: 'NiceViolet', hex: '#722ED1' },
  { name: 'VPGray', val: 'vpgray', hex: '#606060' },
  { name: 'Đen', val: 'black', hex: '#000000' },
  { name: 'Trắng', val: 'white', hex: '#FFFFFF' },
];

export const hexToRgbA = (hex: string, alpha: number) => {
    let c: any;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');
        if(c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        c = '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    return hex;
};

export const TOOLBOX_ITEMS = [
  {
    type: 'Container',
    moduleName: 'Container',
    icon: 'fa-box',
    defaultProps: {
      layoutType: 'flex',
      direction: 'column',
      gap: '10pt',
      padding: '10pt',
      width: '100%',
      color: '#1890FF' // 👈 THÊM DÒNG NÀY ĐỂ BẬT BẢNG CHỌN MÀU THEME
    }
  },
  { type: "Container", moduleName: "Header", icon: "fas fa-arrow-up", defaultProps: { direction: "row", gap: "10pt", paddingBottom: "10pt", bgType: "solid", bg: "none", borderLinked: false, borderBottomStyle: "solid", borderBottomWidth: "1.5pt", borderBottomColor: "#1890FF", width: "100%" } },
  { type: "Container", moduleName: "Footer", icon: "fas fa-arrow-down", defaultProps: { direction: "row", gap: "10pt", paddingTop: "10pt", bgType: "solid", bg: "none", borderLinked: false, borderTopStyle: "solid", borderTopWidth: "1pt", borderTopColor: "#606060", width: "100%" } },
  { type: "Widget", moduleName: "Chapter", icon: "fas fa-book-open", defaultProps: { num: "I", title: "TÊN CHƯƠNG", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Lesson", icon: "fas fa-book", defaultProps: { num: "1", title: "TÊN BÀI HỌC", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Section", icon: "fas fa-bookmark", defaultProps: { num: "1", title: "TIÊU ĐỀ PHẦN", color: "#1890FF", width: "100%" } },
  { type: "Widget", moduleName: "Form", icon: "fas fa-tasks", defaultProps: { num: "1", title: "Tên dạng bài", color: "#FF3B1D", width: "100%" } },
  { type: "Widget", moduleName: "Box", icon: "fas fa-lightbulb", defaultProps: { boxType: "warning", title: "Chú ý", content: "Nội dung ghi chú...", width: "100%" } },
  { type: "Widget", moduleName: "Text", icon: "fas fa-font", defaultProps: { content: "Nhập văn bản *tại đây*...", align: "left", fontSize: "12", fontUnit: "pt", fontWeight: "regular", color: "#000000", width: "100%" } },
  { type: "Widget", moduleName: "Image", icon: "fas fa-image", defaultProps: { content: "placeholder_hinh_1.png", width: "70%" } },
  { type: "Widget", moduleName: "Icon", icon: "fas fa-star", defaultProps: { iconName: "fa-star", color: "#1890FF", fontSize: "16", fontUnit: "pt", align: "center", width: "auto" } },
  { 
    type: "Widget", 
    moduleName: "QuestionBlock", 
    icon: "fas fa-question-circle", 
    defaultProps: { 
      // Chế độ: 'manual' (chọn tay) hoặc 'matrix' (động theo ma trận)
      mode: "manual", 
      
      // Chế độ Manual: Chứa ID các câu hỏi được chọn tay
      selectedQuestions: [], 
      
      // Chế độ Matrix: Chứa các luật rút trích ngẫu nhiên
      // Ví dụ: [{ topic: "Dao động cơ", level: "Vận dụng", count: 2 }]
      matrixRules: [], 

      // Cài đặt hiển thị (Ánh xạ thẳng vào hàm #vp-question của Typst)
      showOptions: true,
      optionsLayout: 4, // 1, 2, hoặc 4 cột
      showSolution: false,
      
      width: "100%",
      padding: "10pt"
    } 
  },
];