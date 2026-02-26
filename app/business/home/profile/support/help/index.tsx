import StoreWrapper from "@/components/wrapper/business";
import { MaterialIcons } from "@expo/vector-icons";
import { MapPinIcon, MessageCircle, PhoneIcon } from "lucide-react-native";
import React from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export interface ContactInfo {
    id: number;
    type: 'address' | 'phone' | 'email' | 'chat' | 'social';
    title: string;
    value: string;
    subtitle?: string;
    icon: string;
}


export default function Help() {
    const contactInfo: ContactInfo[] = [
        {
            id: 1,
            type: 'address',
            title: 'Address',
            value: 'No. 5, Lagos Road, Benin City, Edo State, Nigeria.',
            icon: 'map'
        },
        {
            id: 2,
            type: 'phone',
            title: '+234 (814) 770 2684',
            value: '+2348147702684',
            icon: 'phone'
        },
        {
            id: 3,
            type: 'email',
            title: 'support@corisio.com',
            value: 'support@corisio.com',
            icon: 'email'
        },
        {
            id: 4,
            type: 'chat',
            title: 'Live Chat',
            value: 'Available 24/7',
            subtitle: 'Available 24/7 - 9:00 AM - 10:00 PM',
            icon: 'chat'
        },
        {
            id: 5,
            type: 'social',
            title: 'Facebook',
            value: 'facebook.com/specialcutz',
            icon: 'facebook'
        },
        {
            id: 6,
            type: 'social',
            title: 'Instagram',
            value: '@specialcutz',
            icon: 'instagram'
        },
        {
            id: 7,
            type: 'social',
            title: 'LinkedIn',
            value: 'linkedin.com/company/specialcutz',
            icon: 'linkedin'
        }
    ];



    const handleContactPress = async (contact: ContactInfo) => {
        switch (contact.type) {
            case 'phone':
                await Linking.openURL(`tel:${contact.value}`);
                break;
            case 'email':
                await Linking.openURL(`mailto:${contact.value}`);
                break;
            case 'address':
                // Open maps application
                await Linking.openURL(`maps:0,0?q=${encodeURIComponent(contact.value)}`);
                break;
            case 'chat':
                console.log('Open live chat');
                break;
            case 'social':
                console.log('Open social media:', contact.title);
                break;
        }
    };

    const getContactIcon = (iconType: string) => {
        switch (iconType) {
            case 'map':
                return <MapPinIcon size={20} color="#f97316" />;
            case 'phone':
                return <PhoneIcon size={20} color="#f97316" />;
            case 'email':
                return <MessageCircle size={20} color="#f97316" />;
            case 'chat':
                return <MaterialIcons name="chat" size={20} color="#f97316" />;
            case 'facebook':
                return <MaterialIcons name="chat" size={20} color="#f97316" />;
            case 'instagram':
                return <MaterialIcons name="chat" size={20} color="#f97316" />;
            case 'linkedin':
                return <MaterialIcons name="chat" size={20} color="#f97316" />;
            default:
                return <View className="w-5 h-5 bg-orange-500 rounded" />;
        }
    };


    const ContactItem: React.FC<{ contact: ContactInfo; isLast: boolean }> = ({
        contact,
        isLast
    }) => (
        <TouchableOpacity
            onPress={() => handleContactPress(contact)}
            className={`flex-row items-center p-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-700' : ''
                }`}
        >
            <View className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg items-center justify-center mr-3">
                {getContactIcon(contact.icon)}
            </View>

            <View className="flex-1">
                <Text className="text-base font-medium text-gray-900 dark:text-white mb-1">
                    {contact.title}
                </Text>
                {contact.subtitle && (
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.subtitle}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );


    return (
        <StoreWrapper headerTitle="Help" active="profile">
            <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Contact Us Section */}
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Contact Us
                    </Text>

                    {/* Contact Information */}
                    <View className="bg-white dark:bg-gray-800 rounded-lg mb-6">
                        {contactInfo.map((contact, index) => (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                isLast={index === contactInfo.length - 1}
                            />
                        ))}
                    </View>

                    {/* FAQ Section */}
                    <View className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <Text className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Frequently Asked Questions
                        </Text>
                        <Text className="text-sm text-blue-700 dark:text-blue-200 leading-5 mb-3">
                            Find answers to common questions about our services, booking, and policies.
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-blue-600 dark:text-blue-400 font-medium">
                                View FAQ →
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Emergency Contact */}
                    <View className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <Text className="text-base font-semibold text-red-900 dark:text-red-100 mb-2">
                            Emergency Support
                        </Text>
                        <Text className="text-sm text-red-700 dark:text-red-200 leading-5 mb-3">
                            For urgent issues outside business hours, please contact our emergency support line.
                        </Text>
                        <TouchableOpacity
                            onPress={() => Linking.openURL('tel:+2348147702684')}
                            className="bg-red-600 rounded-lg p-3"
                        >
                            <Text className="text-center font-medium text-white">
                                Call Emergency Support
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </StoreWrapper>
    )
}