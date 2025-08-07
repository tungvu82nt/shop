import React from 'react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbStructuredDataProps {
  items: BreadcrumbItem[];
}

/**
 * Component tạo structured data cho breadcrumb theo schema.org
 */
const BreadcrumbStructuredData: React.FC<BreadcrumbStructuredDataProps> = ({
  items,
}) => {
  // Đảm bảo URL đầy đủ
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yapee.vn';
  
  // Tạo structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
  
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default BreadcrumbStructuredData;