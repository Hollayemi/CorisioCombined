import GroupAvatar from "@/components/collage";
import { Dropdown } from "@/components/dropdown";
import Button from "@/components/form/Button";
import NoRecord from "@/components/noRecord";
import { banksInNigeria } from "@/data/banks";
import { useGetPaymentAccountQuery, useSavePaymentAccountMutation } from "@/redux/user/slices/userSlice2";
import { formatDateToMonthShort } from "@/utils/format";
import { CircleCheck, Clock10 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Keyboard, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";





const RatingDisplayLength = ({
    stage
}: { stage: number }) => {
    const getColor = (color: number): string => {
        if (color >= 85) return "bg-green-500 dark:!bg-green-300";
        if (color >= 70) return "bg-teal-500 dark:!bg-teal-300";
        if (color >= 50 && color < 70) return "bg-blue-500 dark:!bg-blue-300";
        if (color > 30 && color < 50) return "bg-gray-500 dark:!bg-gray-300";
        return "bg-red-500 dark:!bg-red-300";
    };

    const percentage = stage * 25

    return (
        <View className="flex-row items-center mt-0 w-44">
            <Text className="dark:text-white">{percentage}%</Text>
            <View className="flex-1 mx-2.5 bg-gray-200 h-1.5 rounded-full dark:bg-gray-600">
                <View
                    className={`h-full rounded-full ${getColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                />
            </View>
            <Text className="dark:text-gray-300">100%</Text>
        </View>
    );
};


export const RegisteredStores = ({ image, businessName, stage, stagesLeft, setStagesLeft, createdAt }: any) => {
    return (
        <TouchableOpacity onPress={() => { stage !== 4 && setStagesLeft(stagesLeft) }} className="flex-row items-center justify-between flex-1 my-3 mx-1 border border-gray-300 dark:border-gray-800 rounded-xl p-3">
            <View className="flex-row items-center w-[90%] p-2">
                <View className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full items-center justify-center mr-3">
                    <GroupAvatar images={[image]} />
                </View>
                <View className="flex-1 ml-3">
                    <Text numberOfLines={1} className="text-gray-900 dark:text-white text-xl mb-3 font-medium">{businessName}</Text>
                    <RatingDisplayLength stage={stage} />
                </View>
            </View>

            <View className="!pr-4 flex items-center">
                {stage === 4 ? <CircleCheck color="#22c55e" /> : <Clock10 color="#eee" size={20} />}
                <Text className="text-gray-500 dark:text-gray-400 text-sm mt-2">{formatDateToMonthShort(createdAt)}</Text>
            </View>
        </TouchableOpacity>
    )
}




export const Referrals = ({ isLoading, refetch, data, setStagesLeft }: any) => {
    return (
        <View className="flex-1 w-full pb-4">
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} className="flex-1 py-3 px-2 bg-white rounded-2xl dark:bg-slate-900">
                {
                    data.length
                        ? data.map((e: any) =>
                            <RegisteredStores {...e} setStagesLeft={setStagesLeft} />)
                        :
                        <NoRecord
                        />}
            </ScrollView>
        </View>
    )
}

export const stageNote = {
    location: "Store location is missing. Please set the store's coordinates with a valid latitude so customers can easily find you on the map.",
    products: "Store currently have fewer than 5 products listed. Add at least 5 products to showcase what they offer and improve the store's visibility.",
    gallery: "Your store gallery is empty. Upload at least 1 clear and attractive picture so customers can visually connect with your store."
};


export interface BankAccount {
    type: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
}

interface AddBankAccountModalProps {
    visible: boolean;
    onClose: () => void;
}


export const AddBankAccountModal = ({ visible, onClose }: AddBankAccountModalProps) => {
    const [savePayment, { isLoading }] = useSavePaymentAccountMutation()
    const { data, isLoading: getting, refetch } = useGetPaymentAccountQuery()
    const saved = data?.data[0] || {}
    const [bankData, setBankData] = useState<BankAccount>({
        type: "referral",
        bankName: "",
        accountName: "",
        accountNumber: "",
    });
    console.log({ saved })
    useEffect(() => {
        setBankData({
            bankName: saved.bankName,
            type: saved.type,
            accountName: saved.accountName,
            accountNumber: saved.accountNumber,
        })
    }, [getting])

    if (!visible) return null;

    const handleAdd = () => {
        if (bankData.bankName && bankData.accountNumber) {
            onClose()
            savePayment(bankData).then(() => refetch());
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
            <View className="mb-14">
                <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                    Add New Account
                </Text>

                <Text className="text-sm text-gray-600 dark:text-gray-300 text-center mb-8">
                    Enter the account information to add your bank details
                </Text>


                {/* Bank Name Dropdown */}
                <View className="mb-2">
                    <View className="">
                        <Dropdown
                            options={banksInNigeria}
                            selected={[bankData.bankName]} // Wrap in array since component expects array
                            onSelect={(text) => setBankData(prev => ({ ...prev, bankName: text[0] }))}
                            className="mt-2 py-0 h-12 bg-white dark:!bg-gray-700 "
                            textClass="!font-bold !text-black dark:!text-white"
                            placeholder="Select Bank"
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
                <View className="mb-4">
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
        </TouchableWithoutFeedback>
    );
};

