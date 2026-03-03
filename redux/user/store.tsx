// 1. Store configuration (store/index.ts)
import { configureStore } from '@reduxjs/toolkit';
import { addressApi } from './slices/addressSlice';
import authReducer, { authApi } from './slices/authSlice';
import { cartApi } from './slices/cartSlice';
import { chatApi } from './slices/chatSlice';
import { feedbackApi } from './slices/feedbackSlice';
import { followingApi } from './slices/followSlice';
import { homeApi } from './slices/homeSlice';
import { orderApi } from './slices/orderSlice';
import { pickupApi } from './slices/pickupSlice';
import { referralApi } from './slices/referralSlice';
import { savedItemsApi } from './slices/saveItemSlice';
import { storeApi } from './slices/storeSlice';
import { userApi } from './slices/userSlice2';
import { viewsApi } from './slices/viewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [homeApi.reducerPath]: homeApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [chatApi.reducerPath]: chatApi.reducer,
        [viewsApi.reducerPath]: viewsApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [pickupApi.reducerPath]: pickupApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [referralApi.reducerPath]: referralApi.reducer,
        [addressApi.reducerPath]: addressApi.reducer,
        [feedbackApi.reducerPath]: feedbackApi.reducer,
        [savedItemsApi.reducerPath]: savedItemsApi.reducer,
        [followingApi.reducerPath]: followingApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(userApi.middleware)
            .concat(homeApi.middleware)
            .concat(cartApi.middleware)
            .concat(chatApi.middleware)
            .concat(viewsApi.middleware)
            .concat(pickupApi.middleware)
            .concat(orderApi.middleware)
            .concat(storeApi.middleware)
            .concat(referralApi.middleware)
            .concat(feedbackApi.middleware)
            .concat(addressApi.middleware)
            .concat(savedItemsApi.middleware)
            .concat(followingApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;