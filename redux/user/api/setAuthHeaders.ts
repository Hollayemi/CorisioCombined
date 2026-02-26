import AsyncStorage from "@react-native-async-storage/async-storage";

export const jsonHeader = async () => {
    const config = {
        headers: {
            "content-type": "application/json",
            Authorization:
                "Bearer " + (await AsyncStorage.getItem("user_token")),
        },
    };
    return config;
};
