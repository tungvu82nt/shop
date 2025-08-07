import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService, SearchSuggestion } from '../services/searchService';
import { useDebounce } from '../hooks/useDebounce';

// Search state interface
interface SearchState {
  query: string;
  suggestions: SearchSuggestion[];
  searchHistory: string[];
  trendingSearches: string[];
  isLoading: boolean;
  isSearchOpen: boolean;
  recentSearches: string[];
}

// Search actions
type SearchAction =
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_SUGGESTIONS'; payload: SearchSuggestion[] }
  | { type: 'SET_SEARCH_HISTORY'; payload: string[] }
  | { type: 'SET_TRENDING_SEARCHES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_OPEN'; payload: boolean }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'CLEAR_SUGGESTIONS' };

// Initial state
const initialState: SearchState = {
  query: '',
  suggestions: [],
  searchHistory: [],
  trendingSearches: [],
  isLoading: false,
  isSearchOpen: false,
  recentSearches: []
};

// Search reducer
const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    
    case 'SET_SEARCH_HISTORY':
      return { ...state, searchHistory: action.payload };
    
    case 'SET_TRENDING_SEARCHES':
      return { ...state, trendingSearches: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SEARCH_OPEN':
      return { ...state, isSearchOpen: action.payload };
    
    case 'ADD_RECENT_SEARCH': {
      const newRecentSearches = [
        action.payload,
        ...state.recentSearches.filter(item => item !== action.payload)
      ].slice(0, 10);
      return { ...state, recentSearches: newRecentSearches };
    }
    
    case 'CLEAR_SEARCH_HISTORY':
      return { ...state, searchHistory: [], recentSearches: [] };
    
    case 'CLEAR_SUGGESTIONS':
      return { ...state, suggestions: [] };
    
    default:
      return state;
  }
};

// Search context interface
interface SearchContextType {
  state: SearchState;
  setQuery: (query: string) => void;
  performSearch: (query: string) => void;
  getSuggestions: (query: string) => Promise<void>;
  loadTrendingSearches: () => Promise<void>;
  loadSearchHistory: () => void;
  clearSearchHistory: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  selectSuggestion: (suggestion: SearchSuggestion) => void;
}

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Search provider component
export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const navigate = useNavigate();
  
  const debouncedQuery = useDebounce(state.query, 300);
  
  // Load initial data
  useEffect(() => {
    loadSearchHistory();
    loadTrendingSearches();
  }, []);
  
  // Handle debounced query for suggestions
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      getSuggestions(debouncedQuery);
    } else {
      dispatch({ type: 'CLEAR_SUGGESTIONS' });
    }
  }, [debouncedQuery]);
  
  // Set query
  const setQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, []);
  
  // Perform search
  const performSearch = useCallback((query: string) => {
    if (query.trim()) {
      // Save to search history
      searchService.saveSearchHistory(query.trim());
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: query.trim() });
      
      // Navigate to search page
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      
      // Close search modal if open
      dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
      dispatch({ type: 'CLEAR_SUGGESTIONS' });
    }
  }, [navigate]);
  
  // Get suggestions
  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const suggestions = await searchService.getSuggestions(query);
      dispatch({ type: 'SET_SUGGESTIONS', payload: suggestions });
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      dispatch({ type: 'SET_SUGGESTIONS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);
  
  // Load trending searches
  const loadTrendingSearches = useCallback(async () => {
    try {
      const trending = await searchService.getTrendingSearches();
      dispatch({ type: 'SET_TRENDING_SEARCHES', payload: trending });
    } catch (error) {
      console.error('Failed to load trending searches:', error);
    }
  }, []);
  
  // Load search history
  const loadSearchHistory = useCallback(() => {
    const history = searchService.getRecentSearches();
    dispatch({ type: 'SET_SEARCH_HISTORY', payload: history });
  }, []);
  
  // Clear search history
  const clearSearchHistory = useCallback(() => {
    searchService.clearSearchHistory();
    dispatch({ type: 'CLEAR_SEARCH_HISTORY' });
  }, []);
  
  // Open search
  const openSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_OPEN', payload: true });
  }, []);
  
  // Close search
  const closeSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_OPEN', payload: false });
    dispatch({ type: 'CLEAR_SUGGESTIONS' });
  }, []);
  
  // Select suggestion
  const selectSuggestion = useCallback((suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product') {
      // Navigate to product page (in a real app, you'd have product ID)
      performSearch(suggestion.text);
    } else {
      // Search for the suggestion
      performSearch(suggestion.text);
    }
  }, [performSearch]);
  
  const value: SearchContextType = {
    state,
    setQuery,
    performSearch,
    getSuggestions,
    loadTrendingSearches,
    loadSearchHistory,
    clearSearchHistory,
    openSearch,
    closeSearch,
    selectSuggestion
  };
  
  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;