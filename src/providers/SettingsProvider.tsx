import { supabase } from '@/src/utils/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useState, useEffect, useContext, useCallback, PropsWithChildren } from 'react';
import { useAuth } from './AuthProvider';
import { useQuerySettings } from '../api/settings';

interface SettingsContextType {
    filter: boolean;
    theme: any;
    loading: boolean;
    refetch: () => void
}

const SettingsContext = createContext<SettingsContextType>({
    filter: true,
    theme: {},
    loading: true,
    refetch: () => {},
});

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const { data, refetch, isLoading: loading } = useQuerySettings();
    
    const [filter, setFilter] = useState<boolean>(false);
    const [theme, setTheme] = useState({ primary: '#fff', grey: '#5e5d5e', dark: '#1a1a1a' });

    useEffect(() => {
        console.log('settings changed')
        if (data) {
            setTheme({
                primary: data.theme ? '#ba5f22' : '#ffffff', 
                grey: data.theme ? '#5e5d5e' : '#000',
                dark: data.theme ? '#1a1a1a' : '#fff',
            });
            setFilter(data.filter)
        }
    }, [data]);

    return (
        <SettingsContext.Provider value={{ filter, theme, loading, refetch }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
