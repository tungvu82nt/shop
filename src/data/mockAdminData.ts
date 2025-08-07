// Mock data cho trang Admin

export interface MockOrder {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    variant?: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'vnpay' | 'momo' | 'bank_transfer';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  timeline: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  images: string[];
  variants: {
    id: string;
    name: string;
    sku: string;
    price: number;
    comparePrice?: number;
    cost?: number;
    inventory: {
      quantity: number;
      reserved: number;
    };
    attributes: Record<string, string>;
    image?: string;
    weight?: number;
    barcode?: string;
  }[];
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  status: 'active' | 'draft' | 'archived';
  visibility: 'visible' | 'hidden';
  featured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  shippingRequired: boolean;
  taxable: boolean;
  createdAt: string;
  updatedAt: string;
  vendor?: {
    id: string;
    name: string;
  };
  stats: {
    views: number;
    sales: number;
    revenue: number;
    rating: number;
    reviewCount: number;
  };
}

// Mock Orders Data
export const mockOrders: MockOrder[] = [
  {
    id: 'order-001',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'cust-001',
      name: 'Nguyễn Văn An',
      email: 'nguyenvanan@email.com',
      phone: '0901234567'
    },
    items: [
      {
        id: 'item-001',
        name: 'iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
        price: 29990000,
        quantity: 1,
        variant: '256GB - Titan Tự Nhiên'
      },
      {
        id: 'item-002',
        name: 'Ốp lưng iPhone 15 Pro Max',
        image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400',
        price: 590000,
        quantity: 1
      }
    ],
    subtotal: 30580000,
    shipping: 50000,
    tax: 0,
    discount: 580000,
    total: 30050000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'vnpay',
    shippingAddress: {
      fullName: 'Nguyễn Văn An',
      phone: '0901234567',
      address: '123 Đường ABC',
      ward: 'Phường 1',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh'
    },
    notes: 'Giao hàng trong giờ hành chính',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2024-01-15T10:30:00Z',
        note: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-15T14:20:00Z',
        note: 'Đơn hàng đã được xác nhận và thanh toán thành công'
      }
    ]
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-2024-002',
    customer: {
      id: 'cust-002',
      name: 'Trần Thị Bình',
      email: 'tranthibinh@email.com',
      phone: '0987654321'
    },
    items: [
      {
        id: 'item-003',
        name: 'Samsung Galaxy S24 Ultra',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
        price: 26990000,
        quantity: 1,
        variant: '512GB - Đen Titan'
      }
    ],
    subtotal: 26990000,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 26990000,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    shippingAddress: {
      fullName: 'Trần Thị Bình',
      phone: '0987654321',
      address: '456 Đường XYZ',
      ward: 'Phường 2',
      district: 'Quận 3',
      province: 'TP. Hồ Chí Minh'
    },
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2024-01-14T09:15:00Z',
        note: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-14T11:30:00Z',
        note: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'processing',
        timestamp: '2024-01-15T08:45:00Z',
        note: 'Đang chuẩn bị hàng'
      }
    ]
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-2024-003',
    customer: {
      id: 'cust-003',
      name: 'Lê Minh Cường',
      email: 'leminhcuong@email.com',
      phone: '0912345678'
    },
    items: [
      {
        id: 'item-004',
        name: 'MacBook Air M3',
        image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
        price: 28990000,
        quantity: 1,
        variant: '13 inch - 8GB RAM - 256GB SSD'
      },
      {
        id: 'item-005',
        name: 'Magic Mouse',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        price: 2290000,
        quantity: 1
      }
    ],
    subtotal: 31280000,
    shipping: 100000,
    tax: 0,
    discount: 1280000,
    total: 30100000,
    status: 'shipped',
    paymentStatus: 'paid',
    paymentMethod: 'bank_transfer',
    shippingAddress: {
      fullName: 'Lê Minh Cường',
      phone: '0912345678',
      address: '789 Đường DEF',
      ward: 'Phường 5',
      district: 'Quận 10',
      province: 'TP. Hồ Chí Minh'
    },
    createdAt: '2024-01-13T16:20:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2024-01-13T16:20:00Z',
        note: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-13T18:45:00Z',
        note: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'processing',
        timestamp: '2024-01-14T09:00:00Z',
        note: 'Đang chuẩn bị hàng'
      },
      {
        status: 'shipped',
        timestamp: '2024-01-15T10:00:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển - Mã vận đơn: GHN123456789'
      }
    ]
  },
  {
    id: 'order-004',
    orderNumber: 'ORD-2024-004',
    customer: {
      id: 'cust-004',
      name: 'Phạm Thị Dung',
      email: 'phamthidung@email.com',
      phone: '0923456789'
    },
    items: [
      {
        id: 'item-006',
        name: 'iPad Pro 12.9 inch',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        price: 24990000,
        quantity: 1,
        variant: 'M2 - 128GB - WiFi'
      }
    ],
    subtotal: 24990000,
    shipping: 50000,
    tax: 0,
    discount: 0,
    total: 25040000,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'cod',
    shippingAddress: {
      fullName: 'Phạm Thị Dung',
      phone: '0923456789',
      address: '321 Đường GHI',
      ward: 'Phường 7',
      district: 'Quận 7',
      province: 'TP. Hồ Chí Minh'
    },
    createdAt: '2024-01-12T14:30:00Z',
    updatedAt: '2024-01-14T16:30:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2024-01-12T14:30:00Z',
        note: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-12T15:00:00Z',
        note: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'processing',
        timestamp: '2024-01-13T08:00:00Z',
        note: 'Đang chuẩn bị hàng'
      },
      {
        status: 'shipped',
        timestamp: '2024-01-13T14:00:00Z',
        note: 'Đơn hàng đã được giao cho đơn vị vận chuyển'
      },
      {
        status: 'delivered',
        timestamp: '2024-01-14T16:30:00Z',
        note: 'Đơn hàng đã được giao thành công'
      }
    ]
  },
  {
    id: 'order-005',
    orderNumber: 'ORD-2024-005',
    customer: {
      id: 'cust-005',
      name: 'Hoàng Văn Em',
      email: 'hoangvanem@email.com',
      phone: '0934567890'
    },
    items: [
      {
        id: 'item-007',
        name: 'AirPods Pro 2',
        image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
        price: 5990000,
        quantity: 2
      }
    ],
    subtotal: 11980000,
    shipping: 30000,
    tax: 0,
    discount: 980000,
    total: 11030000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'vnpay',
    shippingAddress: {
      fullName: 'Hoàng Văn Em',
      phone: '0934567890',
      address: '654 Đường JKL',
      ward: 'Phường 9',
      district: 'Quận 9',
      province: 'TP. Hồ Chí Minh'
    },
    notes: 'Khách hàng yêu cầu hủy đơn',
    createdAt: '2024-01-11T11:15:00Z',
    updatedAt: '2024-01-12T09:30:00Z',
    timeline: [
      {
        status: 'pending',
        timestamp: '2024-01-11T11:15:00Z',
        note: 'Đơn hàng được tạo'
      },
      {
        status: 'confirmed',
        timestamp: '2024-01-11T12:00:00Z',
        note: 'Đơn hàng đã được xác nhận'
      },
      {
        status: 'cancelled',
        timestamp: '2024-01-12T09:30:00Z',
        note: 'Đơn hàng đã bị hủy theo yêu cầu của khách hàng'
      }
    ]
  }
];

// Mock Products Data
export const mockProducts: MockProduct[] = [
  {
    id: 'prod-001',
    name: 'iPhone 15 Pro Max',
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp và thiết kế titan cao cấp.',
    price: 29990000,
    comparePrice: 32990000,
    cost: 25000000,
    sku: 'IP15PM-256-TN',
    barcode: '1234567890123',
    category: 'Điện thoại',
    subcategory: 'iPhone',
    brand: 'Apple',
    tags: ['smartphone', 'apple', 'iphone', 'premium'],
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
    ],
    variants: [
      {
        id: 'var-001',
        name: '256GB - Titan Tự Nhiên',
        sku: 'IP15PM-256-TN',
        price: 29990000,
        comparePrice: 32990000,
        cost: 25000000,
        inventory: { quantity: 15, reserved: 2 },
        attributes: { storage: '256GB', color: 'Titan Tự Nhiên' },
        weight: 221
      },
      {
        id: 'var-002',
        name: '512GB - Titan Xanh',
        sku: 'IP15PM-512-TX',
        price: 34990000,
        comparePrice: 37990000,
        cost: 29000000,
        inventory: { quantity: 8, reserved: 1 },
        attributes: { storage: '512GB', color: 'Titan Xanh' },
        weight: 221
      }
    ],
    inventory: {
      quantity: 23,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    seo: {
      title: 'iPhone 15 Pro Max - Điện thoại cao cấp với chip A17 Pro',
      description: 'Mua iPhone 15 Pro Max chính hãng với giá tốt nhất. Chip A17 Pro mạnh mẽ, camera 48MP chuyên nghiệp.',
      keywords: ['iphone 15 pro max', 'điện thoại apple', 'smartphone cao cấp']
    },
    status: 'active',
    visibility: 'visible',
    featured: true,
    weight: 221,
    dimensions: { length: 15.9, width: 7.6, height: 0.83 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 1250,
      sales: 45,
      revenue: 1349550000,
      rating: 4.8,
      reviewCount: 127
    }
  },
  {
    id: 'prod-002',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung Galaxy S24 Ultra với S Pen tích hợp, camera 200MP và màn hình Dynamic AMOLED 2X 6.8 inch.',
    price: 26990000,
    comparePrice: 29990000,
    cost: 22000000,
    sku: 'SGS24U-512-BT',
    barcode: '2345678901234',
    category: 'Điện thoại',
    subcategory: 'Samsung Galaxy',
    brand: 'Samsung',
    tags: ['smartphone', 'samsung', 'galaxy', 's-pen'],
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800'
    ],
    variants: [
      {
        id: 'var-003',
        name: '512GB - Đen Titan',
        sku: 'SGS24U-512-BT',
        price: 26990000,
        comparePrice: 29990000,
        cost: 22000000,
        inventory: { quantity: 12, reserved: 1 },
        attributes: { storage: '512GB', color: 'Đen Titan' },
        weight: 232
      }
    ],
    inventory: {
      quantity: 12,
      lowStockThreshold: 5,
      trackQuantity: true
    },
    seo: {
      title: 'Samsung Galaxy S24 Ultra - Smartphone cao cấp với S Pen',
      description: 'Galaxy S24 Ultra chính hãng với S Pen tích hợp, camera 200MP siêu nét và hiệu năng mạnh mẽ.',
      keywords: ['samsung galaxy s24 ultra', 's pen', 'camera 200mp']
    },
    status: 'active',
    visibility: 'visible',
    featured: true,
    weight: 232,
    dimensions: { length: 16.2, width: 7.9, height: 0.86 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    vendor: { id: 'vendor-002', name: 'Samsung Official Store' },
    stats: {
      views: 980,
      sales: 32,
      revenue: 863680000,
      rating: 4.7,
      reviewCount: 89
    }
  },
  {
    id: 'prod-003',
    name: 'MacBook Air M3',
    description: 'MacBook Air M3 với chip Apple M3 mới nhất, màn hình Liquid Retina 13.6 inch và thời lượng pin lên đến 18 giờ.',
    price: 28990000,
    comparePrice: 31990000,
    cost: 24000000,
    sku: 'MBA-M3-256-SL',
    barcode: '3456789012345',
    category: 'Laptop',
    subcategory: 'MacBook',
    brand: 'Apple',
    tags: ['laptop', 'macbook', 'apple', 'm3'],
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800'
    ],
    variants: [
      {
        id: 'var-004',
        name: '13 inch - 8GB RAM - 256GB SSD - Bạc',
        sku: 'MBA-M3-256-SL',
        price: 28990000,
        comparePrice: 31990000,
        cost: 24000000,
        inventory: { quantity: 18, reserved: 3 },
        attributes: { ram: '8GB', storage: '256GB', color: 'Bạc' },
        weight: 1240
      },
      {
        id: 'var-005',
        name: '13 inch - 16GB RAM - 512GB SSD - Xám',
        sku: 'MBA-M3-512-SG',
        price: 35990000,
        comparePrice: 38990000,
        cost: 30000000,
        inventory: { quantity: 10, reserved: 1 },
        attributes: { ram: '16GB', storage: '512GB', color: 'Xám' },
        weight: 1240
      }
    ],
    inventory: {
      quantity: 28,
      lowStockThreshold: 8,
      trackQuantity: true
    },
    seo: {
      title: 'MacBook Air M3 - Laptop Apple mới nhất với chip M3',
      description: 'MacBook Air M3 chính hãng với hiệu năng vượt trội, thiết kế mỏng nhẹ và thời lượng pin dài.',
      keywords: ['macbook air m3', 'laptop apple', 'chip m3']
    },
    status: 'active',
    visibility: 'visible',
    featured: true,
    weight: 1240,
    dimensions: { length: 30.41, width: 21.5, height: 1.13 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 756,
      sales: 28,
      revenue: 811720000,
      rating: 4.9,
      reviewCount: 64
    }
  },
  {
    id: 'prod-004',
    name: 'iPad Pro 12.9 inch',
    description: 'iPad Pro 12.9 inch với chip M2, màn hình Liquid Retina XDR và hỗ trợ Apple Pencil thế hệ 2.',
    price: 24990000,
    comparePrice: 27990000,
    cost: 20000000,
    sku: 'IPP-M2-128-SL',
    barcode: '4567890123456',
    category: 'Tablet',
    subcategory: 'iPad',
    brand: 'Apple',
    tags: ['tablet', 'ipad', 'apple', 'm2', 'pro'],
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'
    ],
    variants: [
      {
        id: 'var-006',
        name: 'M2 - 128GB - WiFi - Bạc',
        sku: 'IPP-M2-128-SL',
        price: 24990000,
        comparePrice: 27990000,
        cost: 20000000,
        inventory: { quantity: 14, reserved: 2 },
        attributes: { chip: 'M2', storage: '128GB', connectivity: 'WiFi', color: 'Bạc' },
        weight: 682
      }
    ],
    inventory: {
      quantity: 14,
      lowStockThreshold: 6,
      trackQuantity: true
    },
    seo: {
      title: 'iPad Pro 12.9 inch M2 - Tablet chuyên nghiệp từ Apple',
      description: 'iPad Pro 12.9 inch với chip M2 mạnh mẽ, màn hình XDR tuyệt đẹp và hỗ trợ Apple Pencil.',
      keywords: ['ipad pro', 'tablet apple', 'chip m2', 'apple pencil']
    },
    status: 'active',
    visibility: 'visible',
    featured: false,
    weight: 682,
    dimensions: { length: 28.06, width: 21.49, height: 0.64 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-13T14:20:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 432,
      sales: 19,
      revenue: 474810000,
      rating: 4.6,
      reviewCount: 41
    }
  },
  {
    id: 'prod-005',
    name: 'AirPods Pro 2',
    description: 'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động nâng cao và case sạc MagSafe.',
    price: 5990000,
    comparePrice: 6990000,
    cost: 4500000,
    sku: 'APP2-MAGSAFE-WH',
    barcode: '5678901234567',
    category: 'Phụ kiện',
    subcategory: 'Tai nghe',
    brand: 'Apple',
    tags: ['tai nghe', 'airpods', 'apple', 'wireless', 'pro'],
    images: [
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
    ],
    variants: [
      {
        id: 'var-007',
        name: 'AirPods Pro 2 - Trắng',
        sku: 'APP2-MAGSAFE-WH',
        price: 5990000,
        comparePrice: 6990000,
        cost: 4500000,
        inventory: { quantity: 35, reserved: 5 },
        attributes: { color: 'Trắng', case: 'MagSafe' },
        weight: 50.8
      }
    ],
    inventory: {
      quantity: 35,
      lowStockThreshold: 15,
      trackQuantity: true
    },
    seo: {
      title: 'AirPods Pro 2 - Tai nghe không dây cao cấp từ Apple',
      description: 'AirPods Pro 2 với chip H2, chống ồn chủ động và case sạc MagSafe tiện lợi.',
      keywords: ['airpods pro 2', 'tai nghe apple', 'chống ồn', 'magsafe']
    },
    status: 'active',
    visibility: 'visible',
    featured: false,
    weight: 50.8,
    dimensions: { length: 4.5, width: 6.1, height: 2.1 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 623,
      sales: 67,
      revenue: 401330000,
      rating: 4.7,
      reviewCount: 156
    }
  },
  {
    id: 'prod-006',
    name: 'Magic Mouse',
    description: 'Magic Mouse với thiết kế tối giản, bề mặt cảm ứng Multi-Touch và kết nối Bluetooth.',
    price: 2290000,
    cost: 1800000,
    sku: 'MM-BT-WH',
    category: 'Phụ kiện',
    subcategory: 'Chuột máy tính',
    brand: 'Apple',
    tags: ['chuột', 'mouse', 'apple', 'bluetooth', 'wireless'],
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'
    ],
    variants: [
      {
        id: 'var-008',
        name: 'Magic Mouse - Trắng',
        sku: 'MM-BT-WH',
        price: 2290000,
        cost: 1800000,
        inventory: { quantity: 22, reserved: 1 },
        attributes: { color: 'Trắng', connectivity: 'Bluetooth' },
        weight: 99
      }
    ],
    inventory: {
      quantity: 22,
      lowStockThreshold: 10,
      trackQuantity: true
    },
    seo: {
      title: 'Magic Mouse - Chuột không dây chính hãng Apple',
      description: 'Magic Mouse với thiết kế tối giản, bề mặt Multi-Touch và kết nối Bluetooth ổn định.',
      keywords: ['magic mouse', 'chuột apple', 'bluetooth mouse']
    },
    status: 'active',
    visibility: 'visible',
    featured: false,
    weight: 99,
    dimensions: { length: 11.35, width: 5.71, height: 2.16 },
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-10T16:30:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 234,
      sales: 15,
      revenue: 34350000,
      rating: 4.3,
      reviewCount: 28
    }
  },
  {
    id: 'prod-007',
    name: 'Ốp lưng iPhone 15 Pro Max',
    description: 'Ốp lưng silicone chính hãng cho iPhone 15 Pro Max với thiết kế ôm sát và bảo vệ tối ưu.',
    price: 590000,
    cost: 300000,
    sku: 'CASE-IP15PM-SIL',
    category: 'Phụ kiện',
    subcategory: 'Ốp lưng',
    brand: 'Apple',
    tags: ['ốp lưng', 'case', 'iphone 15 pro max', 'silicone'],
    images: [
      'https://images.unsplash.com/photo-1601593346740-925612772716?w=800'
    ],
    variants: [
      {
        id: 'var-009',
        name: 'Silicone - Đen',
        sku: 'CASE-IP15PM-SIL-BK',
        price: 590000,
        cost: 300000,
        inventory: { quantity: 45, reserved: 3 },
        attributes: { material: 'Silicone', color: 'Đen' },
        weight: 35
      },
      {
        id: 'var-010',
        name: 'Silicone - Xanh Navy',
        sku: 'CASE-IP15PM-SIL-NV',
        price: 590000,
        cost: 300000,
        inventory: { quantity: 38, reserved: 2 },
        attributes: { material: 'Silicone', color: 'Xanh Navy' },
        weight: 35
      }
    ],
    inventory: {
      quantity: 83,
      lowStockThreshold: 20,
      trackQuantity: true
    },
    seo: {
      title: 'Ốp lưng iPhone 15 Pro Max - Bảo vệ hoàn hảo',
      description: 'Ốp lưng silicone chính hãng cho iPhone 15 Pro Max với nhiều màu sắc và bảo vệ tối ưu.',
      keywords: ['ốp lưng iphone 15 pro max', 'case iphone', 'silicone case']
    },
    status: 'active',
    visibility: 'visible',
    featured: false,
    weight: 35,
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-11T13:15:00Z',
    vendor: { id: 'vendor-001', name: 'Apple Authorized Reseller' },
    stats: {
      views: 189,
      sales: 34,
      revenue: 20060000,
      rating: 4.4,
      reviewCount: 52
    }
  },
  {
    id: 'prod-008',
    name: 'Samsung Galaxy Buds2 Pro',
    description: 'Galaxy Buds2 Pro với chống ồn thông minh, âm thanh Hi-Fi 24bit và thiết kế ergonomic.',
    price: 3990000,
    comparePrice: 4490000,
    cost: 3200000,
    sku: 'GBP2-ANC-WH',
    category: 'Phụ kiện',
    subcategory: 'Tai nghe',
    brand: 'Samsung',
    tags: ['tai nghe', 'galaxy buds', 'samsung', 'wireless', 'anc'],
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'
    ],
    variants: [
      {
        id: 'var-011',
        name: 'Galaxy Buds2 Pro - Trắng',
        sku: 'GBP2-ANC-WH',
        price: 3990000,
        comparePrice: 4490000,
        cost: 3200000,
        inventory: { quantity: 26, reserved: 2 },
        attributes: { color: 'Trắng', anc: 'Có' },
        weight: 44
      }
    ],
    inventory: {
      quantity: 26,
      lowStockThreshold: 12,
      trackQuantity: true
    },
    seo: {
      title: 'Samsung Galaxy Buds2 Pro - Tai nghe không dây cao cấp',
      description: 'Galaxy Buds2 Pro với chống ồn thông minh, âm thanh Hi-Fi và thiết kế thoải mái.',
      keywords: ['galaxy buds2 pro', 'tai nghe samsung', 'chống ồn']
    },
    status: 'active',
    visibility: 'visible',
    featured: false,
    weight: 44,
    shippingRequired: true,
    taxable: true,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-09T10:20:00Z',
    vendor: { id: 'vendor-002', name: 'Samsung Official Store' },
    stats: {
      views: 312,
      sales: 21,
      revenue: 83790000,
      rating: 4.5,
      reviewCount: 37
    }
  }
];

