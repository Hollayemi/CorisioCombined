import useGeolocation from "@/hooks/useGeolocation";
import {
    useGetPopularProductsQuery,
    useGetSimilarProductQuery,
} from "@/redux/user/slices/homeSlice";
import React from "react";
import { FlatList, Text, View } from "react-native";
import BigCard from "./BigCard";
import ProductCard from "./ProductCard";

// Map the fetch type to its corresponding RTK Query hook
const productQueries = {
    popular: useGetPopularProductsQuery,
    similar: useGetSimilarProductQuery,
};

type ProductQueryType = keyof typeof productQueries;

interface FetchType {
    title: string;
    type: ProductQueryType;
    size?: "big" | "small";
    param?: Record<string, any>;

}
function ProductFetcher({ title, type, param, size = "small" }: FetchType) {
    const { coordinates } = useGeolocation();

    const query = {
        lat: coordinates?.latitude,
        lng: coordinates?.longitude,
        ...param,
    };

    const productLoader = productQueries[type];

    const { data, refetch, isLoading, error } = productLoader(query);

    const products = data?.data || []
    React.useEffect(() => {
        if (coordinates?.latitude && coordinates?.longitude) refetch();
    }, [coordinates]);

    const ProductComponent = size === "big" ? BigCard : ProductCard

    return (
        <View>
            <>
                <Text className="text-black dark:text-white text-lg m-2 font-bold font-poppins600">
                    {title}
                </Text>
                <FlatList
                    className="mb-5 flex-1"
                    horizontal
                    data={products}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }: any) => (
                        <ProductComponent {...item.product} branchId={item?.distance?.branchId} key={index} />
                    )}
                    keyExtractor={(item: any) => item?.product?._id}
                />
            </>
        </View>
    );
}

export default ProductFetcher