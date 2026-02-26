import { Image, View } from 'react-native';
;

interface GroupAvatarProps {
    images: string[];
    className?: string
}

export default function GroupAvatar({ images, className }: GroupAvatarProps) {
    const imageCount = Math.min(images.length, 4);
    const img = images.slice(0, imageCount);

    return (
        <View className={`h-16 w-16 overflow-hidden rounded-xl bg-neutral-200 flex-wrap flex-row ${className}`}>
            {imageCount === 1 && (
                <Image source={{ uri: img[0] }} className="h-16 w-16" resizeMode="cover" />
            )}

            {imageCount === 2 && (
                <>
                    <Image source={{ uri: img[0] }} className="w-1/2 h-16" resizeMode="cover" />
                    <Image source={{ uri: img[1] }} className="w-1/2 h-16" resizeMode="cover" />
                </>
            )}

            {imageCount === 3 && (
                <>
                    <View className="flex-row w-full h-1/2">
                        <Image source={{ uri: img[0] }} className="w-1/2 h-full" resizeMode="cover" />
                        <Image source={{ uri: img[1] }} className="w-1/2 h-full" resizeMode="cover" />
                    </View>
                    <Image source={{ uri: img[2] }} className="w-full h-1/2" resizeMode="cover" />
                </>
            )}

            {imageCount === 4 && (
                <>
                    <View className="flex-row w-full h-1/2">
                        <Image source={{ uri: img[0] }} className="w-1/2 h-full" resizeMode="cover" />
                        <Image source={{ uri: img[1] }} className="w-1/2 h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-row w-full h-1/2">
                        <Image source={{ uri: img[2] }} className="w-1/2 h-full" resizeMode="cover" />
                        <Image source={{ uri: img[3] }} className="w-1/2 h-full" resizeMode="cover" />
                    </View>
                </>
            )}
        </View>
    );
}
