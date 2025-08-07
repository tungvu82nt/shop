import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Grid, List, Filter, SortAsc, Trash2, Download, Upload, Search } from 'lucide-react';
import { wishlistService, WishlistData, WishlistFilters, WishlistStats } from '../services/wishlistService';
import { Product } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import OptimizedImage from '../components/ui/OptimizedImage';
import { WishlistButton } from '../components/wishlist/WishlistButton';
import { formatPrice } from '../lib/utils';
import { cn } from '../lib/utils';

// Interface cho view mode
type ViewMode = 'grid' | 'list';

/**
 * Trang danh sách yêu thích
 */
export function WishlistPage() {
  const navigate = useNavigate();
  
  // State
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [stats, setStats] = useState<WishlistStats | null>(null);
  const [filters, setFilters] = useState<WishlistFilters>({
    sortBy: 'addedAt',
    sortOrder: 'desc'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importData, setImportData] = useState('');

  // Cập nhật dữ liệu khi wishlist thay đổi
  useEffect(() => {
    const unsubscribe = wishlistService.subscribe((data: WishlistData) => {
      setWishlistData(data);
      setStats(wishlistService.getStats());
    });

    return unsubscribe;
  }, []);

  // Lấy danh sách items đã được filter
  const getFilteredItems = () => {
    if (!wishlistData) return [];

    let items = wishlistService.getItems(filters);

    // Áp dụng search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      items = items.filter(item => 
        item.product.name.toLowerCase().includes(query) ||
        item.product.description?.toLowerCase().includes(query) ||
        item.product.category?.toLowerCase().includes(query) ||
        item.product.brand?.toLowerCase().includes(query)
      );
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  // Xử lý thay đổi filters
  const handleFiltersChange = (newFilters: Partial<WishlistFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Xử lý clear filters
  const handleClearFilters = () => {
    setFilters({
      sortBy: 'addedAt',
      sortOrder: 'desc'
    });
    setSearchQuery('');
  };

  // Xử lý click sản phẩm
  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  // Xử lý export
  const handleExport = () => {
    const data = wishlistService.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishlist-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Xử lý import
  const handleImport = () => {
    if (importData.trim()) {
      const success = wishlistService.importData(importData);
      if (success) {
        setImportData('');
        setIsImportOpen(false);
      }
    }
  };

  // Xử lý clear all
  const handleClearAll = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ danh sách yêu thích?')) {
      wishlistService.clearAll();
    }
  };

  // Render empty state
  if (!wishlistData || wishlistData.items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Danh sách yêu thích - Yapee Vietnam</title>
          <meta name="description" content="Quản lý danh sách sản phẩm yêu thích của bạn trên Yapee Vietnam" />
        </Helmet>
        
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Danh sách yêu thích trống
              </h1>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích. 
                Hãy khám phá và thêm những sản phẩm bạn thích!
              </p>
              <Button onClick={() => navigate('/')} size="lg">
                Khám phá sản phẩm
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Danh sách yêu thích ({wishlistData.totalItems}) - Yapee Vietnam</title>
        <meta name="description" content={`Quản lý ${wishlistData.totalItems} sản phẩm yêu thích của bạn trên Yapee Vietnam`} />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Danh sách yêu thích
              </h1>
              <p className="text-gray-600">
                {wishlistData.totalItems} sản phẩm • Cập nhật lần cuối: {' '}
                {new Date(wishlistData.lastUpdated).toLocaleString('vi-VN')}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Stats Button */}
              <Dialog open={isStatsOpen} onOpenChange={setIsStatsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Thống kê
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thống kê danh sách yêu thích</DialogTitle>
                  </DialogHeader>
                  {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Tổng quan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Tổng sản phẩm:</span>
                            <span className="font-semibold">{stats.totalItems}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tổng giá trị:</span>
                            <span className="font-semibold">{formatPrice(stats.totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Giá trung bình:</span>
                            <span className="font-semibold">{formatPrice(stats.averagePrice)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Khoảng giá</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span>Dưới 1M:</span>
                            <span>{stats.priceRanges.under1M}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>1M - 5M:</span>
                            <span>{stats.priceRanges.from1Mto5M}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>5M - 10M:</span>
                            <span>{stats.priceRanges.from5Mto10M}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trên 10M:</span>
                            <span>{stats.priceRanges.over10M}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Danh mục</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(stats.categoriesCount).map(([category, count]) => (
                              <div key={category} className="flex justify-between">
                                <span>{category}:</span>
                                <span>{count}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Thương hiệu</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {Object.entries(stats.brandsCount).map(([brand, count]) => (
                              <div key={brand} className="flex justify-between">
                                <span>{brand}:</span>
                                <span>{count}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              {/* Export Button */}
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              {/* Import Button */}
              <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import danh sách yêu thích</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Dán dữ liệu JSON vào đây..."
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      rows={10}
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsImportOpen(false)}>
                        Hủy
                      </Button>
                      <Button onClick={handleImport} disabled={!importData.trim()}>
                        Import
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {/* Clear All Button */}
              <Button variant="destructive" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [string, 'asc' | 'desc'];
                  handleFiltersChange({ sortBy: sortBy as any, sortOrder });
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addedAt-desc">Mới nhất</SelectItem>
                  <SelectItem value="addedAt-asc">Cũ nhất</SelectItem>
                  <SelectItem value="price-asc">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price-desc">Giá cao đến thấp</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                  <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
                </SelectContent>
              </Select>
              
              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Mobile Filters */}
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Lọc
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Bộ lọc</SheetTitle>
                  </SheetHeader>
                  {/* Filter content would go here */}
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredItems.length} / {wishlistData.totalItems} sản phẩm
            </p>
            
            {(searchQuery || Object.keys(filters).some(key => 
              key !== 'sortBy' && key !== 'sortOrder' && filters[key as keyof WishlistFilters]
            )) && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>
          
          {/* Products Grid/List */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy sản phẩm
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {filteredItems.map((item) => (
                <div
                  key={item.productId}
                  className={cn(
                    'group cursor-pointer',
                    viewMode === 'list' && 'flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow'
                  )}
                  onClick={() => handleProductClick(item.product)}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square">
                        <OptimizedImage
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          category={item.product.category}
                        />
                        <div className="absolute top-2 right-2">
                          <WishlistButton
                            product={item.product}
                            iconOnly
                            size="sm"
                          />
                        </div>
                        {item.product.discount && (
                          <Badge className="absolute top-2 left-2 bg-red-500">
                            -{item.product.discount}%
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-red-600">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{item.product.location}</span>
                          <span>Đã bán {item.product.soldCount}</span>
                        </div>
                        {item.notes && (
                          <p className="text-xs text-gray-600 mt-2 italic">
                            Ghi chú: {item.notes}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Thêm vào: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    // List View
                    <>
                      <div className="w-32 h-32 flex-shrink-0">
                        <OptimizedImage
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                          category={item.product.category}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                            {item.product.name}
                          </h3>
                          <WishlistButton
                            product={item.product}
                            iconOnly
                            size="sm"
                          />
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.product.description}
                        </p>
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-xl font-bold text-red-600">
                            {formatPrice(item.product.price)}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.product.originalPrice)}
                            </span>
                          )}
                          {item.product.discount && (
                            <Badge variant="destructive">
                              -{item.product.discount}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>{item.product.location}</span>
                            <span>Đã bán {item.product.soldCount}</span>
                            <span>Thêm vào: {new Date(item.addedAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            Ghi chú: {item.notes}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WishlistPage;