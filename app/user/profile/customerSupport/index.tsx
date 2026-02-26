import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Linking } from 'react-native';
import { Search, MessageCircle, Phone, Mail, Clock, ChevronRight, Star, User, Shield, Truck, CreditCard, RotateCcw, X, Send, Bot, Headphones } from 'lucide-react-native';

export default function CustomerSupport() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [chatVisible, setChatVisible] = useState(false);
    const [chatMessage, setChatMessage] = useState('');

    const supportCategories = [
        {
            id: 1,
            title: 'Orders & Delivery',
            icon: Truck,
            description: 'Track orders, delivery issues, shipping info',
            color: 'bg-blue-500',
            darkColor: 'dark:bg-blue-600'
        },
        {
            id: 2,
            title: 'Payment & Billing',
            icon: CreditCard,
            description: 'Payment methods, billing questions, refunds',
            color: 'bg-green-500',
            darkColor: 'dark:bg-green-600'
        },
        {
            id: 3,
            title: 'Returns & Exchanges',
            icon: RotateCcw,
            description: 'Return policy, exchange process, refunds',
            color: 'bg-purple-500',
            darkColor: 'dark:bg-purple-600'
        },
        {
            id: 4,
            title: 'Account & Security',
            icon: Shield,
            description: 'Account issues, password reset, security',
            color: 'bg-orange-500',
            darkColor: 'dark:bg-orange-600'
        }
    ];

    const quickActions = [
        { id: 1, title: 'Track Order', icon: Truck, action: () => { } },
        { id: 2, title: 'Live Chat', icon: MessageCircle, action: () => setChatVisible(true) },
        { id: 3, title: 'Call Support', icon: Phone, action: () => Linking.openURL('tel:+1234567890') },
        { id: 4, title: 'Email Us', icon: Mail, action: () => Linking.openURL('mailto:support@example.com') }
    ];

    const faqItems = [
        {
            id: 1,
            question: 'How can I track my order?',
            answer: 'Go to Orders section in your account and click on the order you want to track.'
        },
        {
            id: 2,
            question: 'What is your return policy?',
            answer: 'We offer 30-day returns for most items. Items must be in original condition.'
        },
        {
            id: 3,
            question: 'How long does shipping take?',
            answer: 'Standard shipping takes 3-5 business days, express shipping takes 1-2 business days.'
        }
    ];

    const ChatModal = () => (
        <Modal
            visible={chatVisible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <View className="flex-1 bg-white dark:bg-slate-900">
                {/* Chat Header */}
                <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-full items-center justify-center mr-3">
                            <Bot size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-lg font-semibold text-gray-900 dark:text-white">Support Assistant</Text>
                            <Text className="text-sm text-green-500">Online now</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => setChatVisible(false)}
                        className="w-8 h-8 items-center justify-center"
                    >
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                {/* Chat Messages */}
                <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-slate-900">
                    <View className="mb-4">
                        <View className="bg-blue-500 dark:bg-blue-600 rounded-2xl rounded-bl-md p-3 self-start max-w-[80%]">
                            <Text className="text-white">Hello! I'm here to help you. What can I assist you with today?</Text>
                        </View>
                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-2">Just now</Text>
                    </View>
                </ScrollView>

                {/* Chat Input */}
                <View className="p-4 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700">
                    <View className="flex-row items-center bg-gray-100 dark:bg-slate-700 rounded-full px-4 py-2">
                        <TextInput
                            value={chatMessage}
                            onChangeText={setChatMessage}
                            placeholder="Type your message..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 text-gray-900 dark:text-white mr-3"
                            multiline
                        />
                        <TouchableOpacity className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full items-center justify-center">
                            <Send size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    return (
        <View className="flex-1 bg-gray-50 dark:bg-slate-900">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-700 dark:to-purple-800 px-6 pt-16 pb-8">
                    <Text className="text-3xl font-bold text-white mb-2">How can we help?</Text>
                    <Text className="text-blue-100 dark:text-blue-200 text-base">
                        We're here to support you 24/7
                    </Text>
                </View>

                {/* Search Bar */}
                <View className="px-6 -mt-6 mb-6">
                    <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-4 flex-row items-center">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search for help..."
                            placeholderTextColor="#9CA3AF"
                            className="flex-1 ml-3 text-gray-900 dark:text-white text-base"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-6 mb-8">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={action.id}
                                onPress={action.action}
                                className="w-[48%] bg-white dark:bg-slate-800 rounded-2xl p-4 mb-4 shadow-sm dark:shadow-lg"
                                style={{ marginBottom: index >= 2 ? 0 : 16 }}
                            >
                                <View className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full items-center justify-center mb-3">
                                    <action.icon size={24} color="#3B82F6" />
                                </View>
                                <Text className="font-semibold text-gray-900 dark:text-white">{action.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Support Categories */}
                <View className="px-6 mb-8">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Browse by Category</Text>
                    {supportCategories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-lg flex-row items-center"
                        >
                            <View className={`w-12 h-12 ${category.color} ${category.darkColor} rounded-xl items-center justify-center mr-4`}>
                                <category.icon size={24} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                                    {category.title}
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                                    {category.description}
                                </Text>
                            </View>
                            <ChevronRight size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact Support */}
                <View className="px-6 mb-8">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Support</Text>

                    <View className="bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-6 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
                                <Headphones size={20} color="white" />
                            </View>
                            <View>
                                <Text className="text-white font-semibold text-lg">Live Support</Text>
                                <Text className="text-green-100 text-sm">Average response time: 2 minutes</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => setChatVisible(true)}
                            className="bg-white/20 rounded-xl py-3 items-center"
                        >
                            <Text className="text-white font-semibold">Start Live Chat</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            onPress={() => Linking.openURL('tel:+1234567890')}
                            className="flex-1 bg-blue-500 dark:bg-blue-600 rounded-xl p-4 mr-2 items-center"
                        >
                            <Phone size={24} color="white" />
                            <Text className="text-white font-semibold mt-2">Call Us</Text>
                            <Text className="text-blue-100 text-xs mt-1">24/7 Available</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => Linking.openURL('mailto:support@example.com')}
                            className="flex-1 bg-purple-500 dark:bg-purple-600 rounded-xl p-4 ml-2 items-center"
                        >
                            <Mail size={24} color="white" />
                            <Text className="text-white font-semibold mt-2">Email</Text>
                            <Text className="text-purple-100 text-xs mt-1">Response in 2hrs</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQ Section */}
                <View className="px-6 mb-8">
                    <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</Text>
                    {faqItems.map((item) => (
                        <View key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 mb-3 shadow-sm dark:shadow-lg">
                            <Text className="font-semibold text-gray-900 dark:text-white mb-2">{item.question}</Text>
                            <Text className="text-gray-600 dark:text-gray-400 text-sm leading-5">{item.answer}</Text>
                        </View>
                    ))}
                </View>

                {/* Satisfaction Rating */}
                <View className="px-6 mb-8">
                    <View className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 items-center">
                        <Text className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                            How was your experience?
                        </Text>
                        <Text className="text-amber-700 dark:text-amber-300 text-center mb-4">
                            Help us improve our support
                        </Text>
                        <View className="flex-row">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} className="mx-1">
                                    <Star size={32} color="#F59E0B" fill="#F59E0B" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View className="px-6 pb-8">
                    <View className="bg-white dark:bg-slate-800 rounded-2xl p-6 items-center shadow-sm dark:shadow-lg">
                        <Clock size={24} color="#6B7280" />
                        <Text className="font-semibold text-gray-900 dark:text-white mt-2">Support Hours</Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-center mt-1">
                            24/7 Chat & Email Support{'\n'}
                            Phone: Mon-Fri 9AM-6PM EST
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <ChatModal />
        </View>
    );
}