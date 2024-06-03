import { View, Image, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, TextInput, InputAccessoryView, TouchableOpacity, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { defaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';
import RemoteImage from '@/src/components/RemoteImage';
import { useComments, useInsertComment, useUpdateRating, useYourRating } from '@/src/api/comments';
import Comment from '@/src/components/Comment';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import RatingModal from '@/src/components/RatingModal';

const IMG_HEIGHT = 200;
const { width } = Dimensions.get('window');

const RoomPage = () => {
    const room = useLocalSearchParams<{ id: string, name: string, image: string, description: string, created_at: string, created_by: string, username: string }>();
    const roomId = parseFloat(room.id ? room.id : '');
    
    const { data: rawComments, refetch } = useComments(roomId);
    const { data: yourRating, refetch: refetchYourRating } = useYourRating(roomId);

    const { mutateAsync: insertComment } = useInsertComment();
    const { mutateAsync: updateRating } = useUpdateRating();

    const [comments, setComments] = useState<any[] | null>(null);
    const [reply, setReply] = useState<number | null>(null)
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const [ratingLoading, setRatingLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);

    const commentRef = useRef<TextInput>(null);

    const buildTree: any = (comments: any[], replyId: number | null = null) => {
        return comments
            .filter(comment => comment.reply_id === replyId)
            .map(comment => ({
                ...comment,
                replies: buildTree(comments, comment.id)
            }));
    };

    useEffect(() => {
        if (rawComments) {
            setComments(buildTree(rawComments))
        }
    }, [rawComments])

    useEffect(() => {
        console.log(comments)
    }, [comments])

    useEffect(()=>{
        if (yourRating){
            setRating(yourRating.rating);
        }
    }, [yourRating])

    const onSend = async () => {
        if (comment){
            setCommentLoading(true)
            await insertComment({ room_id: roomId, reply_id: reply, message: comment });

            setReply(null);
            setComment('');
            Keyboard.dismiss();

            await refetch();
            setCommentLoading(false);
        }
    }

    const onAddRatingPress = async () => {
        console.log(yourRating)
        if (yourRating && yourRating.rating === rating) {
            setModalVisible(false);
            return;
        }

        setRatingLoading(true);
        await updateRating({rating, id: roomId})
        await refetchYourRating();
        await refetch();
        setModalVisible(false)
        setRatingLoading(false)
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

                    <View style={{flexDirection: 'row', gap: 7, marginTop: 6}}>
                        <View style={styles.profilePic}>
                            <RemoteImage style={{ width: '100%', aspectRatio: 1 }} path={`${room.created_by}.png`} profile />
                        </View>
                        <Text style={styles.user}>{room.username}</Text>
                    </View>

                    <Text style={styles.h2}>{room.description}</Text>

                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                        <Text style={{ fontFamily: 'mon', fontSize: 18}}>Comments</Text>
                        <TouchableOpacity style={{flexDirection: 'row', gap: 7, alignItems: 'center'}} onPress={() => setModalVisible(true)}>
                            <Text style={{fontFamily: 'mon', fontSize: 14}}>Add rating</Text>
                            <FontAwesome6 name='add' size={20}/>
                        </TouchableOpacity>
                    </View>

                    {commentLoading ?
                        <Text style={styles.user}>Loading Comments...</Text>
                        :
                        <View style={styles.comments}>
                            {comments && comments.length > 0 && comments.map((comment: any) => (
                                <Comment key={comment.id} comment={comment} setReply={setReply} commentRef={commentRef} />
                            ))}
                        </View>
                    }
                </ScrollView>
            </KeyboardAvoidingView>

            <InputAccessoryView style={{flex: 1}}>
                <View style={styles.commentInput}>
                    <TextInput
                        ref={commentRef}
                        placeholder="Comment"
                        placeholderTextColor='grey'
                        value={comment}
                        onChangeText={setComment}
                        style={{width: '90%'}}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
                        <Feather 
                            name='send'
                            size={24}
                        />
                    </TouchableOpacity>
                </View>
            </InputAccessoryView>

            <RatingModal 
                modalVisible={modalVisible} 
                setModalVisible={setModalVisible}
                rating={rating}
                setRating={setRating}
                onAddRatingPress={onAddRatingPress}
                ratingLoading={ratingLoading}
            />
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
        marginTop: 25,
        marginBottom: 25,
        width: '50%',
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
        marginBottom: 100,
    },
    commentInput: {
        backgroundColor: '#fff',
        padding: 20,
        borderWidth: StyleSheet.hairlineWidth,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomWidth: 0,
        flex: 1,
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