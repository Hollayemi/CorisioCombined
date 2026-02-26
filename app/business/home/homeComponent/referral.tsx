import GroupAvatar from "@/components/collage";
import Button from "@/components/form/Button";
import ModalComponent from "@/components/modal";
import NoRecord from "@/components/noRecord";
import { useStoreData } from "@/hooks/useData";
import { formatDate } from "@/utils/format";
import { CircleCheck, Clock10, ShareIcon } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl, ScrollView, Share, Text, TouchableOpacity, useColorScheme, View } from "react-native";

export default function ReferralScreen({ shareReferral = false, setShare }: { shareReferral: boolean, setShare: any }) {

    const { staffInfo, referral, referralLoading: isLoading, refetchReferral: refetch } = useStoreData() as any
    const { referred: result = [], ...details }: any = referral
    const [stagesLeft, setStagesLeft] = useState<[]>([])

    const shareToWhatsApp = async () => {
        const playStoreLink = "https://play.google.com/store/apps/details?id=corisio";
        const appStoreLink = "https://apps.apple.com/app/corisio/id123456789";

        const message = `
        Hey 👋,  
        \nI’m using Corisio, a fast way to find stores, products, and services near you. \n
Download the app here:\n🔹 Play Store: ${playStoreLink}\n🔹 App Store: ${appStoreLink}  
            \nUse my referral code **${details.ref_id?.toUpperCase()}** when signing up and enjoy extra benefits 🎉
        `;
        // let url = "whatsapp://send?text=" + encodeURIComponent(message);

        // Linking.openURL(url).catch(() => {
        //     alert("Make sure WhatsApp is installed on your device");
        // });
        await Share.share({
            message: message.trim(),
        });
    };
    const isDark = useColorScheme() === 'dark';
    const iconDarkColor = isDark ? "#eee" : "#333"
    return (
        <View className="flex-1">

            <Referrals
                isLoading={isLoading}
                refetch={refetch}
                setStagesLeft={setStagesLeft}
                setShare={setShare}
                data={result}
            />

            <ModalComponent
                visible={shareReferral}
                onClose={() => setShare(false)}
            >
                <View>
                    <View className="mb-6">
                        <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                            Refer and earn more
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-center">
                            Copy your referral code and paste it into the required field during registration.
                        </Text>
                    </View>
                    <View style={{ borderTopEndRadius: 30, borderTopLeftRadius: 30 }} className='border !rounded-t-2xl border-gray-500 border-dashed h-20 mt-5'>
                        <Text className="text-gray-600 dark:text-gray-400 text-center py-3">
                            Referral Code
                        </Text>
                        <Text style={{ letterSpacing: 4 }} className="text-gray-600 text-2xl !uppercase dark:text-gray-300 text-center font-bold !tracking-wider">
                            {details?.ref_id?.toUpperCase()}
                        </Text>
                    </View>
                    <View className='h-14 mb-10'>
                        <Text onPress={shareToWhatsApp} className="text-gray-600 bg-green-500 text-xl dark:text-white text-center py-3">
                            Share On Whatsapp
                        </Text>
                    </View>

                    <View className='mb-10'>

                    </View>
                </View>
            </ModalComponent>
            <ModalComponent
                visible={Boolean(stagesLeft.length)}
                onClose={() => setStagesLeft([])}
            >
                <View>
                    <View className="mb-6">
                        <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
                            Stages Left
                        </Text>
                        <Text className="text-gray-600 dark:text-gray-400 text-center">
                            Copy your referral code and paste it into the required field during registration.
                        </Text>
                    </View>

                    {stagesLeft.map((stage, i) => (
                        <View key={i} className="mb-4">
                            <Text className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2 capitalize">{stage}</Text>
                            <Text className="font-semibold text-gray-900 dark:text-gray-200 text-base mb-2 leading-8">{stageNote[stage]}</Text>
                        </View>
                    ))}

                    <View className='mb-10'>

                    </View>
                </View>
            </ModalComponent>
        </View>
    )
}

export const ShareReferral = ({ setShare }: { setShare: any }) => {
    const isDark = useColorScheme() === 'dark';
    const iconDarkColor = isDark ? "#eee" : "#333"
    return (
        <TouchableOpacity onPress={() => setShare(true)} className="  !z-50">
            <ShareIcon color={iconDarkColor} />
        </TouchableOpacity>
    )
}
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
        <TouchableOpacity onPress={() => { stage !== 4 && setStagesLeft(stagesLeft) }} className="flex-row items-center justify-between flex-1 my-3 border border-gray-300 dark:border-gray-700 rounded-xl p-3">
            <View className="flex-row items-center w-[88%] p-2">
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
                <Text className="text-gray-500 text-right dark:text-gray-400 text-sm mt-2">{formatDate(createdAt)}</Text>
            </View>
        </TouchableOpacity>
    )
}




const Referrals = ({ isLoading, refetch, data, setStagesLeft, setShare }: any) => {
    const isDark = useColorScheme() === 'dark';
    const iconDarkColor = isDark ? "#eee" : "#333"
    return (
        <View className="flex-1 w-full pb-4">
            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />} className="flex-1 py-3 rounded-2xl ">
                {
                    data.length ? data.map((e: any, i: number) =>
                        <RegisteredStores key={i} {...e} setStagesLeft={setStagesLeft} />
                    )
                        :
                        <View className="flex-1 mt-16 items-center justify-center">
                            <NoRecord text=" " />
                            <Button
                                size="small"
                                IconAfter={<ShareIcon color={iconDarkColor} />}
                                title="Share Your Referral Code"
                                className="rounded-full w-60 mt-5"
                                onPress={() => setShare(true)}
                            />
                            {/* <Text onPress={() => setShare(true)} className="text-gray-600 rounded-full w-52 mt-5 bg-green-500 text-lg dark:text-white text-center py-2.5">
                                Share Your Referral Code
                            </Text> */}
                        </View>
                }
            </ScrollView>
        </View>
    )
}

export const stageNote = {
    location: "Store location is missing. Please set the store's coordinates with a valid latitude so customers can easily find you on the map.",
    products: "Store currently have fewer than 5 products listed. Add at least 5 products to showcase what they offer and improve the store's visibility.",
    gallery: "Your store gallery is empty. Upload at least 1 clear and attractive picture so customers can visually connect with your store."
};
