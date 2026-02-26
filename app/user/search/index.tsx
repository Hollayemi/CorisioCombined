import BigCard from "@/components/product/BigCard";
import HomeWrapper from "@/components/wrapper/user";
import useGeolocation from "@/hooks/useGeolocation";
import { useGetAllProductsQuery } from "@/redux/user/slices/homeSlice";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function SearchResult() {
    const { title }: any = useLocalSearchParams();
    const { coordinates } = useGeolocation()
    const [filterBy, editFilter] = useState({
        search: title,
        category: "",
        price: "",
        star: "",
        location: "",
        size: "",
        discount: "",
        lat: coordinates.latitude,
        lng: coordinates.longitude,
        shipping_method: "",
    });
    const {
        data: prods,
        isLoading,
        status: prodsStatus,
    } = useGetAllProductsQuery(filterBy)
    const result = prods ? prods?.data || {} : {};
    const { result: products } = result;

    const toRemove = ["₦", "star", "stars", ","];
    return (
        <HomeWrapper active="home" headerTitle={title || "Search"}>
            <ScrollView style={{ paddingHorizontal: "2%" }}>
                <View
                    style={{
                        justifyContent: "space-between",
                        flexDirection: "row",
                        paddingBottom: 20,
                        flexWrap: "wrap",
                    }}
                >
                    {isLoading ? (
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                marginTop: "70%"
                            }}
                        >
                            {/* {isset ? <Loader /> : <Loader />} */}
                            <Text style={{ marginVertical: 10 }}>
                                {prodsStatus}
                            </Text>
                        </View>
                    ) : (
                        products?.map((item: any, index: any) => (
                            <BigCard
                                {...item}
                                index={index}
                                key={index}
                                noMargin
                                big
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </HomeWrapper>
    );
}
