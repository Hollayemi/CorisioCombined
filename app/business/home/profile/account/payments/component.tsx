// Add Bank Account Modal Content

import { Dropdown } from "@/components/dropdown";
import Button from "@/components/form/Button";
import { banksInNigeria } from "@/data/banks";
import { useStoreData } from "@/hooks/useData";
import { useSavePaymentAccountMutation } from "@/redux/business/slices/transaction";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface AddBankAccountModalProps {
    visible: boolean;
    onClose: () => void;
    refresh: () => void;
}
type AccountType = "referral" | "purchase"

interface BankAccount {
    type: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}



export default function AddBankAccountModal({ visible, onClose, refresh }: AddBankAccountModalProps) {
    const [savePayment, { isLoading }] = useSavePaymentAccountMutation()
    const { staffInfo } = useStoreData()

    const accountType = [{ label: "Referral", value: "referral" }]
    if (staffInfo.staffRole === "COMPANY_ADMIN") {
        accountType.push({ label: "Purchase", value: "purchase" })
    }


    const [bankData, setBankData] = useState<BankAccount>({
        type: "",
        bankName: "",
        accountName: "",
        accountNumber: "",
    });

    if (!visible) return null;

    const handleAdd = () => {
        if (bankData.bankName && bankData.accountNumber) {
            onClose()
            savePayment(bankData).then(() => refresh());
        }
    };
    return (
        <View className="">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                Add New Account
            </Text>

            <Text className="text-sm text-gray-600 dark:text-gray-300 text-center mb-8">
                Enter the account information to add your bank details
            </Text>

            {/* Bank Name Dropdown */}
            <View className="mb-1">
                <View className="">
                    <Dropdown
                        options={banksInNigeria}
                        selected={[bankData.bankName]} // Wrap in array since component expects array
                        onSelect={(text) => setBankData(prev => ({ ...prev, bankName: text[0] }))}
                        className="mt-2 py-0 !h-12 bg-white dark:!bg-gray-700 "
                        textClass="!font-bold !text-black dark:!text-white"
                        placeholder="Select Bank"
                        multiple={false}
                    />
                </View>
            </View>
            <View className="mb-1">
                <View className="">
                    <Dropdown
                        options={accountType}
                        selected={[bankData.type]} // Wrap in array since component expects array
                        onSelect={(text) => setBankData(prev => ({ ...prev, type: text[0] as "referral" | "purchase" }))}
                        className="mt-2 py-0 !h-12 bg-white dark:!bg-gray-700 "
                        textClass="!font-bold !text-black dark:!text-white"
                        placeholder="Account Type"
                        multiple={false}
                    />
                </View>
            </View>

            {/* Account Number */}
            <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Account Name
                </Text>
                <TextInput
                    value={bankData.accountName}
                    onChangeText={(text) => setBankData(prev => ({ ...prev, accountName: text }))}
                    placeholder="account name"
                    placeholderTextColor="#9CA3AF"
                    className="p-3 h-12 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg  text-gray-900 dark:text-white"
                />
            </View>


            {/* Account Number */}
            <View className="mb-8">
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Account Number
                </Text>
                <TextInput
                    value={bankData.accountNumber}
                    onChangeText={(text) => setBankData(prev => ({ ...prev, accountNumber: text }))}
                    placeholder="5271289562"
                    placeholderTextColor="#9CA3AF"
                    className="p-3 h-12 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg  text-gray-900 dark:text-white"
                    keyboardType="numeric"
                />
            </View>


            {/* Activate Button */}
            <Button
                title="Save"
                isLoading={isLoading}
                onPress={handleAdd}
            />
        </View>
    );
};