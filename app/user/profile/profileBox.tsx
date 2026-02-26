import { useColorScheme } from "@/hooks/useColorScheme.web";
import { MaterialIcons } from "@expo/vector-icons";
import { Route, router } from "expo-router";
import React from "react";
import { Pressable, Switch, Text } from "react-native";

type prop = {
    name: string;
    type: string;
    last?: boolean;
    to?: Route;
    toggleSwitch?: any;
    isEnabled?: any;
};

export default function ProfileBox({
    last,
    name,
    type,
    to,
    toggleSwitch,
    isEnabled,
}: prop) {
    const isDark = useColorScheme() === "dark"
    return (
        <Pressable
            className={`flex-row justify-between items-center ${!last ? "border-b border-neutral-200 dark:border-slate-800" : ""} px-[5%] py-4`}
            onPress={() => (to ? router.push(to) : null)}
        >
            <Text
                className={`font-medium text-[13px] ${name === "Delete Account" ? "text-red-500" : "text-neutral-800 dark:text-neutral-200"}`}
            >
                {name}
            </Text>
            {type === "link" ? (
                <MaterialIcons
                    name="keyboard-arrow-right"
                    size={24}
                    color={name === "Delete Account" ? "#f00" : isDark ? "#eee" : "black"}
                    className={name === "Delete Account" ? "text-red-500" : "text-black dark:text-white"}
                />
            ) : (
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#0147CD" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    className=""
                />
            )}
        </Pressable>
    );
}