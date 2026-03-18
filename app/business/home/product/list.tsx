// app/business/home/product/index.tsx
import NoRecord from "@/components/noRecord";
import StoreWrapper from "@/components/wrapper/business";
import {
    useGetStoreProductsQuery,
    useUpdateProductStatusMutation,
} from "@/redux/business/slices/productSlice";
import { formatPrice } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UploadIcon } from "lucide-react-native";
import React, { useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Product = {
    id: string;
    prodId?: string;
    label: string;
    description?: string;
    price: number;
    currency: string;
    inStock: boolean;
    availability: "in_stock" | "out_of_stock" | "limited";
    totalInStock: number;
    condition: "new" | "used" | "refurbished";
    images: string[];
    isActive: boolean;
    viewCount: number;
    sold?: number;
    createdAt: string;
    category?: { displayName: string; id: string };
    subcategory?: { displayName: string; id: string };
    specifications?: Record<string, any>;
};

const CONDITION_LABELS: Record<string, string> = {
    new: "New",
    used: "Used",
    refurbished: "Refurb",
};

export default function ProductPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data, isLoading, refetch } = useGetStoreProductsQuery({});
    const [handleUpdate, { isLoading: updating }] = useUpdateProductStatusMutation();

    const products: Product[] = data?.data?.products ?? [];
    const pagination = data?.data?.pagination;

    const filtered = products.filter((p) =>
        !searchQuery ||
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StoreWrapper
            headerTitle={`Products (${pagination?.total ?? products.length})`}
            // dropdownItems={[
            //     { label: "Add New Product", value: "new", action: () => router.push("/business/home/product/new") },
            //     { label: "Product Categories", value: "categories" },
            //     { label: "Adjust Categories", value: "adjust", action: () => router.push("/business/home/product/categories/adjust") },
            //     { label: "Help", value: "help" },
            // ]}
        >
            <View className="flex-1 bg-gray-50 dark:bg-gray-950">
                {/* Top summary bar */}
                <View className="bg-white dark:bg-gray-900 px-4 pt-4 pb-5 border-b border-gray-100 dark:border-gray-800">


                    {/* Search */}
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5">
                        <Ionicons name="search-outline" size={17} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search products or categories..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 ml-2.5 text-sm text-gray-800 dark:text-gray-100"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Ionicons name="close-circle" size={17} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* List */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={["#3730a3"]}
                            tintColor="#3730a3"
                            refreshing={isLoading}
                            onRefresh={refetch}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                >
                    {filtered.length > 0
                        ? filtered.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                updating={updating}
                                onToggle={(id, val) =>
                                    handleUpdate({ id, availability: val ? "in_stock" : "out_of_stock" })
                                        .unwrap()
                                        .then(() => refetch())
                                }
                            />
                        ))
                        : <NoRecord />
                    }
                </ScrollView>


                <View className="flex-row self-center absolute border rounded-full bottom-0  mb-4">
                    <TouchableOpacity
                        onPress={() => router.push("/business/home/product/new")}
                        className="flex-row items-center bg-indigo-800 dark:bg-orange-500 rounded-2xl px-5 py-3"
                    >
                        <UploadIcon className={`text-white`} />
                        {/* <Text className=" text-[2C337C] dark:text-white font-bold text-sm ml-1">New Product</Text> */}
                    </TouchableOpacity>
                </View>
            </View>
        </StoreWrapper>
    );
}

// ─── Availability Badge ────────────────────────────────────────────────────────

