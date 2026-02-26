/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

// Type definitions
interface ProductSpecifications {
    sizes?: string[];
    variations?: Record<string, any>;
    [key: string]: any;
}

// Type for the product form data
interface ProductFormData {
    prodName: string;
    prodPrice: string;
    prodKey: string;
    prodInfo: string;
    specifications: ProductSpecifications;
    images: string[];
    newImages: string[];
    totInStock: string;
    subCollectionName: string;
    collectionName: string;
    category: string;
    subcategory: string;
    productGroup: string;
    delivery: string[];
    video?: string;
    collectionId?: string;
    subCollection?: string;
    _id?: string;
}

interface Category {
    _id: string;
    category: string;
    [key: string]: any;
}

interface SubCategory {
    _id: string;
    label: string;
    collectionName: string;
    groups: ProductGroup[];
    [key: string]: any;
}

interface ProductGroup {
    _id: string;
    spec: string;
    [key: string]: any;
}

interface GenPayload {
    category?: string;
    subcategory?: string;
    [key: string]: any;
}

interface ProductToEdit {
    prodName: string;
    prodPrice: string;
    video?: string;
    prodKey: string;
    prodInfo: string;
    images: string[];
    newImages: string[];
    totInStock: string;
    collectionId: string;
    subCollection: string;
    subCollectionName: string;
    collectionName: string;
    subcategory: string;
    productGroup: string;
    delivery: string[];
    specifications?: {
        variations?: Record<string, any>;
    };
    categoryId: string;
    _id: string;
    category: string;
}

// Utility function to remove or add to array
const removeOrAddToArray = <T>(value: T, array: T[], setter: (newArray: T[]) => void): void => {
    const index = array.indexOf(value);
    if (index > -1) {
        setter(array.filter((item) => item !== value));
    } else {
        setter([...array, value]);
    }
};

