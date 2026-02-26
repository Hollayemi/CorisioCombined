// eslint-disable-next-line import/no-unresolved
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// import useSWR from "swr";

// Custom Checkbox Component
type CheckboxProps = {
    checked: boolean;
    indeterminate: boolean;
    onPress: () => void;
    size?: "small" | "medium";
};

const Checkbox = ({
    checked,
    indeterminate,
    onPress,
    size = "medium",
}: CheckboxProps) => {
    const sizeClasses = size === "small" ? "w-4 h-4" : "w-5 h-5";

    return (
        <TouchableOpacity
            onPress={onPress}
            className={`${sizeClasses} border-2 rounded mr-3 items-center justify-center ${checked || indeterminate
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
                }`}
        >
            {checked && <Text className="text-white text-xs font-bold">✓</Text>}
            {indeterminate && !checked && (
                <View className="w-2 h-0.5 bg-blue-600" />
            )}
        </TouchableOpacity>
    );
};

// Expandable Tree Item Component
type TreeItemProps = {
    children?: React.ReactNode;
    label: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
    level?: number;
    hasChildren?: boolean;
};

const TreeItem = ({
    children,
    label,
    isExpanded,
    onToggle,
    level = 0,
    hasChildren = false,
}: TreeItemProps) => {
    const paddingLeft = level * 20;

    return (
        <View>
            <TouchableOpacity
                onPress={hasChildren ? onToggle : undefined}
                className="flex-row items-center py-2 px-2"
                style={{ paddingLeft }}
            >
                {hasChildren && (
                    <View className="w-6 h-6 items-center justify-center mr-2">
                        <Text
                            className={`text-gray-600 ${isExpanded ? "rotate-90" : ""
                                }`}
                        >
                            ▶
                        </Text>
                    </View>
                )}
                {!hasChildren && <View className="w-8" />}
                {label}
            </TouchableOpacity>
            {isExpanded && children && <View>{children}</View>}
        </View>
    );
};

// Spinner Component
const SpinLoader = () => (
    <View className="flex-1 items-center justify-center py-8">
        <ActivityIndicator size="large" color="#2C337C" />
        <Text className="text-gray-600 mt-2">Loading categories...</Text>
    </View>
);

type PreferredCategories = {
    main: any[];
    subCategories: any[];
    groups: any[];
};

type EnhancedCategorySelectorProps = {
    setPreferedCategories: (categories: PreferredCategories) => void;
    preferredCategories?: Partial<PreferredCategories>;
    for_store: boolean;
    hasError?: string;
    error?: string;
};

