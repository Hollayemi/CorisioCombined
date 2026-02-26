import Button from "@/components/form/Button";
import { Input2 } from "@/components/form/TextInput";
import HomeWrapper from "@/components/wrapper/user";
import { useAddPickupAgentMutation } from "@/redux/user/slices/pickupSlice";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import React from "react";
import {
    Keyboard,
    SafeAreaView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import ValidateNewPicker from "./schema/picker.schema";

export default function NewPicker() {
    const [addNewPicker, { isLoading }] = useAddPickupAgentMutation()
    return (
        <HomeWrapper headerTitle="Add New Picker" active="profile">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="px-5 flex-1 bg-white dark:bg-slate-950">
                    <SafeAreaView className="">
                        <Formik
                            validationSchema={ValidateNewPicker}
                            initialValues={{
                                name: "",
                                phone: "",
                                email: "",
                                relationship: "",
                            }}
                            onSubmit={(values, { resetForm }) => {
                                try {
                                    addNewPicker(values).then(() => { }).then((res) => resetForm())
                                    resetForm()
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
                                            onChangeText={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            value={values.name}
                                            label="Full Name"
                                            placeholder="John Doe"
                                            Icon={
                                                errors.name && touched.name ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.name && touched.name && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.name}
                                            </Text>
                                        )}
                                        <Input2
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            placeholder="JohnDoe@mail.com"
                                            label="Email Address"
                                            Icon={
                                                errors.email && touched.email ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.email && touched.email && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.email}
                                            </Text>
                                        )}
                                        <Input2
                                            onChangeText={handleChange("relationship")}
                                            onBlur={handleBlur("relationship")}
                                            value={values.relationship}
                                            placeholder="Friend"
                                            label="Relationship"
                                            Icon={
                                                errors.relationship &&
                                                    touched.relationship ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors && touched.relationship && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.relationship}
                                            </Text>
                                        )}
                                        <Input2
                                            onChangeText={handleChange("phone")}
                                            onBlur={handleBlur("phone")}
                                            value={values.phone}
                                            label="Phone Number"
                                            placeholder="+234 815 667 0000"
                                            Icon={
                                                errors.phone && touched.phone ? (
                                                    <MaterialIcons
                                                        name="error-outline"
                                                        size={24}
                                                        color="red"
                                                    />
                                                ) : (
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={24}
                                                        color="#233974"
                                                        className="text-indigo-900 dark:text-indigo-400"
                                                    />
                                                )
                                            }
                                        />
                                        {errors.phone && touched.phone && (
                                            <Text className="text-xs text-red-500 pl-[5%]">
                                                {errors.phone}
                                            </Text>
                                        )}
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
                </View>
            </TouchableWithoutFeedback>
        </HomeWrapper>
    );
}