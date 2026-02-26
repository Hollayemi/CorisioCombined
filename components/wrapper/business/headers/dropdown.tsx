import { MoreHorizontal } from 'lucide-react-native';
import React, { ReactNode, useState } from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export interface HeaderDropdown {
    items: {
        label?: string;
        value?: any;
        action?: any;
    }[];
    clickComponent?: ReactNode;
    onSelect: any;
    children?: ReactNode;
}

export const HeaderDropdown = ({ items = [], onSelect, children, clickComponent }: HeaderDropdown) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleSelect = (item: any) => {
        onSelect?.(item);
        setIsVisible(false);
    };

    return (
        <>
            {/* Trigger Button */}
            <TouchableOpacity onPress={() => setIsVisible(true)}>
                {children || clickComponent || (
                    <View className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center">
                        <Text className="text-gray-600 dark:text-gray-300"><MoreHorizontal color="gray" /></Text>
                    </View>
                )}
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal visible={isVisible} transparent  onRequestClose={() => setIsVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
                    <View className="flex-1 bg-black/20 ">
                        <TouchableWithoutFeedback>
                            <View className="absolute top-28 right-1 py-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg min-w-48 overflow-hidden">
                                {items.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleSelect(item)}
                                        className="px-4 py-3 border-b-2 border-gray-100 dark:!border-gray-500 last:border-b-0"
                                    >
                                        <Text className="text-gray-900 text-[17px] dark:text-white">{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

// Demo
const SimpleDemo = () => {
    const menuItems = [
        { label: 'Withdraw', value: 'withdraw' },
        { label: 'Request Statement', value: 'statement' },
        { label: 'Settings', value: 'settings' },
        { label: 'Help', value: 'help' },
    ];

    return (
        <View className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800">
                <Text className="text-lg font-semibold text-black dark:text-white">
                    My App
                </Text>

                
            </View>

            {/* Content */}
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-600 dark:text-gray-400">
                    Tap the menu icon in the header
                </Text>
            </View>
        </View>
    );
};

export default SimpleDemo;