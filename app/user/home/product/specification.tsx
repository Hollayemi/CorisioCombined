import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { Text, useColorScheme, View } from 'react-native';
import { sampleSpecs } from './data';
const Tab = createMaterialTopTabNavigator();

const ProductSpecifications = (prop: any) => {
    console.log({prop})
    const {
        navigation,
        route: { params: specifications },
    } = prop;
    
    if (!specifications) {
        return null;
    }

    const { sizes = [], variations = {} } = specifications.data;


    const formatKey = (key: string) => {
        return key.replace(/_/g, ' ');
    };

    return (
        <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-xl font-bold text-gray-900 mb-4">
                Specifications
            </Text>

            {/* Sizes Section */}
            {sizes.length > 0 && (
                <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-800 mb-2">
                        Available Sizes
                    </Text>
                    <View className="flex-row flex-wrap gap-4">
                        {sizes.map((item: any, index: number) => (
                            <View key={index} className="mb-2">
                                <View className="bg-gray-100 px-3 py-2 rounded-md border border-gray-300">
                                    <Text className="text-sm font-medium text-gray-700 text-center">
                                        {item.size}
                                    </Text>
                                </View>

                                <View>
                                    <Text></Text>
                                </View>
                                
                                {/* Display colors if available for this size */}
                                {item.colors && item.colors.length > 0 && (
                                    <View className="flex-row flex-wrap gap-1 mt-1">
                                        {item.colors.map((color: any, colorIndex: number) => (
                                            <View
                                                key={colorIndex}
                                                className="bg-blue-100 px-2 py-1 rounded"
                                            >
                                                <Text className="text-xs text-blue-800">{color}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {/* Variations Section */}
            {Object.keys(variations).length > 0 && (
                <View>
                    <Text className="text-base font-semibold text-gray-800 mb-2">
                        Product Details
                    </Text>
                    <View className="bg-gray-50 rounded-md p-3">
                        {Object.entries(variations).map(([key, value], index) => (
                            <View
                                key={key}
                                className={`flex-row justify-between py-2 ${index !== Object.keys(variations).length - 1
                                    ? 'border-b border-gray-200'
                                    : ''
                                    }`}
                            >
                                <Text className="text-sm text-gray-600 flex-1">
                                    {formatKey(key)}
                                </Text>
                                <Text className="text-sm font-medium text-gray-900 flex-1 text-right">
                                    {String(value)}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};


export default function AboutProduct() {
    const isDark = useColorScheme() === "dark"
    return (
        <View className="flex-1 bg-gray-100">
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: "transparent",
                        marginBottom: 1,
                        width: "50%",
                        marginLeft: 4,
                        borderBottomWidth: 3,
                        borderBottomColor: isDark ? "#eee" : "#2A347E",
                    },
                    tabBarActiveTintColor: isDark ? "#FDB415" : "#2A347E",
                    tabBarInactiveTintColor: isDark ? "#eee" : "#000",
                    tabBarLabelStyle: {
                        fontSize: 16,
                        fontWeight: "400",
                        textTransform: "capitalize",
                    },
                    tabBarStyle: {
                        elevation: 0,
                        // marginBottom: "5%",
                        overflow: "hidden",
                        backgroundColor: isDark ? "#020617" : "white",
                    },
                    tabBarIndicatorContainerStyle: {
                        backgroundColor: isDark ? "#020617" : "white",
                    },
                }}
                style={{ flex: 1, backgroundColor: "white" }}
            >
                <Tab.Screen
                    name="Discover Stores"
                    component={ProductSpecifications}
                    initialParams={{ data: sampleSpecs }}
                />
                {/* <Tab.Screen
                    name="Stores"
                    component={ProductSpecifications}
                    initialParams={{ data: sampleSpecs }}
                    key={`ongoing-`}
                /> */}
            </Tab.Navigator>

            <Text className="text-2xl font-bold text-gray-900 mb-4">
                Product Information
            </Text>
            <ProductSpecifications specifications={sampleSpecs} />

        </View>
    );
}