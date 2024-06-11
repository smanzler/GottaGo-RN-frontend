import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useQuery } from "@tanstack/react-query"

export const useQuerySettings = () => {
    const { profile } = useAuth();

    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            console.log('getting settings')
            if (!profile) return null;
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('user_id', profile.id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        }
    })
}