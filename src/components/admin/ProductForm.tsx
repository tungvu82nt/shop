import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  category: string;
  brand?: string;
  status: 'active' | 'draft' | 'archived';
  visibility: 'visible' | 'hidden';
  featured: boolean;
  shippingRequired: boolean;
  taxable: boolean;
  tags: string[];
  images: string[];
  variants: any[];
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
  };
  weight?: number;
  barcode?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface ProductFormProps {
  formData: Partial<Product>;
  setFormData: (data: Partial<Product>) => void;
  categories: string[];
  isEdit: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ formData, setFormData, categories, isEdit }) => {
  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent as keyof Product],
        [field]: value
      }
    });
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Cơ bản</TabsTrigger>
        <TabsTrigger value="inventory">Kho hàng</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="advanced">Nâng cao</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => updateFormData('name', e.target.value)}
              placeholder="Nhập tên sản phẩm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku || ''}
              onChange={(e) => updateFormData('sku', e.target.value)}
              placeholder="Mã sản phẩm"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Mô tả sản phẩm"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Giá bán *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || 0}
              onChange={(e) => updateFormData('price', parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comparePrice">Giá so sánh</Label>
            <Input
              id="comparePrice"
              type="number"
              value={formData.comparePrice || ''}
              onChange={(e) => updateFormData('comparePrice', parseFloat(e.target.value) || undefined)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cost">Giá vốn</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost || ''}
              onChange={(e) => updateFormData('cost', parseFloat(e.target.value) || undefined)}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Danh mục *</Label>
            <Select value={formData.category || ''} onValueChange={(value) => updateFormData('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Thương hiệu</Label>
            <Input
              id="brand"
              value={formData.brand || ''}
              onChange={(e) => updateFormData('brand', e.target.value)}
              placeholder="Tên thương hiệu"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status || 'draft'} onValueChange={(value) => updateFormData('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visibility">Hiển thị</Label>
            <Select value={formData.visibility || 'visible'} onValueChange={(value) => updateFormData('visibility', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Hiển thị</SelectItem>
                <SelectItem value="hidden">Ẩn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={formData.featured || false}
            onCheckedChange={(checked) => updateFormData('featured', checked)}
          />
          <Label htmlFor="featured">Sản phẩm nổi bật</Label>
        </div>
      </TabsContent>
      
      <TabsContent value="inventory" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Số lượng tồn kho</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.inventory?.quantity || 0}
              onChange={(e) => updateNestedFormData('inventory', 'quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lowStockThreshold">Ngưỡng cảnh báo hết hàng</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={formData.inventory?.lowStockThreshold || 5}
              onChange={(e) => updateNestedFormData('inventory', 'lowStockThreshold', parseInt(e.target.value) || 5)}
              placeholder="5"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="trackQuantity"
            checked={formData.inventory?.trackQuantity ?? true}
            onCheckedChange={(checked) => updateNestedFormData('inventory', 'trackQuantity', checked)}
          />
          <Label htmlFor="trackQuantity">Theo dõi số lượng tồn kho</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Trọng lượng (gram)</Label>
            <Input
              id="weight"
              type="number"
              value={formData.weight || ''}
              onChange={(e) => updateFormData('weight', parseFloat(e.target.value) || undefined)}
              placeholder="0"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="barcode">Mã vạch</Label>
            <Input
              id="barcode"
              value={formData.barcode || ''}
              onChange={(e) => updateFormData('barcode', e.target.value)}
              placeholder="Mã vạch sản phẩm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="shippingRequired"
              checked={formData.shippingRequired ?? true}
              onCheckedChange={(checked) => updateFormData('shippingRequired', checked)}
            />
            <Label htmlFor="shippingRequired">Yêu cầu vận chuyển</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="taxable"
              checked={formData.taxable ?? true}
              onCheckedChange={(checked) => updateFormData('taxable', checked)}
            />
            <Label htmlFor="taxable">Chịu thuế</Label>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="seo" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="seoTitle">Tiêu đề SEO</Label>
          <Input
            id="seoTitle"
            value={formData.seo?.title || ''}
            onChange={(e) => updateNestedFormData('seo', 'title', e.target.value)}
            placeholder="Tiêu đề tối ưu cho SEO"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seoDescription">Mô tả SEO</Label>
          <Textarea
            id="seoDescription"
            value={formData.seo?.description || ''}
            onChange={(e) => updateNestedFormData('seo', 'description', e.target.value)}
            placeholder="Mô tả ngắn gọn cho SEO"
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seoKeywords">Từ khóa SEO</Label>
          <Input
            id="seoKeywords"
            value={formData.seo?.keywords || ''}
            onChange={(e) => updateNestedFormData('seo', 'keywords', e.target.value)}
            placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
          />
        </div>
      </TabsContent>
      
      <TabsContent value="advanced" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <Input
            id="tags"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => updateFormData('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
            placeholder="tag1, tag2, tag3"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Kích thước (cm)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Dài"
              type="number"
              value={formData.dimensions?.length || ''}
              onChange={(e) => updateNestedFormData('dimensions', 'length', parseFloat(e.target.value) || undefined)}
            />
            <Input
              placeholder="Rộng"
              type="number"
              value={formData.dimensions?.width || ''}
              onChange={(e) => updateNestedFormData('dimensions', 'width', parseFloat(e.target.value) || undefined)}
            />
            <Input
              placeholder="Cao"
              type="number"
              value={formData.dimensions?.height || ''}
              onChange={(e) => updateNestedFormData('dimensions', 'height', parseFloat(e.target.value) || undefined)}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductForm;