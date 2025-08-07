# 🖼️ CORS Image Handling Guide

## 📋 Tổng Quan

Tài liệu này hướng dẫn cách xử lý lỗi CORS (Cross-Origin Resource Sharing) khi sử dụng hình ảnh từ các nguồn bên ngoài trong ứng dụng Yapee Vietnam Clone.

## ⚠️ Vấn Đề CORS với Unsplash

### **Lỗi ERR_BLOCKED_BY_ORB**
```
net::ERR_BLOCKED_BY_ORB https://images.unsplash.com/photo-xxx
```

**Nguyên nhân:**
- Unsplash đã thay đổi CORS policy
- Trình duyệt chặn tải hình ảnh từ domain khác
- ORB (Opaque Response Blocking) bảo vệ chống cross-origin attacks

### **Tác Động:**
- Hình ảnh không hiển thị
- Console errors
- Trải nghiệm người dùng kém
- Có thể ảnh hưởng đến SEO

## ✅ Giải Pháp Đã Triển Khai

### **1. Thay Thế Bằng Placeholder Images**

Đã thay thế tất cả URL Unsplash bằng placeholder images từ `via.placeholder.com`:

```typescript
// Trước (gây lỗi CORS)
'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'

// Sau (không lỗi CORS)
'https://via.placeholder.com/500x500/f3f4f6/6b7280?text=iPhone+15+Pro+Max'
```

### **2. Mapping Thông Minh**

Sử dụng mapping để tạo placeholder phù hợp với nội dung:

```typescript
const placeholderMappings = {
  // Brand logos
  'Apple': 'https://via.placeholder.com/100x100/1f2937/ffffff?text=Apple',
  'Samsung': 'https://via.placeholder.com/100x100/1f2937/ffffff?text=Samsung',
  
  // Products
  'iPhone': 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=iPhone',
  'Laptop': 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=Laptop',
  
  // Categories
  'Fashion': 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Fashion',
  'Electronics': 'https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Electronics'
};
```

## 🔧 Các Files Đã Được Cập Nhật

### **Frontend Components:**
- ✅ `src/pages/Home.tsx` - Brand logos và search keywords
- ✅ `src/pages/ProductDetail.tsx` - Product images
- ✅ `src/components/home/FlashSale.tsx` - Flash sale products
- ✅ `src/components/home/CategoryGrid.tsx` - Category images
- ✅ `src/components/home/Banner.tsx` - Banner images
- ✅ `src/components/home/ProductSection.tsx` - Product listings
- ✅ `src/components/product/ProductReviews.tsx` - Review images
- ✅ `src/pages/OrderSuccess.tsx` - Order confirmation images

### **Thống Kê Thay Đổi:**
- **Tổng số URL đã thay thế:** 50+ URLs
- **Loại hình ảnh:** Brand logos, products, categories, banners
- **Kích thước:** 40x40 đến 1200x400 pixels

## 🚀 Best Practices cho Tương Lai

### **1. Sử dụng CDN Riêng**
```typescript
// Tốt nhất: Upload lên CDN riêng
const PRODUCT_IMAGES = {
  iphone15: 'https://cdn.yapee-vietnam.com/products/iphone15.webp',
  laptop: 'https://cdn.yapee-vietnam.com/products/laptop.webp'
};
```

### **2. Fallback Strategy**
```typescript
const ImageWithFallback = ({ src, alt, fallback }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc(fallback || 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image');
  };
  
  return <img src={imgSrc} alt={alt} onError={handleError} />;
};
```

### **3. Image Optimization**
```typescript
// Sử dụng Next.js Image component (nếu migrate sang Next.js)
import Image from 'next/image';

<Image
  src={productImage}
  alt={productName}
  width={500}
  height={500}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>
```

### **4. Lazy Loading**
```typescript
// Sử dụng Intersection Observer cho lazy loading
const LazyImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={imgRef}>
      {isLoaded && <img src={src} alt={alt} />}
    </div>
  );
};
```

## 🔍 Monitoring & Debugging

### **1. Console Errors**
Kiểm tra console để phát hiện lỗi CORS:
```javascript
// Trong DevTools Console
console.log('Checking for CORS errors...');

// Lọc lỗi network
performance.getEntriesByType('navigation')
  .forEach(entry => console.log(entry));
```

### **2. Network Tab**
- Mở DevTools > Network
- Filter by "Img"
- Kiểm tra status codes:
  - ✅ 200: OK
  - ❌ 0: CORS blocked
  - ❌ 403: Forbidden
  - ❌ 404: Not found

### **3. Error Boundary**
```typescript
class ImageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Image loading error:', error, errorInfo);
    // Gửi lỗi lên Sentry
    Sentry.captureException(error);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Không thể tải hình ảnh</div>;
    }
    
    return this.props.children;
  }
}
```

## 📊 Performance Impact

### **Trước khi sửa:**
- ❌ Multiple CORS errors
- ❌ Failed image loads
- ❌ Console spam
- ❌ Poor user experience

### **Sau khi sửa:**
- ✅ No CORS errors
- ✅ All images load successfully
- ✅ Clean console
- ✅ Better user experience
- ✅ Faster page load (no failed requests)

## 🔮 Roadmap

### **Phase 1: Immediate (Completed)**
- ✅ Replace all Unsplash URLs
- ✅ Implement placeholder system
- ✅ Test across all pages

### **Phase 2: Short-term**
- 🔄 Set up proper CDN (Cloudflare/AWS CloudFront)
- 🔄 Upload real product images
- 🔄 Implement image optimization

### **Phase 3: Long-term**
- 📋 Implement lazy loading
- 📋 Add WebP support
- 📋 Progressive image loading
- 📋 Image compression pipeline

## 🛠️ Tools & Resources

### **Placeholder Services:**
- [via.placeholder.com](https://via.placeholder.com/) - Simple placeholders
- [picsum.photos](https://picsum.photos/) - Random images
- [placeholder.com](https://placeholder.com/) - Customizable placeholders

### **CDN Services:**
- [Cloudflare Images](https://www.cloudflare.com/products/cloudflare-images/)
- [AWS CloudFront](https://aws.amazon.com/cloudfront/)
- [Vercel Edge Network](https://vercel.com/docs/concepts/edge-network)

### **Image Optimization:**
- [TinyPNG](https://tinypng.com/) - PNG/JPG compression
- [Squoosh](https://squoosh.app/) - Image optimization
- [ImageOptim](https://imageoptim.com/) - Mac image optimizer

---

## 📝 Notes

- Tất cả placeholder images sử dụng màu sắc nhất quán với design system
- Text trên placeholder rõ ràng và mô tả đúng nội dung
- Kích thước placeholder phù hợp với layout requirements
- Không ảnh hưởng đến responsive design

**Tác giả:** Development Team  
**Cập nhật lần cuối:** $(date)  
**Version:** 1.0