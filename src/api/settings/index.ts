import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query"

export const useQuerySettings = () => {
    const { profile } = useAuth();

    return useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            if (!profile) return null;
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .eq('user_id', profile.id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        },
        retry: 0,
        staleTime: Infinity,
        gcTime: Infinity,
    })
}

export const useUpdateSettings = () => {
    const { session } = useAuth();

    return useMutation({
        async mutationFn(data: any) {
            if (!session) return null;
            console.log(data);
            const updatedSettings = await supabase
                .from('settings')
                .update(data)
                .eq('user_id', session.user.id)

            console.log(updatedSettings)

            return updatedSettings;
        }
    })
}