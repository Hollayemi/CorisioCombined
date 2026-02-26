import { configureStore } from "@reduxjs/toolkit";


import authReducer, { authApi } from "./slices/authSlice";
import { branchApi } from './slices/branchSlice';
import { campaignsDashboardApi } from './slices/campaignSlice';
import { chatApi } from './slices/chatSlice';
import { productApi } from "./slices/productSlice";
import { growthApi } from './slices/growthSlice';
import { ordersCustomersApi } from './slices/orderSlice';
import { referralApi } from "./slices/referralSlice";
import { staffApi } from './slices/staffSlice';
import { storeApi } from './slices/storeSlice';
import { paymentApi } from "./slices/transaction";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [growthApi.reducerPath]: growthApi.reducer,
        [branchApi.reducerPath]: branchApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [referralApi.reducerPath]: referralApi.reducer,
        [ordersCustomersApi.reducerPath]: ordersCustomersApi.reducer,
        [campaignsDashboardApi.reducerPath]: campaignsDashboardApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(staffApi.middleware)
            .concat(productApi.middleware)
            .concat(storeApi.middleware)
            .concat(growthApi.middleware)
            .concat(branchApi.middleware)
            .concat(chatApi.middleware)
            .concat(paymentApi.middleware)
            .concat(referralApi.middleware)
            .concat(ordersCustomersApi.middleware)
            .concat(campaignsDashboardApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
