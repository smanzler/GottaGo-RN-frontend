import { View, Image, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, TextInput, InputAccessoryView, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';
import RemoteImage from '@/src/components/RemoteImage';
import { useComments, useInsertComment } from '@/src/api/comments';
import Comment from '@/src/components/Comment';
import { Feather } from '@expo/vector-icons';

const IMG_HEIGHT = 200;
const { width } = Dimensions.get('window');

const RoomPage = () => {
    const room = useLocalSearchParams<{ id: string, name: string, image: string, description: string, created_at: string, created_by: string, username: string }>();
    const idParse = parseFloat(room.id ? room.id : '');
    
    const { data, refetch } = useComments(idParse);

    const { mutateAsync: insertComment } = useInsertComment();
    const [reply, setReply] = useState<number | null>(null)
    const [comment, setComment] = useState('');

    const commentRef = useRef<TextInput>(null);

    useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        if (e.duration !== 250) {
            setReply(null)
        }
      });
  
      return () => {
        showSubscription.remove();
      };
    }, []);
  

    useEffect(() => {
        console.log(data)
    }, [data])

    useEffect(() => {
        console.log(reply)
    }, [reply])

    const onSend = async () => {
        if (comment){
            await insertComment({ room_id: idParse, reply_id: reply, message: comment });

            setReply(null);
            setComment('')
            Keyboard.dismiss();

            refetch();
        }
    }

    return (
        <View style={{flex: 1}}>
            <KeyboardAvoidingView style={{flex: 1}} behavior='padding'>
                <ScrollView style={styles.container}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10}}>
                        <View style={{justifyContent: 'center', maxWidth: '50%'}}>
                            <Text style={styles.h1}>{room.name}</Text>
                        </View>
                        <View style={defaultStyles.bubbles}>
                            <RemoteImage path={room.image ? room.image : undefined} style={[styles.image]} />
                        </View>
                    </View>
                    <Text style={{ fontFamily: 'mon', fontSize: 18}}>Created by</Text>
                    <View style={{flexDirection: 'row', gap: 7, marginVertical: 6}}>
                        <View style={styles.profilePic}>
                            <RemoteImage style={{ width: '100%', aspectRatio: 1 }} path={`${room.created_by}.png`} profile />
                        </View>
                        <Text style={styles.user}>{room.username}</Text>
                    </View>
                    <Text style={styles.h2}>{room.description}</Text>
                    <View style={styles.comments}>
                        {data && data.length > 0 && data.map((comment: any) => (
                            <Comment key={comment.id} comment={comment} setReply={setReply} commentRef={commentRef} />
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <InputAccessoryView style={{flex: 1}}>
                <TextInput
                    ref={commentRef}
                    placeholder="Comment"
                    placeholderTextColor='grey'
                    value={comment}
                    onChangeText={setComment}
                    style={styles.commentInput}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
                    <Feather 
                        name='send'
                        size={24}
                    />
                </TouchableOpacity>
            </InputAccessoryView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 30,
        backgroundColor: '#fff',
    },
    image: {

        width: 150,
        aspectRatio: 1,
        backgroundColor: 'grey'
    },
    h1: {
        fontFamily: 'mon-b',
        fontSize: 25,
    },
    h2: {
        fontFamily: 'mon-sb',
        marginTop: 10,
    },
    profilePic: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden'
    },
    user: {
        fontFamily: 'mon-sb',
        paddingTop: 3,
    },
    comments: {
        paddingVertical: 20,
    },
    commentInput: {
        backgroundColor: '#fff',
        padding: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomWidth: 0,
    },
    sendBtn: {
        position: 'absolute',
        right: 10,
        top: 0,
        bottom: 0,

        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        maxWidth: 40,
    }
})

export default RoomPage;