'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Item, Category } from '@/lib/api';
import ItemGrid from './components/ItemGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';

export default function MarketplacePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    condition: '',
    size: '',
    brand: '',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        apiClient.getFeaturedItems(),
        apiClient.getCategories(),
      ]);

      if (itemsResponse.success) {
        setItems(itemsResponse.data);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const searchFilters = {
        query: searchQuery,
        category_id: selectedCategory,
        min_price: filters.min_price ? parseFloat(filters.min_price) : undefined,
        max_price: filters.max_price ? parseFloat(filters.max_price) : undefined,
        condition: filters.condition || undefined,
        size: filters.size || undefined,
        brand: filters.brand || undefined,
      };

      const response = await apiClient.searchItems(searchFilters);
      if (response.success) {
        setItems(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    handleSearch();
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    handleSearch();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-poppins">
            Marketplace
          </h1>
          <p className="text-gray-600 text-lg font-poppins">
            Discover amazing items from our community
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            loading={loading}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-[#F71D3B] text-white px-4 py-2 rounded-lg font-poppins font-semibold"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className={`${showFilters ? 'block' : 'hidden'} lg:block space-y-6`}>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
              
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F71D3B]"></div>
              </div>
            ) : (
              <ItemGrid items={items} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
