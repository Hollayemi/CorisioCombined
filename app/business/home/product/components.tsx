// components/CategorySpecification.tsx
import { EditableDropdown } from "@/components/EditableDropdown";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function CategorySpecification({
    onSpecChange,
    keys = [],
    values = [],
    newSpecKey,
    specifications,
    setNewSpecKey,
}: {
    onSpecChange: (specs: Record<string, string>) => void;
    keys: string[];
    values: [];
    specifications: any;
    newSpecKey: string;
    setNewSpecKey: any;
}) {
    const [specs, setSpecs] = useState<Record<string, string>>(specifications || {});
    const [currentValue, setCurrentValue] = useState("");

    useEffect(() => { setSpecs(specifications) }, [specifications])

    const handleAddSpec = () => {
        if (newSpecKey && currentValue) {
            const newSpecs = {
                ...specs,
                [newSpecKey]: currentValue,
            };
            setSpecs(newSpecs);
            onSpecChange(newSpecs);
            setNewSpecKey("");
            setCurrentValue("");
        }
    };

    const removeSpec = (key: string) => {
        const newSpecs = { ...specs };
        delete newSpecs[key];
        setSpecs(newSpecs);
        onSpecChange(newSpecs);
    };
    return (
        <View className="mb-6">
            <View className="flex-row mb-2">
                <View className="flex-1 mr-2">
                    <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Variation
                    </Text>
                    <EditableDropdown
                        options={keys}
                        selected={newSpecKey}
                        onSelect={setNewSpecKey}
                        placeholder="Select key"
                    />
                </View>

                <View className="flex-1">
                    <Text className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Value
                    </Text>
                    <EditableDropdown
                        options={values}
                        selected={currentValue}
                        onSelect={setCurrentValue}
                        placeholder="Select or type value"
                    />
                </View>
            </View>

            <TouchableOpacity
                onPress={handleAddSpec}
                activeOpacity={0.7}
                className="flex-row items-center justify-center border border-[#e6e6e9] dark:border-gray-700 rounded-lg mb-4 mt-2 py-3"
            >
                {/* className="py-4 border border-[#e6e6e9] dark:border-gray-700 rounded-lg mb-4 mt-2"
            > */}
                <Text className="dark:text-white  text-center">
                    Add Specification
                </Text>
            </TouchableOpacity>

            {Object.entries(specs).length > 0 && (
                <View className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    {Object.entries(specs).map(([key, value], i) => (
                        <View
                            key={key}
                            className={`flex-row justify-between !h-6 items-center ${i > 0 && "mt-4"} py-0  last:border-b-0 `}
                        >
                            <Text onPress={() => { setNewSpecKey(key); setCurrentValue(value) }} className={`font-medium text-base text-gray-700 dark:text-gray-300 `}>
                                {key}: {value}
                            </Text>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => removeSpec(key)}>
                                <Ionicons
                                    name="trash"
                                    size={18}
                                    color="#EF4444"
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}
