'use client';

import React from 'react';
import { Category } from '@/lib/api';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const renderCategory = (category: Category, level = 0) => {
    const isSelected = selectedCategory === category.id;
    const hasChildren = category.categories && category.categories.length > 0;
    
    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <button
          onClick={() => onCategoryChange(isSelected ? '' : category.id)}
          className={`w-full text-left px-3 py-2 rounded-md transition-colors font-poppins ${
            isSelected
              ? 'bg-[#F71D3B] text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span className="flex items-center">
            {hasChildren && (
              <span className="mr-2 text-xs">
                {isSelected ? '▼' : '▶'}
              </span>
            )}
            {category.name}
          </span>
        </button>
        
        {hasChildren && isSelected && (
          <div className="mt-1">
            {category.categories!.map((subCategory) =>
              renderCategory(subCategory, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-4">
      <h3 className="font-semibold text-gray-800 mb-4 font-poppins">Categories</h3>
      
      <button
        onClick={() => onCategoryChange('')}
        className={`w-full text-left px-3 py-2 rounded-md mb-2 transition-colors font-poppins ${
          selectedCategory === ''
            ? 'bg-[#F71D3B] text-white'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        All Categories
      </button>
      
      <div className="space-y-1">
        {categories.map((category) => renderCategory(category))}
      </div>
    </div>
  );
}
