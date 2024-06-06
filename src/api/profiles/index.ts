import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = () => {
    const { session } = useAuth();

    return useMutation({
        async mutationFn(data: any) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: data.username,
                    full_name: data.full_name,
                })
                .eq('id', session?.user.id)
                .select('id');

            if (error) {
                throw new Error(error.message);
            }
        }
    })
}