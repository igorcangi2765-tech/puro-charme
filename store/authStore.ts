import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
    user: User | null;
    profile: Profile | null;
    isAdmin: boolean;
    isManager: boolean;
    isStaff: boolean;
    isLoading: boolean;
    initialize: () => Promise<void>;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    profile: null,
    isAdmin: false,
    isManager: false,
    isStaff: false,
    isLoading: true,
    initialize: async () => {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) throw sessionError;

            if (session?.user) {
                // Fetch profile to check if admin
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError && profileError.code !== 'PGRST116') { // Ignore row not found
                    console.error('Error fetching profile:', profileError);
                }

                set({
                    user: session.user,
                    profile: profile || null,
                    isAdmin: profile?.role === 'manager' || profile?.is_admin || false,
                    isManager: profile?.role === 'manager' || profile?.is_admin || false,
                    isStaff: profile?.role === 'staff' || false,
                    isLoading: false
                });
            } else {
                set({ user: null, profile: null, isAdmin: false, isManager: false, isStaff: false, isLoading: false });
            }

            // Listen for auth changes
            supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();

                    set({
                        user: session.user,
                        profile: profile || null,
                        isAdmin: profile?.role === 'manager' || profile?.is_admin || false,
                        isManager: profile?.role === 'manager' || profile?.is_admin || false,
                        isStaff: profile?.role === 'staff' || false,
                    });
                } else {
                    set({ user: null, profile: null, isAdmin: false, isManager: false, isStaff: false });
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
            set({ user: null, profile: null, isAdmin: false, isManager: false, isStaff: false, isLoading: false });
        }
    },
    signOut: async () => {
        await supabase.auth.signOut();
    }
}));
