import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Cookie-based storage to survive mobile Safari redirects
const cookieStorage = {
  getItem: (key: string) => {
    const match = document.cookie.match(new RegExp('(^| )' + key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  },
  setItem: (key: string, value: string) => {
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=604800;SameSite=Lax;Secure`;
  },
  removeItem: (key: string) => {
    document.cookie = `${key}=;path=/;max-age=0`;
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
    storage: cookieStorage,
  }
});
