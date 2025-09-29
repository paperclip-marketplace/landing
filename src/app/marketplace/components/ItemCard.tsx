'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Item } from '@/lib/api';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const formatPrice = (price: number, currency?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  return (
    <Link href={`/marketplace/item/${item.id}`}>
      <div className="bg-white rounded-lg shadow-soft hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
        <div className="relative aspect-square overflow-hidden group">
          {item.media && item.media.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={item.media[0].url}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.media.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  +{item.media.length - 1}
                </div>
              )}
            </div>
          ) : item.images && item.images.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={item.images[0]}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  +{item.images.length - 1}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 font-poppins">
            {item.name}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#F71D3B] font-bold text-xl font-poppins">
              {formatPrice(item.price, item.currency)}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {item.conditionTypeName}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            {item.user?.username ? (
              <Link 
                href={`/marketplace/seller/${item.user.username}`}
                className="font-medium hover:text-[#F71D3B] transition-colors"
              >
                @{item.user.username}
              </Link>
            ) : item.location?.name ? (
              <span className="text-gray-500 text-xs">
                📍 {item.location.name}
              </span>
            ) : (
              <span className="text-gray-500">@Unknown</span>
            )}
            {item.size && (
              <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                Size {item.size}
              </span>
            )}
          </div>
          
          {item.brand && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {typeof item.brand === 'string' ? item.brand : item.brand.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
