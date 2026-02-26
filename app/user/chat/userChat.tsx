import Message from "@/components/chat/message";
import HomeWrapper from "@/components/wrapper/user";
import { useGetChatMessagesQuery, useGetStoresToChatQuery } from "@/redux/user/slices/chatSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Send } from "lucide-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StatusBar, TextInput, View } from "react-native";
import { useChatData, useUserData } from "../../../hooks/useData";

type MessageType = {
    feedback: {
        isSent: boolean;
        isDelivered: boolean;
        isSeen: boolean;
    };
    time: Date;
    by: string;
    edited: { isEdited: boolean };
    message: string;
};
export default function UserChat() {
    const [messageLog, setMessageLog] = useState({}) as any;
    const [notSent, setNotSent] = useState<MessageType[]>([]);
    const isFocused = useIsFocused();
    const [newMessage, setNewMessage] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const { refetch: refetchStoreToChat } = useGetStoresToChatQuery({})
    const params = useLocalSearchParams()
    const { branchId, name, chatId = messageLog?._id || "", rand }: any = params;

    console.log("isFocused", isFocused)
    const { userInfo } = useUserData() as any;
    const {
        socket,
        isSocketConnected,
        sendMessage,
        activeChats,
        markAsRead
    } = useChatData() as any
    console.log({ activeChats })
    const { data: storeChat, isLoading: loadingChat, refetch: refetchMessages } = useGetChatMessagesQuery({ chatId, branchId, username: userInfo.username });



    useFocusEffect(
        useCallback(() => {
            refetchMessages(); // runs every time the screen is focused
            markAsRead(chatId)
        }, [])
    );

    useEffect(() => {
        const newUpdates = activeChats[chatId]
        console.log("newUpdates", newUpdates)
        setMessageLog((prev: any) => {
            if (prev.log && newUpdates.message?._id) {
                const newLog = [...prev.log, newUpdates.message]
                return ({ ...prev, log: newLog })
            }
        })
    }, [activeChats[chatId]])


    const handleSendMessage = async () => {
        console.log("here")
        if (isSocketConnected) {
            sendMessage(chatId, newMessage, branchId);
        } else {
            try {
                const previousPending = JSON.parse(await AsyncStorage.getItem("pendingMessages") || "[]")
                console.log(previousPending)
                await AsyncStorage.setItem("pendingMessages", JSON.stringify([...previousPending, { chatId, message: newMessage, branchId }]))
                console.log("here2")
            } catch (error) {
                console.log(error)
            }

            setNotSent((prev: any) => {
                const newLog = [
                    ...prev,
                    {
                        feedback: {
                            isSent: false,
                            isDelivered: false,
                            isSeen: false,
                        },
                        time: new Date(),
                        by: "customer",
                        edited: { isEdited: false },
                        message: newMessage,
                    },
                ];
                return newLog;
            })
        }
        setNewMessage("");
    };


    useEffect(() => {
        socket?.on("newMessage", (data: any) => {
            setMessageLog((prev: any) => {
                return { ...prev, log: data };
            });
            refetchStoreToChat()
        });
    }, [socket, messageLog]);

    useEffect(() => {
        setMessageLog(storeChat?.data || {});
    }, [storeChat]);

    useEffect(() => {
        if (scrollViewRef.current) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 300);
        }
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messageLog, rand]);

    return (
        <HomeWrapper active="inbox" headerTitle={name || ""}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.select({
                    ios: 0,
                    android: StatusBar.currentHeight
                        ? StatusBar.currentHeight + 2
                        : -100,
                })}
                style={{ flex: 1 }}
            >
                <View className="flex-1 bg-gray-50 dark:bg-gray-950">
                    {/* Chat messages area */}
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={loadingChat}
                                onRefresh={refetchMessages}

                            />
                        }
                        ref={scrollViewRef}
                        className="mb-16 px-5 pb-10"
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {messageLog.log?.map((each: any, i: any) => (
                            <Message
                                sender={each.by === "customer"}
                                notification={each.by === "notification"}
                                date={each.time}
                                text={each.message}
                                key={i}
                                isSent={each.feedback.isSent}
                            />
                        ))}

                        {notSent?.map((each: any, i: any) => (
                            <Message
                                sender={each.by === "customer"}
                                notification={each.by === "notification"}
                                date={each.time}
                                text={each.message}
                                key={i}
                                isSent={each.feedback.isSent}
                            />
                        ))}
                        <View className="mb-3" />
                    </ScrollView>

                    {/* Message input area */}
                    <View className="px-2 mb-2 py-1.5">
                        <View className="bg-gray-100 dark:bg-gray-800 rounded-full flex-row justify-between items-center px-5 py-3 bottom-2 absolute w-full max-h-24 self-center">
                            {/* <MaterialIcons
                            name="attach-file"
                            size={24}
                            className="text-gray-500 dark:text-gray-400"
                        /> */}
                            <TextInput
                                placeholder="Write a Message"
                                placeholderTextColor="#9CA3AF"
                                selectionColor="#3B82F6"
                                multiline
                                value={newMessage}
                                onChangeText={(e: any) => setNewMessage(e)}
                                className="font-regular text-xl  text-gray-900 dark:text-gray-100 w-4/5"
                                style={{ textAlignVertical: 'top' }}
                            />
                            <Send
                                // name="send"
                                onPress={handleSendMessage}//handleSendMsg
                                size={24}
                                className="text-blue-800 dark:!text-blue-400"
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </HomeWrapper>
    );
}