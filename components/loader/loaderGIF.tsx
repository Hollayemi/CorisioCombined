import { Image } from "react-native";
import { View } from "react-native";

export default function LoaderGif() {
    return (
        <View className="flex-1 justify-center items-center p-4">
            {/* Local GIF */}
            <Image
                source={require("@/assets/gif/corisio.gif")}
                className="w-28 h-28"
                // contentFit="contain"
            />

            {/* <Image
                source={require("@/assets/gif/loading.gif")}
                className="w-28 h-28"
                // contentFit="contain"
            /> */}

            
        </View>
    );
}