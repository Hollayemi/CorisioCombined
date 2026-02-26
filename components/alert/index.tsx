import React from "react";
import { Text, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type AlertProps = {
  label: string;
  onPress?: () => void;
  type: "warning" | "action";
};

export default function Alert({ label, onPress, type }: AlertProps) {
  const isWarning = type === "warning";

  return (
    <Pressable
      className={`flex-row p-2.5 justify-between items-center 
        ${isWarning ? 'bg-orange-100 dark:bg-amber-900/30' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}
      onPress={onPress}
    >
      <View className="flex-row flex-[0.9]">
        <Ionicons
          name={isWarning ? "warning" : "card"}
          size={18}
          color={isWarning ? "#ED6C0E" : "#2A347E"}
          className={isWarning ? 'dark:text-amber-500' : 'dark:text-indigo-400'}
        />
        <Text
          className={`text-sm ml-3.5 
            ${isWarning ? 'text-gray-900 dark:text-amber-100' : 'text-indigo-900 dark:text-indigo-200'}`}
        >
          {label}
        </Text>
      </View>
      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#28303F"
          className="dark:text-gray-400"
        />
      )}
    </Pressable>
  );
}