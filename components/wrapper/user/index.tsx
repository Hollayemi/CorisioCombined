import { useRouter } from "expo-router";
import { ReactNode } from "react";
import { View } from "react-native";
import BottomTabBar from "./BottomBar";
import HomeHeader from "./headers/homeHeader";
import InScreenHeader from "./headers/inScreen";
type HeaderInfo = {
    title: string;
    subtitle?: string;
    icon?: string;
    iconColor?: string;
};

type Props = {
    children: React.ReactNode;
    headerType?: "home" | "in-screen";
    headerInfo?: HeaderInfo;
    hasFooter?: boolean;
    active?: string;
    headerTitle?: ReactNode | string;
    noMenu?: boolean;
    dropdownItems?: any;
    noAddProduct?: boolean;
    rightIcon?: any;
    rightIconFunction?: () => void;
    props?: any,
};

export default function HomeWrapper({
    children,
    headerType = "in-screen",
    headerTitle,
    active = "",
    dropdownItems,
    noMenu,
    rightIcon,
    rightIconFunction,
}: Props) {
    const router = useRouter();
    const header = {
        home: <HomeHeader />,
        "in-screen": (
            <InScreenHeader
                title={headerTitle}
                rightIcon={rightIcon}
                dropdownItems={dropdownItems}
                rightIconFunction={rightIconFunction}
            />
        ),

    };
    return (
        <View className="flex-1 !relative w-[100%] bg-white dark:bg-slate-950">
            {header[headerType]}

            {/* Main Content */}
            {children}

            {/* {!noAddProduct && (
                <Pressable
                    onPress={() => router.push("/home")}
                    className="flex-row justify-center absolute h-16 w-16 bg-orange-500 rounded-full right-6 -ml-4  bottom-28 shadow-md items-center"
                >
                    <Ionicons name="camera" size={32} color="#fff" />
                </Pressable>
            )} */}
            {!noMenu && (

                <View className="rounded-full ">
                    <BottomTabBar active={active} />
                </View>
            )}
        </View>
    );
}
