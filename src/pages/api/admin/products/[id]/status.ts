import type { NextApiRequest, NextApiResponse } from 'next';
import { mockProducts, type MockProduct } from '../../../../../data/mockAdminData';

type UpdateStatusRequest = {
  status: MockProduct['status'];
};

type UpdateStatusResponse = {
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
  res: NextApiResponse<UpdateStatusResponse | ErrorResponse>
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức PUT' 
    });
  }

  try {
    const { id } = req.query;
    const { status }: UpdateStatusRequest = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID sản phẩm không hợp lệ'
      });
    }

    if (!status) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Trạng thái không được để trống'
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
    
    // Kiểm tra trạng thái hợp lệ
    const validStatuses: MockProduct['status'][] = ['active', 'draft', 'archived'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Cập nhật trạng thái
    const updatedProduct = {
      ...product,
      status,
      updatedAt: new Date().toISOString()
    };

    // Nếu chuyển sang archived, ẩn sản phẩm
    if (status === 'archived') {
      updatedProduct.visibility = 'hidden';
      updatedProduct.featured = false;
    }

    // Cập nhật trong mock data (trong thực tế sẽ cập nhật database)
    mockProducts[productIndex] = updatedProduct;

    const statusLabels = {
      'active': 'Hoạt động',
      'draft': 'Nháp',
      'archived': 'Lưu trữ'
    };

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: `Cập nhật trạng thái sản phẩm thành "${statusLabels[status]}" thành công`
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi cập nhật trạng thái sản phẩm' 
    });
  }
}