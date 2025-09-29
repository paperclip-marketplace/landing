const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.paperclip.co';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  media: {
    url: string;
    type: 'image' | 'video';
    width?: number;
    height?: number;
    thumbnail: string;
  }[];
  user?: {
    userId: string;
    name: string;
    firstName: string;
    lastName: string;
    username: string;
    locationName: string;
  };
  sellerId?: string;
  location?: {
    latitude: number;
    longitude: number;
    name: string;
  };
  categoryId: number;
  conditionType: number;
  conditionTypeName: string;
  size?: string;
  color?: {
    id: string;
    name: string;
    hex: string;
  };
  brand?: {
    id: string;
    name: string;
    domain?: string;
    logo?: string;
  } | string;
  age?: string;
  categoryTree?: {
    id: number;
    parentId: number | null;
    name: string;
    seoname: string;
    seourl: string;
    imageUrl: string;
  }[];
  created: string;
  deliveryMethodMeetInPerson?: boolean;
}

export interface Category {
  id: string;
  name: string;
  parent_id?: string;
  categories?: Category[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  token?: string;
}

export interface FilterConfig {
  ages: { id: string; value: string }[];
  clothingSize: {
    tops: { id: string; value: string }[];
    trousers: { id: string; value: string }[];
    jeans: { id: string; value: string }[];
  };
  shoesSize: { id: string; value: string }[];
  colors: { id: string; name: string; hex: string }[];
}

export interface SearchFilters {
  term?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  selectedCondition?: string[];
  selectedBrandId?: string[];
  selectedColorId?: string[];
  selectedAge?: string[];
  selectedShoeSize?: string[];
  selectedTrouserSize?: string[];
  selectedJeanSize?: string[];
  selectedTopSize?: string[];
  l1?: string;
  l2?: string;
  l3?: string;
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.request<User>('/v4/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async register(username: string, email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.request<User>('/v4/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    await this.request('/v4/logout', { method: 'POST' });
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/v4/categories/tree-filters');
  }

  async getFeaturedItems(): Promise<ApiResponse<Item[]>> {
    return this.request<Item[]>('/v4/items/featured');
  }

  async getTrendingItems(): Promise<ApiResponse<Item[]>> {
    return this.request<Item[]>('/v4/items/trending');
  }

  async searchItems(filters: SearchFilters = {}): Promise<ApiResponse<Item[]>> {
    const params = new URLSearchParams();
    
    params.append('include', 'user,media,brand,color,categoryTree');
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return this.request<Item[]>(`/v4/search/items?${params.toString()}`);
  }

  async getItem(id: string): Promise<ApiResponse<Item>> {
    return this.request<Item>(`/v4/items/${id}`);
  }

  async getWalletBalance(): Promise<ApiResponse<{ balance: number; currency: string }>> {
    return this.request('/v4/wallet/balance');
  }

  async getFilterConfig(): Promise<ApiResponse<FilterConfig>> {
    return this.request<FilterConfig>('/v4/items/config');
  }
}

export const apiClient = new ApiClient();
