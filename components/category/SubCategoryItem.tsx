import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { CustomCheckbox } from './CustomCheckbox';

// SubCategory Item Component
export const SubCategoryItem = ({
    subcategory,
    categoryId,
    selectedSubCategories = [],
    selectedGroups = [],
    onToggleSubCategory,
    onToggleGroup
}: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isSubSelected = selectedSubCategories.includes(subcategory._id);
    const isSubIndeterminate = !isSubSelected &&
        subcategory.groups?.some((group: any) => selectedGroups.includes(group._id));

    return (
        <View className="border-l-4 border-blue-200 dark:border-blue-800 ml-4">
            <TouchableOpacity
                className="flex-row items-center p-3 bg-gray-50 dark:bg-gray-900"
                onPress={() => setIsExpanded(!isExpanded)}
            >
                <CustomCheckbox
                    checked={isSubSelected}
                    indeterminate={isSubIndeterminate}
                    onPress={() => onToggleSubCategory(categoryId, subcategory._id)}
                    size="small"
                />

                <Text className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    {subcategory.label}
                </Text>

                <View className="flex-row items-center">
                    <View className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full mr-2">
                        <Text className="text-xs text-gray-600 dark:text-gray-300">
                            {subcategory.groups?.length || 0}
                        </Text>
                    </View>

                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={16}
                        className="text-gray-400 dark:!text-gray-400"
                    />
                </View>
            </TouchableOpacity>

            {isExpanded && (
                <View className="bg-gray-25 dark:bg-gray-950">
                    {subcategory.groups?.map((group: any) => (
                        <TouchableOpacity
                            key={group._id}
                            className="flex-row items-center p-3 pl-8 ml-5 border-l-4 border-gray-200 dark:border-gray-700"
                            onPress={() => onToggleGroup(categoryId, subcategory._id, group._id)}
                        >
                            <CustomCheckbox
                                checked={selectedGroups.includes(group._id)}
                                onPress={() => onToggleGroup(categoryId, subcategory._id, group._id)}
                                size="small"
                            />

                            <Text className="text-sm text-gray-700 dark:text-gray-300">
                                {group.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};
