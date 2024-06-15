import { supabase } from '@/src/utils/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useState, useEffect, useContext, PropsWithChildren, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { useQuerySettings } from '../api/settings';
import { useColorScheme } from 'react-native';

interface SettingsContextType {
    filter: boolean;
    theme: any;
    loading: boolean;
    refetch: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
    filter: true,
    theme: {},
    loading: true,
    refetch: async () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { data, refetch, isLoading: loading } = useQuerySettings();
    const { profile } = useAuth();

    const initialTheme = useColorScheme()
    const isDark = initialTheme === 'dark';
    
    const [filter, setFilter] = useState<boolean>(true);
    const [theme, setTheme] = useState( !isDark ? { accent:'#ba5f22', grey: '#5e5d5e', primary: '#fff', secondary: '#1a1a1a', tint: '#878787' } : { accent: 'green', grey: '#5e5d5e', primary: '#1a1a1a', secondary: '#fff', tint: '#333333'});

    useEffect(() => {
        if (profile) {
            refetch();
        }
    }, [profile]);

    useEffect(() => {
        if (profile && data) {
            setTheme(
                data.theme ? { 
                    accent:'#ba5f22', 
                    grey: '#5e5d5e', 
                    primary: '#fff', 
                    secondary: '#1a1a1a', 
                    tint: '#878787' 
                } : { 
                    accent: 'green', 
                    grey: '#5e5d5e', 
                    primary: '#1a1a1a', 
                    secondary: '#fff', 
                    tint: '#333333'
                } 
            );
            setFilter(data.filter);
        }
    }, [profile, data]);

    useEffect(() => {
        console.log(theme)
    }, [theme])

    const memoizedRefetch = useCallback(async() => {
        await refetch();
    }, [refetch]);

    return (
        <SettingsContext.Provider value={{ filter, theme, loading, refetch: memoizedRefetch }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);