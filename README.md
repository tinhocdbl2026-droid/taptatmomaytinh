# Bé Học Bật và Tắt Máy Tính

Ứng dụng React + Vite mô phỏng thao tác bật, tắt và cho máy tính ngủ dành cho học sinh tiểu học.

## Chạy trên máy

Dùng Node.js 24 LTS (tối thiểu 22.12), sau đó chạy:

```sh
npm ci
npm run dev
```

Mở địa chỉ Vite hiển thị, gồm đường dẫn `/taptatmomaytinh/`.
Ứng dụng mô phỏng hiện tại không cần Gemini API key. Không mở trực tiếp index.html bằng cách nhấp đúp.

## Kiểm tra bản xuất bản

```sh
npm run lint
npm run build
npm run preview
```

Mở địa chỉ preview kèm `/taptatmomaytinh/`. Thư mục `dist` mới là bản chạy trên máy chủ tĩnh.

## GitHub Pages và lỗi trang trắng

Website: https://tinhocdbl2026-droid.github.io/taptatmomaytinh/

Nguyên nhân đã xác minh:

1. Pages được đặt thành **Deploy from a branch / main / root**, nên xuất bản index.html nguồn. HTML yêu cầu `/src/main.tsx`, bị 404 trên Pages và React không khởi động. Pages không tự biên dịch TSX.
2. Workflow npm ci thất bại do esbuild 0.25 xung đột với peer dependency của Vite 8. Đã bỏ esbuild trực tiếp không dùng đến và cập nhật package-lock.json.
3. vite.config.ts nhập sai `@vitejs.plugin-react`. Tên đúng là `@vitejs/plugin-react`.
4. CSS có `@import "tailwindcss"` nhưng thiếu plugin Tailwind trong Vite. Đã thêm `tailwindcss()` để tạo CSS tiện ích.

Cách triển khai sau khi hợp nhất bản sửa:

1. Vào **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Vào **Actions → Build and deploy Vite site to Pages**. Push vào main sẽ tự chạy; hoặc chọn **Run workflow**, nhánh main.
3. Chờ cả build và deploy màu xanh. Workflow dùng Node 24, chạy npm ci, kiểm tra TypeScript, build và tải đúng thư mục dist lên Pages.
4. Mở website, nhấn Ctrl+F5 nếu trình duyệt còn giữ bản cũ.

Giữ `base: '/taptatmomaytinh/'` trong vite.config.ts. Nếu đổi tên repository, cần đổi base tương ứng.
Không dùng `--force` hoặc `--legacy-peer-deps` để che lỗi phụ thuộc. Khi sửa package.json, cập nhật package-lock.json bằng npm install rồi kiểm tra lại npm ci.

Pull request chạy kiểm tra build và TypeScript, không triển khai website. Chỉ nhánh main hoặc thao tác Run workflow mới triển khai.
