'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, Item } from '@/lib/api';
import ItemGrid from '../../components/ItemGrid';

export default function SellerProfilePage() {
  const params = useParams();
  const [seller, setSeller] = useState<any>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.username) {
      loadSellerData(params.username as string);
    }
  }, [params.username]);

  const loadSellerData = async (username: string) => {
    setLoading(true);
    try {
      const [sellerResponse, itemsResponse] = await Promise.all([
        fetch(`https://api.paperclip.co/v4/users/byUsername/${username}`),
        apiClient.searchItems({ sellerId: username })
      ]);

      if (sellerResponse.ok) {
        const sellerData = await sellerResponse.json();
        setSeller(sellerData.data);
      }

      if (itemsResponse.success && Array.isArray(itemsResponse.data)) {
        setItems(itemsResponse.data);
      } else {
        console.warn('Items response not successful or not an array:', itemsResponse);
        setItems([]);
      }
    } catch (error) {
      console.error('Failed to load seller data:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F71D3B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {seller && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-2xl">
                  {seller.firstName?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 font-poppins">
                  {seller.name}
                </h1>
                <p className="text-gray-600 font-poppins">@{seller.username}</p>
                <p className="text-gray-500 font-poppins">{seller.locationName}</p>
                {seller.rating && (
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-sm text-gray-600">{seller.rating}/5</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">
            Items for Sale ({items.length})
          </h2>
        </div>

        <ItemGrid items={items} />
      </div>
    </div>
  );
}
