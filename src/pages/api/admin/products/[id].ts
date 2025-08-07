import type { NextApiRequest, NextApiResponse } from 'next';
import { mockProducts, type MockProduct } from '../../../../data/mockAdminData';

type UpdateProductRequest = Partial<Omit<MockProduct, 'id' | 'createdAt' | 'updatedAt' | 'stats'>>;

type ProductResponse = {
  success: boolean;
  product?: MockProduct;
  message: string;
};

type ErrorResponse = {
  error: string;
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse | ErrorResponse>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'ID sản phẩm không hợp lệ'
    });
  }

  if (req.method === 'GET') {
    return handleGetProduct(req, res, id);
  } else if (req.method === 'PUT') {
    return handleUpdateProduct(req, res, id);
  } else if (req.method === 'DELETE') {
    return handleDeleteProduct(req, res, id);
  } else {
    return res.status(405).json({ 
      error: 'Method Not Allowed', 
      message: 'Chỉ hỗ trợ phương thức GET, PUT và DELETE' 
    });
  }
}

function handleGetProduct(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse | ErrorResponse>,
  id: string
) {
  try {
    const product = mockProducts.find(p => p.id === id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.status(200).json({
      success: true,
      product,
      message: 'Lấy thông tin sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi lấy thông tin sản phẩm' 
    });
  }
}

function handleUpdateProduct(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse | ErrorResponse>,
  id: string
) {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    const updateData: UpdateProductRequest = req.body;
    const currentProduct = mockProducts[productIndex];

    // Kiểm tra SKU trùng lặp (nếu có cập nhật SKU)
    if (updateData.sku && updateData.sku !== currentProduct.sku) {
      const existingProduct = mockProducts.find(p => p.sku === updateData.sku && p.id !== id);
      if (existingProduct) {
        return res.status(400).json({
          error: 'Bad Request',
          message: 'SKU đã tồn tại'
        });
      }
    }

    // Cập nhật sản phẩm
    const updatedProduct: MockProduct = {
      ...currentProduct,
      ...updateData,
      id: currentProduct.id, // Không cho phép thay đổi ID
      createdAt: currentProduct.createdAt, // Không cho phép thay đổi ngày tạo
      updatedAt: new Date().toISOString(),
      stats: currentProduct.stats // Giữ nguyên stats
    };

    // Cập nhật trong mock data (trong thực tế sẽ cập nhật database)
    mockProducts[productIndex] = updatedProduct;

    res.status(200).json({
      success: true,
      product: updatedProduct,
      message: 'Cập nhật sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi cập nhật sản phẩm' 
    });
  }
}

function handleDeleteProduct(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse | ErrorResponse>,
  id: string
) {
  try {
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Xóa sản phẩm khỏi mock data (trong thực tế sẽ xóa khỏi database)
    const deletedProduct = mockProducts.splice(productIndex, 1)[0];

    res.status(200).json({
      success: true,
      product: deletedProduct,
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Có lỗi xảy ra khi xóa sản phẩm' 
    });
  }
}