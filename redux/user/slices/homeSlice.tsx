import LocationManager from '@/hooks/useCoordinates';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

// Define types for your API responses
interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
    // Add other product fields as needed
}

interface SearchQuery {
    query: string;
    filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        // Add other filter options
    };
}

interface Ad {
    id: string;
    title: string;
    image: string;
    link: string;
    // Add other ad fields
}

interface FlashSale {
    id: string;
    product: Product;
    originalPrice: number;
    discountedPrice: number;
    endTime: string;
    // Add other flash sale fields
}

interface Store {
    id: string;
    name: string;
    address: string;
    distance: number;
    rating: number;
    // Add other store fields
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

interface latLng {
    lat?: string | number | null,
    lng?: string | number | null
}

interface GetProductParams {
    productId?: string | null,
    p?: string | number | null,
    search?: string | null,
    limit?: string | number | null,
    lat?: string | number | null,
    lng?: string | number | null
}

export const homeApi = createApi({
    reducerPath: 'homeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Product', 'Search', 'HomeData'],
    endpoints: (builder) => ({
        // Get all products (requires authentication)
        getAllCategories: builder.query<ApiResponse<Product[]>, void>({
            query: () => ({
                url: '/corisio/all-categories',
                method: "GET",
            }),
        }),
        // Get all products (requires authentication)
        getAllProducts: builder.query<any, GetProductParams>({
            query: ({ productId, p = 1, search, limit = 20, lat, lng, ...rest }) => {
                const locationManager = new LocationManager()
                const currentLocation = locationManager.getCurrentLocation();
                console.log("currentLocation===>", currentLocation)
                return ({
                    url: '/products',
                    method: "GET",
                    params: {
                        lat: lat || currentLocation?.latitude,
                        lng: lng || currentLocation?.longitude,
                        limit,
                        search,
                        productId,
                        p,
                        ...rest
                    },
                    providesTags: ['Product']
                })
            },
        }),
        // Search products
        searchProducts: builder.mutation<ApiResponse<Product[]>, SearchQuery>({
            query: (searchData) => ({
                url: '/search',
                method: 'POST',
                body: searchData,
            }),
            invalidatesTags: ['Search'],
        }),
        // Get available ads for home page
        getAvailableAds: builder.query<ApiResponse<Ad[]>, void>({
            query: () => ({
                url: '/home/ads',
                method: "GET",
                providesTags: ['HomeData']
            }),
        }),
        // Get flash sales for home page
        getFlashSales: builder.query<ApiResponse<FlashSale[]>, void>({
            query: () => ({
                url: '/home/flashsales',
                method: "GET",
                providesTags: ['HomeData']
            }),
        }),

        // Get popular products for home page
        getPopularProducts: builder.query<ApiResponse<Product[]>, latLng>({
            query: ({ lat, lng }) => ({
                url: '/home/popular-products',
                method: "GET",
                params: {
                    lat,
                    lng,
                },
                providesTags: ['HomeData']
            }),
        }),

        getSimilarProduct: builder.query<ApiResponse<Product[]>, latLng & { category?: string }>({
            query: (params) => ({
                url: '/home/similar-products',
                method: "GET",
                params,
                providesTags: ['HomeData']
            }),
        }),

    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetAllProductsQuery,
    useSearchProductsMutation,
    useGetAvailableAdsQuery,
    useGetFlashSalesQuery,
    useGetPopularProductsQuery,
    useGetSimilarProductQuery,
} = homeApi;