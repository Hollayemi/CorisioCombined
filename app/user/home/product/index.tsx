import {
    AntDesign,
    Ionicons,
    MaterialIcons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useDispatch } from "react-redux";

import Button from "@/components/form/Button";
import ProductFetcher from "@/components/product/Fetcher";
import Rating from "@/components/rating";
import Slider from "@/components/slider";
import ProductViewHeader from "@/components/wrapper/user/headers/productViewHeader";
import { shareProduct } from "@/data/share";
import { useUserData } from "@/hooks/useData";
import { useAddToCartMutation } from "@/redux/user/slices/cartSlice";
import { useSaveItemMutation } from "@/redux/user/slices/saveItemSlice";
import { useGetStoreInfoQuery } from "@/redux/user/slices/storeSlice";
import { useSetViewMutation } from "@/redux/user/slices/viewSlice";
import { reshapePrice } from "@/utils/format";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color, size } from "./data";
import AboutProduct from "./specification";

type prop = {
    navigation: any;
    product: object | null;
};

export default function Product() {
    const [addToCart, { isLoading }] = useAddToCartMutation()
    const insets = useSafeAreaInsets();
    const [saveItem, { isLoading: saving }] = useSaveItemMutation()
    const { product: rawProduct }: any = useLocalSearchParams()
    const [viewProduct] = useSetViewMutation()
    const product = JSON.parse(rawProduct)
    const { data: getStore, isLoading: storeLoading } = useGetStoreInfoQuery({ branchId: product?.branchId })
    const dispatch = useDispatch();
    const [showingImage, showImage] = useState(
        product?.images ? product?.images[0] : ""
    );
    const { cartedProds, savedProds, socket, following, refetchCart, refetchSavedItems }: any = useUserData() as any;
    const storeInfo = getStore?.data || {};
    const isFollowing = following?.includes(storeInfo.branchId);
    const [selectedSizes, selectSize] = useState([]);
    const [selectedColors, selectColor] = useState([]);
    const payload = {
        productId: product?._id,
        variation: {
            size: selectedSizes,
            color: selectedColors,
        },
        store: product?.store,
        branch: product?.branch,
    };

    console.log(product)

    useEffect(() => {
        viewProduct(
            {
                productId: product?._id,
                branchId: product?.branchId,
                store: product?.store,
                branch: product?.branch,
            })
    }, [getStore]);

    const productIsAddedToCart = cartedProds?.includes(product?._id)
    const productIsSaved = savedProds?.includes(product?._id)

    return (
        <View className="flex-1">
            <ProductViewHeader status={{ inCart: productIsAddedToCart, isSaved: productIsSaved }} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 bg-gray-100 dark:bg-slate-950 pb-20"
            >
                {/* Product Image Slider */}
                <View className="man-h-64 shadow-lg shadow-black/15 dark:shadow-black/40 elevation-10">
                    <Slider itemsPerView={1} height={350} className="-mb-6">
                        {/* <Image
                            source={{ uri: showingImage }}
                            className="w-full h-[350px] object-cover"
                        /> */}
                        {product?.images?.length > 1
                            ? product.images.map((item: any, i: any) => (

                                <Image
                                    source={{ uri: item }}
                                    className="w-full h-full object-cover"
                                />

                            ))
                            : null}
                    </Slider>
                </View>

                {/* Thumbnail Images */}
                <View className="flex-row flex-wrap justify-center hidden">
                    <Slider itemsPerView={5} height={70} className="-mb-6">
                        {product?.images?.length > 1
                            ? product.images.map((item: any, i: any) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => showImage(item)}
                                >
                                    <Image
                                        source={{ uri: item }}
                                        className="w-16 h-16 rounded-md mx-2"
                                    />
                                </TouchableOpacity>
                            ))
                            : null}
                    </Slider>
                </View>

                {/* Product Info */}
                <View className="mx-4 pb-5">
                    <Text className="text-2xl font-semibold mt-10 dark:text-white">
                        {product.prodName}
                    </Text>

                    <View className="flex-row justify-between items-center mt-2.5">
                        <View className="flex-row items-center flex-[0.7]">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                                {reshapePrice(product.prodPrice)}
                            </Text>
                            {product.discount && (
                                <Text className="text-blue-700 text-xs font-normal ml-5 dark:text-blue-400">
                                    Save {product.discount}% {"\n"} With tax inclusive.
                                </Text>
                            )}
                        </View>
                        <View className="flex-row flex-[0.2] justify-between">
                            <TouchableOpacity onPress={() => shareProduct(product, storeInfo)}>
                                <AntDesign
                                    name="share-alt"
                                    size={24}
                                    className="dark:!text-white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => saveItem(payload).unwrap().then(() => refetchSavedItems())}>
                                <MaterialIcons
                                    name="favorite-outline"
                                    size={24}
                                    className={`${productIsSaved ? "!text-red-500" : "dark:!text-white"}`}
                                // onPress={() => saveProduct(payload, dispatch)}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Sizes */}
                    <Text className="text-lg font-semibold mt-5 dark:text-white">
                        Available sizes
                    </Text>
                    <View className="flex-row mt-2.5">
                        {size.map((text, index) => (
                            <Text
                                key={index}
                                className="text-gray-500 text-sm font-medium rounded bg-gray-200 px-3 py-2 mr-2.5 dark:bg-slate-800 dark:text-gray-300"
                            >
                                {text.toLocaleUpperCase()}
                            </Text>
                        ))}
                    </View>

                    {/* Colors */}
                    <Text className="text-lg font-semibold mt-6 dark:text-white">
                        Select Color
                    </Text>
                    <View className="flex-row mt-2.5">
                        {color.map((text, index) => (
                            <View
                                key={index}
                                className="h-6 w-6 px-3 py-2 mr-2.5 rounded-full"
                                style={{ backgroundColor: text }}
                            />
                        ))}
                    </View>

                    <AboutProduct />
                    {/* Description */}
                    <Text className="text-lg font-semibold mt-6 dark:text-white">
                        Description
                    </Text>
                    <Text className="text-gray-800 text-[14px] text-justify font-normal mt-1 leading-7 dark:text-gray-300">
                        {product.prodInfo}
                    </Text>

                    {/* Store Info */}
                    <View className="bg-gray-200 p-2.5 my-5 rounded-lg dark:bg-slate-900">
                        <View className="flex-row justify-between items-center mt-2.5">
                            <View className="flex-row">
                                <View>
                                    <Text onPress={() => router.push({ pathname: "/user/store", params: { branchId: storeInfo.branchId, store: storeInfo.store } })} className="text-indigo-900 text-xl font-bold dark:text-indigo-300">
                                        {storeInfo.businessName}
                                    </Text>
                                    <View className="flex-row items-center ">
                                        <Text className="font-semibold text-yellow-700 text-sm dark:text-yellow-400">
                                            @{storeInfo.branchName}
                                        </Text>
                                        <Text className="font-semibold text-gray-600 text-sm !ml-2.5 dark:text-gray-300">
                                            103{storeInfo.followers} Followers
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    className="border border-gray-500 rounded-xl h-7 py-1 px-3.5 ml-2.5"
                                    onPress={() => { }
                                        // followStore(
                                        //     storeInfo,
                                        //     dispatch,
                                        //     socket,
                                        //     isFollowing
                                        // )
                                        // }
                                    }>
                                    <Text className="text-black text-sm dark:text-white">
                                        {isFollowing ? "Following" : "Follow"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Ionicons
                                name="chatbubbles"
                                size={26}
                                onPress={() => router.push({
                                    pathname: "/user/chat/userChat", params: {
                                        chatId: null,
                                        branchId: storeInfo.branchId,
                                        name: storeInfo.businessName,
                                        image: storeInfo.profile_image,
                                    }
                                })}
                                color="#2A347E"
                                className="dark:!text-indigo-300"
                            />
                        </View>


                        <TouchableOpacity onPress={() => router.push({ pathname: "/user/map/storeView", params: { paramData: JSON.stringify({ storeCoordinates: product?.coordinates }) } })} className="flex-row mt-3">
                            <SimpleLineIcons
                                name="location-pin"
                                size={14}
                                color="#505050"
                                className="dark:text-gray-300"
                            />
                            <Text className="text-gray-600 text-sm leading-5 ml-2.5 dark:text-gray-300">
                                {storeInfo.address}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push({ pathname: "/user/map/storeView", params: { paramData: JSON.stringify({ storeCoordinates: product?.coordinates }) } })}>
                            <Text className="text-indigo-900 text-sm mt-1  font-semibold underline dark:text-indigo-300">
                                Show and track on Map{" "}
                                <Ionicons name="open-outline" size={12} />
                            </Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-between mt-4">
                            <Text className="text-black text-base font-semibold dark:text-white mt-1">
                                Store Review (
                                {storeInfo.feedback
                                    ? storeInfo.feedback.totalReviews
                                    : 0}
                                )
                            </Text>
                            <Rating
                                rate={
                                    storeInfo.feedback
                                        ? storeInfo.feedback?.averageRating?.toFixed()
                                        : 0
                                }
                            />
                        </View>
                    </View>
                </View>

                <ProductFetcher type="similar" title="Similar Products" param={{ category: product.categoryId || product.category }} />

            </ScrollView>
            {/* Add to Cart Button */}
            <View className="bg-white relative h-20 dark:bg-slate-900 border-t-slate-300  dark:border-t-slate-800 border-t ">
                <View className="bottom-0 w-full border-t-gray-300 flex-row items-center px-3 justify-evenly mt-4">
                    <Button
                        onPress={async () => addToCart(payload).then(() => refetchCart())}
                        className="w-5/12 !py-4 mb-4"
                        textSize={16}
                        size="medium"
                        isLoading={isLoading}
                        title={productIsAddedToCart ? "Remove" : "Add to cart"}
                    />
                    <Button
                        onPress={() => { }}
                        className="w-5/12 !py-4 mb-4"
                        textSize={16}
                        size="medium"
                        title="Buy Now"
                    />
                </View>
            </View>
            <View style={{ height: insets.bottom }} className="bg-white dark:!bg-gray-900" />
        </View>
    );
}