export const EnhancedCategorySelector = ({
    setPreferedCategories,
    preferredCategories = {},
    error = "",
    hasError,
    for_store,
}: EnhancedCategorySelectorProps) => {
    // const { data, isLoading } = useSWR(
    //     `/corisio/category/thread?for_store=${for_store ? "true" : "false"}`
    // );

    const { data: cates, isLoading } = useGetFeaturedCategoriesQuery(false);

    console.log(preferredCategories);
    const categoryTree = cates ? cates?.data : [];

    const [showStatusModal, setShowStatusModal] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState(
        preferredCategories?.main || []
    );
    const [selectedSubCategories, setSelectedSubCategories] = useState(
        preferredCategories.subCategories || []
    );
    const [selectedGroups, setSelectedGroups] = useState(
        preferredCategories.groups || []
    );

    useEffect(() => {
        setPreferedCategories({
            main: selectedCategories || [],
            subCategories: selectedSubCategories || [],
            groups: selectedGroups || [],
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories, selectedSubCategories, selectedGroups]);

    const [searchTerm, setSearchTerm] = useState("");
    const [expandedItems, setExpandedItems] = useState<any[]>([]);

    const filteredThread = searchTerm
        ? categoryTree.filter(
            (category: { category: string; sub_category: any[] }) =>
                category.category
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                category.sub_category.some(
                    (sub: { label: string; groups: any[] }) =>
                        sub.label
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        sub.groups.some((group: { label: string }) =>
                            group.label
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                        )
                )
        )
        : categoryTree;

    // Category toggle
    const toggleCategory = (categoryId: any) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        if (!category) return;

        if (selectedCategories.includes(categoryId)) {
            // Deselect category and all its subcategories and groups
            setSelectedCategories((prev: any[]) =>
                prev.filter((id: any) => id !== categoryId)
            );

            const subIds = category.sub_category.map(
                (sub: { _id: any }) => sub._id
            );
            setSelectedSubCategories((prev: any[]) =>
                prev.filter((id: any) => !subIds.includes(id))
            );

            const groupIds = category.sub_category.flatMap(
                (sub: { groups: any[] }) =>
                    sub.groups.map((g: { _id: any }) => g._id)
            );
            setSelectedGroups((prev: any[]) =>
                prev.filter((id: any) => !groupIds.includes(id))
            );
        } else {
            // Select category and all its subcategories and groups
            setSelectedCategories((prev: any) => [...prev, categoryId]);

            const subIds = category.sub_category.map(
                (sub: { _id: any }) => sub._id
            );
            setSelectedSubCategories((prev: any) => [
                ...new Set([...prev, ...subIds]),
            ]);

            const groupIds = category.sub_category.flatMap(
                (sub: { groups: any[] }) =>
                    sub.groups.map((g: { _id: any }) => g._id)
            );
            setSelectedGroups((prev: any) => [
                ...new Set([...prev, ...groupIds]),
            ]);
        }
    };

    // Subcategory toggle
    const toggleSubCategory = (categoryId: any, subcategoryId: any) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        const subcategory = category?.sub_category.find(
            (s: { _id: any }) => s._id === subcategoryId
        );
        if (!subcategory) return;

        if (selectedSubCategories.includes(subcategoryId)) {
            // Deselect subcategory and all its groups
            setSelectedSubCategories((prev: any[]) =>
                prev.filter((id: any) => id !== subcategoryId)
            );
            setSelectedGroups((prev: any[]) =>
                prev.filter(
                    (id: any) =>
                        !subcategory.groups
                            .map((g: { _id: any }) => g._id)
                            .includes(id)
                )
            );

            // Check if we need to deselect parent category
            const otherSubsSelected = category?.sub_category
                .filter((s: { _id: any }) => s._id !== subcategoryId)
                .some((s: { _id: any }) =>
                    selectedSubCategories.includes(s._id)
                );

            if (!otherSubsSelected && selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any[]) =>
                    prev.filter((id: any) => id !== categoryId)
                );
            }
        } else {
            setSelectedCategories((prev: any) => [...prev, categoryId]);
            // Select subcategory and all its groups
            setSelectedSubCategories((prev: any) => [...prev, subcategoryId]);
            setSelectedGroups((prev: any) => [
                ...new Set([
                    ...prev,
                    ...subcategory.groups.map((g: { _id: any }) => g._id),
                ]),
            ]);

            // Check if we need to select parent category
            const allSubsSelected = category?.sub_category.every(
                (s: { _id: any }) =>
                    selectedSubCategories.includes(s._id) ||
                    s._id === subcategoryId
            );

            if (allSubsSelected && !selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any) => [...prev, categoryId]);
            }
        }
    };

    // Group toggle
    const toggleGroupCategory = (
        categoryId: any,
        subcategoryId: any,
        groupId: any
    ) => {
        if (selectedGroups.includes(groupId)) {
            // Deselect group
            setSelectedGroups((prev: any[]) =>
                prev.filter((id: any) => id !== groupId)
            );

            // Check if we need to deselect parent subcategory
            const subcategory = categoryTree
                .find((c: { _id: any }) => c._id === categoryId)
                ?.sub_category.find(
                    (s: { _id: any }) => s._id === subcategoryId
                );

            if (!subcategory) return;

            const otherGroupsSelected = subcategory.groups
                .filter((g: { _id: any }) => g._id !== groupId)
                .some((g: { _id: any }) => selectedGroups.includes(g._id));

            if (
                !otherGroupsSelected &&
                selectedSubCategories.includes(subcategoryId)
            ) {
                setSelectedSubCategories((prev: any[]) =>
                    prev.filter((id: any) => id !== subcategoryId)
                );

                // Check if we need to deselect parent category
                const category = categoryTree.find(
                    (c: { _id: any }) => c._id === categoryId
                );
                if (!category) return;

                const hasOtherSelectedSubs = category.sub_category
                    .filter((s: { _id: any }) => s._id !== subcategoryId)
                    .some((s: { _id: any }) =>
                        selectedSubCategories.includes(s._id)
                    );

                const hasOtherSelectedGroups = category.sub_category
                    .filter((s: { _id: any }) => s._id !== subcategoryId)
                    .flatMap((s: { groups: any }) => s.groups)
                    .some((g: { _id: any }) => selectedGroups.includes(g._id));

                if (
                    !hasOtherSelectedSubs &&
                    !hasOtherSelectedGroups &&
                    selectedCategories.includes(categoryId)
                ) {
                    setSelectedCategories((prev: any[]) =>
                        prev.filter((id: any) => id !== categoryId)
                    );
                }
            }
        } else {
            // Select group
            setSelectedGroups((prev: any) => [...prev, groupId]);

            // Check if we need to select parent subcategory
            if (!selectedSubCategories.includes(subcategoryId)) {
                setSelectedSubCategories((prev: any) => [
                    ...prev,
                    subcategoryId,
                ]);
            }

            // Check if we need to select parent category
            if (!selectedCategories.includes(categoryId)) {
                setSelectedCategories((prev: any) => [...prev, categoryId]);
            }
        }
    };

    // Check if category is fully selected
    const isCategoryChecked = (categoryId: any, subcategoryLength: any) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        if (!category) return false;
        if (!selectedCategories?.includes(categoryId) && !subcategoryLength)
            return false;

        return category.sub_category.every(
            (sub: { _id: any; groups: any[] }) =>
                selectedSubCategories.includes(sub._id) &&
                sub.groups.every((group: { _id: any }) =>
                    selectedGroups.includes(group._id)
                )
        );
    };

    // Check if category is partially selected
    const isCategoryIndeterminate = (categoryId: any) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        if (!category) return false;

        const hasSomeSelected = category.sub_category.some(
            (sub: { _id: any; groups: any[] }) =>
                selectedSubCategories.includes(sub._id) ||
                sub.groups.some((group: { _id: any }) =>
                    selectedGroups.includes(group._id)
                )
        );

        const allFullySelected = category.sub_category.every(
            (sub: { _id: any; groups: any[] }) =>
                selectedSubCategories.includes(sub._id) &&
                sub.groups.every((group: { _id: any }) =>
                    selectedGroups.includes(group._id)
                )
        );

        return hasSomeSelected && !allFullySelected;
    };

    // Check if subcategory is fully selected
    const isSubChecked = (
        categoryId: any,
        subcategoryId: any,
        groupLength: any
    ) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        const subcategory = category?.sub_category.find(
            (s: { _id: any }) => s._id === subcategoryId
        );
        if (!subcategory) return false;
        if (!selectedSubCategories.includes(subcategoryId) && !groupLength)
            return false;

        return subcategory.groups.every((group: { _id: any }) =>
            selectedGroups.includes(group._id)
        );
    };

    // Check if subcategory is partially selected
    const isSubIndeterminate = (categoryId: any, subcategoryId: any) => {
        const category = categoryTree.find(
            (c: { _id: any }) => c._id === categoryId
        );
        const subcategory = category?.sub_category.find(
            (s: { _id: any }) => s._id === subcategoryId
        );
        if (!subcategory) return false;

        const selectedCount = subcategory.groups.filter((group: { _id: any }) =>
            selectedGroups.includes(group._id)
        ).length;

        return selectedCount > 0 && selectedCount < subcategory.groups.length;
    };

    // Check if group is selected
    const isGroupChecked = (groupId: any) => {
        return selectedGroups.includes(groupId);
    };

    // Handle search
    const handleSearch = (text: string) => {
        const term = text.toLowerCase();
        setSearchTerm(text);

        if (term) {
            const matchedItems: any[] = [];
            categoryTree.forEach(
                (category: {
                    category: string;
                    _id: any;
                    sub_category: any[];
                }) => {
                    if (category.category.toLowerCase().includes(term)) {
                        matchedItems.push(category._id);
                    }

                    category.sub_category.forEach(
                        (subcategory: {
                            label: string;
                            _id: any;
                            groups: any[];
                        }) => {
                            if (
                                subcategory.label.toLowerCase().includes(term)
                            ) {
                                matchedItems.push(category._id);
                                matchedItems.push(subcategory._id);
                            }

                            subcategory.groups.forEach(
                                (group: { label: string; _id: any }) => {
                                    if (
                                        group.label.toLowerCase().includes(term)
                                    ) {
                                        matchedItems.push(category._id);
                                        matchedItems.push(subcategory._id);
                                        matchedItems.push(group._id);
                                    }
                                }
                            );
                        }
                    );
                }
            );
            setExpandedItems([...new Set(matchedItems)]);
        } else {
            setExpandedItems([]);
        }
    };

    const toggleExpanded = (itemId: any) => {
        setExpandedItems((prev) =>
            prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId]
        );
    };

    const renderStatusModal = () => (
        <Modal
            visible={showStatusModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowStatusModal(false)}
        >
            <View
                className="flex-1 bg-white rounded-t-3xl  my-2 w-full absolute !bottom-0"
                style={{ maxHeight: 600, height: 600, bottom: -10 }}
            >
                <View className="p-6 border-b border-gray-200">
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-bold text-gray-900 mb-4">
                            Select Your Categories
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowStatusModal(false)}
                        >
                            <Text className="text-lg  text-red-500 mb-4">
                                close
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                        <Text className="text-gray-400 mr-2">🔍</Text>
                        <TextInput
                            className="flex-1 text-gray-900"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChangeText={handleSearch}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                <ScrollView
                    className="flex-1 px-4"
                    showsVerticalScrollIndicator={false}
                >
                    {isLoading ? (
                        <SpinLoader />
                    ) : (
                        <View className="py-4">
                            {filteredThread.map(
                                (category: {
                                    _id: React.Key | null | undefined;
                                    sub_category: any[];
                                    category:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                    >
                                    | Iterable<React.ReactNode>
                                    | React.ReactPortal
                                    | Promise<
                                        | string
                                        | number
                                        | bigint
                                        | boolean
                                        | React.ReactPortal
                                        | React.ReactElement<
                                            unknown,
                                            | string
                                            | React.JSXElementConstructor<any>
                                        >
                                        | Iterable<React.ReactNode>
                                        | null
                                        | undefined
                                    >
                                    | null
                                    | undefined;
                                }) => (
                                    <TreeItem
                                        key={category._id}
                                        isExpanded={expandedItems.includes(
                                            category._id
                                        )}
                                        onToggle={() =>
                                            toggleExpanded(category._id)
                                        }
                                        hasChildren={
                                            category.sub_category.length > 0
                                        }
                                        level={0}
                                        label={
                                            <View className="flex-row items-center flex-1">
                                                <Checkbox
                                                    checked={isCategoryChecked(
                                                        category._id,
                                                        category.sub_category
                                                            .length
                                                    )}
                                                    indeterminate={isCategoryIndeterminate(
                                                        category._id
                                                    )}
                                                    onPress={() =>
                                                        toggleCategory(
                                                            category._id
                                                        )
                                                    }
                                                />
                                                <Text className="text-base font-semibold text-gray-900 flex-1">
                                                    {category.category}
                                                </Text>
                                            </View>
                                        }
                                    >
                                        {category.sub_category.map(
                                            (sub: {
                                                _id:
                                                | React.Key
                                                | null
                                                | undefined;
                                                groups: any[];
                                                label:
                                                | string
                                                | number
                                                | bigint
                                                | boolean
                                                | React.ReactElement<
                                                    unknown,
                                                    | string
                                                    | React.JSXElementConstructor<any>
                                                >
                                                | Iterable<React.ReactNode>
                                                | React.ReactPortal
                                                | Promise<
                                                    | string
                                                    | number
                                                    | bigint
                                                    | boolean
                                                    | React.ReactPortal
                                                    | React.ReactElement<
                                                        unknown,
                                                        | string
                                                        | React.JSXElementConstructor<any>
                                                    >
                                                    | Iterable<React.ReactNode>
                                                    | null
                                                    | undefined
                                                >
                                                | null
                                                | undefined;
                                            }) => (
                                                <TreeItem
                                                    key={sub._id}
                                                    isExpanded={expandedItems.includes(
                                                        sub._id
                                                    )}
                                                    onToggle={() =>
                                                        toggleExpanded(sub._id)
                                                    }
                                                    hasChildren={
                                                        sub.groups.length > 0
                                                    }
                                                    level={1}
                                                    label={
                                                        <View className="flex-row items-center flex-1">
                                                            <Checkbox
                                                                checked={isSubChecked(
                                                                    category._id,
                                                                    sub._id,
                                                                    sub.groups
                                                                        .length
                                                                )}
                                                                indeterminate={isSubIndeterminate(
                                                                    category._id,
                                                                    sub._id
                                                                )}
                                                                onPress={() =>
                                                                    toggleSubCategory(
                                                                        category._id,
                                                                        sub._id
                                                                    )
                                                                }
                                                                size="small"
                                                            />
                                                            <Text className="text-sm text-gray-800 flex-1">
                                                                {sub.label}
                                                            </Text>
                                                        </View>
                                                    }
                                                >
                                                    {sub.groups.map(
                                                        (group: {
                                                            _id:
                                                            | React.Key
                                                            | null
                                                            | undefined;
                                                            label:
                                                            | string
                                                            | number
                                                            | bigint
                                                            | boolean
                                                            | React.ReactElement<
                                                                unknown,
                                                                | string
                                                                | React.JSXElementConstructor<any>
                                                            >
                                                            | Iterable<React.ReactNode>
                                                            | React.ReactPortal
                                                            | Promise<
                                                                | string
                                                                | number
                                                                | bigint
                                                                | boolean
                                                                | React.ReactPortal
                                                                | React.ReactElement<
                                                                    unknown,
                                                                    | string
                                                                    | React.JSXElementConstructor<any>
                                                                >
                                                                | Iterable<React.ReactNode>
                                                                | null
                                                                | undefined
                                                            >
                                                            | null
                                                            | undefined;
                                                        }) => (
                                                            <TreeItem
                                                                key={group._id}
                                                                hasChildren={
                                                                    false
                                                                }
                                                                level={2}
                                                                label={
                                                                    <View className="flex-row items-center flex-1">
                                                                        <Checkbox
                                                                            checked={isGroupChecked(
                                                                                group._id
                                                                            )}
                                                                            indeterminate={
                                                                                false
                                                                            }
                                                                            onPress={() =>
                                                                                toggleGroupCategory(
                                                                                    category._id,
                                                                                    sub._id,
                                                                                    group._id
                                                                                )
                                                                            }
                                                                            size="small"
                                                                        />
                                                                        <Text className="text-sm text-gray-700 flex-1">
                                                                            {
                                                                                group.label
                                                                            }
                                                                        </Text>
                                                                    </View>
                                                                }
                                                                isExpanded={
                                                                    false
                                                                }
                                                                onToggle={() => { }}
                                                            />
                                                        )
                                                    )}
                                                </TreeItem>
                                            )
                                        )}
                                    </TreeItem>
                                )
                            )}
                        </View>
                    )}
                </ScrollView>
            </View>
        </Modal>
    );

    return (
        <View>
            <TouchableOpacity
                onPress={() => setShowStatusModal(true)}
                className={`bg-gray-200 h-12 rounded-xl px-5 border mb-4 flex  ${error ? "border-red-300" : "border-gray-200"
                    }`}
            >
                <Text
                    className={`flex-1  mt-4 ${preferredCategories.main?.length
                        ? "text-blue-800"
                        : "text-gray-400 ml-3"
                        } `}
                    numberOfLines={1}
                >
                    {preferredCategories.main?.length
                        ? `${preferredCategories.main?.length} Categories, ${preferredCategories.subCategories?.length} subcategories and ${preferredCategories.groups?.length} groups selected`
                        : "Adjust Categories"}
                </Text>
            </TouchableOpacity>
            {renderStatusModal()}
        </View>
    );
};
