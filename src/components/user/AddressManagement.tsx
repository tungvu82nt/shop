import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin, Home, Building, Star, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { supabase } from '../../lib/supabase';

interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  type: 'home' | 'office' | 'other';
  isDefault: boolean;
  note?: string;
}

interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  province: string;
  type: 'home' | 'office' | 'other';
  isDefault: boolean;
  note: string;
}

interface AddressManagementProps {
  onAddressSelect?: (address: Address) => void;
  selectedAddressId?: string;
  mode?: 'manage' | 'select';
}

const AddressManagement: React.FC<AddressManagementProps> = ({
  onAddressSelect,
  selectedAddressId,
  mode = 'manage'
}) => {
  const { toast } = useToast();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
    type: 'home',
    isDefault: false,
    note: ''
  });

  // Mock data for provinces, districts, wards
  const provinces = [
    { code: 'HN', name: 'Hà Nội' },
    { code: 'HCM', name: 'TP. Hồ Chí Minh' },
    { code: 'DN', name: 'Đà Nẵng' },
    { code: 'HP', name: 'Hải Phòng' },
    { code: 'CT', name: 'Cần Thơ' }
  ];

  const districts = {
    'HN': [
      { code: 'BA_DINH', name: 'Ba Đình' },
      { code: 'HOAN_KIEM', name: 'Hoàn Kiếm' },
      { code: 'HAI_BA_TRUNG', name: 'Hai Bà Trưng' },
      { code: 'DONG_DA', name: 'Đống Đa' },
      { code: 'TAY_HO', name: 'Tây Hồ' }
    ],
    'HCM': [
      { code: 'QUAN_1', name: 'Quận 1' },
      { code: 'QUAN_2', name: 'Quận 2' },
      { code: 'QUAN_3', name: 'Quận 3' },
      { code: 'QUAN_4', name: 'Quận 4' },
      { code: 'QUAN_5', name: 'Quận 5' }
    ]
  };

  const wards = {
    'BA_DINH': [
      { code: 'PHUC_XA', name: 'Phúc Xá' },
      { code: 'TRUC_BACH', name: 'Trúc Bạch' },
      { code: 'VIEN_DONG', name: 'Viện Đông' }
    ],
    'QUAN_1': [
      { code: 'BEN_NGHE', name: 'Bến Nghé' },
      { code: 'BEN_THANH', name: 'Bến Thành' },
      { code: 'NGUYEN_THAI_BINH', name: 'Nguyễn Thái Bình' }
    ]
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      // Tích hợp với Supabase để lấy danh sách địa chỉ
      const { data: user } = await supabase.auth.getUser();
      
      if (user.user) {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.user.id)
          .order('is_default', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching addresses:', error);
          // Fallback to mock data for development
          setAddresses([
            {
              id: '1',
              name: 'Nguyễn Văn An',
              phone: '0901234567',
              address: '123 Đường ABC, Phường XYZ',
              ward: 'Phường 1',
              district: 'Quận 1',
              province: 'TP. Hồ Chí Minh',
              type: 'home' as const,
              isDefault: true,
              note: 'Giao hàng giờ hành chính'
            }
          ]);
        } else {
          setAddresses(data || []);
        }
      } else {
        // Mock data for development when not authenticated
        setAddresses([
          {
            id: '1',
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '123 Đường ABC',
            ward: 'Phúc Xá',
            district: 'Ba Đình',
            province: 'Hà Nội',
            type: 'home',
            isDefault: true,
            note: 'Gần cổng chính'
          },
          {
            id: '2',
            name: 'Nguyễn Văn A',
            phone: '0123456789',
            address: '456 Đường XYZ',
            ward: 'Bến Nghé',
            district: 'Quận 1',
            province: 'TP. Hồ Chí Minh',
            type: 'office',
            isDefault: false,
            note: 'Tầng 5, tòa nhà ABC'
          }
        ]);
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách địa chỉ.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      province: '',
      type: 'home',
      isDefault: addresses.length === 0,
      note: ''
    });
    setShowDialog(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      ward: address.ward,
      district: address.district,
      province: address.province,
      type: address.type,
      isDefault: address.isDefault,
      note: address.note || ''
    });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.address || !formData.province || !formData.district || !formData.ward) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = editingAddress 
        ? `/api/user/addresses/${editingAddress.id}`
        : '/api/user/addresses';
      
      const method = editingAddress ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (editingAddress) {
          setAddresses(prev => prev.map(addr => 
            addr.id === editingAddress.id ? data.address : addr
          ));
        } else {
          setAddresses(prev => [...prev, data.address]);
        }
        
        toast({
          title: 'Thành công!',
          description: `Địa chỉ đã được ${editingAddress ? 'cập nhật' : 'thêm'}.`,
        });
        
        setShowDialog(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu địa chỉ.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setAddresses(prev => prev.filter(addr => addr.id !== addressId));
        toast({
          title: 'Đã xóa',
          description: 'Địa chỉ đã được xóa thành công.',
        });
      } else {
        throw new Error('Không thể xóa địa chỉ');
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa địa chỉ.',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/user/addresses/${addressId}/set-default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        setAddresses(prev => prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        })));
        
        toast({
          title: 'Thành công!',
          description: 'Đã đặt làm địa chỉ mặc định.',
        });
      } else {
        throw new Error('Không thể đặt địa chỉ mặc định');
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể đặt địa chỉ mặc định.',
        variant: 'destructive',
      });
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'office': return <Building className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home': return 'Nhà riêng';
      case 'office': return 'Văn phòng';
      default: return 'Khác';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {mode === 'select' ? 'Chọn địa chỉ giao hàng' : 'Quản lý địa chỉ'}
        </h2>
        <Button onClick={handleAddAddress}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm địa chỉ mới
        </Button>
      </div>

      {/* Address List */}
      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có địa chỉ nào</h3>
              <p className="text-gray-600 text-center mb-4">
                Thêm địa chỉ giao hàng để thuận tiện cho việc mua sắm
              </p>
              <Button onClick={handleAddAddress}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm địa chỉ đầu tiên
              </Button>
            </CardContent>
          </Card>
        ) : (
          addresses.map((address) => (
            <Card 
              key={address.id} 
              className={`cursor-pointer transition-all ${
                mode === 'select' && selectedAddressId === address.id
                  ? 'ring-2 ring-blue-500 border-blue-500'
                  : 'hover:shadow-md'
              }`}
              onClick={() => mode === 'select' && onAddressSelect?.(address)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        {getAddressTypeIcon(address.type)}
                        <span className="font-medium">{getAddressTypeLabel(address.type)}</span>
                      </div>
                      
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Mặc định
                        </Badge>
                      )}
                      
                      {mode === 'select' && selectedAddressId === address.id && (
                        <Badge className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Đã chọn
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className="font-medium">{address.name} | {address.phone}</p>
                      <p className="text-gray-600">
                        {address.address}, {address.ward}, {address.district}, {address.province}
                      </p>
                      {address.note && (
                        <p className="text-sm text-gray-500">Ghi chú: {address.note}</p>
                      )}
                    </div>
                  </div>
                  
                  {mode === 'manage' && (
                    <div className="flex items-center space-x-2 ml-4">
                      {!address.isDefault && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(address.id);
                          }}
                        >
                          Đặt mặc định
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddress(address);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(address.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Họ tên *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Địa chỉ cụ thể *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Số nhà, tên đường"
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                <Select 
                  value={formData.province} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, province: value, district: '', ward: '' }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh/thành" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.name}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="district">Quận/Huyện *</Label>
                <Select 
                  value={formData.district} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, district: value, ward: '' }))}
                  disabled={!formData.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Mock districts based on selected province */}
                    {formData.province === 'Hà Nội' && districts.HN.map((district) => (
                      <SelectItem key={district.code} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                    {formData.province === 'TP. Hồ Chí Minh' && districts.HCM.map((district) => (
                      <SelectItem key={district.code} value={district.name}>
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ward">Phường/Xã *</Label>
                <Select 
                  value={formData.ward} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, ward: value }))}
                  disabled={!formData.district}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Mock wards based on selected district */}
                    {formData.district === 'Ba Đình' && wards.BA_DINH.map((ward) => (
                      <SelectItem key={ward.code} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                    {formData.district === 'Quận 1' && wards.QUAN_1.map((ward) => (
                      <SelectItem key={ward.code} value={ward.name}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="type">Loại địa chỉ</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'home' | 'office' | 'other') => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Nhà riêng</SelectItem>
                  <SelectItem value="office">Văn phòng</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Ghi chú thêm (tùy chọn)"
                rows={2}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: !!checked }))}
              />
              <Label htmlFor="isDefault">Đặt làm địa chỉ mặc định</Label>
            </div>
          </form>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDialog(false)}
            >
              Hủy
            </Button>
            <Button 
              type="submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : (editingAddress ? 'Cập nhật' : 'Thêm địa chỉ')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressManagement;