import { Image, Text, View } from "react-native";

const NoRecord = ({ text, className }: any) => {
    return (
        <View className={`flex justify-center h-[20%] items-center pt-10 ${className}`}>
            <Image source={require("@/assets/images/norecordfound.png")} className="w-32 h-28 mt-20 " />
            <Text className="text-neutral-500 dark:text-neutral-400 mt-4">
                {text || "No Record Found"}
            </Text>
        </View>
    );
};

export default NoRecord