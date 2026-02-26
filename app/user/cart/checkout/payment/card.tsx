import { Image, Text, TouchableOpacity, View } from "react-native";

type OptionListProps = {
    type: string;
    brief: string;
    onPress: (a: string) => void;
    selected: "paystack" | "crypto"
};

const images: Record<string, any> = {
    paystack: require("@/assets/images/card.png"),
    crypto: require("@/assets/images/crypto.png"),
};

 const OptionList = ({ type, brief, selected, onPress }: OptionListProps) => {
    return (
        <TouchableOpacity onPress={() => onPress(type)} className="px-1.5 py-7.5 h-44 min-h-44 w-1/2">
            <View className={`bg-gray-100 dark:border-slate-700 ${selected === type && "border" } flex-col items-center justify-center h-full px-2.5 py-6 rounded dark:bg-slate-900`}>
                <Image
                    source={images[type]}
                    className="w-20 h-20"
                />
                <Text className="px-1 text-center leading-5 mt-5 text-gray-900 dark:text-gray-300">
                    {brief}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default OptionList