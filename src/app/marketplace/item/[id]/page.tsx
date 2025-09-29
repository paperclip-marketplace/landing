'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { apiClient, Item } from '@/lib/api';
import AuthModal from '../../components/AuthModal';

export default function ItemDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    
    if (params.id) {
      loadItem(params.id as string);
    }
  }, [params.id]);

  const loadItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.getItem(itemId);
      if (response.success) {
        console.log('Item data:', response.data);
        setItem(response.data);
      }
    } catch (error) {
      console.error('Failed to load item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    alert('Purchase functionality will be implemented with MangoPay integration');
  };

  const formatPrice = (price: number, currency?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F71D3B]"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 font-poppins">Item not found</h1>
          <p className="text-gray-600 font-poppins">The item you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image/Video Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              {item.media && item.media.length > 0 ? (
                <>
                  {item.media[currentImageIndex].type === 'video' ? (
                    <video
                      src={item.media[currentImageIndex].url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.media[currentImageIndex].url}
                      alt={`${item.name} image ${currentImageIndex + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="object-cover"
                    />
                  )}
                  {item.media.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : item.media.length - 1)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex < item.media.length - 1 ? currentImageIndex + 1 : 0)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : item.images && item.images.length > 0 ? (
                <>
                  <Image
                    src={item.images[currentImageIndex]}
                    alt={`${item.name} image ${currentImageIndex + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                  {item.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : item.images.length - 1)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(currentImageIndex < item.images.length - 1 ? currentImageIndex + 1 : 0)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
                      >
                        →
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-lg">No media available</span>
                </div>
              )}
            </div>
            
            {((item.media && item.media.length > 1) || (item.images && item.images.length > 1)) && (
              <div className="flex space-x-2 overflow-x-auto">
                {item.media && item.media.length > 1 ? (
                  item.media.map((media, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-[#F71D3B]' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={media.thumbnail}
                        alt={`${item.name} thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <span className="text-white text-xs">▶</span>
                        </div>
                      )}
                    </button>
                  ))
                ) : (
                  item.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-[#F71D3B]' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${item.name} thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 font-poppins">
                {item.name}
              </h1>
              <p className="text-2xl font-bold text-[#F71D3B] font-poppins">
                {formatPrice(item.price, item.currency)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                {item.conditionTypeName}
              </span>
              {item.size && (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  Size {item.size}
                </span>
              )}
              {item.brand && (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {typeof item.brand === 'string' ? item.brand : item.brand.name}
                </span>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed font-poppins">
                {item.description || 'No description available.'}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 font-poppins">
                Seller
              </h3>
              {item.user?.username ? (
                <Link 
                  href={`/marketplace/seller/${item.user.username}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-lg">
                      {item.user.firstName?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 font-poppins block">
                      {item.user.name || 'Unknown Seller'}
                    </span>
                    <span className="text-sm text-gray-500 font-poppins">
                      @{item.user.username} • {item.user.locationName || 'Unknown Location'}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-3 p-2">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-lg">?</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 font-poppins block">
                      Unknown Seller
                    </span>
                    <span className="text-sm text-gray-500 font-poppins">
                      Seller information unavailable
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#F71D3B] text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-[#E01A35] transition-colors font-poppins"
              >
                Buy Now
              </button>
              <p className="text-sm text-gray-500 mt-2 text-center font-poppins">
                Secure payment powered by MangoPay
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}
