'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/api';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string, l1?: string, l2?: string, l3?: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categoryPath, setCategoryPath] = useState<Category[]>([]);

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySelect = (category: Category, path: Category[]) => {
    setCategoryPath(path);
    const l1 = path[0]?.id;
    const l2 = path[1]?.id;
    const l3 = path[2]?.id;
    onCategoryChange(category.id, l1, l2, l3);
  };

  const renderCategory = (category: Category, level = 0, path: Category[] = []) => {
    const currentPath = [...path, category];
    const isSelected = selectedCategory === category.id;
    const isExpanded = expandedCategories.has(category.id);
    const hasChildren = category.categories && category.categories.length > 0;
    
    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className="flex items-center">
          <button
            onClick={() => handleCategorySelect(category, currentPath)}
            className={`flex-1 text-left px-3 py-2 rounded-md transition-colors font-poppins flex items-center justify-between ${
              isSelected
                ? 'bg-[#F71D3B] text-white'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <span>{category.name}</span>
            {hasChildren && (
              <span 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="ml-2 text-xs cursor-pointer hover:scale-110 transition-transform"
              >
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
          </button>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {category.categories!.map((subCategory) =>
              renderCategory(subCategory, level + 1, currentPath)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-4">
      <h3 className="font-semibold text-gray-800 mb-4 font-poppins">Categories</h3>
      
      {categoryPath.length > 0 && (
        <div className="mb-4 p-2 bg-gray-50 rounded-md">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {categoryPath.map((cat, index) => (
              <React.Fragment key={cat.id}>
                {index > 0 && <span>›</span>}
                <span className={index === categoryPath.length - 1 ? 'font-medium text-[#F71D3B]' : ''}>
                  {cat.name}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      <button
        onClick={() => {
          setCategoryPath([]);
          onCategoryChange('');
        }}
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
