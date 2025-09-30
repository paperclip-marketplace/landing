'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, Item, Category, SearchFilters } from '@/lib/api';
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
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<{l1?: string, l2?: string, l3?: string}>({});
  const [filtersChanged, setFiltersChanged] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (filtersChanged) {
      handleSearch();
      setFiltersChanged(false);
    }
  }, [filters, selectedCategory, selectedCategoryPath, searchQuery, filtersChanged]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      console.log('Loading initial data...');
      const [itemsResponse, categoriesResponse] = await Promise.all([
        apiClient.getFeaturedItems(),
        apiClient.getCategories(),
      ]);

      console.log('Items response:', itemsResponse);
      console.log('Categories response:', categoriesResponse);

      if (itemsResponse.success) {
        console.log('Setting items:', itemsResponse.data);
        setItems(itemsResponse.data);
      } else {
        console.error('Failed to load items:', itemsResponse.message);
      }

      if (categoriesResponse.success) {
        console.log('Setting categories:', categoriesResponse.data);
        setCategories(categoriesResponse.data);
      } else {
        console.error('Failed to load categories:', categoriesResponse.message);
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
      const searchFilters: SearchFilters = {
        ...filters,
        term: searchQuery,
        categoryId: selectedCategory,
        ...selectedCategoryPath,
      };

      console.log('Search filters:', searchFilters);
      const response = await apiClient.searchItems(searchFilters);
      console.log('Search response:', response);
      if (response.success) {
        console.log('First search item:', response.data[0]);
        setItems(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string, l1?: string, l2?: string, l3?: string) => {
    setSelectedCategory(categoryId);
    setSelectedCategoryPath({ l1, l2, l3 });
    setFiltersChanged(true);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setFiltersChanged(true);
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
                selectedCategory={selectedCategory}
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
