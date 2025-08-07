import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { AlertCircle, Info, Grid, List } from 'lucide-react';
import { SearchResponse } from '@/services/searchService';
import SearchResultCard from './SearchResultCard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResultsListProps {
  searchResponse: SearchResponse | null;
  isLoading?: boolean;
  error?: string | null;
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  onProductClick?: (productId: string) => void;
  onPageChange?: (page: number) => void;
  wishlistedItems?: Set<string>;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showOptimizationInfo?: boolean;
  onToggleOptimizationInfo?: () => void;
  className?: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  searchResponse,
  isLoading = false,
  error = null,
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  onPageChange,
  wishlistedItems = new Set(),
  viewMode = 'grid',
  onViewModeChange,
  showOptimizationInfo = false,
  onToggleOptimizationInfo,
  className
}) => {
  const renderLoadingSkeleton = () => {
    return (
      <div className={cn(
        "grid gap-4",
        viewMode === 'grid' 
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
          : "grid-cols-1"
      )}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <Alert className="my-4">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  };

  const renderEmptyState = () => {
    if (!searchResponse || searchResponse.results.length > 0) return null;

    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không tìm thấy sản phẩm nào
        </h3>
        <p className="text-gray-500">
          Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
        </p>
      </div>
    );
  };

  const renderResultsHeader = () => {
    if (!searchResponse || isLoading) return null;

    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Hiển thị {searchResponse.results.length} trong số {searchResponse.total} sản phẩm
            {searchResponse.searchTime && (
              <span className="ml-2">({searchResponse.searchTime}ms)</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Optimization Info Toggle */}
          {onToggleOptimizationInfo && (
            <Button
              variant={showOptimizationInfo ? "default" : "outline"}
              size="sm"
              onClick={onToggleOptimizationInfo}
              className="text-xs"
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" />
              Debug
            </Button>
          )}

          {/* View Mode Toggle */}
          {onViewModeChange && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!searchResponse || searchResponse.results.length === 0) return null;

    return (
      <div className={cn(
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          : "space-y-4"
      )}>
        {searchResponse.results.map((result) => (
          <SearchResultCard
              key={result.id}
              result={result}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              onProductClick={onProductClick}
              isWishlisted={wishlistedItems?.includes(result.id)}
              showOptimizationInfo={showOptimizationInfo}
              viewMode={viewMode}
              className={viewMode === 'list' ? 'w-full' : ''}
            />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (!searchResponse || !onPageChange || searchResponse.totalPages <= 1) return null;

    const { currentPage, totalPages } = searchResponse;
    const maxVisiblePages = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4" />
          Trước
        </Button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Sau
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderSuggestions = () => {
    if (!searchResponse?.suggestions || searchResponse.suggestions.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Có thể bạn muốn tìm:</h3>
        <div className="flex flex-wrap gap-2">
          {searchResponse.suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                // Handle suggestion click - this would typically trigger a new search
                console.log('Suggestion clicked:', suggestion);
              }}
            >
              {suggestion.text}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full", className)}>
      {renderError()}
      
      {isLoading ? (
        renderLoadingSkeleton()
      ) : (
        <>
          {renderResultsHeader()}
          {renderSuggestions()}
          {renderResults()}
          {renderEmptyState()}
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default SearchResultsList;