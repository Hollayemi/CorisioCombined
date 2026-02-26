import Slider from '@/components/slider';
import { shareStoreOwner } from '@/data/share';
import { useUserData } from '@/hooks/useData';
import { useAddToCartMutation } from '@/redux/user/slices/cartSlice';
import { useSaveItemMutation } from '@/redux/user/slices/saveItemSlice';
import { useGetStoreCategoriesQuery, useGetStoreInfoQuery, useGetStoreProductsQuery } from '@/redux/user/slices/storeSlice';
import { formatDate, reshapePrice, summarizeHours } from '@/utils/format';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Clock, Filter, Grid3X3, Heart, List, MapPin, Share, ShoppingCart, Star } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductSellerStore = () => {
    const { branchId, store }: any = useLocalSearchParams()
    const { cartedProds, savedProds, refetchCart, refetchSavedItems } = useUserData() as any;
    const { data } = useGetStoreInfoQuery({ branchId: branchId })
    const storeData = data?.data || {}
    const { data: cates, isLoading: cateLoading, refetch: refetchCates } = useGetStoreCategoriesQuery({ store })
    const storeCategories = cates?.data || []
    const { data: prods } = useGetStoreProductsQuery({ store })
    const storeProducts = prods?.data?.all || []
    console.log({ storeProducts })
    if (!branchId) router.back()
    const [viewMode, setViewMode] = useState('grid');
    const [isFollowing, setIsFollowing] = useState(false);
    const isDark = useColorScheme() === 'dark'

    const achievements = [
        { title: "Delivery Method", description: `${storeData.pickup ? "✅ Pickup" : "Pickup not allowed"} ${storeData.waybill?.isset ? ", ✅ Waybilling" : ""}`, icon: "🚚" },
        { title: "Quality Assured", description: "100% authentic products", icon: "✅" },
        { title: "Opening Hours", description: summarizeHours(storeData.opening_hours || {}), icon: "⏲️" },
    ];


    const ProductCard = ({ product, isGrid = true }: any) => {
        const [addCartHandler, { isLoading: carting }] = useAddToCartMutation()
        const [saveProduct, { isLoading: saving }] = useSaveItemMutation()


        const payload = {
            productId: product?._id,
            store: product?.store,
            branch: product?.branch,
        };

        return (
            <TouchableOpacity
                className={`${isGrid ? 'w-[48%]' : 'w-full flex-row'} bg-white dark:bg-slate-800 rounded-xl p-1.5 py-3 mb-3 shadow-[15px] border border-gray-100 dark:border-slate-700`}
            >
                <View className={`${isGrid ? '' : 'w-24 h-24 mr-3'}`}>
                    <Image
                        source={{ uri: product.images[0] }}
                        className={`${isGrid ? 'w-full h-32' : 'w-full h-full'} rounded-lg`}
                        resizeMode="cover"
                    />
                    {product.isNew && (
                        <View className="absolute top-2 left-2 bg-green-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-[12px] font-bold">NEW</Text>
                        </View>
                    )}
                    {product.isFeatured && (
                        <View className="absolute top-2 left-2 bg-purple-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-[12px] font-bold">FEATURED</Text>
                        </View>
                    )}

                    {product.discount > 0 && (
                        <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-[12px] font-bold">-{product.discount}%</Text>
                        </View>
                    )}

                    {isGrid && <TouchableOpacity onPress={() => saveProduct(payload).then(() => refetchSavedItems())} className="absolute bottom-2 right-2 w-8 h-8 bg-white dark:bg-gray-700  rounded-full items-center justify-center shadow-md">
                        <Heart size={16} color={savedProds.includes(product?._id) ? "red" : "#d1d5db"} />
                    </TouchableOpacity>}
                </View>

                <View className={`${isGrid ? 'mt-2' : 'flex-1'}`}>
                    <View className='flex-row justify-between'>
                        <Text className={`text-gray-900 dark:text-white font-semibold ${isGrid ? "!text-[15px]" : "!text-[18px] !w-48"}`} numberOfLines={1}>
                            {product.prodName}
                        </Text>
                        {!isGrid && <TouchableOpacity onPress={() => saveProduct(payload).then(() => refetchSavedItems())} className=" w-8 h-8 mx-1 absolute right-0 bg-white dark:bg-gray-700 rounded-full items-center justify-center shadow-md">
                            <Heart size={16} color="#ef4444" />
                        </TouchableOpacity>}
                    </View>

                    {<TouchableOpacity onPress={() => addCartHandler(payload).then(() => refetchCart())} className={`${isGrid ? "w-8 h-8 bottom-1" : " h-8 px-2 flex-row bottom-3"} mx-1 absolute right-0  bg-white dark:bg-gray-700 rounded-full items-center justify-center shadow-md`}>
                        <ShoppingCart size={16} color={cartedProds.includes(product?._id) ? "#f97316" : "#d1d5db"} />
                        {!isGrid && <Text className="text-gray-900 dark:text-white text-lg ml-1">
                            {cartedProds.includes(product?._id) ? " Remove from cart" : "Add to cart"}
                        </Text>}
                    </TouchableOpacity>}


                    {/* <View className="flex-row items-center mt-1">
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <Text className="text-gray-600 dark:text-gray-300 text-[12px] ml-1">
                        {product.rating} ({product.reviews})
                    </Text>
                </View> */}

                    <Text className="text-gray-900 dark:text-white text-lg">
                        {product.subCollectionName}
                    </Text>
                    <View className={`flex-row items-center ${isGrid ? 'mt-2' : 'mt-3'}`}>
                        <Text className="text-gray-900 dark:text-white font-bold text-lg">
                            {reshapePrice(product.prodPrice)}
                        </Text>
                        {product.originalPrice > product.price && (
                            <Text className="text-gray-500 dark:text-gray-300 text-[15px] line-through ml-2">
                                ${product.originalPrice}
                            </Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        )
    };
    const insets = useSafeAreaInsets()
    const iconColor = isDark ? "#eee" : "#555"
    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-900">
            <View className="flex-row items-center absolute top-0 left-0 w-full justify-between px-4 py-3 pt-14 z-50 bg-transparent">
                {/* Back Button */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full text-black dark:text-gray-50 bg-gray-100 dark:bg-slate-800 items-center justify-center"
                >
                    <ArrowLeft size={18} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => shareStoreOwner(storeData)}
                    className={`w-10 h-10  rounded-full bg-gray-100 dark:bg-slate-800 items-center justify-center
                        }`}
                >
                    <Share size={17} color={isDark ? "white" : "black"} />
                </TouchableOpacity>
            </View>
            <ScrollView refreshControl={<RefreshControl refreshing={cateLoading} onRefresh={refetchCates} />} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="man-h-64 shadow-lg shadow-black/15 dark:shadow-black/40 elevation-10">
                    <Slider itemsPerView={1} height={200} className="-mb-6">
                        {storeData?.gallery?.length > 1
                            ? storeData?.gallery.map((item: any, i: any) => (
                                <Image
                                    key={i}
                                    source={{ uri: item }}
                                    className="w-full h-full object-cover"
                                />
                            ))
                            : [<Image
                                key={0}
                                source={{ uri: storeData.profile_image }}
                                className="w-full h-full object-cover"
                            />]
                        }
                    </Slider>
                    <View className='absolute w-full h-full bg-slate-950 opacity-30 top-0' />
                </View>


                {/* Store Cover & Info */}
                <View className="bg-white dark:bg-slate-800 pt-2 mb-3">

                    <View className="px-4 pb-4">
                        <View className="flex-row items-start mt-[-30px] mb-4">
                            <Image
                                source={{ uri: storeData.profile_image }}
                                className="w-20 h-20 rounded-full border-4 border-white mr-4"
                            />
                            <View className="flex-1 mt-8">
                                <Text className="text-gray-900 dark:text-white text-xl font-bold">
                                    {storeData.businessName}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-300 text-[14px]">
                                    by {storeData.branchName}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsFollowing(!isFollowing)}
                                className={`px-4 py-2 rounded-full mt-8 ${isFollowing ? 'bg-gray-200' : 'bg-blue-500'}`}
                            >
                                <Text className={`font-semibold ${isFollowing ? 'text-gray-700' : 'text-white'}`}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row items-center mb-1">
                            <View className="flex-row items-center mr-6">
                                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                                <Text className="text-gray-900 dark:text-white font-bold ml-1">
                                    {storeData.rating || 0}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-300 ml-1">
                                    ({storeData.reviews} reviews)
                                </Text>
                            </View>
                            <Text className="text-gray-600 dark:text-gray-300 text-[15px]">
                                {storeData.followers?.toLocaleString() || 0} followers
                            </Text>
                        </View>

                        <View className="flex-row items-center mb-3">
                            <MapPin size={14} color={iconColor} />
                            <Text className="text-gray-600 dark:text-gray-300 text-[15px] ml-1 mr-4">
                                {storeData.address}
                            </Text>
                            <Clock size={14} color={iconColor} />
                            <Text className="text-gray-600 dark:text-gray-300 text-[15px] ml-1">
                                {formatDate(storeData.createdAt)}
                            </Text>
                        </View>

                        {storeData.about_store && <Text className="text-gray-700 dark:text-gray-300 text-[14px] leading-7">
                            {storeData.about_store}
                        </Text>}
                    </View>
                </View>

                {/* Achievements */}
                <View className="bg-white dark:bg-slate-800 mx-4 rounded-xl p-4 mb-3">
                    <Text className="text-gray-900 dark:text-white font-bold text-lg mb-3">
                        Policies
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {achievements.map((achievement, index) => (
                            <View key={index} className="mb-6">
                                <View className="flex-row items-center mb-1">
                                    <Text className="text-lg mr-2">{achievement.icon}</Text>
                                    <Text className="text-gray-900 dark:text-white font-semibold text-[15px]">
                                        {achievement.title}
                                    </Text>
                                </View>
                                <Text className="text-gray-600 leading-7 dark:text-gray-300 text-[14px]">
                                    {achievement.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Categories */}
                <View className="bg-white dark:bg-slate-800 mx-4 rounded-xl p-4 mb-3">
                    <Text className="text-gray-900 dark:text-white font-bold text-lg mb-3">
                        Categories
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {storeCategories.map((category: any, index: number) => (
                            <TouchableOpacity
                                key={index}
                                className="mr-3 w-32 px-2 py-3 flex items-center rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700"
                            >
                                <Image
                                    source={{ uri: category.icon }}
                                    className="w-16 h-16 rounded-full border-4 border-white place-items-center"
                                />
                                <Text numberOfLines={1} className="text-gray-900 dark:text-white font-semibold text-[15px] text-center">
                                    {category.label}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-300 text-[12px] text-center">
                                    {category.products} items
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Products Section */}
                <View className="bg-white dark:bg-slate-800 mx-4 rounded-xl p-4 mb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-900 dark:text-white font-bold text-lg">
                            Products ({storeProducts.length})
                        </Text>
                        <View className="flex-row items-center space-x-2">
                            <TouchableOpacity
                                onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700"
                            >
                                {viewMode === 'grid' ?
                                    <List size={16} color={iconColor} /> :
                                    <Grid3X3 size={16} color={iconColor} />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity className="p-2 ml-2 rounded-lg bg-gray-100 dark:bg-slate-700">
                                <Filter size={16} color={iconColor} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className={`${viewMode === 'grid' ? 'flex-row flex-wrap justify-between' : ''}`}>
                        {storeProducts.map((product: any) => (
                            <ProductCard key={product.id} product={product} isGrid={viewMode === 'grid'} />
                        ))}
                    </View>

                    {/* <TouchableOpacity className="mt-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 items-center">
                        <Text className="text-gray-600 dark:text-gray-300 font-semibold">
                            View All Products ({products.length + 24} more)
                        </Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>
            <StatusBar style='light' />
            <View style={{ height: insets.bottom }} className="bg-white dark:!bg-gray-900" />
        </View>
    );
};

export default ProductSellerStore;