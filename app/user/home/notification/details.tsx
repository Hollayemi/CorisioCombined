import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text } from "react-native";

export default function NotificationDetails() {
  const params = useLocalSearchParams()

  const { data }: any = params;
  const { info } = JSON.parse(data || "[]")



  return (
    <ScrollView className={`p-5 bg-white dark:bg-slate-950`}>
      <Text
        className="text-xl text-black dark:text-white font-semibold max-w-[80%]"
        numberOfLines={1}
      >
        {info?.title}
      </Text>
      <Text
        className="mt-2 text-neutral-500 dark:text-neutral-400 font-medium text-sm leading-8"
      >
        {info?.note}
      </Text>
    </ScrollView>
  );
}