import { Star } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

type prop = {
    rate: number;
    size?: number;
    medium?: boolean;
    setClick?: any;
    className?: string;
};

export default function Rating({ rate, size = 24, setClick, className }: prop) {
    return (
        <View style={{ flexDirection: "row", }} className={className}>
            <View style={{ flexDirection: "row" }}>
                {Array.from({ length: rate }, (_, index) => (
                    <Star
                        size={size}
                        color="#FDB415"
                        key={index}
                        onPress={() => setClick(index + 1)}
                    />
                ))}
            </View>
            <View style={{ flexDirection: "row" }}>
                {Array.from({ length: 5 - rate }, (_, index) => (
                    <Star
                        size={size}
                        color="#A3AAAE"
                        key={index}
                        onPress={() => setClick(index + rate + 1)}
                    />
                ))}
            </View>
        </View>
    );
}
