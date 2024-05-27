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
            const { data: newRoom, error } = await supabase
                .from('rooms')
                .insert({
                    name: data.name,
                    description: data.description,
                    image: data.image,
                    created_by: session?.user.id,
                    location: `POINT(${data.longitude} ${data.latitude})`,
                })
                .select('id');

            if (error) {
                throw new Error(error.message);
            } 
            
            if (!newRoom[0]) {
                return;
            }

            const { error: ratingError  } = await supabase
                .from('ratings')
                .insert({
                    created_by: session?.user.id,
                    room_id: newRoom[0].id,
                    rating: data.rating,
                })
                .single();
            

            if (ratingError) {
                throw new Error(ratingError.message);
            }
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

export const useImage = (id: string | null | undefined, profile?: boolean) => {
    return useQuery({
        queryKey: ['image', id],
        queryFn: async () => {
            if (!id) return null;
            
            const { data, error } = await supabase.storage
                .from(!profile ? 'rooms' : 'avatars')
                .download(id);

            if (error) {
                console.log(error);
            }

            if (data) {
                try {
                    const result = await readFileAsDataURL(data);
                    return result;
                } catch (error) {
                    console.error('Failed to read file:', error);
                    return null;
                }
            } else {
                return null;
            }
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 10,
    });
}

async function readFileAsDataURL(data: any) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(data);

        fr.onload = () => {
            resolve(fr.result);
        };

        fr.onerror = (error) => {
            console.error(error);
            reject(null);
        };
    });
}