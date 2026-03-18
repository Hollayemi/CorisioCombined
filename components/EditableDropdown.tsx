import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

type EditableDropdownProps = {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    editable?: boolean;
    className?: string;
};

export function EditableDropdown({
    options,
    selected,
    onSelect,
    placeholder = "Select or type",
    editable = true,
    className,
}: EditableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected ?? "");
    const [filteredOptions, setFilteredOptions] = useState(options);

    // Sync external selected value
    useEffect(() => {
        setInputValue(selected ?? "");
    }, [selected]);

    // Sync options list (e.g. loaded async)
    useEffect(() => {
        setFilteredOptions(
            options.filter((o) =>
                o.toLowerCase().includes((inputValue ?? "").toLowerCase())
            )
        );
    }, [options]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
        setIsOpen(true); // open as user types
        setFilteredOptions(
            options.filter((o) =>
                o.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setInputValue(value);
        // Reset filter to full list for next open
        setFilteredOptions(options);
        setIsOpen(false);
    };

    const handleChevronPress = () => {
        if (isOpen) {
            setIsOpen(false);
        } else {
            // Reset filter when opening via chevron
            setFilteredOptions(
                options.filter((o) =>
                    o.toLowerCase().includes((inputValue ?? "").toLowerCase())
                )
            );
            setIsOpen(true);
        }
    };

    const showAddOption =
        editable &&
        inputValue.trim() !== "" &&
        !options.some((o) => o.toLowerCase() === inputValue.toLowerCase());

    return (
        <View className={`mb-4 ${className ?? ""}`}>
            {/* Trigger row */}
            <View className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 h-14 bg-white dark:bg-gray-800">
                <TextInput
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder={placeholder}
                    onFocus={() => setIsOpen(true)}
                    editable={editable}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-black dark:text-white"
                />
                <TouchableOpacity onPress={handleChevronPress} className="pl-2 py-2">
                    <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#6B7280"
                    />
                </TouchableOpacity>
            </View>

            {/* Inline expanding list */}
            {isOpen && (
                <View
                    className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 mt-1 overflow-hidden"
                    style={{
                        elevation: 4,
                        shadowColor: "#000",
                        shadowOpacity: 0.08,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        style={{ maxHeight: 200 }}
                    >
                        {filteredOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => handleSelect(option)}
                                className={`p-3 h-14 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 ${
                                    selected === option
                                        ? "bg-gray-100 dark:bg-slate-700"
                                        : ""
                                }`}
                            >
                                <Text className="text-black dark:text-white">{option}</Text>
                                {selected === option && (
                                    <Ionicons name="checkmark" size={16} color="#4F46E5" />
                                )}
                            </TouchableOpacity>
                        ))}

                        {/* Add custom value option */}
                        {showAddOption && (
                            <TouchableOpacity
                                onPress={() => handleSelect(inputValue.trim())}
                                className="flex-row items-center px-3 py-3 bg-slate-50 dark:bg-gray-700"
                            >
                                <Ionicons name="add-circle" size={18} color="#2C337C" />
                                <Text className="ml-2 text-black dark:text-white">
                                    Add "{inputValue.trim()}"
                                </Text>
                            </TouchableOpacity>
                        )}

                        {filteredOptions.length === 0 && !showAddOption && (
                            <View className="p-4 items-center">
                                <Text className="text-gray-400">No matches found</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}