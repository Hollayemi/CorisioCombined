import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { CategoryItem } from './CategoryItem';
import { SubCategoryItem } from './SubCategoryItem';

// Loading Component
const LoadingSpinner = () => (
    <View className="flex-1 items-center justify-center py-12">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 dark:text-gray-400 mt-3">Loading categories...</Text>
    </View>
);

// Summary Component
const SelectionSummary = ({ selectedCategories, selectedSubCategories, selectedGroups }: { selectedCategories: [], selectedSubCategories: [], selectedGroups: [] }) => {
    if (!selectedCategories.length && !selectedSubCategories.length && !selectedGroups.length) {
        return null;
    }

    return (
        <View className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
            <Text className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Selection Summary
            </Text>
            <View className="flex-row flex-wrap gap-2">
                <View className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-blue-800 dark:text-blue-200">
                        {selectedCategories.length} Categories
                    </Text>
                </View>
                <View className="bg-green-100 dark:bg-green-800 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-green-800 dark:text-green-200">
                        {selectedSubCategories.length} Subcategories
                    </Text>
                </View>
                <View className="bg-purple-100 dark:bg-purple-800 px-3 py-1 rounded-full">
                    <Text className="text-xs font-medium text-purple-800 dark:text-purple-200">
                        {selectedGroups.length} Groups
                    </Text>
                </View>
            </View>
        </View>
    );
};

