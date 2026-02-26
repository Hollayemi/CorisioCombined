import { Image, Text, View } from "react-native";

const PickerCard = ({ item }: any) => {
    console.log({item})
    return (
        <View className="p-4 relative flex-row border rounded-md bg-white dark:bg-slate-800 my-1.5 border-neutral-300 dark:border-slate-700">
            {/* <Image
                source={require("@/assets/images/customerSupport.png")}
                className="w-[60px] h-[60px]"
            /> */}
            <View className="ml-2.5">
                <Text
                    className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-1"
                    numberOfLines={1}
                >
                    {item?.name}
                </Text>
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                    {item?.email || "- - - -"}
                </Text>
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                    {item?.relationship}
                </Text>
            </View>
        </View>
    );
}

export default PickerCard