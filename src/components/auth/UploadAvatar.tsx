import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, User, Crop, RotateCw, Download, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { useToast } from '../ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Slider } from '../ui/slider';
import { supabase } from '../../lib/supabase';

interface UploadAvatarProps {
  currentAvatar?: string;
  onAvatarChange?: (avatarUrl: string) => void;
  onAvatarRemove?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  allowCrop?: boolean;
  allowRemove?: boolean;
  className?: string;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

const UploadAvatar: React.FC<UploadAvatarProps> = ({
  currentAvatar,
  onAvatarChange,
  onAvatarRemove,
  size = 'md',
  allowCrop = true,
  allowRemove = true,
  className = ''
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [cropData, setCropData] = useState<CropData>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    rotation: 0
  });
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-16 h-16', icon: 'h-4 w-4', button: 'h-6 w-6' },
    md: { container: 'w-24 h-24', icon: 'h-5 w-5', button: 'h-8 w-8' },
    lg: { container: 'w-32 h-32', icon: 'h-6 w-6', button: 'h-10 w-10' },
    xl: { container: 'w-40 h-40', icon: 'h-8 w-8', button: 'h-12 w-12' }
  };

  const config = sizeConfig[size];

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Chỉ hỗ trợ file ảnh định dạng JPG, PNG, WEBP';
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return 'Kích thước file không được vượt quá 5MB';
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: 'Lỗi tải file',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewImage(imageUrl);
      
      // Create image object for cropping
      const img = new Image();
      img.onload = () => {
        setOriginalImage(img);
        if (allowCrop) {
          setShowCropDialog(true);
        } else {
          uploadImage(imageUrl);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  }, [allowCrop, toast]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const cropImage = (): string => {
    if (!originalImage || !canvasRef.current) return '';

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = cropData.width;
    canvas.height = cropData.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((cropData.rotation * Math.PI) / 180);
    ctx.scale(cropData.scale, cropData.scale);

    // Draw image
    ctx.drawImage(
      originalImage,
      cropData.x,
      cropData.y,
      cropData.width / cropData.scale,
      cropData.height / cropData.scale,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    // Restore context
    ctx.restore();

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  const uploadImage = async (imageData: string) => {
    setIsUploading(true);
    
    try {
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Create FormData
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.jpg');
      
      // Tích hợp với Supabase Storage để upload avatar
      const fileName = `avatar-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Lấy public URL của ảnh đã upload
      const { data: { publicUrl } } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);
      
      // Cập nhật avatar URL trong database
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      onAvatarChange?.(publicUrl);
      toast({
        title: 'Thành công!',
        description: 'Ảnh đại diện đã được cập nhật.',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi tải lên',
        description: error.message || 'Có lỗi xảy ra khi tải lên ảnh.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setShowCropDialog(false);
      setPreviewImage(null);
      setOriginalImage(null);
    }
  };

  const handleCropConfirm = () => {
    const croppedImage = cropImage();
    uploadImage(croppedImage);
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar) return;
    
    setIsUploading(true);
    
    try {
      // Tích hợp với Supabase để xóa avatar
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      
      if (updateError) {
        throw new Error(updateError.message);
      }
      
      // Xóa file từ storage (optional - có thể giữ lại để tránh broken links)
      // const response = await fetch('/api/user/avatar', {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });
      
      onAvatarRemove?.();
      toast({
        title: 'Thành công!',
        description: 'Đã xóa ảnh đại diện.',
      });
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa ảnh.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <div className={`relative ${className}`}>
        <div 
          className={`${config.container} relative rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer group overflow-hidden`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={openFileDialog}
        >
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt="Avatar" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
              <User className={`${config.icon} text-gray-400`} />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className={`${config.icon} text-white`} />
          </div>
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="absolute -bottom-2 -right-2 flex space-x-1">
          <Button
            size="sm"
            variant="outline"
            className={`${config.button} rounded-full bg-white shadow-md hover:shadow-lg`}
            onClick={openFileDialog}
            disabled={isUploading}
          >
            <Upload className="h-3 w-3" />
          </Button>
          
          {allowRemove && currentAvatar && (
            <Button
              size="sm"
              variant="outline"
              className={`${config.button} rounded-full bg-white shadow-md hover:shadow-lg text-red-600 hover:text-red-700`}
              onClick={handleRemoveAvatar}
              disabled={isUploading}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ảnh đại diện</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative w-64 h-64 mx-auto border border-gray-300 rounded-lg overflow-hidden">
              {previewImage && (
                <img 
                  src={previewImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${cropData.scale}) rotate(${cropData.rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                />
              )}
            </div>
            
            {/* Controls */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Zoom</label>
                <Slider
                  value={[cropData.scale]}
                  onValueChange={([value]) => setCropData(prev => ({ ...prev, scale: value }))}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Xoay</label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[cropData.rotation]}
                    onValueChange={([value]) => setCropData(prev => ({ ...prev, rotation: value }))}
                    min={0}
                    max={360}
                    step={15}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCropData(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCropDialog(false)}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleCropConfirm}
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải lên...' : 'Xác nhận'}
            </Button>
          </DialogFooter>
          
          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UploadAvatar;

// Hook để sử dụng avatar upload
export const useAvatarUpload = () => {
  const { toast } = useToast();
  
  const uploadAvatar = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await fetch('/api/user/avatar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }
    
    return data.avatarUrl;
  };
  
  const removeAvatar = async (): Promise<void> => {
    const response = await fetch('/api/user/avatar', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Remove failed');
    }
  };
  
  return {
    uploadAvatar,
    removeAvatar,
  };
};