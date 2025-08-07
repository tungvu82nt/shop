import type { NextApiRequest, NextApiResponse } from 'next';
import { mockProducts, getProductStats, type MockProduct } from '../../../data/mockAdminData';

type ProductsResponse = {
  products: MockProduct[];
  total: number;
  stats: ReturnType<typeof getProductStats>;
};

type CreateProductRequest = Omit<MockProduct, 'id' | 'createdAt' | 'updatedAt' | 'stats'>;

type CreateProductResponse = {
  success: boolean;
  product: MockProduct;
  message: string;
};

type ErrorResponse = {
  error: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResponse | CreateProductResponse | ErrorResponse>
) {
  if (req.method === 'GET') {
    return handleGetProducts(req, res);
  } else if (req.method === 'POST') {
    return handleCreateProduct(req, res);
  } else {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức GET và POST' 
    });
  }
}

function handleGetProducts(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResponse | ErrorResponse>
) {
  try {
    // Lấy các query parameters
    const {
      page = '1',
      limit = '10',
      search = '',
      status = '',
      category = '',
      featured = '',
      lowStock = '',
      sortBy = 'updatedAt',
      sortOrder = 'desc'
    } = req.query;

    let filteredProducts = [...mockProducts];

    // Lọc theo tìm kiếm (tên sản phẩm, SKU, mô tả)
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Lọc theo trạng thái
    if (status && typeof status === 'string' && status !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.status === status);
    }

    // Lọc theo danh mục
    if (category && typeof category === 'string' && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }

    // Lọc sản phẩm nổi bật
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }

    // Lọc sản phẩm sắp hết hàng
    if (lowStock === 'true') {
      filteredProducts = filteredProducts.filter(product => 
        product.inventory.quantity <= product.inventory.lowStockThreshold
      );
    }

    // Sắp xếp
    if (typeof sortBy === 'string' && typeof sortOrder === 'string') {
      filteredProducts.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'inventory':
            aValue = a.inventory.quantity;
            bValue = b.inventory.quantity;
            break;
          case 'sales':
            aValue = a.stats.sales;
            bValue = b.stats.sales;
            break;
          case 'createdAt':
          case 'updatedAt':
            aValue = new Date(a[sortBy]);
            bValue = new Date(b[sortBy]);
            break;
          default:
            aValue = new Date(a.updatedAt);
            bValue = new Date(b.updatedAt);
        }

        if (sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    // Phân trang
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    // Lấy thống kê
    const stats = getProductStats();

    res.status(200).json({
      products: paginatedProducts,
      total: filteredProducts.length,
      stats
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi lấy danh sách sản phẩm' 
    });
  }
}

function handleCreateProduct(
  req: NextApiRequest,
  res: NextApiResponse<CreateProductResponse | ErrorResponse>
) {
  try {
    const productData: CreateProductRequest = req.body;

    // Validate required fields
    if (!productData.name || !productData.sku || !productData.price) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tên sản phẩm, SKU và giá bán là bắt buộc'
      });
    }

    // Kiểm tra SKU trùng lặp
    const existingProduct = mockProducts.find(p => p.sku === productData.sku);
    if (existingProduct) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'SKU đã tồn tại'
      });
    }

    // Tạo sản phẩm mới
    const newProduct: MockProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        views: 0,
        sales: 0,
        revenue: 0,
        rating: 0,
        reviewCount: 0
      }
    };

    // Thêm vào mock data (trong thực tế sẽ lưu vào database)
    mockProducts.push(newProduct);

    res.status(201).json({
      success: true,
      product: newProduct,
      message: 'Tạo sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi tạo sản phẩm' 
    });
  }
}