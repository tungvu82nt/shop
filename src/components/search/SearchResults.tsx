import React, { useState, useEffect } from 'react';
import { Grid, List, SortAsc, SortDesc, Loader2, AlertCircle } from 'lucide-react';
import { SearchResult, SearchQuery } from '../../services/searchService';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { ProductCard } from '../product/ProductCard';
import { ProductListItem } from '../product/ProductListItem';
import { Skeleton } from '../ui/skeleton';

interface SearchResultsProps {
  result: SearchResult | null;
  query: SearchQuery;
  isLoading: boolean;
  error: string | null;
  onQueryChange: (query: SearchQuery) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}

type ViewMode = 'grid' | 'list';

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Liên quan nhất' },
  { value: 'price_asc', label: 'Giá thấp đến cao' },
  { value: 'price_desc', label: 'Giá cao đến thấp' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy nhất' }
];

function SearchResultsSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="w-24 h-24 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: SearchQuery }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Không tìm thấy sản phẩm</h3>
      <p className="text-muted-foreground mb-4">
        {query.q
          ? `Không có kết quả nào cho "${query.q}"`
          : 'Không có sản phẩm nào phù hợp với bộ lọc của bạn'
        }
      </p>
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Gợi ý:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Kiểm tra lại chính tả</li>
          <li>Thử sử dụng từ khóa khác</li>
          <li>Giảm bớt bộ lọc</li>
          <li>Sử dụng từ khóa tổng quát hơn</li>
        </ul>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
      <p className="text-muted-foreground mb-4">{error}</p>
      <Button onClick={onRetry} variant="outline">
        Thử lại
      </Button>
    </div>
  );
}

export function SearchResults({
  result,
  query,
  isLoading,
  error,
  onQueryChange,
  onProductClick,
  className
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    onQueryChange({
      ...query,
      sortBy,
      page: 1 // Reset to first page when sorting
    });
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    onQueryChange({
      ...query,
      page
    });
  };
  
  // Handle retry
  const handleRetry = () => {
    onQueryChange({ ...query });
  };
  
  // Generate pagination items
  const generatePaginationItems = () => {
    if (!result) return [];
    
    const { page, totalPages } = result;
    const items = [];
    
    // Always show first page
    if (page > 3) {
      items.push(1);
      if (page > 4) {
        items.push('ellipsis');
      }
    }
    
    // Show pages around current page
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      items.push(i);
    }
    
    // Always show last page
    if (page < totalPages - 2) {
      if (page < totalPages - 3) {
        items.push('ellipsis');
      }
      items.push(totalPages);
    }
    
    return items;
  };
  
  // Format search time
  const formatSearchTime = (time: number) => {
    return time < 1000 ? `${Math.round(time)}ms` : `${(time / 1000).toFixed(2)}s`;
  };
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Results count */}
          {result && (
            <div className="text-sm text-muted-foreground">
              {result.total > 0 ? (
                <>
                  Hiển thị {((result.page - 1) * result.limit) + 1}-
                  {Math.min(result.page * result.limit, result.total)} trong số {result.total} kết quả
                  {result.searchTime && (
                    <span className="ml-2">({formatSearchTime(result.searchTime)})</span>
                  )}
                </>
              ) : (
                'Không có kết quả'
              )}
            </div>
          )}
          
          {/* Active filters */}
          {query.q && (
            <Badge variant="secondary">
              "{query.q}"
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sort */}
          <Select value={query.sortBy || 'relevance'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sắp xếp theo" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* View mode */}
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
        </div>
      </div>
      
      {/* Content */}
      <div className="min-h-96">
        {/* Loading */}
        {isLoading && (
          <SearchResultsSkeleton viewMode={viewMode} />
        )}
        
        {/* Error */}
        {error && !isLoading && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}
        
        {/* Results */}
        {result && !isLoading && !error && (
          <>
            {result.items.length > 0 ? (
              <>
                {/* Products */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {result.items.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onClick={() => onProductClick?.(product)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {result.items.map((product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        onClick={() => onProductClick?.(product)}
                      />
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {result.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <PaginationContent>
                        {/* Previous */}
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, result.page - 1))}
                            className={cn(
                              result.page === 1 && 'pointer-events-none opacity-50'
                            )}
                          />
                        </PaginationItem>
                        
                        {/* Page numbers */}
                        {generatePaginationItems().map((item, index) => (
                          <PaginationItem key={index}>
                            {item === 'ellipsis' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                onClick={() => handlePageChange(item as number)}
                                isActive={item === result.page}
                              >
                                {item}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        
                        {/* Next */}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(Math.min(result.totalPages, result.page + 1))}
                            className={cn(
                              result.page === result.totalPages && 'pointer-events-none opacity-50'
                            )}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <EmptyState query={query} />
            )}
          </>
        )}
      </div>
      
      {/* Suggestions */}
      {result?.suggestions && result.suggestions.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="font-medium mb-3">Có thể bạn quan tâm:</h3>
          <div className="flex flex-wrap gap-2">
            {result.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onQueryChange({ ...query, q: suggestion, page: 1 })}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchResults;