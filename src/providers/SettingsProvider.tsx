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
    refetch: () => Promise<void>;
    setTheme: React.Dispatch<React.SetStateAction<any>>;
    setFilter: React.Dispatch<React.SetStateAction<any>>;
}

const SettingsContext = createContext<SettingsContextType>({
    filter: true,
    theme: {},
    loading: true,
    refetch: async () => {},
    setTheme: () => {},
    setFilter: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { data, refetch, isLoading: loading } = useQuerySettings();
    const { profile } = useAuth();

    const initialTheme = useColorScheme()
    const [isDark, setIsDark] = useState(initialTheme === 'dark');
    
    const [filter, setFilter] = useState<boolean>(true);
    const [theme, setTheme] = useState( !isDark ? { accent:'#ba5f22', grey: '#5e5d5e', primary: '#fff', secondary: '#1a1a1a', tint: '#878787', isDark: false } : { accent: '#ba5f22', grey: '#5e5d5e', primary: '#1a1a1a', secondary: '#fff', tint: '#333333', isDark: true});

    useEffect(() => {
        if (profile) {
            console.log('refetching');
            refetch();
        }
    }, [profile]);

    useEffect(() => {
        if (profile && data) {
            setTheme(
                !data.dark_mode ? { 
                    accent:'#ba5f22', 
                    grey: '#5e5d5e', 
                    primary: '#fff', 
                    secondary: '#1a1a1a', 
                    tint: '#f3f3f3',
                    isDark: false,
                } : { 
                    accent: '#ba5f22', 
                    grey: '#5e5d5e', 
                    primary: '#1a1a1a', 
                    secondary: '#fff', 
                    tint: '#333333',
                    isDark: true,
                } 
            );
            setFilter(data.filter);
        }
    }, [profile, data]);

    useEffect(() => {
        setTheme(
            !isDark ? { 
                accent:'#ba5f22', 
                grey: '#5e5d5e', 
                primary: '#fff', 
                secondary: '#1a1a1a', 
                tint: '#f3f3f3',
                isDark: false,
            } : { 
                accent: '#ba5f22', 
                grey: '#5e5d5e', 
                primary: '#1a1a1a', 
                secondary: '#fff', 
                tint: '#333333',
                isDark: true,
            } 
        );
    }, [isDark])

    const memoizedRefetch = useCallback(async() => {
        await refetch();
    }, [refetch]);

    return (
        <SettingsContext.Provider value={{ filter, theme, loading, refetch: memoizedRefetch, setTheme: setIsDark, setFilter }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);