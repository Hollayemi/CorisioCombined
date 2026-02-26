import Button from "@/components/form/Button";
import { Image, Text, View } from "react-native";

interface TwoFactorSetupModalProps {
    visible: boolean;
    onClose: () => void;
    onActivate: () => void;
}

export default function LogoutModal({ visible, onClose, onActivate }: TwoFactorSetupModalProps) {
    if (!visible) return null;

    return (
        <View className="p-4">
            {/* Illustration */}
            {/* <View className="items-center mb-6">
                <Image source={require("@/assets/images/2fa.png")} className="w-60 h-36" />
            </View> */}

            {/* Content */}
            <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-4">
                Confirm log Out
            </Text>

            <Text className="text-base text-gray-600 dark:text-gray-300 text-center mb-8 leading-8">
                Are you sure you want to log out from your account?
            </Text>



            <Button
                className="!mt-0 !bg-red-500 !text-white dark:!text-white"

                title="Yes, Log me Out"
                onPress={onActivate}
            />
            <Button
                className="!mt-4 !bg-red-300 !text-white dark:!text-white"

                title="No, I'll Cancel"
                onPress={onClose}
            />
        </View>
    );
};
