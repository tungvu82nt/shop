import type { NextApiRequest, NextApiResponse } from 'next';
import { mockProducts, type MockProduct } from '../../../../../data/mockAdminData';

type UpdateFeaturedRequest = {
  featured: boolean;
};

type UpdateFeaturedResponse = {
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
  res: NextApiResponse<UpdateFeaturedResponse | ErrorResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức PUT' 
    });
  }

  try {
    const { id } = req.query;
    const { featured }: UpdateFeaturedRequest = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    if (typeof featured !== 'boolean') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Giá trị featured phải là boolean'
      });
    }

    // Tìm sản phẩm
    const productIndex = mockProducts.findIndex(product => product.id === id);
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    const product = mockProducts[productIndex];
    
    // Kiểm tra điều kiện để đặt featured
    if (featured && (product.status !== 'active' || product.visibility !== 'visible')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Chỉ có thể đặt nổi bật cho sản phẩm đang hoạt động và hiển thị'
      });
    }

    // Cập nhật trạng thái featured
    const updatedProduct = {
      ...product,
      featured,
      updatedAt: new Date().toISOString()
    };

    // Cập nhật trong mock data (trong thực tế sẽ cập nhật database)
    mockProducts[productIndex] = updatedProduct;

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: featured 
        ? 'Đã đặt sản phẩm làm nổi bật' 
        : 'Đã bỏ đặt sản phẩm nổi bật'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái nổi bật:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi cập nhật trạng thái nổi bật' 
    });
  }
}