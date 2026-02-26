"use client";
import { server } from "@/config/server";
import { isAuthenticated } from "@/redux/user/api/axiosBaseQuery";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
    by: string;
    time: string;
    message: string;
    messageId?: string;
}

interface ChatData {
    chatId: string;
    log: Message[];
    lastMessage: Message;
}

interface MessageData {
    chatId: string;
    message: string;
    branchId: string
}

export interface UserChatContextType {

    socket: Socket | null;
    isSocketConnected: boolean;
    activeChats: Record<string, ChatData>;


    // Socket methods
    sendMessage: (chatId: string, message: string, branchId?: string) => void;
    joinChatRoom: (chatId: string) => void;
    createChatRoom: (branchId: string) => void;
    markAsRead: (chatId: string) => void;
    startTyping: (chatId: string) => void;
    stopTyping: (chatId: string) => void;
}

const defaultProvider: UserChatContextType = {

    socket: null,
    isSocketConnected: false,
    activeChats: {},

    sendMessage: () => { },
    joinChatRoom: () => { },
    createChatRoom: () => { },
    markAsRead: () => { },
    startTyping: () => { },
    stopTyping: () => { },
};

const ChatContext = createContext(defaultProvider);

const ChatDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [activeChats, setActiveChats] = useState<Record<string, ChatData>>({});

    // Use ref to prevent multiple socket connections
    const socketRef = useRef<Socket | null>(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;


    // Socket methods
    const sendMessage = useCallback((chatId: string, message: string, branchId?: string) => {
        if (socket && isSocketConnected) {
            const messageData = {
                chatId,
                message,
                by: 'customer',
                branchId,
                timestamp: new Date().toISOString()
            };
            socket.emit('sendMessage', messageData);
        } else {
            console.error('Socket not connected');
        }
    }, [socket, isSocketConnected]);

    const joinChatRoom = useCallback((chatId: string) => {
        if (socket && isSocketConnected) {
            socket.emit('joinRoom', { chatId, role: 'customer' });
        }
    }, [socket, isSocketConnected]);

    const createChatRoom = useCallback((branchId: string) => {
        if (socket && isSocketConnected) {
            socket.emit('createChatRoom', { branchId });
        }
    }, [socket, isSocketConnected]);

    const markAsRead = useCallback((chatId: string) => {
        if (socket && isSocketConnected) {
            socket.emit('markAsRead', { chatId, by: 'customer' });
        }
    }, [socket, isSocketConnected]);

    const startTyping = useCallback((chatId: string) => {
        if (socket && isSocketConnected) {
            socket.emit('typing', { chatId });
        }
    }, [socket, isSocketConnected]);

    const stopTyping = useCallback((chatId: string) => {
        if (socket && isSocketConnected) {
            socket.emit('stopTyping', { chatId });
        }
    }, [socket, isSocketConnected]);


    // Socket setup with proper cleanup and error handling
    useEffect(() => {
        const setupSocket = async () => {
            try {
                // Prevent multiple connections
                if (socketRef.current?.connected) {
                    return;
                }

                const token = await AsyncStorage.getItem("user_token");
                if (!token) {
                    console.log("No user token found");
                    return;
                }

                // Close existing socket if any
                if (socketRef.current) {
                    socketRef.current.disconnect();
                }

                // Create new socket connection
                const newSocket = io(server, {
                    transports: ["websocket"],
                    forceNew: true,
                    reconnection: true,
                    reconnectionAttempts: maxReconnectAttempts,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    query: {
                        token: token,
                        by: "user_token",
                    },
                });

                socketRef.current = newSocket;
                setSocket(newSocket);

                // Connection events
                newSocket.on("connect", async () => {
                    setIsSocketConnected(true);
                    reconnectAttempts.current = 0;

                    const previousPending = JSON.parse(await AsyncStorage.getItem("pendingMessages") || "[]")
                    await previousPending?.map((each: MessageData) => sendMessage(each?.chatId, each.message, each.branchId))
                    await AsyncStorage.setItem("pendingMessages", "[]")
                    newSocket.emit("registerUser", "user");
                });

                newSocket.on("disconnect", (reason) => {
                    console.log("Socket disconnected:", reason);
                    setIsSocketConnected(false);
                });

                newSocket.on("connect_error", (error) => {
                    console.error("Socket connection error:", error);
                    setIsSocketConnected(false);
                    reconnectAttempts.current++;
                });

                // Registration confirmation
                newSocket.on("userRegistered", (data) => {
                    console.log("User registered successfully:", data);
                });

                // Room events
                newSocket.on("roomJoined", ({ room }) => {
                    console.log(`Successfully joined room: ${room}`);
                });

                newSocket.on("chatRoomCreated", ({ chatId, room }) => {
                    console.log(`Chat room created: ${chatId}`);
                });

                // Message events
                newSocket.on("newMessage", (data: ChatData) => {
                    console.log("New message received:", data);
                    setActiveChats(prev => ({
                        ...prev,
                        [data.chatId]: data
                    }));

                    // You can also trigger a notification here
                    // or update your chat list in Redux
                });

                newSocket.on("messageSent", (data) => {
                    // console.log("Message sent confirmation:", data);
                    // Update local chat state to show message as sent
                    setActiveChats(prev => ({
                        ...prev,
                        [data.chatId]: data
                    }));
                });

                newSocket.on("markedAsRead", ({ chatId }) => {
                    console.log(`Messages marked as read in chat: ${chatId}`);
                });

                // Typing events
                newSocket.on("userTyping", ({ chatId, username, isTyping }) => {
                    console.log(`${username} is ${isTyping ? 'typing' : 'stopped typing'} in ${chatId}`);
                    // Handle typing indicators in your UI
                });

                // Notification events
                newSocket.on("notify", (data) => {
                    console.log("New notification:", data);
                    // setNotification((prev: any) => [data, ...prev]);
                });

                // Error events
                newSocket.on("error", (error) => {
                    console.error("Socket error:", error);
                });

            } catch (error) {
                console.error("Error setting up socket:", error);
            }
        };

        // Only setup socket if user is authenticated
        (async () => {
            const authenticated = await isAuthenticated();
            if (authenticated) {
                setupSocket();
            }
        })();

        // Cleanup function
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
                setIsSocketConnected(false);
                console.log("Socket disconnected and cleaned up");
            }
        };
    }, []);


    return (
        <ChatContext.Provider
            value={{
                socket,
                isSocketConnected,
                activeChats,

                // function
                sendMessage,
                joinChatRoom,
                createChatRoom,
                markAsRead,
                startTyping,
                stopTyping,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export { ChatContext, ChatDataProvider };

