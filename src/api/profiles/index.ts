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

                })
                .eq('id', session?.user.id)
                .select('id');

            if (error) {
                throw new Error(error.message);
            }
        }
    })
}