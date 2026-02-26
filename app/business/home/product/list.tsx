import Button from "@/components/form/Button";
import NoRecord from "@/components/noRecord";
import StoreWrapper from "@/components/wrapper/business";
import {
    useGetStoreFilesCountQuery,
    useGetStoreProductsQuery,
    useUpdateProductStatusMutation,
} from "@/redux/business/slices/productSlice";
import { formatPrice } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image, RefreshControl, ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";


export default function ProductPage() {
    const [selectedCollection, setSelectedCollection] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("");
    console.log({ selectedCollection })
    const { data, isLoading, refetch } = useGetStoreProductsQuery({ category: selectedCategory });

    const {
        data: files,
        error,
        isLoading: filesLoading,
    } = useGetStoreFilesCountQuery();
    const { topBar, categories } = files?.data || {};
    const [handleUpdate, { isLoading: updating }] = useUpdateProductStatusMutation()

    const products = data?.data || [];
    console.log({ categories })
    return (
        <StoreWrapper headerTitle="Store Products" dropdownItems={[
            { label: 'Add New Product', value: 'withdraw', action: () => router.push('/business/home/product/new') },
            { label: 'Product Categories', value: 'statement' },
            { label: 'Adjust Categories', value: 'settings', action: () => router.push('/business/home/product/categories/adjust') },
            { label: 'Help', value: 'help' },
        ]}>
            <View className="flex-1 bg-white dark:bg-gray-900">
                <View className="px-2 mb-4 mt-2">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
                        <Ionicons name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search"
                            className="flex-1 ml-3 text-gray-700"
                            placeholderTextColor="#9CA3AF"
                        />
                        <TouchableOpacity>
                            <Ionicons
                                name="options-outline"
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="flex-row px-4 mb-6">
                    <Button
                        title="All"
                        size="small"
                        textColor={`${"All" !== selectedCollection ? "text-gray-500 dark:!text-gray-200" : ""}`}
                        className={`w-fit !h-9 !px-3 mx-1 ${selectedCollection !== "All" ? "!text-gray-500 dark:!text-gray-200 !bg-gray-200 dark:!bg-slate-800" : ""}`}
                        onPress={() => {setSelectedCollection("All"); setSelectedCategory("")}}
                    />
                    {categories?.values?.map((category: any, i: number) => (
                        <Button
                            key={i}
                            title={category.collectionName}
                            size="small"
                            textColor={`${category.collectionName !== selectedCollection ? "text-gray-500 dark:!text-gray-200" : ""}`}
                            className={`w-fit !h-9 !px-3 mx-1 ${category.collectionName !== selectedCollection ? "!text-gray-500 dark:!text-gray-200 !bg-gray-200 dark:!bg-slate-800" : ""}`}
                            onPress={() => { setSelectedCollection(category.collectionName), setSelectedCategory(category.category?._id) }}
                        />
                    ))}
                </View>
                {/* Product List */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={["#3b82f6"]}
                            tintColor="#3b82f6"
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    className="flex-1 px-2 !pb-24">

                    <View style={{ paddingBottom: 130 }}>
                        {products.length ? products.map((product: any) => (
                            <View
                                key={product.id}
                                className="flex-row items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 mb-4"
                            >
                                <View className="w-20 h-20 bg-gray-800 rounded-lg mr-4 items-center justify-center">
                                    <Image
                                        source={{
                                            uri:
                                                product.image
                                        }}
                                        className="object-contain w-full h-full rounded-lg"
                                    />
                                </View>

                                <View className="flex-1">
                                    <Text className="text-gray-900 dark:text-gray-200 font-bold text-[18px] mb-1">
                                        {product.productName}
                                    </Text>


                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-[#8e8e92] dark:text-[#9e9ea1] font-bold text-lg">
                                            {formatPrice(product.price)}
                                        </Text>
                                        <View className="flex-row items-center mb-1">
                                            <Text className="text-gray-500 dark:text-gray-200 text-sm mr-2">
                                                Unit Sold :
                                            </Text>
                                            <Text className="text-gray-900 dark:text-gray-200  font-semibold text-sm">
                                                {product.sold || 0}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="flex-row justify-between items-center">
                                        <Text onPress={() => router.push({ pathname: "/business/home/product/new", params: { id: product.prodId } })} className="w-20 mt-1.5 px-2 py-1.5 bg-gray-200 dark:!bg-slate-900  dark:text-orange-600 text-blue-600 rounded-full">Quick Edit</Text>
                                        <View className="flex-row items-center mt-1">
                                            <Text className="text-gray-500 dark:text-gray-400 text-sm mr-2">
                                                Available
                                            </Text>
                                            <Switch
                                                value={product.status === 'available'}
                                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                                onValueChange={(value: boolean) => {
                                                    handleUpdate({ id: product.prodId, status: value ? 'available' : 'unavailable' }).then(() => { refetch() });
                                                }}
                                                className="mt-0.5"
                                                trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                                                thumbColor={true ? '#ffffff' : '#ffffff'}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )) : <NoRecord />}
                    </View>
                </ScrollView>
            </View>
        </StoreWrapper>
    );
}
