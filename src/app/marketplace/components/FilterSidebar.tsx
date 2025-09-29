'use client';

import React, { useState } from 'react';

interface FilterSidebarProps {
  filters: {
    min_price: string;
    max_price: string;
    condition: string;
    size: string;
    brand: string;
  };
  onFiltersChange: (filters: FilterSidebarProps['filters']) => void;
}

export default function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_price: '',
      max_price: '',
      condition: '',
      size: '',
      brand: '',
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

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

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Price Range
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min"
              value={localFilters.min_price}
              onChange={(e) => handleFilterChange('min_price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            />
            <input
              type="number"
              placeholder="Max"
              value={localFilters.max_price}
              onChange={(e) => handleFilterChange('max_price', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Condition
          </label>
          <select
            value={localFilters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
          >
            <option value="">Any Condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Size
          </label>
          <select
            value={localFilters.size}
            onChange={(e) => handleFilterChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
          >
            <option value="">Any Size</option>
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
            Brand
          </label>
          <input
            type="text"
            placeholder="Enter brand name"
            value={localFilters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F71D3B] focus:border-transparent font-poppins"
          />
        </div>
      </div>
    </div>
  );
}
