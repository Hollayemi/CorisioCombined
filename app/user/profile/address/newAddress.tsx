import Button from "@/components/form/Button";
import { Input2 } from "@/components/form/TextInput";
import OptionsMenu from "@/components/option-menu";
import HomeWrapper from "@/components/wrapper/user";
import { useGetAddressesQuery, useSaveAddressMutation } from "@/redux/user/slices/addressSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
    Keyboard,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Nigeria from "./nigeria.json";
import ValidatAddressPicker from "./schema/address.schema";

export default function NewAddress() {
    const { data, back }: any = useLocalSearchParams()
    console.log(back)
    const { refetch } = useGetAddressesQuery()
    const { selectedLocation }: any = JSON.parse(data || "{}")

    const [saveNewAddress] = useSaveAddressMutation();
    const path = usePathname()
    return (
        <HomeWrapper headerTitle="New Shipping Address" active="profile">
            <View className="px-3 bg-white dark:bg-slate-950 flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <SafeAreaView className="px-4 bg-white dark:bg-slate-950 flex-1">
                        <Formik
                            validationSchema={ValidatAddressPicker}

                            initialValues={{
                                address: selectedLocation?.address || "",
                                state: selectedLocation?.state || "",
                                city: selectedLocation?.city || "",
                                postal_code: selectedLocation?.postal_code || "",
                            }}
                            onSubmit={(values) => {
                                try {
                                    saveNewAddress(values).then(() => { refetch(); back && router.back() });
                                } catch (error) {
                                }
                            }}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                isValid,
                            }) => (
                                <View className="flex-col justify-between h-full">
                                    <View className="my-[4%]">
                                        <Input2
                                            onChangeText={handleChange("address")}
                                            onBlur={handleBlur("address")}
                                            value={values.address}
                                            label="Shipping Address"
                                            placeholder="Enter your shipping address"
                                            Icon={
                                                errors.address && touched.address ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                        className="absolute top-0 right-2.5"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="absolute top-0 right-2.5 text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.address && touched.address && typeof errors.address === "string" && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.address}
                                            </Text>
                                        )}

                                        <OptionsMenu
                                            Component={() => (
                                                <>
                                                    <Input2
                                                        onChangeText={handleChange("state")}
                                                        onBlur={handleBlur("state")}
                                                        value={values.state}
                                                        // others={{ disabled: true }}
                                                        placeholder="Select your state"
                                                        label="State"
                                                        Icon={
                                                            errors.state && touched.state ? (
                                                                <MaterialIcons
                                                                    name="error-outline"
                                                                    size={24}
                                                                    color="red"
                                                                    className="absolute top-0 right-2.5"
                                                                />
                                                            ) : (
                                                                <Ionicons
                                                                    name="chevron-down"
                                                                    size={20}
                                                                    color="#C5C5C5"
                                                                    className="absolute top-0 right-2"
                                                                />
                                                            )
                                                        }
                                                    />
                                                    {errors.state && touched.state && typeof errors.state === "string" && (
                                                        <Text className="text-xs text-red-500 pl-[5%]">
                                                            {errors.state}
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                            setSelectedValue={handleChange("state")}
                                            options={Nigeria.map((x: any) => {
                                                return { key: x.state, label: x.state };
                                            })}
                                        />

                                        <OptionsMenu
                                            Component={() => (
                                                <>
                                                    <Input2
                                                        onChangeText={handleChange("city")}
                                                        onBlur={handleBlur("city")}
                                                        value={values.city}
                                                        placeholder="Select Your City"
                                                        label="City"
                                                        Icon={
                                                            errors.city && touched.city ? (
                                                                <MaterialIcons
                                                                    name="error-outline"
                                                                    size={24}
                                                                    color="red"
                                                                    className="absolute top-0 right-2.5"
                                                                />
                                                            ) : (
                                                                <Ionicons
                                                                    name="chevron-down"
                                                                    size={24}
                                                                    color="#C5C5C5"
                                                                    className="absolute top-0 right-2.5"
                                                                />
                                                            )
                                                        }
                                                    />
                                                    {errors.city && touched.city && typeof errors.city === "string" && (
                                                        <Text className="text-xs text-red-500 pl-[5%]">
                                                            {errors.city}
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                            setSelectedValue={handleChange("city")}
                                            options={Nigeria.filter(
                                                (x: any) => x.state === values.state && x.lgas
                                            )[0]?.lgas.map((each: any) => {
                                                return { key: each, label: each };
                                            })}
                                        />

                                        <Input2
                                            onChangeText={handleChange("postal_code")}
                                            onBlur={handleBlur("postal_code")}
                                            value={values.postal_code}
                                            label="Zip Code"
                                            others={{ keyboardType: "numeric" }}
                                            placeholder="351108"
                                            Icon={
                                                errors.postal_code && touched.postal_code ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                        className="absolute top-0 right-2.5"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="absolute top-0 right-2.5 text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.postal_code && touched.postal_code && typeof errors.postal_code === "string" && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.postal_code}
                                            </Text>
                                        )}

                                        <View className="flex-row justify-center items-center my-7">
                                            <Ionicons
                                                name="map-outline"
                                                size={20}
                                                color="#233974"
                                                className="mr-1.5 text-indigo-900 dark:text-indigo-400"
                                            />
                                            <Text
                                                className="text-indigo-900 dark:text-indigo-400 text-base border-b border-dashed"
                                                onPress={() => router.push({
                                                    pathname: "/user/map",
                                                    params: { path }
                                                })}
                                            >
                                                Select Via Map
                                            </Text>
                                        </View>
                                    </View>

                                    <Button
                                        title="Save"
                                        className="mb-10"
                                        onPress={handleSubmit}
                                        disabled={!isValid}
                                    />
                                </View>
                            )}
                        </Formik>
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </View>
        </HomeWrapper>
    );
}