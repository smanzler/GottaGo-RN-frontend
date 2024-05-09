import { useAuth } from "@/src/providers/AuthProvider";
import { supabase } from "@/src/utils/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Location from 'expo-location'
import { Region } from "react-native-maps";

export const useRooms = () => {
    return useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            console.log('getting rooms')
            
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
        
            let location = await Location.getLastKnownPositionAsync({});

            const { data, error } = await supabase.rpc('nearby_rooms', {
                long: location?.coords.longitude,
                lat: location?.coords.latitude,
            })
        
            if (error) throw new Error(error.message);
            console.log(data)
            return data;
        }
    });
}

export const useRoom = (id: number) => {
    return useQuery({
        queryKey: ['room', id],
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
            console.log('creating room', data);
            const { error, data: newRoom } = await supabase
                .from('rooms')
                .insert({
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    created_by: session?.user.id,
                    location: `POINT(${data.longitude} ${data.latitude})`,
                })
                .single();

            if (error) throw new Error(error.message);

            return newRoom;
        }
    })
}

export const getRoomsInView = async (
    min_lat: number,
    min_long: number,
    max_lat: number,
    max_long: number,
) => {
    const { data, error } = await supabase.rpc('rooms_in_view', {
        min_lat,
        min_long,
        max_lat,
        max_long,
    })

    if (error) throw new Error(error.message);

    return data;
}