// Utility functions
export const getOrderById = (id: string): MockOrder | undefined => {
  return mockOrders.find(order => order.id === id);
};

export const getProductById = (id: string): MockProduct | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getOrdersByStatus = (status: MockOrder['status']): MockOrder[] => {
  return mockOrders.filter(order => order.status === status);
};

export const getProductsByCategory = (category: string): MockProduct[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getProductsByStatus = (status: MockProduct['status']): MockProduct[] => {
  return mockProducts.filter(product => product.status === status);
};

export const getFeaturedProducts = (): MockProduct[] => {
  return mockProducts.filter(product => product.featured);
};

export const getLowStockProducts = (): MockProduct[] => {
  return mockProducts.filter(product => 
    product.inventory.quantity <= product.inventory.lowStockThreshold
  );
};

export const getOrderStats = () => {
  const total = mockOrders.length;
  const pending = getOrdersByStatus('pending').length;
  const confirmed = getOrdersByStatus('confirmed').length;
  const processing = getOrdersByStatus('processing').length;
  const shipped = getOrdersByStatus('shipped').length;
  const delivered = getOrdersByStatus('delivered').length;
  const cancelled = getOrdersByStatus('cancelled').length;
  
  const totalRevenue = mockOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);
  
  return {
    total,
    pending,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
    totalRevenue
  };
};

export const getProductStats = () => {
  const total = mockProducts.length;
  const active = getProductsByStatus('active').length;
  const draft = getProductsByStatus('draft').length;
  const archived = getProductsByStatus('archived').length;
  const featured = getFeaturedProducts().length;
  const lowStock = getLowStockProducts().length;
  
  const totalValue = mockProducts.reduce((sum, product) => 
    sum + (product.inventory.quantity * product.cost || 0), 0
  );
  
  return {
    total,
    active,
    draft,
    archived,
    featured,
    lowStock,
    totalValue
  };
};