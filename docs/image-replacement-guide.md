# Hướng dẫn Thay thế Hình ảnh Placeholder

## Vấn đề

Ứng dụng gặp lỗi `net::ERR_NAME_NOT_RESOLVED` khi tải hình ảnh từ `via.placeholder.com`. Lỗi này có thể xảy ra do:

- Vấn đề DNS hoặc kết nối mạng
- Chặn truy cập từ firewall/proxy
- Dịch vụ via.placeholder.com tạm thời không khả dụng

## Giải pháp Đã Triển khai

### 1. Thay thế bằng Picsum Photos

Đã thay thế tất cả URL từ `via.placeholder.com` bằng `picsum.photos` - một dịch vụ cung cấp hình ảnh ngẫu nhiên chất lượng cao và ổn định.

### 2. Mapping Hình ảnh Thông minh

```javascript
const imageMapping = {
  // Hình ảnh sản phẩm
  'Product+Image': 'https://picsum.photos/300/300?random=1',
  'iPhone+15+Pro+Max': 'https://picsum.photos/500/500?random=2',
  
  // Hình ảnh danh mục
  'Fashion+Nam': 'https://picsum.photos/200/200?random=8',
  'Sneaker': 'https://picsum.photos/200/200?random=9',
  'Shoes': 'https://picsum.photos/200/200?random=10',
  'Bags': 'https://picsum.photos/200/200?random=11',
  'Automotive': 'https://picsum.photos/200/200?random=12',
  'Health': 'https://picsum.photos/200/200?random=13',
  
  // Logo thương hiệu
  'Adidas': 'https://picsum.photos/100/100?random=14'
};
```

### 3. Các File Đã Được Cập nhật

- `src/components/home/ProductSection.tsx`
- `src/pages/OrderSuccess.tsx`
- `src/components/home/Banner.tsx`
- `src/components/home/CategoryGrid.tsx`
- `src/components/home/FlashSale.tsx`
- `src/components/product/ProductReviews.tsx`
- `src/pages/Home.tsx`
- `src/pages/ProductDetail.tsx`

## Lợi ích của Picsum Photos

### ✅ Ưu điểm

- **Độ tin cậy cao**: Dịch vụ ổn định, ít bị gián đoạn
- **Chất lượng hình ảnh**: Hình ảnh chất lượng cao từ Unsplash
- **Đa dạng kích thước**: Hỗ trợ mọi kích thước hình ảnh
- **Tốc độ tải nhanh**: CDN toàn cầu
- **Miễn phí**: Không giới hạn số lượng request

### 🔧 Cách sử dụng

```javascript
// Hình ảnh cố định với ID
https://picsum.photos/300/200?random=1

// Hình ảnh ngẫu nhiên
https://picsum.photos/300/200

// Hình ảnh vuông
https://picsum.photos/300
```

## Các Dịch vụ Thay thế Khác

### 1. Lorem Picsum
- URL: `https://picsum.photos/`
- Ưu điểm: Hình ảnh chất lượng cao, nhiều tùy chọn

### 2. DummyImage
- URL: `https://dummyimage.com/`
- Ưu điểm: Tùy chỉnh màu sắc, text

### 3. PlaceImg
- URL: `https://placeimg.com/`
- Ưu điểm: Phân loại theo chủ đề

### 4. Placeholder.com
- URL: `https://placeholder.com/`
- Ưu điểm: Đơn giản, nhanh

## Thực tiễn Tốt nhất

### 1. Sử dụng Hình ảnh Thật

Trong môi trường production, nên:
- Upload hình ảnh thật lên CDN riêng
- Sử dụng dịch vụ lưu trữ như AWS S3, Cloudinary
- Tối ưu hóa kích thước và định dạng hình ảnh

### 2. Fallback Strategy

```javascript
const ImageWithFallback = ({ src, fallback, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc(fallback || 'https://picsum.photos/300/300?random=1');
  };
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      onError={handleError}
      {...props} 
    />
  );
};
```

### 3. Lazy Loading

```javascript
<img 
  src={imageUrl}
  loading="lazy"
  alt="Product image"
/>
```

### 4. Responsive Images

```javascript
<img 
  src={`https://picsum.photos/300/300?random=${id}`}
  srcSet={`
    https://picsum.photos/150/150?random=${id} 150w,
    https://picsum.photos/300/300?random=${id} 300w,
    https://picsum.photos/600/600?random=${id} 600w
  `}
  sizes="(max-width: 768px) 150px, (max-width: 1024px) 300px, 600px"
  alt="Product image"
/>
```

## Giám sát và Gỡ lỗi

### 1. Kiểm tra Network Tab

- Mở Developer Tools → Network
- Reload trang và kiểm tra các request hình ảnh
- Tìm các request bị lỗi (màu đỏ)

### 2. Console Errors

```javascript
// Theo dõi lỗi hình ảnh
window.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    console.error('Image failed to load:', e.target.src);
  }
}, true);
```

### 3. Performance Monitoring

```javascript
// Đo thời gian tải hình ảnh
const img = new Image();
const startTime = performance.now();

img.onload = () => {
  const loadTime = performance.now() - startTime;
  console.log(`Image loaded in ${loadTime}ms`);
};

img.src = imageUrl;
```

## Kết luận

Việc thay thế `via.placeholder.com` bằng `picsum.photos` đã giải quyết thành công các lỗi `ERR_NAME_NOT_RESOLVED`. Picsum Photos cung cấp một giải pháp ổn định và chất lượng cao cho việc hiển thị hình ảnh placeholder trong quá trình phát triển.

### Các bước tiếp theo được khuyến nghị:

1. **Thiết lập CDN riêng** cho hình ảnh production
2. **Upload hình ảnh thật** cho các sản phẩm và danh mục
3. **Triển khai lazy loading** để tối ưu hiệu suất
4. **Thêm image optimization** (WebP, responsive images)
5. **Thiết lập monitoring** cho việc tải hình ảnh

---

*Tài liệu này được tạo để ghi lại quá trình giải quyết lỗi hình ảnh placeholder trong dự án Yapee Vietnam Clone.*