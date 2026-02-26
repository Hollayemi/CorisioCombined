import Button from "@/components/form/Button";
import Input from "@/components/form/TextInput";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Formik } from "formik";
import React from "react";
import {
    Keyboard,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import Heading, { Footer } from "./components";
import Step1ValidationSchema from "./schema/Step1.schema";

export default function Step1() {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView>
                <SafeAreaView className="flex-1 bg-white dark:bg-slate-950 px-2 ">
                    <Heading
                        description="Let's get down to know each other, this will enable us to satisfy you better."
                        title="Let's get you onboard"
                    />
                    <View className="px-4">
                        <Formik
                            validationSchema={Step1ValidationSchema}
                            initialValues={{
                                fullname: "",
                                username: "",
                                email: "",
                                phoneNumber: "",
                            }}
                            onSubmit={(values) => {
                                router.push({ pathname: "/user/auth/Signup2", params: values });
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
                                <>
                                    <View className="my-[7%]">
                                        <Input
                                            onChangeText={handleChange("fullname")}
                                            onBlur={handleBlur("fullname")}
                                            value={values.fullname}
                                            label="Full Name"
                                            others={{
                                                keyboardType: "default",
                                            }}
                                            placeholder="John Doe"
                                            Icon={
                                                errors.fullname && touched.fullname ? (
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
                                                    />
                                                )
                                            }
                                        />
                                        {errors.fullname && touched.fullname && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-[3%] mt-1">
                                                {errors.fullname}
                                            </Text>
                                        )}

                                        <Input
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            value={values.email}
                                            placeholder="JohnDoe@mail.com"
                                            label="Email Address"
                                            others={{
                                                keyboardType: "email-address",
                                            }}
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
                                                    />
                                                )
                                            }
                                        />
                                        {errors.email && touched.email && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-[3%] mt-1">
                                                {errors.email}
                                            </Text>
                                        )}

                                        <Input
                                            onChangeText={handleChange("username")}
                                            onBlur={handleBlur("username")}
                                            value={values.username}
                                            placeholder="Big Joe"
                                            label="Username"
                                            others={{
                                                keyboardType: "default",
                                            }}
                                            Icon={
                                                errors.username && touched.username ? (
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
                                                    />
                                                )
                                            }
                                        />
                                        {errors.username && touched.username && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-[3%] mt-1">
                                                {errors.username}
                                            </Text>
                                        )}

                                        <Input
                                            onChangeText={handleChange("phoneNumber")}
                                            onBlur={handleBlur("phoneNumber")}
                                            value={values.phoneNumber}
                                            label="Phone Number"
                                            placeholder="+234 815 667 0000"
                                            Icon={
                                                errors.phoneNumber && touched.phoneNumber ? (
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
                                                    />
                                                )
                                            }
                                        />
                                        {errors.phoneNumber && touched.phoneNumber && (
                                            <Text className="text-xs text-red-500 dark:text-red-400 pl-[3%] mt-1">
                                                {errors.phoneNumber}
                                            </Text>
                                        )}
                                    </View>

                                    <Button
                                        title="Next"
                                        onPress={handleSubmit}
                                        disabled={!isValid}
                                    />
                                </>
                            )}
                        </Formik>
                    </View>

                    <Footer />
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}