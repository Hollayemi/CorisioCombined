import { ReactNode } from "react";
import { View } from "react-native";
import BottomTabBar from "./BottomBar";
import InScreenHeader from "./headers/inScreen";
type HeaderInfo = {
    title: string;
    subtitle?: string;
    icon?: string;
    iconColor?: string;
};

type Props = {
    children: React.ReactNode;
    headerType?: "in-screen";
    headerInfo?: HeaderInfo;
    hasFooter?: boolean;
    noHeader?: boolean;
    dropdownItems?: any;
    active?: string;
    headerTitle?: ReactNode | string;
    rightIcon?: any;
    rightIconFunction?: () => void;
};

export default function StoreWrapper({
    children,
    headerType = "in-screen",
    noHeader,
    headerTitle,
    hasFooter = true,
    dropdownItems,
    active = "",
    rightIcon,
    rightIconFunction,
}: Props) {

    const header = {
        "in-screen": (
            <InScreenHeader
                title={headerTitle}
                dropdownItems={dropdownItems}
                rightIcon={rightIcon}
                rightIconFunction={rightIconFunction}
            />
        ),
    };

    return (
        <View className="flex-1 !relative w-[100%] bg-white dark:bg-gray-800">
            {!noHeader && header[headerType]}

            {/* Main Content */}
            {children}


            {hasFooter &&
                // <View className="absolute bottom-6 rounded-full h-18 left-0 right-0  p-3 shadow">
                <BottomTabBar active={active} />
                // </View>
            }

            {/*
                <SDUIEngine
                    screenName={active}
                    userType="new"
                />
            */}

        </View>
    );
}
