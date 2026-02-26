import { ApiResponse } from '@/helper/prop';
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api/axiosBaseQuery';

interface Campaign {
    id: string;
    title: string;
    description: string;
    type: 'discount' | 'promotion' | 'announcement';
    discountType?: 'percentage' | 'fixed';
    discountValue?: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    targetAudience?: string[];
    products?: string[];
    branches?: string[];
    createdAt: string;
    updatedAt: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isActive: boolean;
    targetAudience?: string[];
    expiryDate?: string;
    createdAt: string;
}

interface CampaignStats {
    totalCampaigns: number;
    activeCampaigns: number;
    upcomingCampaigns: number;
    expiredCampaigns: number;
    totalReach: number;
    totalEngagement: number;
    conversionRate: number;
}

interface DashboardCards {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    productsGrowth: number;
}

interface CategorySalesCount {
    categoryId: string;
    categoryName: string;
    totalSales: number;
    totalRevenue: number;
    percentage: number;
}

interface ChartData {
    date: string;
    orders: number;
    carts: number;
    views: number;
}

interface BuyerData {
    customerId: string;
    customerName: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    isRead: boolean;
    createdAt: string;
}

export const campaignsDashboardApi = createApi({
    reducerPath: 'campaignsDashboardApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Campaign', 'Announcement', 'Dashboard', 'Notification'],
    endpoints: (builder) => ({
        // Campaigns
        getAllCampaigns: builder.query<Campaign[], {
            page?: number;
            limit?: number;
            status?: 'active' | 'inactive' | 'upcoming' | 'expired';
        }>({
            query: (params) => ({
                url: '/branch/campaign',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Campaign' as const, id })), 'Campaign']
                    : ['Campaign'],
        }),

        addCampaign: builder.mutation<CampaignResponse, CreateCampaignPayload>({
            query: (campaignData) => ({
                url: '/branch/campaign',
                method: 'POST',
                body: campaignData,
            }),
            invalidatesTags: ['Campaign'],
        }),

        getCampaignStats: builder.query<CampaignStats, void>({
            query: () => ({
                url: '/branch/campaign/stats',
                method: 'GET',
            }),
            providesTags: ['Campaign'],
        }),

        // Announcements
        getAnnouncements: builder.query<Announcement[], {
            page?: number;
            limit?: number;
            isActive?: boolean;
        }>({
            query: (params) => ({
                url: '/branch/announcement',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Announcement' as const, id }), 'Announcement')]
                    : ['Announcement'],
        }),

        addAnnouncement: builder.mutation<AnnouncementResponse, CreateAnnouncementPayload>({
            query: (announcementData) => ({
                url: '/branch/announcement',
                method: 'POST',
                body: announcementData,
            }),
            invalidatesTags: ['Announcement'],
        }),

        // Dashboard Data
        getDashboardCards: builder.query<DashboardCards, {
            period?: 'today' | 'week' | 'month' | 'year';
        }>({
            query: (params) => ({
                url: '/dashboard/cards',
                method: 'GET',
                params,
            }),
            providesTags: ['Dashboard'],
        }),

        getCategorySalesCount: builder.query<CategorySalesCount[], {
            period?: 'today' | 'week' | 'month' | 'year';
        }>({
            query: (params) => ({
                url: '/dashboard/categorie-count',
                method: 'GET',
                params,
            }),
            providesTags: ['Dashboard'],
        }),

        // Charts & Analytics
        getOrderCartViewIncrement: builder.query<ChartData[], {
            period?: 'week' | 'month' | 'year';
            startDate?: string;
            endDate?: string;
        }>({
            query: (params) => ({
                url: '/branch/increment-chart',
                method: 'GET',
                params,
            }),
            providesTags: ['Dashboard'],
        }),

        getRecentBuyersBubble: builder.query<BuyerData[], {
            limit?: number;
            period?: 'week' | 'month' | 'year';
        }>({
            query: (params) => ({
                url: '/branch/buyer-chart',
                method: 'GET',
                params,
            }),
            providesTags: ['Dashboard'],
        }),

        // Notifications
        getBusinessNotifications: builder.query<ApiResponse<any>, {
            page?: number;
            limit?: number;
            isRead?: boolean;
        }>({
            query: (params) => ({
                url: '/store/notification',
                method: 'GET',
                params,
            })
        }),

        viewAllStoreNotifications: builder.mutation<void, void>({
            query: () => ({
                url: '/branch/notification/view-all',
                method: 'POST', // Changed to POST as it modifies server state
            }),
            invalidatesTags: ['Notification'],
        }),

        deleteNotifications: builder.mutation<DeleteNotificationResponse, { notificationIds: string[] }>({
            query: (data) => ({
                url: '/store/delete/notification',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Notification'],
        }),
    }),
});

// Type definitions
interface Campaign {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'upcoming' | 'expired';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateCampaignPayload extends Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'> { }

interface CampaignResponse {
    success: boolean;
    data: Campaign;
    message?: string;
}

interface CampaignStats {
    active: number;
    inactive: number;
    upcoming: number;
    expired: number;
    total: number;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    isActive: boolean;
    createdAt: string;
}

interface CreateAnnouncementPayload extends Omit<Announcement, 'id' | 'createdAt'> { }

interface AnnouncementResponse {
    success: boolean;
    data: Announcement;
    message?: string;
}

interface DashboardCards {
    totalSales: number;
    totalOrders: number;
    newCustomers: number;
    conversionRate: number;
}

interface CategorySalesCount {
    category: string;
    count: number;
    revenue: number;
}

interface ChartData {
    date: string;
    value: number;
}

interface BuyerData {
    id: string;
    name: string;
    email: string;
    purchaseCount: number;
    lastPurchase: string;
}

interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface DeleteNotificationResponse {
    success: boolean;
    message?: string;
    deletedCount: number;
}

export const {
    useGetAllCampaignsQuery,
    useAddCampaignMutation,
    useGetCampaignStatsQuery,
    useGetAnnouncementsQuery,
    useAddAnnouncementMutation,
    useGetDashboardCardsQuery,
    useGetCategorySalesCountQuery,
    useGetOrderCartViewIncrementQuery,
    useGetRecentBuyersBubbleQuery,
    useGetBusinessNotificationsQuery,
    useViewAllStoreNotificationsMutation,
    useDeleteNotificationsMutation,
} = campaignsDashboardApi;

// ======================