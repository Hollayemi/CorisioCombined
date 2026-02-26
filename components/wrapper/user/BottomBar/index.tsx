import { router, usePathname } from 'expo-router';
import {
    Home,
    Inbox,
    ShoppingCart,
    User,
    WalletCards
} from 'lucide-react-native';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme.web';
import type { Route } from 'expo-router';

interface NavItem {
    name: string;
    icon: React.ComponentType<any>;
    path: Route;
    badge?: number;
}

const navItems: NavItem[] = [
    { name: 'Home', icon: Home, path: '/user/home' },
      { name: 'Earnings', icon: WalletCards, path: '/user/earn'},
    { name: 'Cart', icon: ShoppingCart, path: '/user/cart' },
    { name: 'Inbox', icon: Inbox, path: '/user/chat', badge: 3 },
    { name: 'Profile', icon: User, path: '/user/profile' },
];

export default function BottomNavigation({ active }: { active: string }) {
    const pathname = usePathname();

    const handleNavPress = (path: Route) => {
        router.push(path);
    };
    const isDark = useColorScheme() === "dark"
    return (
        <View className={`bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-slate-800 px-4 py-2 ${
                                Platform.OS === "android" ? `pb-[30px]` : ""
                            }`}>
            <View className="flex-row justify-between items-center">
                {navItems.map((item) => {
                    const isActive = pathname === item.path || item.name.toLowerCase() === active?.toLowerCase();
                    const IconComponent = item.icon;

                    return (
                        <TouchableOpacity
                            key={item.name}
                            onPress={() => handleNavPress(item.path)}
                            className="flex-1 items-center py-2"
                        >
                            <View className="relative">
                                <IconComponent
                                    size={24}
                                    color={isActive ? isDark ? "#FDB415" : '#2A347E' : '#9CA3AF'}
                                    strokeWidth={isActive ? 2 : 1.5}
                                />

                                {/* Badge for notifications */}
                                {item.badge && (
                                    <View className="absolute -top-2 -right-2 bg-red-500 rounded-full min-w-5 h-5 items-center justify-center">
                                        <Text className="text-white text-xs font-medium">
                                            {item.badge}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Label and dot - only show when active */}
                            <View className="items-center mt-1">
                                <Text className={`${isActive ? "text-[#2A347E] dark:text-[#FDB415]" : "text-gray-500 dark:text-gray-200"} text-sm font-bold`}>
                                    {item.name}
                                </Text>
                            </View>

                            <View className={`w-1.5 h-1.5 ${isActive && "bg-[#2A347E] dark:bg-[#FDB415]"} rounded-full mt-1`} />

                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}