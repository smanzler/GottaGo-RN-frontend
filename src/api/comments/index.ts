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

export const useInsertComment = () => {
    const { session } = useAuth();

    return useMutation({
        async mutationFn(data: any) {
            const { error } = await supabase
                .from('comments')
                .insert({
                    room_id: data.room_id,
                    reply_id: data.reply_id,
                    message: data.message,
                    created_by: session?.user.id,
                })
                .select('id');

            if (error) {
                throw new Error(error.message);
            }
        }
    })
}