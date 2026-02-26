import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    View
} from "react-native";

interface SliderProps {
    children: React.ReactNode[]; // Children prop for passing items inside the component
    autoSlide?: boolean; // Option to enable/disable auto-sliding
    interval?: number; // Time interval for auto-sliding (in milliseconds)
    itemsPerView?: number; // Number of items to display per view (for sliding)
    useFade?: boolean; // Option to enable fading instead of sliding
    className?: string;
    height?: number
}

const { width: screenWidth } = Dimensions.get("window"); // Get the screen width for the slider

const Slider: React.FC<SliderProps> = ({
    children,
    autoSlide = true,
    interval = 5000, // default to 3 seconds
    itemsPerView = 3, // display one item by default (for sliding)
    useFade = false, // default to sliding behavior
    className,
    height,
}) => {
    const flatListRef = useRef<FlatList>(null); // Ref for controlling the FlatList (sliding)
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current index
    const fadeAnim = useRef(new Animated.Value(1)).current; // Animated value for opacity
    const childrenArray = React.Children.toArray(children); // Convert children to an array
    const totalItems = childrenArray.length; // Get the total number of children

    useEffect(() => {
        let autoSlideInterval: NodeJS.Timeout;
        if (autoSlide) {
            autoSlideInterval = setInterval(() => {
                setCurrentIndex((prevIndex) => {
                    const nextIndex = (prevIndex + 1) % totalItems; // Loop back to the start after the last item

                    if (useFade) {
                        fadeOutIn(nextIndex); // Fade transition
                    } else {
                        flatListRef.current?.scrollToIndex({
                            index: nextIndex,
                            animated: true,
                        });
                    }

                    return nextIndex;
                });
            }, interval);
        }

        // Clear interval when component unmounts
        return () => {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
        };
    }, [autoSlide, interval, totalItems, useFade]);

    // Function to handle fade in/out effect
    const fadeOutIn = (nextIndex: number) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0, // Fade out
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1, // Fade in
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setCurrentIndex(nextIndex); // Set the next index after the animation completes
        });
    };

    const itemWidth = screenWidth / itemsPerView; // Calculate the width based on items per view

    return (
        <View style={[{ height: height || 200 }]} className={className}>
            {useFade ? (
                <Animated.View
                    style={[styles.fadeContainer, { opacity: fadeAnim }]}
                >
                    {childrenArray[currentIndex]}
                </Animated.View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={childrenArray}
                    renderItem={({ item }) => (
                        <View
                            style={[styles.itemContainer, { width: itemWidth }]}
                        >
                            {item}
                        </View>
                    )}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal
                    pagingEnabled={itemsPerView === 1} // Only use paging if displaying one item at a time
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={itemWidth} // Snapping based on item width
                    decelerationRate="fast"
                    onMomentumScrollEnd={(event) => {
                        const offsetX = event.nativeEvent.contentOffset.x;
                        const newIndex = Math.floor(offsetX / itemWidth);
                        setCurrentIndex(newIndex); // Update current index on manual scroll
                    }}
                    getItemLayout={(_, index) => ({
                        length: itemWidth,
                        offset: itemWidth * index,
                        index,
                    })}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    fadeContainer: {
        width: screenWidth - 28, // Full width for fade effect
        height: "100%", // Full height
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Slider;
