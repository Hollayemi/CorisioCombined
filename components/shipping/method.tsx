import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatName } from "../../utils/get-initials";
import OptionsMenu from "../option-menu";

type MethodProps = {
    title: string;
    desc: string;
    view?: boolean;
    edit?: boolean;
};

export default function Method({ title, desc, view, edit }: MethodProps) {
    return (
        <TouchableOpacity onPress={() => router.push("/profile/address")}>
            <View className="rounded border border-gray-300 p-5 flex-row justify-between items-center my-1 dark:!border-gray-900 dark:bg-slate-900">
                <View className="flex-row">
                    {view && (
                        <Entypo name="location" size={20} color="#2A347E" className="dark:!text-indigo-300" />
                    )}
                    <View className="ml-3.5">
                        <Text className="text-base font-bold text-indigo-900 dark:text-indigo-300">
                            {title}
                        </Text>
                        <Text className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                            {view ? desc.slice(0, 45) : desc}
                        </Text>
                    </View>
                </View>
                {view && (
                    <Entypo name="chevron-right" size={24} color="#2A347E" className="dark:text-indigo-300" />
                )}
                {edit && (
                    <AntDesign name="edit" size={24} color="#2A347E" className="dark:text-indigo-300" />
                )}
            </View>
        </TouchableOpacity>
    );
}

type DeliveryMethodProps = {
    type: string;
    store: string;
    addresses: any[];
    pickers: any[];
    selectedValue: any;
    updatePayload: (value: any) => void;
};

export function MethodForDelivery({
    type,
    store,
    addresses,
    updatePayload,
    selectedValue,
    pickers,
}: DeliveryMethodProps) {
    console.log({ selectedValue, store })
    const options =
        type === "pickup"
            ? pickers.map((e: any) => ({
                label: `${e?.name}, (${e?.relationship})`,
                key: e,
            }))
            : [...addresses.map((e: any) => ({
                label: `${e?.address}, ${e?.state}, ${e?.city} (${e?.postal_code})`,
                key: e,
            })), {
                label: "Add New Address",
                key: "/profile/address/newAddress"
            }];

    return (
        <OptionsMenu
            Component={() => (
                <View className="rounded border border-gray-300 p-5 flex-row justify-between items-center my-1 dark:border-gray-800 dark:bg-slate-900">
                    <View className="flex-row">
                        {type === "pickup" ? (
                            <AntDesign name="car" size={20} color="#2A347E" className="dark:!text-indigo-300" />
                        ) : (
                            <Entypo name="location" size={20} color="#2A347E" className="dark:!text-indigo-300" />
                        )}
                        <View className="ml-3.5">
                            <Text className="text-base font-bold text-indigo-900 dark:text-indigo-300">
                                Set {type === "pickup" ? "picker to pick from: " : "your location for "}
                                {formatName(store)} store
                            </Text>
                            <Text className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                                {type === "pickup"
                                    ? selectedValue
                                        ? `${selectedValue?.name}, (${selectedValue?.relationship})`
                                        : "Myself"
                                    : selectedValue
                                        ? `${selectedValue?.address}, ${selectedValue?.state}, ${selectedValue?.city}, ${selectedValue?.postal_code}`
                                        : "Select location"}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
            others={{ label: "Delivery Method" }}
            options={options}
            selectedValue={""}
            setSelectedValue={(x: string) =>
                x.toString().startsWith("/") ? router.push({ pathname: x as any, params: { back: "true" } }) :
                    updatePayload((prev: any) => ({
                        ...prev,
                        picker: { ...prev.picker, [store]: x },
                    }))
            }
        />
    );
}
