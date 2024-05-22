import { supabase } from "@/src/utils/supabase";
import { useQuery } from "@tanstack/react-query";

export const useComments = (id: number) => {
    return useQuery({
        queryKey: ['comments', id],
        queryFn: async () => {
            console.log(`getting comments ${id}`)
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        }
    });
}