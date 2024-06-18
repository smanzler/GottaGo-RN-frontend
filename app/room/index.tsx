import { View, Image, Text, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView, TextInput, InputAccessoryView, TouchableOpacity, Keyboard, Platform, Linking } from 'react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { SlideInDown, interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from 'react-native-reanimated';
import { useDefaultStyles } from '@/src/constants/Styles';
import { useRoom } from '@/src/api/rooms';
import RemoteImage from '@/src/components/RemoteImage';
import { useComments, useInsertComment, useUpdateRating, useYourRating } from '@/src/api/comments';
import Comment from '@/src/components/Comment';
import { Entypo, Feather, FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import RatingModal from '@/src/components/RatingModal';
import { useAuth } from '@/src/providers/AuthProvider';
import { useSettings } from '@/src/providers/SettingsProvider';
import ReportModal from '@/src/components/ReportModal';
import { supabase } from '@/src/utils/supabase';

type Room = {
    id: string,
    name: string,
    image: string,
    description: string,
    created_at: string,
    created_by: string,
    username: string,
    rating: any,
    rating_count: any,
    lat: any,
    long: any
}

const RoomPage = () => {
    const room = useLocalSearchParams<Room>();
    const roomId = parseFloat(room.id ? room.id : '');

    room.rating = parseFloat(room.rating);

    const roundedRating = Math.round(room.rating * 2) / 2;

    const { session } = useAuth();
    const { theme } = useSettings();
    const defaultStyles = useDefaultStyles(theme);
    const styles: any = useMemo(() => createStyles(theme), [theme]);

    const { data: rawComments, refetch } = useComments(roomId);
    const { data: yourRating, refetch: refetchYourRating } = useYourRating(roomId);

    const { mutateAsync: insertComment } = useInsertComment();
    const { mutateAsync: updateRating } = useUpdateRating();

    const [comments, setComments] = useState<any[] | null>(null);
    const [reply, setReply] = useState<number | null>(null)
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [reportModalVisible, setReportModalVisible] = useState(false)
    const [reported, setReported] = useState(false);

    const [ratingLoading, setRatingLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [reportLoading, setReportLoading] = useState(false);

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
        if (yourRating) {
            setRating(yourRating.rating);
        }
    }, [yourRating])

    const onDirections = () => {
        const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${room.lat},${room.long}`;
        const label = room.name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (!url) return;
        Linking.openURL(url);
    }

    const onSend = async () => {
        if (!session) {
            router.push('(auth)/login')
            return;
        }
        if (comment) {
            setCommentLoading(true)
            await insertComment({ room_id: roomId, reply_id: reply, message: comment });

            setReply(null);
            setComment('');
            Keyboard.dismiss();

            await refetch();
            setCommentLoading(false);
        }
    }

    const onRatingPress = () => {
        if (!session) {
            router.push('(auth)/login')
            return;
        }
        setModalVisible(true)
    }

    const onAddRatingPress = async () => {
        if (yourRating && yourRating.rating === rating) {
            setModalVisible(false);
            return;
        }

        setRatingLoading(true);
        await updateRating({ rating, id: roomId })
        await refetchYourRating();
        await refetch();
        setModalVisible(false)
        setRatingLoading(false)
    }

    const onReportPress = async () => {
        if (!session) {
            router.push('(auth)/login')
            return;
        }
        
        if (reported) {
            setReportLoading(true)

            const data = await supabase.rpc('unreport-room');
            console.log(data);
            setReported(false);

            setReportLoading(false);
        } else {
            setReportModalVisible(true)
        } 
    }

    const onReport = async () => {
        setReportLoading(true);

        const data = await supabase.rpc('report-room');
        console.log(data);
        setReported(true)
        setReportModalVisible(false);

        setReportLoading(false);
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.primary }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>
                <ScrollView style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                        <View style={{ justifyContent: 'center', maxWidth: '50%' }}>
                            <Text style={styles.h1}>{room.name}</Text>
                        </View>
                        <View style={defaultStyles.bubbles}>
                            <RemoteImage path={room.image ? room.image : undefined} style={[styles.image]} />
                        </View>
                    </View>

                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: 'mon', fontSize: 18, color: theme.secondary }}>Rating: </Text>
                            <TouchableOpacity style={{ flexDirection: 'row', gap: 3 }} onPress={onDirections}>
                                <Text style={{ fontFamily: 'mon', fontSize: 18, color: theme.secondary }}>Directions</Text>
                                <FontAwesome6 name='location-arrow' size={18} color={theme.secondary}></FontAwesome6>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', gap: 2, alignItems: 'center', marginBottom: 20 }}>
                                <Text style={styles.rating}> {typeof room.rating === 'number' ? room.rating.toFixed(1) : 0}</Text>
                                <View style={styles.stars}>
                                    {Array.from({ length: 5 }, (_, index) => (
                                        <View key={`${roomId}-${index}`} style={{ position: 'relative', width: 24, aspectRatio: 1 }}>
                                            <FontAwesome
                                                name={index + 1 <= roundedRating ? 'star' : index + 0.5 === roundedRating ? 'star-half' : 'star'}
                                                size={24}
                                                color={index + 1 <= roundedRating || index + 0.5 === roundedRating ? 'gold' : 'grey'}
                                            />
                                            {index + 0.5 === roundedRating &&
                                                <FontAwesome
                                                    name='star'
                                                    size={30}
                                                    color='grey'
                                                    style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}
                                                />
                                            }
                                        </View>
                                    ))}
                                </View>
                                <Text style={styles.rating}>{`(${room.rating_count})`}</Text>
                            </View>
                            <TouchableOpacity onPress={onReportPress} disabled={reportLoading}>
                                <Entypo name={reportLoading ? 'cycle' : 'flag'} size={30} color={reported ? 'red' : theme.secondary}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={{ fontFamily: 'mon', fontSize: 18, color: theme.secondary }}>Created by:</Text>

                    <View style={{ flexDirection: 'row', gap: 7, marginTop: 6 }}>
                        <View style={styles.profilePic}>
                            <RemoteImage style={{ width: '100%', aspectRatio: 1 }} path={`${room.created_by}.png`} profile />
                        </View>
                        <Text style={styles.user}>{room.username}</Text>
                    </View>

                    <Text style={[styles.h2, { width: '100%' }]}>{room.description}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontFamily: 'mon', fontSize: 18, color: theme.secondary }}>Comments</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', gap: 7, alignItems: 'center' }} onPress={onRatingPress}>
                            <Text style={{ fontFamily: 'mon', fontSize: 14, color: theme.secondary }}>Add rating</Text>
                            <FontAwesome6 name='add' size={20} color={theme.secondary} />
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

            <InputAccessoryView style={{ flex: 1 }}>
                <View style={styles.commentInput}>
                    <TextInput
                        ref={commentRef}
                        placeholder="Comment"
                        placeholderTextColor='grey'
                        value={comment}
                        onChangeText={setComment}
                        style={{ width: '80%', color: theme.secondary }}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
                        <Feather
                            name='send'
                            size={24}
                            color={theme.secondary}
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

            <ReportModal
                modalVisible={reportModalVisible}
                setModalVisible={setReportModalVisible}
                onReport={onReport}
                reportLoading={reportLoading}
            />
        </View>
    )
}

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginBottom: 30,
        backgroundColor: theme.primary,
    },
    image: {
        width: 150,
        aspectRatio: 1,
        backgroundColor: 'grey'
    },
    h1: {
        color: theme.secondary,
        fontFamily: 'mon-b',
        fontSize: 25,
    },
    h2: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        marginTop: 25,
        marginBottom: 25,
        width: '50%',
    },
    rating: {
        color: theme.secondary,
        fontSize: 16,
        fontFamily: 'mon-sb',
        justifyContent: 'center',
        paddingTop: 1
    },
    stars: {
        flexDirection: 'row',
    },
    profilePic: {
        width: 25,
        aspectRatio: 1,
        borderRadius: 15,
        overflow: 'hidden'
    },
    user: {
        color: theme.secondary,
        fontFamily: 'mon-sb',
        paddingTop: 3,
    },
    comments: {
        paddingVertical: 20,
        marginBottom: 100,
    },
    commentInput: {
        backgroundColor: theme.primary,
        padding: 20,
        borderTopEndRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomWidth: 0,
        flex: 1,

        elevation: 2,
        shadowColor: theme.secondary,
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
            width: 1,
            height: 2,
        },
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