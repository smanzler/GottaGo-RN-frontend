import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            console.log('getting rooms')
            const { data, error } = await supabase
                .from('rooms')
                .select('*');

            if (error) throw new Error(error.message);

            return data;
        }
    });
}

export const useRoom = (id: number) => {
    return useQuery({
        queryKey: ['rooms', id],
        queryFn: async () => {
            console.log(`getting room ${id}`)
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);

            return data;
        }
    });
}

export const useInsertRoom = () => {
    const { session } = useAuth();

    return useMutation({
        async mutationFn(data: any) {
            const { error, data: newRoom } = await supabase
                .from('rooms')
                .insert({
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    created_by: session?.user.id,
                    longitude: data.longitude,
                    latitude: data.latitude,
                })
                .single();

            if (error) throw new Error(error.message);

            return newRoom;
        }
    })
}