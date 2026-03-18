// app//products/CreateProductScreen.tsx
import { Dropdown } from "@/components/dropdown";
import InputField from "@/components/form/storeTextInputs";
import LoaderGif from "@/components/loader/loaderGIF";
import StoreWrapper from "@/components/wrapper/business";
import toaster from "@/config/toaster";
import useProductForm from "@/hooks/useProductForm";
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import { useGetOneProductsQuery, useUpdateProductMutation, useUploadProductMutation } from "@/redux/business/slices/productSlice";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { UploadCloud } from "lucide-react-native";
import { useRef, useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CategorySpecification from "./components";

const conditionOptions = [
    { label: "New", value: "new" },
    { label: "Used", value: "used" },
    { label: "Refurbished", value: "refurbished" },
];

export default function CreateProductScreen() {
    const insets = useSafeAreaInsets();
    const { id }: any = useLocalSearchParams()
    const { data: dataToEdit, isLoading: gettingToEdit, refetch } = useGetOneProductsQuery({ id }, { skip: !id });
    const [uploadHandler, { isLoading: uploading }] =
        useUploadProductMutation();
    const [updateHandler, { isLoading: updating }] = useUpdateProductMutation()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const scrollRef = useRef<ScrollView>(null);

    const { data: cates, isLoading: cateLoading, refetch: refetchCate } =
        useGetFeaturedCategoriesQuery("true");
    const categories = cates ? cates?.data : [];

    console.log({ categories })

    // Use the custom hook with all handlers
    const {
        formData,
        productGroups,
        loading,
        fromCollection,
        specInfo,
        newSpecKey,
        localFiles,

        // Handlers from the hook
        setNewSpecKey,
        handleTextChange,
        handleNumericChange,
        handleChangeCategory,
        handleSubCateSelection,
        handleProductGroupSelection,
        conditionHandler,
        handleImageUpload: hookImageUpload,
        removeImage,
        reset,
        setFormData,
    } = useProductForm(categories, dataToEdit);

    // Custom image upload handler using expo-image-picker
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

    const handleImageUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
            base64: true, // Add this to get base64 data
        });

        if (!result.canceled) {
            result.assets.forEach((asset) => {
                if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
                    toaster({
                        type: "error",
                        message: `${asset.fileName} size too large`,
                    });
                } else {
                    hookImageUpload(asset.uri, asset.base64);
                }
            });
        }
    };

    // Video upload handler
    const handleVideoUpload = (uri: string) => {
        setFormData((prev) => ({ ...prev, video: uri }));
    };

    const handleVideoRemove = () => {
        setFormData((prev) => ({ ...prev, video: undefined }));
    };

    // Form validation with error handling
    const validateFormWithErrors = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.label.trim()) {
            newErrors.label = "Product name is required";
        }

        if (!formData.price.trim()) {
            newErrors.price = "Price is required";
        } else if (isNaN(Number(formData.price))) {
            newErrors.price = "Price must be a valid number";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!formData.subcategory) {
            newErrors.subcategory = "Subcategory is required";
        }

        if (!formData.totalInStock.trim()) {
            newErrors.totalInStock = "Stock quantity is required";
        } else if (isNaN(Number(formData.totalInStock))) {
            newErrors.totalInStock = "Stock must be a valid number";
        }

        if (formData.images.length === 0) {
            newErrors.images = "At least one product image is required";
        }

        if (formData.condition.length === 0) {
            newErrors.condition = "At least one condition option is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Submit handler
    const handleSubmit = async () => {
        console.log("Submitting form with data:", formData);
        // if (!validateFormWithErrors()) {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
        console.log({ errors, formData });

        try {
            const handler = id ? updateHandler : uploadHandler
            const result = await handler(formData).unwrap();

            console.log({ result })

            toaster(result);
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.data?.message || "Failed to create product"
            );
        }
        // }
    };

    // Get subcategories from selected category
    const getSubcategories = () => {
        if (!fromCollection?.sub_category) return [];
        return fromCollection.sub_category.map((sub: any) => ({
            label: sub.label || sub.name,
            value: sub._id,
            ...sub,
        }));
    };

    // Get product groups from selected subcategory
    const getProductGroupOptions = () => {
        return productGroups.map((group) => ({
            label: group.name || group.label,
            value: group._id,
            ...group,
        }));
    };

    const handleRemoveImegeLink = (link: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img) => img !== link),
        }));
    }

    // Convert condition array to format expected by dropdown
    const getSelectedConditionOptions = () => {
        return formData.condition;
    };
    const isLoading = cateLoading || uploading || loading || (id ? gettingToEdit : false);
    let emptyImageSelector = id && formData.images.length !== 0 ? 4 - formData.images.length : 4
    if (emptyImageSelector < 0) emptyImageSelector = 0
    return (
        <StoreWrapper
            headerTitle={id ? `Update ${formData.label}` : "Add New Product"}
            hasFooter={false}
        >

            <View className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1"
                >
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={id ? () => {} : refetchCate} />}
                        ref={scrollRef}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >

                        {/* Image Upload Section */}
                        <View className="mb-6">
                            {/* Main Upload Area */}
                            <TouchableOpacity
                                onPress={handleImageUpload}
                                className="border-2 p-12 border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center mb-4"
                            >

                                <UploadCloud size={40} className="text-gray-900 dark:!text-white" />
                                <Text className="text-[15px] mt-3 font-medium text-gray-900 dark:text-white mb-3">
                                    Upload up to 5 images
                                </Text>
                                <Text className="text-base text-gray-500 dark:text-gray-400 mb-4 text-center">
                                    (345x255 or larger recommended, up to 1MB each)
                                </Text>

                            </TouchableOpacity>

                            {/* Image Preview Grid */}
                            <View className="flex-row flex-wrap">
                                {formData.images.map((each: string, i) => (
                                    <View key={i} className="w-1/4 p-1">
                                        <View className="relative">
                                            <Image
                                                source={{ uri: each }}
                                                className="w-full h-16 rounded-lg bg-gray-200 dark:bg-gray-700"
                                            />
                                            <TouchableOpacity
                                                onPress={() => handleRemoveImegeLink(each)}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                                            >
                                                <Ionicons
                                                    name="close"
                                                    size={14}
                                                    color="white"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                                {Array.from({ length: emptyImageSelector }).map((_, index) => (
                                    <View key={index} className="w-1/4 p-1">

                                        {localFiles[index] ? (
                                            <View className="relative">
                                                <Image
                                                    source={{ uri: localFiles[index] }}
                                                    className="w-full h-16 rounded-lg bg-gray-200 dark:bg-gray-700"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => removeImage(index)}
                                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center"
                                                >
                                                    <Ionicons
                                                        name="close"
                                                        size={14}
                                                        color="white"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={handleImageUpload}
                                                className="w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg items-center justify-center"
                                            >
                                                <Text className="text-gray-400 text-2xl">+</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Video Upload */}
                        {/* <VideoUploader
                        onUpload={handleVideoUpload}
                        onRemove={handleVideoRemove}
                        maxSizeMB={10}
                        currentVideo={formData.video}
                    /> */}

                        <InputField
                            label="Product Name"
                            placeholder="Product Name *"
                            value={formData.label}
                            error={errors.label}
                            onChangeText={(text: any) =>
                                handleTextChange("label", text)
                            }
                            className="mb-0"
                        />
                        <InputField
                            label="Price"
                            placeholder="Price *"
                            value={formData.price}
                            error={errors.price}
                            onChangeText={(text: any) =>
                                handleNumericChange("price", text)
                            }
                            keyboardType="numeric"
                            className="mt-3"
                        />
                        <InputField
                            label="Total in stock"
                            placeholder="Quantity in Stock *"
                            value={formData.totalInStock}
                            error={errors.totalInStock}
                            onChangeText={(text: any) =>
                                handleNumericChange("totalInStock", text)
                            }
                            keyboardType="numeric"
                            className="mt-2"
                        />


                        {/* Category Options */}
                        <View className="flex-row justify-between items-center">
                            <Text className="text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-2 mt-5">
                                Category Options
                            </Text>
                            <TouchableOpacity onPress={refetchCate}>
                                <Ionicons name="add" size={20} color={cateLoading ? "gray" : "gray"} />
                            </TouchableOpacity>
                        </View>

                        <Dropdown
                            options={categories.map((cat: any) => ({
                                label: cat.category || cat.name,
                                value: cat._id,
                                ...cat,
                            }))}
                            selected={[formData.category]} // Wrap in array since component expects array
                            onSelect={(selectedValues) => {
                                const selectedValue = selectedValues[0]; // Get first value for single select
                                const category = categories.find(
                                    (cat: any) => cat._id === selectedValue
                                );
                                if (category) {
                                    handleChangeCategory(category);
                                }
                            }}
                            placeholder="Select Category"
                            multiple={false}
                        />

                        {errors.category && (
                            <Text className="!text-red-500 mb-2">
                                {errors.category}
                            </Text>
                        )}

                        <Dropdown
                            options={getSubcategories()}
                            selected={[formData.subcategory]} // Wrap in array since component expects array
                            onSelect={(selectedValues) => {
                                const selectedValue = selectedValues[0]; // Get first value for single select
                                const subcategory = getSubcategories().find(
                                    (cat: any) => cat._id === selectedValue
                                );
                                if (subcategory) {
                                    handleSubCateSelection(subcategory);
                                }
                            }}
                            className="mt-2"
                            // disabled={!fromCollection}

                            placeholder="Select Product Sub Category *"
                            multiple={false}
                        />
                        {errors.subcategory && (
                            <Text className="!text-red-500 mb-2">
                                {errors.subcategory}
                            </Text>
                        )}

                        <Dropdown
                            options={getProductGroupOptions()}
                            selected={[formData.productGroup]}
                            onSelect={(selectedValues) => {
                                const selectedValue = selectedValues[0];
                                const group = getProductGroupOptions().find(
                                    (g) => g._id === selectedValue
                                );
                                console.log({ group })
                                if (group) {
                                    handleProductGroupSelection(group);
                                }
                            }}
                            className="mt-2 mb-6"
                            placeholder="Select Product Group"
                        />

                        {/* Category Specifications */}
                        <Text className="text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-5 mt-5">
                            Add Specifications
                        </Text>
                        {specInfo && (
                            <CategorySpecification
                                onSpecChange={(specs) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        specifications: specs,
                                    }))
                                }
                                specifications={formData.specifications}
                                keys={Object.keys(specInfo?.spec || {}).map((x) =>
                                    x?.replaceAll("_", " ")
                                )}
                                values={
                                    specInfo.spec?.[
                                    newSpecKey?.replaceAll(" ", "_")
                                    ] || []
                                }
                                newSpecKey={newSpecKey}
                                setNewSpecKey={setNewSpecKey}
                            />
                        )}

                        {/* Condition Options */}
                        <Text className="text-[14px] font-bold text-gray-700 dark:text-gray-300 mb-2 mt-5">
                            Condition Options *
                        </Text>
                        <Dropdown
                            options={conditionOptions}
                            selected={[formData.condition]} // This should be an array of selected values
                            onSelect={(selected) => {
                                if (Array.isArray(selected)) {
                                    setFormData((prev) => ({
                                        ...prev,
                                        condition: selected[0], // Get first value for single select
                                    }));
                                } else {
                                    conditionHandler(selected);
                                }
                            }}
                            className=""
                            placeholder="Select condition methods *"
                            multiple
                        />
                        {errors.condition && (
                            <Text

                                className="!text-red-500 mb-2"
                            >
                                {errors.condition}
                            </Text>
                        )}

                        {/* Description */}
                        <View className="!mt-2">
                            <InputField
                                label="Description"
                                placeholder="Product Description"
                                value={formData.description}
                                onChangeText={(text: any) =>
                                    handleTextChange("description", text)
                                }
                                multiline={true}
                                className="mt-3 !mb-10 !p-0"
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <View className="flex-row px-3 border-t border-gray-200 dark:border-gray-700 pt-4 bg-white dark:bg-gray-900">
                    <TouchableOpacity
                        onPress={handleSubmit}
                        style={{
                            width: "46%",
                            marginRight: "4%",
                        }}
                        className="h-14 bg-[#2C337C] dark:!bg-orange-500 flex justify-center rounded-full !w-[50%]"
                        disabled={isLoading}
                    >
                        <Text
                            style={{ color: "#fff" }}
                            className="text-center font-semibold !text-white dark:text- text-xl"
                        >
                            {isLoading
                                ? updating ? "Updating Product" : "Creating Product..."
                                : id ? "Update Product" : "Create Product"}
                        </Text>
                    </TouchableOpacity>
                    {/* Reset Button */}
                    <TouchableOpacity
                        onPress={() => {
                            reset();
                            setErrors({});
                        }}
                        style={{ width: "46%" }}
                        className="border-2 border-[#2C337C] dark:!border-gray-500  dark:bg-gray-800 h-14 flex justify-center rounded-full"
                    >
                        <Text className="text-center font-semibold text-xl dark:text-gray-200">
                            Reset Form
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: insets.bottom }} className="bg-white dark:bg-gray-900" />
            </View>
            {isLoading && <View className="absolute w-full h-full flex justify-center items-center">
                <View className="w-full h-full absolute bg-black opacity-10"></View>
                <LoaderGif />
            </View>}
        </StoreWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 32,
    },
});
