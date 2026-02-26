// screens/PaymentDetailsScreen.tsx
import Button from "@/components/form/Button";
import ModalComponent from "@/components/modal";
import NoRecord from "@/components/noRecord";
import StoreWrapper from '@/components/wrapper/business';
import { useStoreData } from "@/hooks/useData";
import { useDeletePaymentAccountMutation, useGetPaymentAccountQuery } from "@/redux/business/slices/transaction";
import { router } from "expo-router";
import { PlusIcon, Trash } from 'lucide-react-native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import AddBankAccountModal from "./component";


interface BankAccount {
    bankName: string;
    _id: string;
    accountNumber: string;
    type: string;
}

// Main Payment Details Screen
const PaymentDetailsScreen: React.FC = () => {
    const { data, isLoading: getting, refetch } = useGetPaymentAccountQuery()
    const [deleteAccount, { isLoading: deleting }] = useDeletePaymentAccountMutation()
    const { staffInfo }: any = useStoreData();
    const saved = data?.data || []
    const [showAddBankModal, setShowAddBankModal] = useState(false);

    const isDark = useColorScheme() === 'dark';
    const iconDarkColor = !isDark ? "#eee" : "#333"

    const BankAccountItem: React.FC<{ account: BankAccount }> = ({ account }) => (
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 flex-row items-center justify-between">
            <View className="flex-1">
                <Text className="text-base capitalize font-semibold text-gray-900 dark:text-white mb-1">
                    {account.bankName.split("-").join(" ")}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {account.type} • {account.accountNumber}
                </Text>
            </View>

            {<TouchableOpacity
                onPress={() => deleteAccount({ id: account._id }).then(() => refetch())}
                className="w-10 h-10 items-center justify-center"
            >
                <Trash size={20} color={"red"} />
            </TouchableOpacity>}
        </View>
    );

    return (
        <StoreWrapper headerTitle="Payment" active='profile'>
            <ScrollView refreshControl={<RefreshControl refreshing={getting} onRefresh={refetch} />} className="flex-1 bg-gray-50 dark:bg-gray-900">
                <View className="p-4">
                    {/* Bank Accounts List */}
                    <View className="mb-6">
                        {saved.length ? saved.map((account: any) => (
                            <BankAccountItem key={account.id} account={account} />
                        )) :
                            <View className="!mt-20 flex items-center justify-center">
                                <NoRecord text=" " />
                                <Button
                                    size="small"
                                    IconAfter={<PlusIcon color={iconDarkColor} />}
                                    title="Share Your Referral Code"
                                    className="rounded-full w-60 mt-28"
                                    onPress={() => setShowAddBankModal(true)}
                                />
                            </View>}
                    </View>

                    {saved.length && !Boolean(staffInfo.two_fa) && <TouchableOpacity
                        onPress={() => router.push("/home/profile/account/password")}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4"
                    >
                        <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                            💡 Enable Two-Factor Authentication
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Add an extra layer of security to your unauthorize withdrawal
                        </Text>
                        <Text className="text-blue-600 dark:text-blue-400 font-medium">
                            Set up now →
                        </Text>
                    </TouchableOpacity>}
                </View>
            </ScrollView>
            {saved.length &&
                <View className="px-4 py-3 dark:bg-gray-900">
                    <Button
                        IconBefore={<PlusIcon size={iconDarkColor}
                            className="mb-6" />}
                        onPress={() => setShowAddBankModal(true)}
                        title=" Add new payment option"
                    />
                </View>
            }

            <ModalComponent
                visible={showAddBankModal}
                onClose={() => setShowAddBankModal(false)}

            >
                <AddBankAccountModal
                    visible={showAddBankModal}
                    refresh={refetch}
                    onClose={() => setShowAddBankModal(false)}
                />
            </ModalComponent>
        </StoreWrapper>
    );
};

export default PaymentDetailsScreen;