function AvailabilityBadge({ availability }: { availability: string }) {
    if (availability === "in_stock") {
        return (
            <View className="flex-row items-center bg-green-100 dark:bg-green-950 rounded-full px-2.5 py-1">
                <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                <Text className="text-green-700 dark:text-green-400 text-xs font-semibold">In Stock</Text>
            </View>
        );
    }
    if (availability === "limited") {
        return (
            <View className="flex-row items-center bg-amber-100 dark:bg-amber-950 rounded-full px-2.5 py-1">
                <View className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                <Text className="text-amber-700 dark:text-amber-400 text-xs font-semibold">Limited</Text>
            </View>
        );
    }
    return (
        <View className="flex-row items-center bg-red-100 dark:bg-red-950 rounded-full px-2.5 py-1">
            <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
            <Text className="text-red-700 dark:text-red-400 text-xs font-semibold">Out of Stock</Text>
        </View>
    );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
    product,
    updating,
    onToggle,
}: {
    product: Product;
    updating: boolean;
    onToggle: (id: string, active: boolean) => void;
}) {
    const specs = product.specifications
        ? Object.entries(product.specifications)
            .filter(([, v]) => v && !Array.isArray(v))
            .slice(0, 2)
        : [];

    return (
        <View className="bg-white dark:bg-gray-900 rounded-3xl mb-4 border border-gray-200 dark:border-gray-800 overflow-hidden">

            {/* Main row */}
            <View className="flex-row p-3.5">
                {/* Image + condition badge */}
                <View className="mr-3.5 p-2">
                    <Image
                        source={{ uri: product.images?.[0] || "https://via.placeholder.com/150" }}
                        className="w-28 h-28 rounded-2xl bg-gray-100 dark:bg-gray-800"
                        resizeMode="cover"
                    />
                    <View className="absolute bottom-6 left-3 bg-gray-900 dark:bg-gray-700 rounded-lg px-2 py-0.5">
                        <Text className="text-white text-xs font-bold">
                            {CONDITION_LABELS[product.condition] ?? product.condition}
                        </Text>
                    </View>
                </View>

                {/* Info */}
                <View className="flex-1 p-2">
                    {/* Category breadcrumb */}
                    {product.category && (
                        <View className="flex-row flex-wrap items-center mb-1">
                            <Text className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                                {product.category.displayName}
                            </Text>
                            {product.subcategory && (
                                <Text className="text-xs text-gray-400 dark:text-gray-600">
                                    {" · "}{product.subcategory.displayName}
                                </Text>
                            )}
                        </View>
                    )}

                    {/* Name */}
                    <Text numberOfLines={2} className="text-base font-bold text-gray-900 dark:text-white leading-snug mb-1.5">
                        {product.label}
                    </Text>

                    {/* Price */}
                    <Text className="text-lg font-extrabold text-indigo-800 dark:text-green-400 mb-2">
                        {formatPrice(product.price)}
                        <Text className="text-xs font-normal text-gray-400"> {product.currency}</Text>
                    </Text>

                    {/* Spec pills */}
                    {specs.length > 0 && (
                        <View className="flex-row flex-wrap gap-1 mb-2">
                            {specs.map(([k, v]) => (
                                <View key={k} className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-0.5">
                                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                                        <Text className="font-semibold text-gray-700 dark:text-gray-300">{k} </Text>
                                        {String(v)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Availability + units */}
                    <View className="flex-row justify-between items-center gap-2">
                        <Text className="text-xs text-gray-400 dark:text-gray-500">
                            {product.totalInStock} unit{product.totalInStock !== 1 ? "s" : ""}
                        </Text>
                        <AvailabilityBadge availability={product.availability} />
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2.5 border-t border-gray-100 dark:border-gray-700">
                <View className="flex-row items-center">
                    <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
                    <Text className="text-xs text-gray-400 dark:text-gray-500 ml-1">
                        {product.viewCount ?? 0} views
                    </Text>
                </View>

                <View className="flex-row items-center">
                    {/* Live toggle */}
                    <View className="flex-row items-center mr-3">
                        <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-1.5">
                            {product.availability ? "Available" : "Off"}
                        </Text>
                        <Switch
                            value={product.availability === "in_stock"}
                            disabled={updating}
                            onValueChange={(val) => onToggle(product.id ?? product.id, val)}
                            style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                            trackColor={{ false: "#d1d5db", true: "#3730a3" }}
                            thumbColor="#ffffff"
                        />
                    </View>

                    {/* Edit button */}
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: "/business/home/product/new",
                                params: { id: product.prodId ?? product.id },
                            })
                        }
                        className="flex-row items-center bg-indigo-50 dark:bg-indigo-950 rounded-xl px-3 py-1.5"
                    >
                        <Ionicons name="create-outline" size={13} color="#3730a3" />
                        <Text className="ml-1 text-xs font-bold text-indigo-800 dark:text-indigo-400">Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}