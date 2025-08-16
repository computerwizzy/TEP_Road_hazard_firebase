
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// This file is designed to be used in client components.
let supabase: SupabaseClient | undefined

function getSupabaseBrowserClient() {
    if (supabase) {
        return supabase;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your_supabase') || supabaseAnonKey.includes('your_supabase')) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('Running in demo mode - Supabase credentials not configured.');
        }
        // Return a mock client for demo purposes
        supabase = {
            storage: {
                from: () => ({
                    upload: () => Promise.resolve({ data: { path: 'mock-receipt.pdf' }, error: null }),
                    getPublicUrl: () => ({ data: { publicUrl: 'https://example.com/mock-receipt.pdf' } })
                })
            },
            from: () => ({
                select: () => Promise.resolve({ data: [], error: null }),
                insert: () => Promise.resolve({ data: [{ id: 1 }], error: null })
            })
        } as any;
        return supabase;
    }
    supabase = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
    return supabase;
}


export const supabase = getSupabaseBrowserClient();
