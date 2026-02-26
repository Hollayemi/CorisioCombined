import { Linking } from "react-native";

export const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
};

export default function handleEmail(email: string) {
    Linking.openURL(`mailto:${email}`);
}

export const handleSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
};