// Custom hook for product form management
const useProductForm = (categories: Category[] = [], dataToEdit?: { data?: {} }) => {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [newSpecKey, setNewSpecKey] = useState<string>("");
    const [specValue, setSpecValue] = useState<string>("");
    const [specInfo, setProdSpecs] = useState<any>({});
    const [productGroups, setGroups] = useState<ProductGroup[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [fromCollection, setFromCollection] = useState<Category | null>(null);
    const [localFiles, setLocalFiles] = useState<any[]>([]);
    const [delivery, selectDelivery] = useState<string[]>(["pickup"]);
    const [genPayload, getGenPayload] = useState<GenPayload | null>(null);
    const [descLoading, setDescLoading] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [formData, setFormData] = useState<ProductFormData>({
        prodName: "",
        prodPrice: "",
        prodKey: "",
        prodInfo: "",
        specifications: { sizes: selectedSizes },
        images: [],
        newImages: [],
        totInStock: "",
        subCollectionName: "",
        collectionName: "",
        category: "",
        subcategory: "",
        productGroup: "",
        delivery,
    });

    const prodToEdit = (dataToEdit?.data ?? {}) as ProductToEdit;

    useEffect(() => {
        setFromCollection(categories.filter((x) => x._id === formData.category)[0] || null);
    }, [formData.category, prodToEdit]);
    // Reset form to initial state

    const reset = (): void => {
        setFormData({
            prodName: "",
            prodPrice: "",
            prodKey: "",
            prodInfo: "",
            specifications: { sizes: [] },
            images: [],
            newImages: [],
            totInStock: "",
            subCollectionName: "",
            collectionName: "",
            category: "",
            subcategory: "",
            productGroup: "",
            delivery: ["pickup"],
        });
        setFiles([]);
        setLocalFiles([]);
        setSelectedSizes([]);
        setNewSpecKey("");
        setSpecValue("");
        setProdSpecs("");
    };

    useEffect(() => {
        if (dataToEdit) {
            setFormData({
                prodName: prodToEdit.prodName || "",
                prodPrice: prodToEdit.prodPrice?.toString() || "",
                video: prodToEdit.video,
                prodKey: prodToEdit.prodKey || "",
                prodInfo: prodToEdit.prodInfo || "",

                images: prodToEdit.images || [],
                newImages: [],
                totInStock: prodToEdit.totInStock?.toString() || "",
                collectionId: prodToEdit.collectionId,
                subCollection: prodToEdit.subCollection,

                subCollectionName: prodToEdit.subCollectionName || "",
                collectionName: prodToEdit.collectionName || "",
                subcategory: prodToEdit.subcategory || "",
                productGroup: prodToEdit.productGroup || "",
                delivery: prodToEdit.delivery || ["pickup"],

                specifications: prodToEdit.specifications || {},
                category: prodToEdit.category || "",
                _id: prodToEdit._id,
            });

            selectDelivery(prodToEdit.delivery || ["pickup"]);
            setProdSpecs(prodToEdit.specifications || {});
            setFromCollection(categories.filter((x) => x._id === prodToEdit.category)[0] || null);
            fromCollection?.sub_category.map((sub: any) => sub._id === prodToEdit.subcategory && setGroups(sub.groups || []));
            productGroups.map((group) => group._id === prodToEdit.productGroup && setProdSpecs(group.spec || ""));
        }
    }, [formData.category, dataToEdit, prodToEdit, categories, fromCollection?.sub_category, productGroups]);




    // Generic form field change handler
    const handleChange = (prop: keyof ProductFormData) => {
        (value: string): void => {
            setFormData((prev) => ({ ...prev, [prop]: value }));
        }
    }

    // Handle text input changes (for TextInput onChangeText)
    const handleTextChange = (
        prop: keyof ProductFormData,
        value: string
    ): void => {
        // Remove parentheses, plus signs as per your comment
        const sanitizedValue = value.replace(/[()+=]/g, "");
        setFormData((prev) => ({ ...prev, [prop]: sanitizedValue }));
    };

    // Handle numeric input changes with validation
    const handleNumericChange = (
        prop: keyof ProductFormData,
        value: string
    ): void => {
        const numericValue = value.replace(/[^0-9.]/g, "");
        setFormData((prev) => ({ ...prev, [prop]: numericValue }));
    };

    // Delivery handler
    const deliveryHandler = (value: string): void => {
        removeOrAddToArray(value, delivery, selectDelivery);
        setFormData((prev) => ({
            ...prev,
            delivery: delivery.includes(value)
                ? delivery.filter((d) => d !== value)
                : [...delivery, value],
        }));
    };

    // Category selection handler
    const handleChangeCategory = (selectedCategory: Category): void => {
        const { category, _id } = selectedCategory;
        getGenPayload((prev) => ({
            ...prev,
            category,
        }));

        setFormData((prev) => ({
            ...prev,
            category: _id,
            collectionName: category,
            // Reset dependent fields
            subcategory: "",
            subCollectionName: "",
            productGroup: "",
        }));

        // Reset dependent states
        setGroups([]);
        setProdSpecs("");
    };

    // Subcategory selection handler
    const handleSubCateSelection = (selectedSubCategory: SubCategory): void => {
        const { _id, groups, label }: any = selectedSubCategory;
        getGenPayload((prev) => ({ ...prev, subcategory: label, }));
        setFormData((prev) => ({
            ...prev,
            subcategory: _id,
            subCollectionName: label,
            productGroup: "",
        }));
        setGroups(groups || []);
        setProdSpecs("");
    };

    // Product group selection handler
    const handleProductGroupSelection = (selectedProductGroup: ProductGroup): void => {
        const { spec, _id } = selectedProductGroup;
        setFormData((prev) => ({
            ...prev,
            productGroup: _id,
        }));
        setProdSpecs(spec || "");
    };


    // Size selection handlers
    const handleSizeSelection = (size: string): void => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter((s) => s !== size)
            : [...selectedSizes, size];

        setSelectedSizes(newSizes);
        setFormData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                sizes: newSizes,
            },
        }));
    };


    // Add custom specification
    const addCustomSpec = (): void => {
        if (newSpecKey.trim() && specValue.trim()) {
            setFormData((prev) => ({
                ...prev,
                specifications: {
                    ...prev.specifications,
                    [newSpecKey.trim()]: specValue.trim(),
                },
            }));
            setNewSpecKey("");
            setSpecValue("");
        }
    };

    // Remove custom specification
    const removeCustomSpec = (specKey: string): void => {
        setFormData((prev) => {
            const newSpecKeys = { ...prev.specifications };
            delete newSpecKeys[specKey];
            return {
                ...prev,
                specifications: newSpecKeys,
            };
        });
    };

    // Image handlers
    const handleImageUpload = async (
        imageUri: string,
        base64: any
    ): Promise<void> => {
        setLocalFiles((prev) => [...prev, imageUri]);
        const mimeType = imageUri.split(".").pop() || "jpeg";
        const dataUri = `data:image/${mimeType};base64,${base64}`;

        setFormData((prev) => ({
            ...prev,
            newImages: [...prev.newImages, dataUri],
        }));
    };

    const removeImage = (index: number): void => {
        setLocalFiles((prev) => [...prev.filter((_, i) => i !== index)]);
        setFormData((prev) => ({
            ...prev,
            newImages: prev.newImages.filter((_, i) => i !== index),
        }));
    };

    // Form validation
    const validateForm = (): boolean => {
        const requiredFields: (keyof ProductFormData)[] = [
            "prodName",
            "prodPrice",
            "prodInfo",
            "category",
            "subcategory",
            "totInStock",
        ];

        return requiredFields.every((field) => {
            const value = formData[field];
            return value && value.toString().trim() !== "";
        });
    };

    return {
        // State
        formData,
        selectedSizes,
        newSpecKey,
        specValue,
        specInfo,
        productGroups,
        files,
        localFiles,
        delivery,
        genPayload,
        descLoading,
        loading,
        fromCollection,

        // Setters
        setFormData,
        setSelectedSizes,
        setNewSpecKey,
        setSpecValue,
        setProdSpecs,
        setGroups,
        setFiles,
        setLocalFiles,
        selectDelivery,
        getGenPayload,
        setDescLoading,
        setLoading,

        // Handlers
        handleChange,
        handleTextChange,
        handleNumericChange,
        deliveryHandler,
        handleChangeCategory,
        handleSubCateSelection,
        handleProductGroupSelection,
        handleSizeSelection,
        addCustomSpec,
        removeCustomSpec,
        handleImageUpload,
        removeImage,
        reset,
        validateForm,
    };
};

export default useProductForm;

export type {
    Category,
    GenPayload,
    ProductFormData,
    ProductGroup,
    ProductSpecifications,
    ProductToEdit,
    SubCategory
};

