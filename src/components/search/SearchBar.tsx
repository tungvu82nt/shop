import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, TrendingUp, Filter } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { searchService, SearchSuggestion } from '../../services/searchService';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { analytics } from '../../lib/analytics';

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  autoFocus?: boolean;
}

export function SearchBar({
  onSearch,
  onFilterClick,
  placeholder = 'Tìm kiếm sản phẩm...',
  className,
  showFilters = true,
  autoFocus = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Load initial data
  useEffect(() => {
    setSearchHistory(searchService.getRecentSearches());
    loadTrendingSearches();
  }, []);
  
  // Load trending searches
  const loadTrendingSearches = async () => {
    try {
      const trending = await searchService.getTrendingSearches();
      setTrendingSearches(trending);
    } catch (error) {
      console.error('Failed to load trending searches:', error);
    }
  };
  
  // Handle autocomplete
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      
      searchService.getSuggestions(debouncedQuery, abortControllerRef.current.signal)
        .then(setSuggestions)
        .catch((error) => {
          if (error.name !== 'AbortError') {
            console.error('Autocomplete error:', error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);
  
  // Handle search
  const handleSearch = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      // Track search analytics
      analytics.track('search_performed', {
        query: searchQuery.trim(),
        source: 'search_bar'
      });
      
      onSearch?.(searchQuery.trim());
      setQuery(searchQuery.trim());
      setIsOpen(false);
      
      // Save to search history
      searchService.saveSearchHistory(searchQuery.trim());
      setSearchHistory(searchService.getRecentSearches());
    }
  }, [onSearch]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0 || searchHistory.length > 0 || trendingSearches.length > 0);
  };
  
  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Track suggestion click analytics
    analytics.track('search_suggestion_clicked', {
      suggestion: suggestion.text,
      type: suggestion.type,
      source: 'autocomplete'
    });
    
    if (suggestion.type === 'product') {
      // Navigate to product page (assuming suggestion.text contains product name)
      // In a real app, you'd have product ID in the suggestion
      handleSearch(suggestion.text);
    } else {
      // Search for the suggestion
      handleSearch(suggestion.text);
    }
  };
  
  // Handle history item click
  const handleHistoryClick = (historyItem: string) => {
    // Track search history click analytics
    analytics.track('search_history_clicked', {
      query: historyItem,
      source: 'search_history'
    });
    
    handleSearch(historyItem);
  };
  
  // Clear search
  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  // Clear search history
  const clearHistory = () => {
    searchService.clearSearchHistory();
    setSearchHistory([]);
  };
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);
  
  // Cleanup abort controller
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  const showDropdown = isOpen && (
    suggestions.length > 0 ||
    (query.length === 0 && (searchHistory.length > 0 || trendingSearches.length > 0))
  );
  
  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      <div className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={() => setIsOpen(true)}
              className="pl-10 pr-10 h-12 text-base"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {showFilters && (
            <Button
              variant="outline"
              size="lg"
              onClick={onFilterClick}
              className="ml-2 h-12 px-4"
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc
            </Button>
          )}
        </div>
        
        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            {/* Loading */}
            {isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                Đang tìm kiếm...
              </div>
            )}
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                  Gợi ý tìm kiếm
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{suggestion.text}</div>
                      {suggestion.count && (
                        <div className="text-xs text-muted-foreground">
                          {suggestion.count} sản phẩm
                        </div>
                      )}
                      {suggestion.price && (
                        <div className="text-xs text-muted-foreground">
                          {suggestion.price.toLocaleString('vi-VN')} ₫
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {suggestion.type === 'product' && 'Sản phẩm'}
                      {suggestion.type === 'category' && 'Danh mục'}
                      {suggestion.type === 'brand' && 'Thương hiệu'}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Search History */}
            {query.length === 0 && searchHistory.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Tìm kiếm gần đây
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Xóa tất cả
                  </Button>
                </div>
                {searchHistory.slice(0, 5).map((item, index) => (
                  <button
                    key={`history-${index}`}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                  >
                    <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Trending Searches */}
            {query.length === 0 && trendingSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Tìm kiếm phổ biến
                </div>
                {trendingSearches.slice(0, 5).map((item, index) => (
                  <button
                    key={`trending-${index}`}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted rounded-md transition-colors"
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate">{item}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* No results */}
            {suggestions.length === 0 && query.length >= 2 && !isLoading && (
              <div className="p-4 text-center text-muted-foreground">
                Không tìm thấy kết quả cho "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;