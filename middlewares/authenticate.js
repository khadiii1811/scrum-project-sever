export default function authenticate(req, res, next) {
  // Gán giá trị user giả lập (giả sử đang đăng nhập)
  req.user = { user_id: 1, role: 'manager' };
  next();
}
