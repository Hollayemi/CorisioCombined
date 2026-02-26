import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { timeSince } from "../../utils/format";

type message = {
    type?: "text" | "image" | "file";
    text?: string;
    date?: any;
    sender?: boolean;
    isSent?: boolean;
    notification?: boolean;
};

function Message({ type, date, sender, text, isSent, notification }: message) {
    return (
        <View className={`my-${notification ? 0 : 4}`}>
            <View
                className={`
                    ${notification ?
                        'bg-transparent px-0 pt-0 pb-1' :
                        sender ?
                            'bg-indigo-50 dark:bg-indigo-900/30 px-5 py-2' :
                            'bg-amber-50 dark:bg-amber-900/20 px-3 pt-2'
                    }
                    max-w-[80%]
                    rounded-t-lg
                    ${sender ? 'rounded-bl-lg rounded-br-none' : 'rounded-br-lg rounded-bl-none'}
                    ${notification ? 'self-center' : sender ? 'self-end' : 'self-start'}
                    my-1
                `}
            >
                <Text
                    className={`
                        ${!notification ? 'text-lg' : 'text-sm'}
                        font-medium
                        ${!notification ?
                            'text-gray-900 dark:text-gray-100' :
                            'text-gray-500 dark:text-gray-400'
                        }
                        leading-7
                    `}
                >
                    {text}
                </Text>
            </View>
            {!notification && (
                <View
                    className={`
                        flex-row items-center
                        ${sender ? 'justify-end' : 'justify-start'}
                    `}
                >
                    <Text
                        className={`
                            text-xs
                            font-medium
                            ${sender ? 'text-right' : 'text-left'}
                            text-gray-700 dark:text-gray-300
                        `}
                    >
                        {timeSince(date)}
                    </Text>
                    <MaterialIcons
                        name={isSent ? "done" : "more-time"}
                        size={12}
                        className="text-gray-500 dark:text-gray-400 ml-0.5"
                    />
                </View>
            )}
        </View>
    );
}

export default Message;