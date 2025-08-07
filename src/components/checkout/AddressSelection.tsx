import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Interface cho địa chỉ giao hàng
interface Address {
  id: string;
  name: string; // Tên người nhận
  phone: string; // Số điện thoại
  address: string; // Địa chỉ chi tiết
  ward: string; // Phường/Xã
  district: string; // Quận/Huyện
  province: string; // Tỉnh/Thành phố
  isDefault: boolean; // Địa chỉ mặc định
}

interface AddressSelectionProps {
  selectedAddress: Address | null;
  onAddressSelect: (address: Address) => void;
  onNext: () => void;
}

/**
 * Component chọn địa chỉ giao hàng
 * Hiển thị danh sách địa chỉ đã lưu và cho phép chọn/thêm mới
 */
const AddressSelection: React.FC<AddressSelectionProps> = ({
  selectedAddress,
  onAddressSelect,
  onNext
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hàm xử lý edit address
  const handleEditAddress = async (updatedAddress: Address) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_addresses')
        .update({
          name: updatedAddress.name,
          phone: updatedAddress.phone,
          address: updatedAddress.address,
          ward: updatedAddress.ward,
          district: updatedAddress.district,
          province: updatedAddress.province,
          is_default: updatedAddress.isDefault,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedAddress.id);

      if (error) {
        console.error('Lỗi cập nhật địa chỉ:', error);
        alert('Có lỗi xảy ra khi cập nhật địa chỉ');
      } else {
        console.log('Cập nhật địa chỉ thành công');
        setEditingAddress(null);
        // Reload addresses - trong thực tế nên refetch data
        window.location.reload();
      }
    } catch (err) {
      console.error('Lỗi:', err);
      alert('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý delete address
  const handleDeleteAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressId);

      if (error) {
        console.error('Lỗi xóa địa chỉ:', error);
        alert('Có lỗi xảy ra khi xóa địa chỉ');
      } else {
        console.log('Xóa địa chỉ thành công');
        setShowDeleteDialog(null);
        // Reload addresses - trong thực tế nên refetch data
        window.location.reload();
      }
    } catch (err) {
      console.error('Lỗi:', err);
      alert('Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock data - trong thực tế sẽ lấy từ API
  const [addresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      address: '123 Đường ABC, Phường XYZ',
      ward: 'Phường 1',
      district: 'Quận 1',
      province: 'TP. Hồ Chí Minh',
      isDefault: true
    },
    {
      id: '2',
      name: 'Nguyễn Văn B',
      phone: '0987654321',
      address: '456 Đường DEF, Phường UVW',
      ward: 'Phường 2',
      district: 'Quận 3',
      province: 'TP. Hồ Chí Minh',
      isDefault: false
    }
  ]);

  /**
   * Xử lý chọn địa chỉ
   */
  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address);
  };

  /**
   * Xử lý tiếp tục với địa chỉ đã chọn
   */
  const handleContinue = () => {
    if (selectedAddress) {
      onNext();
    }
  };

  /**
   * Format địa chỉ đầy đủ
   */
  const formatFullAddress = (address: Address) => {
    return `${address.address}, ${address.ward}, ${address.district}, ${address.province}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Địa chỉ giao hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Danh sách địa chỉ */}
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedAddress?.id === address.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{address.name}</h4>
                      <span className="text-gray-600">|</span>
                      <span className="text-gray-600">{address.phone}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {formatFullAddress(address)}
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAddress(address);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteDialog(address.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Radio button indicator */}
                <div className="flex items-center mt-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    selectedAddress?.id === address.id
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAddress?.id === address.id && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedAddress?.id === address.id ? 'Đã chọn' : 'Chọn địa chỉ này'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Thêm địa chỉ mới */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm địa chỉ mới
          </Button>

          {/* Form thêm địa chỉ mới - placeholder */}
          {showAddForm && (
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-4">
                    Form thêm địa chỉ mới sẽ được triển khai ở bước tiếp theo.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Đóng
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedAddress}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Tiếp tục
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <EditAddressForm
              address={editingAddress}
              onSave={handleEditAddress}
              onCancel={() => setEditingAddress(null)}
              isLoading={isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!showDeleteDialog} onOpenChange={() => setShowDeleteDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa địa chỉ</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn xóa địa chỉ này không? Hành động này không thể hoàn tác.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(null)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => showDeleteDialog && handleDeleteAddress(showDeleteDialog)}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Component form chỉnh sửa địa chỉ
interface EditAddressFormProps {
  address: Address;
  onSave: (address: Address) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  address,
  onSave,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState<Address>(address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tên người nhận</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="address">Địa chỉ chi tiết</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ward">Phường/Xã</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="district">Quận/Huyện</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="province">Tỉnh/Thành phố</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            required
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Hủy
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddressSelection;