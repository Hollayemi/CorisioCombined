import React from "react";
import { Text, View } from "react-native";

type StepperProps = {
  last?: boolean;
  title: string;
  date: string;
  time: string;
  desc: string;
};

export default function Stepper({ last, date, desc, time, title }: StepperProps) {
  return (
    <View className="flex-row pl-5">
      {/* Step indicator circle */}
      <View
        className={`h-5 w-5 rounded-full absolute left-3 z-10 
          ${last ? 'border-indigo-800' : 'border-yellow-500'} 
          border-7 bg-white dark:bg-slate-800`}
      />
      
      {/* Step content */}
      <View
        className={`pl-5 border-l-3 mt-2.5 ml-0.5 pb-5 
          ${last ? 'border-white dark:border-slate-800' : 'border-gray-500'} 
          border-dashed`}
      >
        {/* Header row */}
        <View className="flex-row items-center">
          <Text className="text-gray-900 text-base font-poppins600 dark:text-white">
            {title}
          </Text>
          <Text className="text-gray-900 text-[10px] font-poppins500 ml-2.5 dark:text-gray-300">
            {date}
          </Text>
          <Text className="text-gray-500 text-[10px] font-poppins400 ml-1.5 dark:text-gray-400">
            At {time}
          </Text>
        </View>
        
        {/* Description */}
        <Text className="text-gray-500 text-[10px] font-poppins400 ml-1.5 dark:text-gray-400">
          {desc}
        </Text>
      </View>
    </View>
  );
}