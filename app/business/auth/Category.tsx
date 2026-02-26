import { CategorySelector } from '@/components/category/selector';
import ProgressHeader from '@/components/wrapper/business/headers/authHeader';
import { useGetFeaturedCategoriesQuery } from "@/redux/business/slices/growthSlice";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { PageHeader } from './component';


export default function CategorySelectionScreen() {
    const { data: cates, isLoading, refetch } = useGetFeaturedCategoriesQuery(false);
    const categoryTree = cates ? cates?.data : [];
    const [selectedCategories, setSelectedCategories] = useState({
        main: [],
        subCategories: [],
        groups: []
    });

    return (
        <SafeAreaView className="bg-white flex-1 dark:bg-gray-900">
            <ProgressHeader
                currentStep={5}
            />
            <PageHeader
                title="Set the Stage for Your Store"
                subtitle="Choose your category and subcategory, let’s make you discoverable!"
            />

            <View className="flex-1 h-full">
                <CategorySelector
                    categories={categoryTree}
                    refetch={refetch}
                    handleNext={() => router.push({ pathname: "/business/auth/Signup1", params: { categories: JSON.stringify(selectedCategories) } })}
                    isLoading={isLoading}
                    onSelectionChange={setSelectedCategories}
                    initialSelection={selectedCategories}
                />
            </View>
        </SafeAreaView>
    );
};