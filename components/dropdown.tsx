import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

type DropdownOption = {
    label: string;
    value: string;
    [key: string]: any;
};

type DropdownProps = {
    options: DropdownOption[];
    selected: string[];
    onSelect: (values: string[]) => void;
    placeholder?: string;
    multiple?: boolean;
    className?: string;
    textClass?: string;
    disabled?: boolean;
};

export function Dropdown({
    options,
    selected,
    onSelect,
    placeholder = "Select",
    multiple = false,
    className,
    textClass,
    disabled = false,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false); // ← fix #1

    const toggleOption = (value: string) => {
        if (multiple) {
            const newSelected = selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value];
            onSelect(newSelected);
        } else {
            onSelect([value]);
            setIsOpen(false);
        }
    };

    const getDisplayText = () => {
        // fix #5: filter out empty/undefined values
        const validSelected = selected.filter((v) => v && v !== "");
        if (validSelected.length === 0) return placeholder;

        return validSelected
            .map((value) => options.find((opt) => opt.value === value)?.label ?? value)
            .join(", ");
    };

    return (
        <View className={`mb-4 ${className ?? ""}`}>
            <TouchableOpacity
                disabled={disabled}
                activeOpacity={1}
                className={`border border-gray-200 dark:border-gray-700 rounded-lg p-3 h-14 flex-row justify-between items-center ${
                    disabled
                        ? "bg-gray-100 dark:bg-gray-700 opacity-60"
                        : "bg-white dark:bg-gray-800"
                }`}
                onPress={() => setIsOpen((prev) => !prev)}
            >
                <Text
                    numberOfLines={1}
                    className={`flex-1 mr-2 text-gray-800 dark:text-gray-200 ${textClass ?? ""}`}
                >
                    {getDisplayText()}
                </Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    className="text-gray-500 dark:!text-gray-400"
                />
            </TouchableOpacity>

            {/* Inline expanding list — no Modal, no measureInWindow */}
            {isOpen && (
                <View className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 mt-1 overflow-hidden"
                    style={{ elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
                >
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 200 }}>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                className={`p-3 h-14 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 ${
                                    selected.includes(option.value)
                                        ? "bg-gray-100 dark:bg-slate-700"
                                        : ""
                                }`}
                                activeOpacity={1}
                                onPress={() => toggleOption(option.value)}
                            >
                                <Text className="text-gray-800 dark:text-gray-200">{option.label}</Text>
                                {selected.includes(option.value) && (
                                    <Ionicons name="checkmark" size={16} className="text-indigo-800 dark:!text-gray-400" />
                                )}
                            </TouchableOpacity>
                        ))}
                        {options.length === 0 && (
                            <View className="p-4 items-center">
                                <Text className="text-gray-400">No options available</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}