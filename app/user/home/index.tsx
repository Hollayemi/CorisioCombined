import { SearchBox } from "@/components/form/SearchBox";
import LoaderGif from "@/components/loader/loaderGIF";
import PopularAd from "@/components/product/Ads";
import CategoryCard from "@/components/product/CategoryCard";
import ProductCard from "@/components/product/ProductCard";
import HomeWrapper from "@/components/wrapper/user";
import useGeolocation from "@/hooks/useGeolocation";
import { useGetAllCategoriesQuery, useGetAllProductsQuery, useGetPopularProductsQuery } from "@/redux/user/slices/homeSlice";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { ads } from "./data";
import ProductFetcher from "@/components/product/Fetcher";

export default function Home({ navigation }: any) {
    const { coordinates, error } = useGeolocation()
    const { data: rawCategories, isLoading: categoriesLoading, } = useGetAllCategoriesQuery()
    const { data: rawProducts, isLoading: fetchingProduct, refetch: refetchProduct } = useGetAllProductsQuery({
        lat: coordinates.latitude,
        lng: coordinates.longitude
    })
    const { data: rawPopular, refetch: refetchPopularProduct } = useGetPopularProductsQuery({
        lat: coordinates.latitude,
        lng: coordinates.longitude
    })
    const [search, setSearch] = useState("");
    const AllProducts = rawProducts?.data?.result || []
    const AllPopular = rawPopular?.data || []
    // console.log(fetchingProduct)
    // if (AllProducts.length === 0 || AllPopular.length === 0  || fetchingProduct) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <LoaderGif />
    //         </View>
    //     );
    // }
    return (
        <HomeWrapper headerType="home" hasFooter>
            <View className="py-1 pb-2 bg-white dark:bg-slate-950 px-3 ">
                <SearchBox
                    placeholder="What are you looking for?"
                    value={search}
                    onWhite
                    onChange={(e: any) => setSearch(e)}
                    onPress={() =>
                        router.push("/user/search/searchScreen")
                    }
                />
            </View>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={fetchingProduct}
                        onRefresh={refetchProduct}

                    />
                }
                className="flex-1 bg-white dark:bg-slate-950 px-2"
                ListHeaderComponent={
                    <View className="">
                        {fetchingProduct && (
                            // <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                            <LoaderGif />
                        )}
                        <Image
                            source={require("@/assets/images/productOff.png")}
                            className="w-full my-2 rounded-lg"
                        />
                        <View className="flex-row items-center justify-between mt-4">
                            <Text className="text-black dark:text-white text-lg m-2 font-bold font-poppins600">
                                Categories
                            </Text>

                            <Text onPress={() => router.push("/user/home/category")} className="text-blue-800 dark:text-white text-sm m-2 font-bold font-poppins600">
                                See All
                            </Text>
                        </View>
                        <FlatList
                            className="mb-1.5 flex-1"
                            horizontal
                            data={rawCategories?.data || []}
                            renderItem={({ item, index }: any) => (
                                <CategoryCard {...item} key={index} />
                            )}
                            keyExtractor={(item: any) => item.id}
                        />
                        {/* <Text className="text-black dark:text-white text-lg m-2 font-bold font-poppins600">
                            Flash Sales
                        </Text>
                        <FlatList
                            className="mb-0 flex-1"
                            horizontal
                            data={product.filter(
                                (item) => item.type === "flash"
                            )}
                            renderItem={({ item }: any) => (
                                <ProductCard {...item} />
                            )}
                            keyExtractor={(item: any) => item.id}
                        /> */}

                         
                                       
                        <Text className="text-black dark:text-white text-lg m-2 font-bold font-poppins600">
                            Popular Ads
                        </Text>
                        <FlatList
                            className="mb-5 flex-1"
                            horizontal
                            data={ads}
                            keyExtractor={(item: any) => item._id}
                            renderItem={({ item, index }: any) => (
                                <PopularAd {...item} key={index} />
                            )}
                        />
                        <ProductFetcher type="popular" title="Popular Products" />

                        <Text className="text-black dark:text-white text-lg m-2 font-bold font-poppins600">
                            Products
                        </Text>
                    </View>
                }
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
                numColumns={3}
                data={AllProducts}
                renderItem={({ item, index }: any) => (
                    <View style={{ flex: 1, maxWidth: '33%', padding: 5 }} key={index}>
                        <ProductCard
                            {...item}
                            index={index}
                            noMargin
                            navigation={navigation}
                        />
                    </View>
                )}
                keyExtractor={(item: any) => item._id}
            />
        </HomeWrapper>
    );
}