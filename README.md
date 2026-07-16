# 🎓 Trang Web Chúc Mừng Tốt Nghiệp

Trang web đơn giản với mã bảo mật 8 số, video chúc mừng, pháo hoa và lời chúc — host miễn phí trên **GitHub Pages**.

## ✨ Tính năng

- 🔐 Nhập mã bảo mật 8 số để mở khóa
- 🎬 Video chúc mừng tốt nghiệp
- 🎆 Pháo hoa + lời chúc bay sau khi video kết thúc
- 📱 Responsive, hoạt động trên điện thoại

## 🚀 Deploy lên GitHub Pages (miễn phí)

### Bước 1: Tạo repository trên GitHub

1. Vào [github.com/new](https://github.com/new)
2. Đặt tên repo (ví dụ: `giang-tot-nghiep`)
3. Chọn **Public**
4. Bấm **Create repository**

### Bước 2: Đẩy code lên GitHub

```bash
cd d:\GiangTotNghiep
git init
git add .
git commit -m "Trang web chúc mừng tốt nghiệp"
git branch -M main
git remote add origin https://github.com/TEN-USER/TEN-REPO.git
git push -u origin main
```

### Bước 3: Bật GitHub Pages

1. Vào repo → **Settings** → **Pages**
2. **Source**: chọn branch `main`, folder `/ (root)`
3. Bấm **Save**
4. Sau 1–2 phút, truy cập: `https://TEN-USER.github.io/TEN-REPO/`

## ⚙️ Tùy chỉnh

### Đổi mã bảo mật

Mở file `js/config.js` và sửa:

```js
securityCode: '16072026',  // ← đổi thành mã 8 số của bạn
```

### Thêm video chúc mừng

1. Chuẩn bị file video MP4 (khuyến nghị ≤ 50MB để load nhanh)
2. Đặt vào: `assets/video/chuc-mung.mp4`
3. (Tuỳ chọn) Thêm ảnh poster: `assets/poster.jpg`

### Đổi lời chúc

Sửa mảng `wishes` trong `js/config.js`.

## 📁 Cấu trúc thư mục

```
GiangTotNghiep/
├── index.html
├── css/style.css
├── js/
│   ├── config.js    ← mã bảo mật & lời chúc
│   └── main.js
├── assets/
│   ├── video/
│   │   └── chuc-mung.mp4   ← thêm video của bạn
│   └── poster.jpg          ← (tuỳ chọn)
└── README.md
```

## 🔑 Mã mặc định

Mã mặc định: **16072026** (ngày 16/07/2026)

> Lưu ý: Mã được lưu trong file JS nên không thực sự bảo mật tuyệt đối — phù hợp cho quà tặng vui, không dùng cho dữ liệu nhạy cảm.

## 🖥️ Chạy thử local

Mở trực tiếp `index.html` bằng trình duyệt, hoặc dùng Live Server trong VS Code / Cursor.
