import React from 'react';
import { Helmet } from 'react-helmet-async';

interface OrganizationStructuredDataProps {
  name: string;
  logo: string;
  url: string;
  description?: string;
  sameAs?: string[];
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
    areaServed?: string;
    availableLanguage?: string[];
  };
}

/**
 * Component tạo structured data cho tổ chức theo schema.org
 */
const OrganizationStructuredData: React.FC<OrganizationStructuredDataProps> = ({
  name,
  logo,
  url,
  description,
  sameAs = [],
  address,
  contactPoint,
}) => {
  // Đảm bảo logo URL đầy đủ
  const baseUrl = import.meta.env.VITE_APP_URL || 'https://yapee.vn';
  const fullLogoUrl = logo.startsWith('http') ? logo : `${baseUrl}${logo}`;
  
  // Tạo structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: fullLogoUrl,
  };
  
  // Thêm mô tả nếu có
  if (description) {
    structuredData.description = description;
  }
  
  // Thêm liên kết mạng xã hội nếu có
  if (sameAs && sameAs.length > 0) {
    structuredData.sameAs = sameAs;
  }
  
  // Thêm địa chỉ nếu có
  if (address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      ...address,
    };
  }
  
  // Thêm thông tin liên hệ nếu có
  if (contactPoint) {
    structuredData.contactPoint = {
      '@type': 'ContactPoint',
      ...contactPoint,
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

export default OrganizationStructuredData;