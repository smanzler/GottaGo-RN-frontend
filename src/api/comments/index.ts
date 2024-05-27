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

export const useUpdateRating = () => {
    const { session } = useAuth();

    return useMutation({
        async mutationFn(data: any) {
            console.log('updating rating')
            const { error } = await supabase
                .rpc('update_rating', {
                    room_id_input: data.id,
                    user_id: session?.user.id,
                    rating_input: data.rating,
                })

            if (error) throw new Error(error.message);
        }
    })
}

export const useYourRating = (id: number) => {
    const { session } = useAuth();

    return useQuery({
        queryKey: ['rating', id, session?.user.id],
        queryFn: async () => {
            console.log(`getting rating ${id}`)
            const { data, error } = await supabase
                .from('ratings')
                .select('*')
                .eq('created_by', session?.user.id)
                .eq('room_id', id)
                .single();


            if (error) throw new Error(error.message);

            return data;
        },
        retry: 1,
    });
}