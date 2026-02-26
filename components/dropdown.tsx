import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
};

export function Dropdown({
    options,
    selected,
    onSelect,
    placeholder = "Select",
    multiple = false,
    className,
    textClass,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
    const dropdownRef = useRef<View>(null);

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

    const getDisplayText = () => {
        if (selected.length === 1 && selected[0] === "") return placeholder;

        const selectedLabels = selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            return option?.label || value;
        });

        return selectedLabels.join(", ");
    };

    return (
        <View className={`relative`}>
            <TouchableOpacity
                ref={dropdownRef}
                className={`border mb-4 border-gray-200 dark:border-gray-700 rounded-lg p-3 h-14 flex-row justify-between items-center bg-white dark:bg-gray-800 ${className}`}
                onPress={handleToggleDropdown}
            >
                <Text numberOfLines={1} className={`text-gray-800 dark:text-gray-200 ${textClass}`}>
                    {getDisplayText()}
                </Text>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    className="text-gray-500 dark:!text-gray-400"
                />
            </TouchableOpacity>

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
                    <ScrollView
                        className="!h-[200px] absolute border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 shadow-lg"
                        style={{
                            top: dropdownLayout.y + dropdownLayout.height + 4,
                            right: dropdownLayout.x > 280 ? 15 : undefined,
                            left: dropdownLayout.x <= 280 ? dropdownLayout.x : undefined,
                            minWidth: dropdownLayout.width,
                            // width: dropdownLayout.width,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 15 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 10,
                        }}
                    >
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.value}
                                className={`p-3 h-14 flex-row justify-between items-center border-b border-gray-100 dark:border-gray-700 ${selected.includes(option.value)
                                        ? "bg-gray-100 dark:bg-slate-700"
                                        : ""
                                    }`}
                                onPress={() => toggleOption(option.value)}
                            >
                                <Text className="text-gray-800 dark:text-gray-200">
                                    {option.label}
                                </Text>
                                {selected.includes(option.value) && (
                                    <Ionicons
                                        name="checkmark"
                                        size={16}
                                        className="text-indigo-800 dark:!text-gray-400"
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}