import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useComments = (id: number) => {
    return useQuery({
        queryKey: ['comments', id],
        queryFn: async () => {
            console.log(`getting comments ${id}`)
            const { data, error } = await supabase
                .rpc('get_comments', {
                    room_id_input: id
                })

            if (error) throw new Error(error.message);

            return data;
        },
        retry: 1,
    });
}
