import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

type EditableDropdownProps = {
    options: string[];
    selected: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    editable?: boolean;
};

export function EditableDropdown({
    options,
    selected,
    onSelect,
    placeholder = "Select or type",
    editable = true,
}: EditableDropdownProps) {
    const dropdownRef = useRef<View>(null);
    const [dropdownLayout, setDropdownLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 100,
    });
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected);
    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleToggleDropdown = () => {
        if (!isOpen) {
            dropdownRef.current?.measureInWindow((x, y, width, height) => {
                setDropdownLayout({ x, y, width, height });
                setIsOpen(true);
            });
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        setInputValue(selected);
    }, [selected]);

    useEffect(() => setFilteredOptions(options), [options]);

    const handleInputChange = (text: string) => {
        setInputValue(text);
        setFilteredOptions(
            options.filter((option) =>
                option.toLowerCase().includes(text.toLowerCase())
            )
        );
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setInputValue(value);
        setIsOpen(false);
    };

    return (
        <View className="relative z-10">
            <View ref={dropdownRef} className="flex-row items-center border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 h-14 bg-white dark:bg-gray-800">
                <TextInput
                    value={inputValue}
                    onChangeText={handleInputChange}
                    placeholder={placeholder}
                    onFocus={() => setIsOpen(true)}
                    editable={editable}
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-black dark:text-white"
                />
                <TouchableOpacity onPress={handleToggleDropdown}>
                    <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#6B7280"
                    />
                </TouchableOpacity>
            </View>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-transparent"
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View className="absolute border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
                        style={{
                            top: dropdownLayout.y + dropdownLayout.height + 4,
                            left: dropdownLayout.x,
                            width: dropdownLayout.width,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 15 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 10,
                        }}>
                        {filteredOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => handleSelect(option)}
                                className={`p-3 h-14 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 ${selected === option
                                    ? "bg-gray-100 dark:bg-slate-700"
                                    : ""
                                    }`}
                            >
                                <Text className="text-black dark:text-white">{option}</Text>
                            </TouchableOpacity>
                        ))}
                        {inputValue && !options.includes(inputValue) && editable && (
                            <TouchableOpacity
                                onPress={() => handleSelect(inputValue)}
                                className="flex-row items-center px-3 py-2 bg-slate-50 dark:bg-gray-700"
                            >
                                <Ionicons name="add-circle" size={18} color="#2C337C" />
                                <Text className="ml-2 text-black dark:text-white">
                                    Add &quot;{inputValue}&quot;
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}
