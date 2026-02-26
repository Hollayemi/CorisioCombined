import { Text, View } from "react-native";

const AddressCard = ({ item, icon, isDefault }: any) => {
    return (
        <View
            className={`p-4 relative border rounded-md ${isDefault ? 'bg-indigo-50 dark:bg-slate-700' : 'bg-white dark:bg-slate-800'} my-1.5 mx-4 border-neutral-300 dark:border-slate-600`}
        >
            <View className="ml-2.5">
                <Text
                    className="text-xl font-bold text-indigo-900 dark:text-indigo-300 mb-1"
                    numberOfLines={1}
                >
                    {item?.state}
                </Text>
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                    {`${item?.address}, ${item?.city}, ${item?.state}.`}
                </Text>
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                    {item?.postal_code}
                </Text>
            </View>
            {icon}
        </View>
    );
};

export default AddressCard