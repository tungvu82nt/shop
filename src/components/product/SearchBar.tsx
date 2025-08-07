import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { searchService } from '@/services/searchService'
import SearchSuggestions from '../search/SearchSuggestions'
import { useAuth } from '@/contexts/AuthContext'
import { useSearch } from '@/contexts/SearchContext'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
  autoNavigate?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Tìm kiếm sản phẩm, thương hiệu, danh mục...',
  className = '',
  autoNavigate = true
}) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { openSearch } = useSearch()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)



  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Save search history
      try {
        await searchService.saveSearchHistory(searchQuery, user?.id)
      } catch (error) {
        console.error('Failed to save search history:', error)
      }
      
      // Call onSearch callback if provided
      if (onSearch) {
        onSearch(searchQuery)
      }
      
      // Navigate to search page if autoNavigate is true
      if (autoNavigate) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
      
      setIsOpen(false)
      setQuery(searchQuery)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setIsOpen(true)
  }
  
  const handleOpenGlobalSearch = (e: React.MouseEvent) => {
    e.preventDefault()
    openSearch()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }



  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleOpenGlobalSearch}
          onClick={handleOpenGlobalSearch}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base border-2 border-gray-200 focus:border-orange-500 rounded-lg"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      <SearchSuggestions
        query={query}
        isVisible={isOpen}
        onSelect={handleSearch}
        onClose={() => setIsOpen(false)}
        className="mt-1"
      />
    </div>
  )
}

export default SearchBar