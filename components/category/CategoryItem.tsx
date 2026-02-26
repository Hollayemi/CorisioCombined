
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SubCategoryItem } from './SubCategoryItem';
import { CustomCheckbox } from './CustomCheckbox';

export const CategoryItem = ({
    category,
    isSelected,
    isIndeterminate,
    onToggle,
    isExpanded,
    onExpand
}: any) => {
    return (
        <View className="mb-2">
            <View className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    className="flex-row items-center p-4"
                    onPress={onExpand}
                >
                    <CustomCheckbox
                        checked={isSelected}
                        indeterminate={isIndeterminate}
                        onPress={onToggle}
                    />

                    <Text className="flex-1 text-base font-semibold text-gray-900 dark:text-white">
                        {category.category}
                    </Text>

                    <View className="flex-row items-center">
                        <View className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full mr-3">
                            <Text className="text-xs text-blue-600 dark:text-blue-300 font-medium">
                                {category.sub_category?.length || 0} subs
                            </Text>
                        </View>

                        <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            className="text-gray-400 dark:!text-gray-300"
                        />
                    </View>
                </TouchableOpacity>

                {/* {isExpanded && (
                    <View className="border-t border-gray-100 dark:border-gray-700">
                        {category.sub_category?.map((sub: any) => (
                            <SubCategoryItem
                                key={sub._id}
                                subcategory={sub}
                                categoryId={category._id}
                                isSelected={isSelected}
                                onToggle={onToggle}
                            />
                        ))}
                    </View>
                )} */}
            </View>
        </View>
    );
};
