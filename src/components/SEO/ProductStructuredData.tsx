import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProductStructuredDataProps {
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string;
  sku: string;
  brand: string;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  ratingValue?: number;
  reviewCount?: number;
  url?: string;
}

/**
 * Component tạo structured data cho sản phẩm theo schema.org
 */
const ProductStructuredData: React.FC<ProductStructuredDataProps> = ({
  name,
  description,
  price,
  currency = 'VND',
  image,
  sku,
  brand,
  availability = 'InStock',
  ratingValue,
  reviewCount,
  url,
}) => {
  // Đảm bảo image URL đầy đủ
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yapee.vn';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  // Tạo structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    image: fullImageUrl,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      url: url || window.location.href,
    },
  };
  
  // Thêm đánh giá nếu có
  if (ratingValue && reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default ProductStructuredData;