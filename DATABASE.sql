-- ============================================================
-- ServeNaija — Complete Database Schema
-- Run this entire file in Supabase SQL Editor on a fresh project
-- Order matters — run top to bottom
-- ============================================================


-- ============================================================
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with app-specific fields
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('customer', 'provider')),
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. PROVIDERS TABLE
-- Service provider business listings
-- ============================================================

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  phone_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Providers are viewable by everyone"
  ON providers FOR SELECT USING (true);

CREATE POLICY "Users can insert their own provider listing"
  ON providers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own provider listing"
  ON providers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own provider listing"
  ON providers FOR DELETE USING (auth.uid() = user_id);

-- Indexes for common queries
CREATE INDEX providers_category_idx ON providers(category);
CREATE INDEX providers_state_idx ON providers(state);
CREATE INDEX providers_is_featured_idx ON providers(is_featured);
CREATE INDEX providers_is_verified_idx ON providers(is_verified);
CREATE INDEX providers_rating_idx ON providers(rating DESC);
CREATE INDEX providers_created_at_idx ON providers(created_at DESC);


-- ============================================================
-- 3. SERVICES TABLE
-- Individual services offered by a provider
-- ============================================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT USING (true);

CREATE POLICY "Provider owners can insert services"
  ON services FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.id = provider_id
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Provider owners can update services"
  ON services FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.id = provider_id
      AND providers.user_id = auth.uid()
    )
  );

CREATE POLICY "Provider owners can delete services"
  ON services FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM providers
      WHERE providers.id = provider_id
      AND providers.user_id = auth.uid()
    )
  );


-- ============================================================
-- 4. FAVOURITES TABLE
-- Customer saved providers
-- ============================================================

CREATE TABLE favourites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider_id)
);

-- Enable RLS
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own favourites"
  ON favourites FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favourites"
  ON favourites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favourites"
  ON favourites FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- 5. CONVERSATIONS TABLE
-- Chat threads between a customer and a provider
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  customer_last_read_at TIMESTAMPTZ,
  provider_last_read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, provider_id)
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = provider_id
  );

CREATE POLICY "Customers can create conversations"
  ON conversations FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Participants can update conversations"
  ON conversations FOR UPDATE USING (
    auth.uid() = customer_id OR auth.uid() = provider_id
  );

-- Indexes
CREATE INDEX conversations_customer_id_idx ON conversations(customer_id);
CREATE INDEX conversations_provider_id_idx ON conversations(provider_id);
CREATE INDEX conversations_last_message_at_idx ON conversations(last_message_at DESC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;


-- ============================================================
-- 6. MESSAGES TABLE
-- Individual messages within a conversation
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.customer_id = auth.uid() OR conversations.provider_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
      AND (conversations.customer_id = auth.uid() OR conversations.provider_id = auth.uid())
    )
  );

-- Indexes
CREATE INDEX messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX messages_created_at_idx ON messages(created_at ASC);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Auto-update last_message_at on conversations when a message is sent
CREATE OR REPLACE FUNCTION update_conversation_last_message_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_message_inserted
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message_at();


-- ============================================================
-- 7. REVIEWS TABLE
-- Customer reviews for providers
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider_id, customer_id)
);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT USING (true);

CREATE POLICY "Customers can insert a review if they have a conversation with the provider"
  ON reviews FOR INSERT WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.customer_id = auth.uid()
      AND conversations.provider_id = (
        SELECT user_id FROM providers WHERE id = provider_id
      )
    )
  );

-- Indexes
CREATE INDEX reviews_provider_id_idx ON reviews(provider_id);
CREATE INDEX reviews_customer_id_idx ON reviews(customer_id);
CREATE INDEX reviews_created_at_idx ON reviews(created_at DESC);

-- Auto-update provider rating and review_count when a review is submitted
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET
    rating = (
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM reviews
      WHERE reviews.provider_id = NEW.provider_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviews.provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_inserted
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();

CREATE TRIGGER on_review_updated
  AFTER UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_provider_rating();


-- ============================================================
-- 8. CATEGORIES TABLE
-- Managed via admin dashboard
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT USING (true);

-- No insert/update/delete from client — managed via admin dashboard with service role key


-- ============================================================
-- 9. ADMINS TABLE
-- Separate from auth.users — for admin dashboard access only
-- ============================================================

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Block all access from anon/authenticated keys
-- Only service_role key (used by admin dashboard) can access this table
CREATE POLICY "No public access to admins"
  ON admins FOR ALL USING (false);


-- ============================================================
-- 10. STORAGE BUCKET POLICIES
-- Run these after creating the provider-logos bucket in Storage
-- ============================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own logo"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'provider-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access to all logos
CREATE POLICY "Public can view all logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'provider-logos');

-- Allow users to update their own logo
CREATE POLICY "Users can update their own logo"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'provider-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own logo
CREATE POLICY "Users can delete their own logo"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'provider-logos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- ============================================================
-- 11. SEED INITIAL CATEGORIES
-- The 15 categories used in the mobile app
-- ============================================================

INSERT INTO categories (name, icon) VALUES
  ('Plumbing', 'droplet'),
  ('Electrical', 'zap'),
  ('Cleaning', 'sparkles'),
  ('Carpentry', 'hammer'),
  ('Painting', 'paint-bucket'),
  ('IT & Tech Support', 'monitor'),
  ('Fashion & Tailoring', 'scissors'),
  ('Generator & Power Solutions', 'battery-charging'),
  ('AC & Refrigeration', 'wind'),
  ('Catering & Cooking', 'chef-hat'),
  ('Photography', 'camera'),
  ('Tutoring & Education', 'book-open'),
  ('Beauty & Wellness', 'heart'),
  ('Security Services', 'shield'),
  ('Moving & Logistics', 'truck');


-- ============================================================
-- DONE
-- All tables, policies, triggers, indexes, and seed data created
-- Next steps:
--   1. Create the provider-logos storage bucket in Supabase Dashboard
--   2. Run the admin seed script: node scripts/seed-admin.mjs
--   3. Configure Auth redirect URLs in Supabase Dashboard
-- ============================================================
