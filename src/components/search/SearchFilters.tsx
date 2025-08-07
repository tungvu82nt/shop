import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Star, MapPin, Truck } from 'lucide-react';
import { SearchQuery, SearchFilters as ISearchFilters, FilterOption, PriceRange } from '../../services/searchService';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface SearchFiltersProps {
  filters: ISearchFilters;
  currentQuery: SearchQuery;
  onFiltersChange: (query: SearchQuery) => void;
  onClearFilters: () => void;
  className?: string;
  isMobile?: boolean;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function FilterSection({ title, children, defaultOpen = true, className }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-left"
        >
          {title}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function SearchFiltersContent({
  filters,
  currentQuery,
  onFiltersChange,
  onClearFilters,
  className
}: SearchFiltersProps) {
  const [localQuery, setLocalQuery] = useState<SearchQuery>(currentQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  
  // Update local state when currentQuery changes
  useEffect(() => {
    setLocalQuery(currentQuery);
    if (currentQuery.minPrice !== undefined && currentQuery.maxPrice !== undefined) {
      setPriceRange([currentQuery.minPrice, currentQuery.maxPrice]);
    }
  }, [currentQuery]);
  
  // Apply filters
  const applyFilters = () => {
    onFiltersChange({
      ...localQuery,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined
    });
  };
  
  // Handle category change
  const handleCategoryChange = (category: string, checked: boolean) => {
    setLocalQuery(prev => ({
      ...prev,
      category: checked ? category : undefined
    }));
  };
  
  // Handle brand change (multi-select)
  const handleBrandChange = (brand: string, checked: boolean) => {
    setLocalQuery(prev => {
      const currentBrands = Array.isArray(prev.brand) ? prev.brand : prev.brand ? [prev.brand] : [];
      
      if (checked) {
        return {
          ...prev,
          brand: [...currentBrands, brand]
        };
      } else {
        const newBrands = currentBrands.filter(b => b !== brand);
        return {
          ...prev,
          brand: newBrands.length > 0 ? newBrands : undefined
        };
      }
    });
  };
  
  // Handle rating change
  const handleRatingChange = (rating: number, checked: boolean) => {
    setLocalQuery(prev => ({
      ...prev,
      minRating: checked ? rating : undefined
    }));
  };
  
  // Handle location change
  const handleLocationChange = (location: string, checked: boolean) => {
    setLocalQuery(prev => ({
      ...prev,
      location: checked ? location : undefined
    }));
  };
  
  // Handle shipping option change
  const handleShippingChange = (option: string, checked: boolean) => {
    setLocalQuery(prev => {
      const currentShipping = prev.shippingOptions || [];
      
      if (checked) {
        return {
          ...prev,
          shippingOptions: [...currentShipping, option]
        };
      } else {
        const newShipping = currentShipping.filter(s => s !== option);
        return {
          ...prev,
          shippingOptions: newShipping.length > 0 ? newShipping : undefined
        };
      }
    });
  };
  
  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (localQuery.category) count++;
    if (localQuery.brand) {
      count += Array.isArray(localQuery.brand) ? localQuery.brand.length : 1;
    }
    if (localQuery.minRating) count++;
    if (localQuery.location) count++;
    if (localQuery.shippingOptions?.length) count += localQuery.shippingOptions.length;
    if (priceRange[0] > 0 || priceRange[1] < 10000000) count++;
    return count;
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setLocalQuery({
      query: localQuery.query,
      sortBy: localQuery.sortBy
    });
    setPriceRange([0, 10000000]);
    onClearFilters();
  };
  
  // Handle price range change
  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange([range.min, range.max === Infinity ? 10000000 : range.max]);
    setLocalQuery(prev => ({
      ...prev,
      minPrice: range.min,
      maxPrice: range.max === Infinity ? undefined : range.max
    }));
  };
  
  // Handle availability change
  const handleAvailabilityChange = (type: string, checked: boolean) => {
    if (type === 'in_stock') {
      setLocalQuery(prev => ({
        ...prev,
        inStock: checked ? true : undefined
      }));
    }
  };
  
  // Handle tag change
  const handleTagChange = (tag: string, checked: boolean) => {
    setLocalQuery(prev => {
      const currentTags = prev.tags || [];
      if (checked) {
        return {
          ...prev,
          tags: [...currentTags, tag]
        };
      } else {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag)
        };
      }
    });
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  // Count active filters
  const activeFiltersCount = [
    localQuery.category,
    localQuery.brand,
    localQuery.rating,
    localQuery.minPrice,
    localQuery.maxPrice,
    localQuery.inStock,
    ...(localQuery.tags || [])
  ].filter(Boolean).length;
  
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Bộ lọc</h3>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} bộ lọc
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Xóa tất cả
          </Button>
        </div>
      </div>
      
      {/* Categories */}
      {filters.categories.length > 0 && (
        <FilterSection title="Danh mục">
          <div className="space-y-2">
            {filters.categories.slice(0, 8).map((category) => (
              <div key={category.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.value}`}
                  checked={localQuery.category === category.value}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`category-${category.value}`}
                  className="flex-1 text-sm font-normal cursor-pointer"
                >
                  {category.label}
                  {category.count && (
                    <span className="text-muted-foreground ml-1">({category.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Price Range */}
      <FilterSection title="Khoảng giá">
        <div className="space-y-4">
          {/* Predefined ranges */}
          {filters.priceRanges.length > 0 && (
            <div className="space-y-2">
              {filters.priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePriceRangeChange(range)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-sm transition-colors',
                    range.selected
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex justify-between items-center">
                    <span>{range.label}</span>
                    {range.count && (
                      <span className="text-xs opacity-70">({range.count})</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {/* Custom range slider */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Tùy chỉnh</div>
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000000}
              min={0}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>
      </FilterSection>
      
      {/* Brands */}
      {filters.brands.length > 0 && (
        <FilterSection title="Thương hiệu">
          <div className="space-y-2">
            {(() => {
               const currentBrands = Array.isArray(localQuery.brand) ? localQuery.brand : localQuery.brand ? [localQuery.brand] : [];
               
               return (
                 <>
                   {filters.brands.slice(0, 8).map((brand) => {
                     const isChecked = currentBrands.includes(brand.value);
                     
                     return (
                       <div key={brand.value} className="flex items-center space-x-2">
                         <Checkbox
                           id={`brand-${brand.value}`}
                           checked={isChecked}
                           onCheckedChange={(checked) => 
                             handleBrandChange(brand.value, checked as boolean)
                           }
                         />
                         <Label
                           htmlFor={`brand-${brand.value}`}
                           className="flex-1 text-sm font-normal cursor-pointer"
                         >
                           {brand.label}
                           {brand.count && (
                             <span className="text-muted-foreground ml-1">({brand.count})</span>
                           )}
                         </Label>
                       </div>
                     );
                   })}
                   {currentBrands.length > 0 && (
                     <div className="pt-2">
                       <div className="flex flex-wrap gap-1">
                         {currentBrands.map((brand) => (
                           <Badge key={brand} variant="secondary" className="text-xs">
                             {brand}
                             <button
                               onClick={() => handleBrandChange(brand, false)}
                               className="ml-1 hover:text-destructive"
                             >
                               <X className="h-3 w-3" />
                             </button>
                           </Badge>
                         ))}
                       </div>
                     </div>
                   )}
                 </>
               );
             })()}
          </div>
        </FilterSection>
      )}
      
      {/* Rating */}
      {filters.ratings.length > 0 && (
        <FilterSection title="Đánh giá">
          <div className="space-y-2">
            {filters.ratings.map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={localQuery.rating === rating}
                  onCheckedChange={(checked) => 
                    handleRatingChange(rating, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center space-x-1 text-sm font-normal cursor-pointer"
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-3 w-3',
                          i < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <span>từ {rating} sao trở lên</span>
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Availability */}
      {filters.availability.length > 0 && (
        <FilterSection title="Tình trạng">
          <div className="space-y-2">
            {filters.availability.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${option.value}`}
                  checked={
                    (option.value === 'in_stock' && localQuery.inStock === true) ||
                    (option.value === 'out_of_stock' && localQuery.inStock === false)
                  }
                  onCheckedChange={(checked) => 
                    handleAvailabilityChange(option.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`availability-${option.value}`}
                  className="flex-1 text-sm font-normal cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {option.value === 'in_stock' && <Truck className="h-3 w-3" />}
                    {option.label}
                    {option.count && (
                      <span className="text-muted-foreground">({option.count})</span>
                    )}
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Tags */}
      {filters.tags.length > 0 && (
        <FilterSection title="Thẻ" defaultOpen={false}>
          <div className="space-y-2">
            {filters.tags.slice(0, 10).map((tag) => (
              <div key={tag.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag.value}`}
                  checked={localQuery.tags?.includes(tag.value) || false}
                  onCheckedChange={(checked) => 
                    handleTagChange(tag.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`tag-${tag.value}`}
                  className="flex-1 text-sm font-normal cursor-pointer"
                >
                  {tag.label}
                  {tag.count && (
                    <span className="text-muted-foreground ml-1">({tag.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Location */}
      {filters.locations && filters.locations.length > 0 && (
        <FilterSection title="Khu vực" defaultOpen={false}>
          <div className="space-y-2">
            {filters.locations.slice(0, 8).map((location) => (
              <div key={location.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${location.value}`}
                  checked={localQuery.location === location.value}
                  onCheckedChange={(checked) => 
                    handleLocationChange(location.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`location-${location.value}`}
                  className="flex items-center space-x-1 text-sm font-normal cursor-pointer"
                >
                  <MapPin className="h-3 w-3" />
                  <span>{location.label}</span>
                  {location.count && (
                    <span className="text-muted-foreground">({location.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Shipping Options */}
      {filters.shippingOptions && filters.shippingOptions.length > 0 && (
        <FilterSection title="Vận chuyển" defaultOpen={false}>
          <div className="space-y-2">
            {filters.shippingOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`shipping-${option.value}`}
                  checked={localQuery.shipping?.includes(option.value) || false}
                  onCheckedChange={(checked) => 
                    handleShippingChange(option.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`shipping-${option.value}`}
                  className="flex items-center space-x-1 text-sm font-normal cursor-pointer"
                >
                  <Truck className="h-3 w-3" />
                  <span>{option.label}</span>
                  {option.count && (
                    <span className="text-muted-foreground">({option.count})</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </FilterSection>
      )}
      
      {/* Apply Button */}
      <div className="pt-4 border-t">
        <Button onClick={applyFilters} className="w-full">
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
}

export function SearchFilters(props: SearchFiltersProps) {
  if (props.isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            Bộ lọc
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
            <SheetDescription>
              Sử dụng các bộ lọc để tìm sản phẩm phù hợp
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <SearchFiltersContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <div className={cn('w-64 flex-shrink-0', props.className)}>
      <div className="sticky top-4">
        <SearchFiltersContent {...props} />
      </div>
    </div>
  );
}

export default SearchFilters;