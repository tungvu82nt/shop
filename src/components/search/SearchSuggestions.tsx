import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { globalSearchService, SearchResult } from '../../services/globalSearchService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatPrice } from '../../lib/utils';

interface SearchSuggestionsProps {
  query: string;
  isVisible: boolean;
  onSelect: (query: string) => void;
  onClose: () => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  isVisible,
  onSelect,
  onClose,
  className = ''
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [instantResults, setInstantResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load search history và trending searches
    setSearchHistory(globalSearchService.getSearchHistory());
    setTrendingSearches(globalSearchService.getTrendingSearches());
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setInstantResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        // Lấy suggestions và instant results song song
        const [suggestionsData, instantData] = await Promise.all([
          globalSearchService.search(query, { limit: 5 }),
          globalSearchService.instantSearch(query)
        ]);

        setSuggestions(suggestionsData.suggestions);
        setInstantResults(instantData);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce để tránh gọi API quá nhiều
    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSuggestionClick = (suggestion: string) => {
    onSelect(suggestion);
    onClose();
  };

  const handleProductClick = (product: SearchResult) => {
    // Navigate to product page
    window.location.href = product.url;
    onClose();
  };

  const clearSearchHistory = () => {
    globalSearchService.clearSearchHistory();
    setSearchHistory([]);
  };

  if (!isVisible) {
    return null;
  }

  const showHistory = !query.trim() && searchHistory.length > 0;
  const showTrending = !query.trim() && trendingSearches.length > 0;
  const showSuggestions = query.trim() && suggestions.length > 0;
  const showInstantResults = query.trim() && instantResults.length > 0;

  return (
    <div
      ref={containerRef}
      className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto ${className}`}
    >
      {loading && (
        <div className="p-4 text-center text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          <span className="mt-2 block text-sm">Đang tìm kiếm...</span>
        </div>
      )}

      {/* Search History */}
      {showHistory && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Clock className="w-4 h-4" />
              Tìm kiếm gần đây
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearchHistory}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Xóa tất cả
            </Button>
          </div>
          <div className="space-y-1">
            {searchHistory.slice(0, 5).map((item, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
              >
                <Clock className="w-3 h-3 text-gray-400" />
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {showTrending && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <TrendingUp className="w-4 h-4" />
            Tìm kiếm phổ biến
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.slice(0, 6).map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 hover:text-blue-700"
                onClick={() => handleSuggestionClick(item)}
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Search className="w-4 h-4" />
            Gợi ý tìm kiếm
          </div>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-2"
              >
                <Search className="w-3 h-3 text-gray-400" />
                <span>
                  {suggestion.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                    part.toLowerCase() === query.toLowerCase() ? (
                      <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
                    ) : (
                      part
                    )
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instant Results */}
      {showInstantResults && (
        <div className="p-4">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Sản phẩm liên quan
          </div>
          <div className="space-y-2">
            {instantResults.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-md flex items-center gap-3 group"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate group-hover:text-blue-600">
                    {product.title.split(new RegExp(`(${query})`, 'gi')).map((part, i) => 
                      part.toLowerCase() === query.toLowerCase() ? (
                        <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {product.price && (
                      <span className="text-sm font-semibold text-red-600">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    {product.category && (
                      <span className="text-xs text-gray-500">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query.trim() && !loading && suggestions.length === 0 && instantResults.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Không tìm thấy kết quả cho "{query}"</p>
          <p className="text-xs text-gray-400 mt-1">
            Thử tìm kiếm với từ khóa khác
          </p>
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
        aria-label="Đóng gợi ý tìm kiếm"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SearchSuggestions;