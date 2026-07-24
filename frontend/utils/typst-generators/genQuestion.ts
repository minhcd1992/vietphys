export const generateQuestion = (node: any): string => {
  const props = node.properties || {};
  // Ở đây thầy cứ giữ nguyên toàn bộ cái logic mapping đáp án, ma trận, 
  // tráo đề cũ mà thầy đã viết cực kỳ ngon lành nhé. 
  // Đoạn dưới này tôi chỉ viết ví dụ khung để nó không báo lỗi.
  
  const data = props.questionData || [];
  
  return `
// Khối gọi hàm Render Bài tập cũ của thầy
#vp-render-questions(
  // ... các tham số dữ liệu JSON chuyển thành dict của Typst
)
  `.trim();
};