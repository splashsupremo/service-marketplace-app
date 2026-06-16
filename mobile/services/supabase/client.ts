import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client
 *
 * Single shared instance used throughout the app for auth, database
 * queries, and storage. Configuration values come from environment
 * variables (see .env / .env.example) rather than being hardcoded here.
 *
 * - `react-native-url-polyfill/auto` patches the global URL API, which
 *   the Supabase client depends on but isn't fully available in React
 *   Native's JS runtime by default.
 * - AsyncStorage is used for session persistence: Supabase automatically
 *   saves the auth session here so users stay logged in across app
 *   restarts, and `autoRefreshToken` keeps the session valid in the
 *   background without manual re-login.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure .env exists with ' +
      'EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY set, ' +
      'then restart the dev server (env vars are only read at startup).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // Disable URL-based session detection — this is a React Native app,
    // not a browser, so there's no URL bar redirect flow to detect.
    detectSessionInUrl: false,
  },
});