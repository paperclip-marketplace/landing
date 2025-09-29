'use client';

import React, { useState, useEffect } from 'react';
import { apiClient, FilterConfig, SearchFilters } from '@/lib/api';

interface FilterSidebarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  selectedCategory?: string;
}

export default function FilterSidebar({ filters, onFiltersChange, selectedCategory }: FilterSidebarProps) {
  const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(null);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  useEffect(() => {
    loadFilterConfig();
  }, []);

  const loadFilterConfig = async () => {
    try {
      const response = await apiClient.getFilterConfig();
      if (response.success) {
        setFilterConfig(response.data);
      }
    } catch (error) {
      console.error('Failed to load filter config:', error);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMultiSelectChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
    const currentValues = (localFilters[key] as string[]) || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    handleFilterChange(key, newValues);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  if (!filterConfig) {
    return <div className="bg-white rounded-lg shadow-soft p-4">Loading filters...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800 font-poppins">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-[#F71D3B] hover:underline font-poppins"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.priceMin || ''}
              onChange={(e) => handleFilterChange('priceMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.priceMax || ''}
              onChange={(e) => handleFilterChange('priceMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Colors
          </label>
          <div className="grid grid-cols-4 gap-2">
            {filterConfig.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleMultiSelectChange('selectedColorId', color.id, !(localFilters.selectedColorId || []).includes(color.id))}
                className={`w-8 h-8 rounded-full border-2 ${
                  (localFilters.selectedColorId || []).includes(color.id) 
                    ? 'border-[#F71D3B] ring-2 ring-[#F71D3B] ring-opacity-30' 
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex || '#ccc' }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Age
          </label>
          <select
            value={(localFilters.selectedAge || [])[0] || ''}
            onChange={(e) => handleFilterChange('selectedAge', e.target.value ? [e.target.value] : [])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
          >
            <option value="">Any Age</option>
            {filterConfig.ages.map((age) => (
              <option key={age.id} value={age.value}>
                {age.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Size
          </label>
          <div className="space-y-2">
            <select
              value={(localFilters.selectedTopSize || [])[0] || ''}
              onChange={(e) => handleFilterChange('selectedTopSize', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            >
              <option value="">Any Top Size</option>
              {filterConfig.clothingSize.tops.map((size) => (
                <option key={size.id} value={size.value}>
                  {size.value}
                </option>
              ))}
            </select>
            
            <select
              value={(localFilters.selectedTrouserSize || [])[0] || ''}
              onChange={(e) => handleFilterChange('selectedTrouserSize', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            >
              <option value="">Any Trouser Size</option>
              {filterConfig.clothingSize.trousers.map((size) => (
                <option key={size.id} value={size.value}>
                  {size.value}
                </option>
              ))}
            </select>

            <select
              value={(localFilters.selectedJeanSize || [])[0] || ''}
              onChange={(e) => handleFilterChange('selectedJeanSize', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            >
              <option value="">Any Jean Size</option>
              {filterConfig.clothingSize.jeans.map((size) => (
                <option key={size.id} value={size.value}>
                  {size.value}
                </option>
              ))}
            </select>

            <select
              value={(localFilters.selectedShoeSize || [])[0] || ''}
              onChange={(e) => handleFilterChange('selectedShoeSize', e.target.value ? [e.target.value] : [])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            >
              <option value="">Any Shoe Size</option>
              {filterConfig.shoesSize.map((size) => (
                <option key={size.id} value={size.value}>
                  {size.value}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
