import { configureStore } from "@reduxjs/toolkit";

import authReducer, { authApi } from "./slices/authSlices";
import { branchApi } from './slices/branchSlice';
import { campaignsDashboardApi } from './slices/campaignSlice';
import { chatApi } from './slices/chatSlice';
import { growthApi } from './slices/growthSlice';
import { ordersCustomersApi } from './slices/orderSlice';
import { productApi } from "./slices/productSlice";
import { referralApi } from "./slices/referralSlice";
import { staffApi } from './slices/staffSlice';
import { storeApi } from './slices/storeSlice';
import { storeInfoApi } from './slices/storeInfoSlice';
import { paymentApi } from "./slices/transaction";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [staffApi.reducerPath]: staffApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [storeInfoApi.reducerPath]: storeInfoApi.reducer,
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
            .concat(storeInfoApi.middleware)
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
