export interface Admin {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "customer" | "provider";
  created_at: string;
}

export interface AdminProvider {
  id: string;
  user_id: string;
  business_name: string;
  category: string;
  state: string;
  city: string;
  description: string;
  image_url: string | null;
  phone_number: string | null;
  is_verified: boolean;
  is_featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
}

export interface AdminConversation {
  id: string;
  customer_id: string;
  provider_id: string;
  last_message_at: string;
  created_at: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalProviders: number;
  totalCustomers: number;
  totalMessages: number;
  totalReviews: number;
  totalConversations: number;
  verifiedProviders: number;
  featuredProviders: number;
}