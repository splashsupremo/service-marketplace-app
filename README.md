# ServeNaija — Service Marketplace App

A full-stack mobile marketplace for service providers in Nigeria. Customers can discover, contact, and review local service providers. Providers can list their services and manage their business profile.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Monorepo Structure](#monorepo-structure)
4. [Prerequisites](#prerequisites)
5. [Mobile App Setup](#mobile-app-setup)
6. [Admin Dashboard Setup](#admin-dashboard-setup)
7. [Supabase Setup](#supabase-setup)
8. [Environment Variables](#environment-variables)
9. [Building the APK](#building-the-apk)
10. [Deploying the Admin Dashboard](#deploying-the-admin-dashboard)
11. [Features](#features)
12. [Key Design Decisions](#key-design-decisions)

---

## Project Overview

ServeNaija connects customers with trusted local service providers across Nigeria. The platform covers 15 service categories including Plumbing, Electrical, IT, Fashion & Tailoring, Generator & Power Solutions, and more.

**Tagline:** FIND · HIRE · TRUST

---

## Tech Stack

### Mobile App
- **Framework:** Expo SDK 54 + React Native
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based)
- **State Management:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime)

### Admin Dashboard
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Auth:** Custom JWT (HttpOnly cookies)
- **Backend:** Same Supabase project (service role key)

---

## Monorepo Structure

```
service-marketplace-app/
├── mobile/                        # Expo React Native app
│   ├── app/                       # Expo Router screens
│   │   ├── (tabs)/                # Tab navigation screens
│   │   │   ├── index.tsx          # Home
│   │   │   ├── search.tsx         # Search
│   │   │   ├── favourites.tsx     # Favourites
│   │   │   ├── messages.tsx       # Messages
│   │   │   └── profile.tsx        # Profile
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   ├── chat/
│   │   │   └── [conversationId].tsx
│   │   ├── profile/
│   │   │   └── edit.tsx
│   │   ├── provider/
│   │   │   ├── dashboard.tsx
│   │   │   ├── edit-listing.tsx
│   │   │   ├── services.tsx
│   │   │   └── reviews.tsx
│   │   ├── providers/
│   │   │   └── [id].tsx
│   │   ├── faqs.tsx
│   │   ├── support.tsx
│   │   └── _layout.tsx
│   ├── components/
│   │   └── ui/                    # ThemedText, ThemedView, Button, Card, LoadingScreen
│   ├── constants/
│   │   └── theme/                 # colors, typography, spacing, radius
│   ├── features/                  # Feature-specific components
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── favourites/
│   │   ├── home/
│   │   ├── listings/
│   │   ├── profile/
│   │   ├── provider-dashboard/
│   │   ├── providers/
│   │   └── reviews/
│   ├── hooks/
│   │   └── useThemeColors.ts
│   ├── services/
│   │   ├── mockData/              # categories.ts, nigerianStates.ts
│   │   ├── notifications.ts
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── providerMappers.ts
│   ├── store/                     # Zustand stores
│   │   ├── authStore.ts
│   │   ├── chatStore.ts
│   │   ├── favouritesStore.ts
│   │   ├── providerStore.ts
│   │   └── reviewsStore.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── category.ts
│   │   └── provider.ts
│   ├── utils/
│   │   └── formatCurrency.ts
│   ├── app.json
│   └── eas.json
│
└── admin/                         # Next.js admin dashboard
    ├── app/
    │   ├── (dashboard)/
    │   │   ├── layout.tsx
    │   │   └── dashboard/
    │   │       ├── page.tsx           # Overview / Analytics
    │   │       ├── users/             # Users management
    │   │       ├── providers/         # Provider verification
    │   │       ├── categories/        # Category management
    │   │       └── conversations/     # Conversation viewer
    │   ├── api/
    │   │   └── auth/
    │   │       ├── login/route.ts
    │   │       └── logout/route.ts
    │   ├── login/
    │   │   └── page.tsx
    │   └── layout.tsx
    ├── components/
    │   └── layout/
    │       ├── Sidebar.tsx
    │       ├── TopBar.tsx
    │       └── SkeletonRow.tsx
    ├── lib/
    │   ├── auth/
    │   │   ├── jwt.ts
    │   │   └── session.ts
    │   ├── supabase/
    │   │   └── admin.ts
    │   └── types.ts
    ├── middleware.ts
    └── scripts/
        └── seed-admin.mjs
```

---

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Supabase account (free tier works)
- Vercel account (free tier works)
- Expo account (free tier works)

---

## Mobile App Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/service-marketplace-app.git
cd service-marketplace-app/mobile
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `mobile/.env` (for local development only — not committed to git):

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Important:** For production APK builds, credentials are read from `app.json` extras — not `.env`. See [Environment Variables](#environment-variables).

### 4. Update `app.json` with your Supabase credentials

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

### 5. Start the development server

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your phone.

---

## Admin Dashboard Setup

### 1. Navigate to the admin folder

```bash
cd service-marketplace-app/admin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create `admin/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_generated_jwt_secret
```

Generate a JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run database migrations

Run the complete SQL from the [Supabase Setup](#supabase-setup) section in your Supabase SQL Editor.

### 5. Seed the first admin user

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/seed-admin.mjs
```

### 6. Start the development server

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

---

## Supabase Setup

### 1. Create a new Supabase project

Go to [supabase.com](https://supabase.com) → New Project. Note your:
- Project URL
- Anon key (public)
- Service role key (secret — never expose this client-side)

### 2. Run all database migrations

Go to **Supabase Dashboard → SQL Editor** and run the complete SQL from the `DATABASE.sql` file included in this repository. It creates all tables, RLS policies, triggers, and indexes in the correct order.

### 3. Set up Storage

Go to **Supabase Dashboard → Storage** and create a bucket:
- **Name:** `provider-logos`
- **Public:** Yes

Add this RLS policy to the bucket:
```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'provider-logos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public read
CREATE POLICY "Public can view logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'provider-logos');
```

### 4. Configure Auth

Go to **Supabase Dashboard → Authentication → URL Configuration**:

**Site URL:**
```
https://yourdomain.com
```

**Redirect URLs:**
```
https://yourdomain.com/**
https://admin.yourdomain.com/**
exp://127.0.0.1:8081/--/auth/reset-password
```

---

## Environment Variables

### Mobile App (`mobile/app.json`)

| Key | Description |
|-----|-------------|
| `extra.supabaseUrl` | Your Supabase project URL |
| `extra.supabaseAnonKey` | Your Supabase anon/public key |

### Admin Dashboard (`admin/.env.local`)

| Key | Description | Client/Server |
|-----|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Client + Server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Client + Server |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — bypasses RLS | **Server only** |
| `JWT_SECRET` | Secret for signing admin session tokens | **Server only** |

> ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` or `JWT_SECRET` to the client.**

---

## Building the APK

### Preview APK (for testing)

```bash
cd mobile
eas build --platform android --profile preview
```

### Production AAB (for Play Store)

```bash
eas build --platform android --profile production
```

Download the built APK/AAB from [expo.dev](https://expo.dev) or the URL printed in the terminal.

---

## Deploying the Admin Dashboard

### Deploy to Vercel

```bash
cd admin
vercel
```

### Add environment variables to Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add JWT_SECRET
```

### Deploy to production

```bash
vercel --prod
```

### Add custom domain

```bash
vercel domains add admin.yourdomain.com
```

Then add the DNS records Vercel provides to your domain registrar.

---

## Features

### Mobile App

| Feature | Description |
|---------|-------------|
| Authentication | Email + password signup/login with role selection (customer or provider) |
| Forgot Password | OTP-based password reset via email |
| Home Screen | Featured, Recently Added, and Popular providers with auto-scrolling carousel |
| Search | Real-time search with filters (category, state, rating, sort) |
| Provider Profile | Full profile with services, reviews, contact button |
| Favourites | Save and manage favourite providers |
| Messaging | Real-time chat between customers and providers |
| Reviews | One review per customer per provider, with star rating |
| Provider Dashboard | Business profile management, services, reviews, stats |
| Push Notifications | Expo push notifications for new messages |
| Dark Mode | Full light/dark mode support |

### Admin Dashboard

| Feature | Description |
|---------|-------------|
| Analytics | Live counts for users, providers, messages, reviews, conversations |
| Users | View all users with ban/unban functionality |
| Providers | Verify providers, mark as featured |
| Categories | Add and delete service categories |
| Conversations | View all conversations and read full message threads |

---

## Key Design Decisions

- **Nigerian market focus:** 37 states + FCT with all LGAs, Naira (₦) currency formatting
- **Role chosen at signup:** Customer or Provider — not changeable after registration
- **Customer-initiated conversations only:** Providers cannot start conversations
- **One review per customer per provider:** Enforced at database level with unique constraint
- **Admin auth is separate:** Uses a dedicated `admins` table with bcrypt passwords and JWT sessions — completely isolated from the mobile app's user auth
- **Service role key server-only:** Admin dashboard uses Next.js API routes and Server Components to ensure the service role key never reaches the browser
- **Image uploads:** Uses Expo SDK 54 `File` class (not legacy `readAsStringAsync`)
- **Push notifications deferred:** Registered on login, sent via Expo Push API

---

## Support

- Email: support@servenaija.com
- Admin: admin@servenaija.com