// Main Category Selector Component
export const CategorySelector = ({
    categories = [],
    isLoading = false,
    onSelectionChange,
    refetch,
    handleNext,
    initialSelection = {
        main: [],
        subCategories: [],
        groups: []
    }
}: any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const [selectedCategories, setSelectedCategories] = useState(initialSelection.main || []);
    const [selectedSubCategories, setSelectedSubCategories] = useState(initialSelection.subCategories || []);
    const [selectedGroups, setSelectedGroups] = useState(initialSelection.groups || []);

    // Update parent component when selections change
    useEffect(() => {
        onSelectionChange?.({
            main: selectedCategories,
            subCategories: selectedSubCategories,
            groups: selectedGroups
        });
    }, [selectedCategories, selectedSubCategories, selectedGroups]);

    // Filter categories based on search
    const filteredCategories = searchTerm
        ? categories.filter((category: any) =>
            category.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.sub_category?.some((sub: any) =>
                sub.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sub.groups?.some((group: any) =>
                    group.label.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        )
        : categories;

    // Toggle category selection
    const toggleCategory = (categoryId: any) => {
        const category = categories.find((c: any) => c._id === categoryId);
        if (!category) return;

        if (selectedCategories.includes(categoryId)) {
            // Deselect category and all its children
            setSelectedCategories((prev: any) => prev.filter((id: any) => id !== categoryId));

            const subIds = category.sub_category?.map((sub: any) => sub._id) || [];
            setSelectedSubCategories((prev: any) => prev.filter((id: any) => !subIds.includes(id)));

            const groupIds = category.sub_category?.flatMap((sub: any) =>
                sub.groups?.map((g: any) => g._id) || []
            ) || [];
            setSelectedGroups((prev: any) => prev.filter((id: any) => !groupIds.includes(id)));
        } else {
            // Select category and all its children
            setSelectedCategories((prev: any) => [...prev, categoryId]);

            const subIds = category.sub_category?.map((sub: any) => sub._id) || [];
            setSelectedSubCategories((prev: any) => [...new Set([...prev, ...subIds])]);

            const groupIds = category.sub_category?.flatMap((sub: any) =>
                sub.groups?.map((g: any) => g._id) || []
            ) || [];
            setSelectedGroups((prev: any) => [...new Set([...prev, ...groupIds])]);
        }
    };

    // Toggle subcategory selection
    const toggleSubCategory = (categoryId: string, subcategoryId: string) => {
        const category = categories.find((c: any) => c._id === categoryId);
        const subcategory = category?.sub_category?.find((s: any) => s._id === subcategoryId);
        if (!subcategory) return;

        if (selectedSubCategories.includes(subcategoryId)) {
            // Deselect subcategory and its groups
            setSelectedSubCategories((prev: any) => prev.filter((id: any) => id !== subcategoryId));

            const groupIds = subcategory.groups?.map((g: any) => g._id) || [];
            setSelectedGroups((prev: any) => prev.filter((id: any) => !groupIds.includes(id)));

            // Check if parent category should be deselected
            const otherSubsSelected = category?.sub_category?.filter((s: any) => s._id !== subcategoryId)
                .some((s: any) => selectedSubCategories.includes(s._id));

            if (!otherSubsSelected && selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any) => prev.filter((id: any) => id !== categoryId));
            }
        } else {
            // Select subcategory and its groups
            setSelectedSubCategories((prev: any) => [...prev, subcategoryId]);
            const groupIds = subcategory.groups?.map((g: any) => g._id) || [];
            setSelectedGroups((prev: any) => [...new Set([...prev, ...groupIds])]);

            // Select parent category if not already selected
            if (!selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any) => [...prev, categoryId]);
            }
        }
    };

    // Toggle group selection
    const toggleGroup = (categoryId: string, subcategoryId: string, groupId: string) => {
        if (selectedGroups.includes(groupId)) {
            // Deselect group
            setSelectedGroups((prev: any) => prev.filter((id: any) => id !== groupId));

            // Check if parent subcategory should be deselected
            const category = categories.find((c: any) => c._id === categoryId);
            const subcategory = category?.sub_category?.find((s: any) => s._id === subcategoryId);

            if (subcategory) {
                const otherGroupsSelected = subcategory.groups?.filter((g: any) => g._id !== groupId)
                    .some((g: any) => selectedGroups.includes(g._id));

                if (!otherGroupsSelected && selectedSubCategories.includes(subcategoryId)) {
                    setSelectedSubCategories((prev: any) => prev.filter((id: any) => id !== subcategoryId));

                    // Check parent category
                    const otherSubsSelected = category?.sub_category?.filter((s: any) => s._id !== subcategoryId)
                        .some((s: any) => selectedSubCategories.includes(s._id));

                    if (!otherSubsSelected && selectedCategories.includes(categoryId)) {
                        setSelectedCategories((prev: any) => prev.filter((id: any) => id !== categoryId));
                    }
                }
            }
        } else {
            // Select group
            setSelectedGroups((prev: any) => [...prev, groupId]);

            // Select parent subcategory and category if not already selected
            if (!selectedSubCategories.includes(subcategoryId)) {
                setSelectedSubCategories((prev: any) => [...prev, subcategoryId]);
            }
            if (!selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any) => [...prev, categoryId]);
            }
        }
    };

    // Check if category is fully selected
    const isCategorySelected = (categoryId: string) => {
        return selectedCategories.includes(categoryId);
    };

    // Check if category is partially selected
    const isCategoryIndeterminate = (categoryId: string) => {
        const category = categories.find((c: any) => c._id === categoryId);
        if (!category || selectedCategories.includes(categoryId)) return false;

        return category.sub_category?.some((sub: any) =>
            selectedSubCategories.includes(sub._id) ||
            sub.groups?.some((group: any) => selectedGroups.includes(group._id))
        ) || false;
    };

    // Toggle category expansion
    const toggleCategoryExpansion = (categoryId: string) => {
        setExpandedCategories((prev: any) => {
            const newSet = new Set(prev);
            if (newSet.has(categoryId)) {
                newSet.delete(categoryId);
            } else {
                newSet.add(categoryId);
            }
            return newSet;
        });
    };

    // Handle search with auto-expansion
    const handleSearch = (text: string) => {
        setSearchTerm(text);

        if (text.trim()) {
            // Auto-expand categories that match search
            const matchingCategories = new Set();
            categories.forEach((category: any) => {
                if (category.category.toLowerCase().includes(text.toLowerCase()) ||
                    category.sub_category?.some((sub: any) =>
                        sub.label.toLowerCase().includes(text.toLowerCase()) ||
                        sub.groups?.some((group: any) =>
                            group.label.toLowerCase().includes(text.toLowerCase())
                        )
                    )) {
                    matchingCategories.add(category._id);
                }
            });
            setExpandedCategories(matchingCategories);
        }
    };

    // Get display text for trigger button
    const getDisplayText = () => {
        const totalSelected = selectedCategories.length + selectedSubCategories.length + selectedGroups.length;
        if (totalSelected === 0) {
            return "Select Categories";
        }
        return `${selectedCategories.length} categories, ${selectedSubCategories.length} subcategories, ${selectedGroups.length} groups selected`;
    };

    return (
        <View className="!flex-1">
            {/* Trigger Button */}
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
                className="bg-gray-50 hidden dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-4 mb-4"
            >
                <Text
                    className={`text-base ${selectedCategories.length > 0
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                    numberOfLines={1}
                >
                    {getDisplayText()}
                </Text>
            </TouchableOpacity>

            {/* Modal */}
            {/* <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisible(false)}
            >*/}
            {/* <SafeAreaView className="flex-1 px-6 bg-gray-50 dark:bg-gray-900"> */}
            {/* Header */}
            <View className=" px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <View className="flex-row hidden items-center justify-between mb-4">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white">
                        Select Categories
                    </Text>
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                        <Ionicons name="close" size={24} className="text-gray-500" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                    <Ionicons name="search" size={20} className="text-gray-400 dark:!text-white mr-3" />
                    <TextInput
                        className="flex-1 text-gray-900 dark:text-white"
                        placeholder="Search categories, subcategories, or groups..."
                        placeholderTextColor="#9CA3AF"
                        value={searchTerm}
                        onChangeText={handleSearch}
                    />
                    {searchTerm ? (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} className="text-gray-400" />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {/* Content */}
            <ScrollView refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={() => refetch?.()} />
            } className="flex-1 px-2 py-4" showsVerticalScrollIndicator={false}>
                <SelectionSummary
                    selectedCategories={selectedCategories}
                    selectedSubCategories={selectedSubCategories}
                    selectedGroups={selectedGroups}
                />

                {isLoading ? (
                    <LoadingSpinner />
                ) : (
                    <View>
                        {filteredCategories.map((category: any) => (
                            <View key={category._id} className="mb-3">
                                <CategoryItem
                                    category={category}
                                    isSelected={isCategorySelected(category._id)}
                                    isIndeterminate={isCategoryIndeterminate(category._id)}
                                    onToggle={() => toggleCategory(category._id)}
                                    isExpanded={expandedCategories.has(category._id)}
                                    onExpand={() => toggleCategoryExpansion(category._id)}
                                />

                                {expandedCategories.has(category._id) && (
                                    <View className="ml-4 mt-2">
                                        {category.sub_category?.map((sub: any) => (
                                            <SubCategoryItem
                                                key={sub._id}
                                                subcategory={sub}
                                                categoryId={category._id}
                                                selectedSubCategories={selectedSubCategories}
                                                selectedGroups={selectedGroups}
                                                onToggleSubCategory={toggleSubCategory}
                                                onToggleGroup={toggleGroup}
                                            />
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}

                        {filteredCategories.length === 0 && !isLoading && (
                            <View className="py-12 items-center">
                                <Ionicons name="search" size={48} className="text-gray-300 dark:!text-white mb-4" />
                                <Text className="text-gray-500 dark:text-gray-400 text-center">
                                    No categories found {searchTerm && `matching ${searchTerm}`}
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Footer */}
            <View className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <TouchableOpacity
                    onPress={handleNext}
                    className="bg-[#2A347E] py-4 rounded-xl"
                >
                    <Text className="text-center text-white font-semibold text-base">
                        Let's Get Started ({selectedCategories.length + selectedSubCategories.length + selectedGroups.length} selected)
                    </Text>
                </TouchableOpacity>
            </View>
            {/* </SafeAreaView> */}
            {/* </Modal> */}
        </View>
    );
};
