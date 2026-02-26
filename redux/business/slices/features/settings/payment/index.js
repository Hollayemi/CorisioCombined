import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';
import toaster from "@/app/configs/toaster";
import martApi from '../../../api/baseApi';
import { jsonHeader } from '../../../api/setAuthHeaders';

export const businessSubscriptionApi = createAsyncThunk(
    'post/paymentRef',
    async (payload) => {
        const { data } = await martApi
            .post('/store/plan/new', payload, jsonHeader("store"))
            .then((e) => e)
            .catch((e) => e.response);
        return data;
    }
);

export const businessSubscription = (dispatch, payload) => {
    dispatch(businessSubscriptionApi(payload))
        .then(unwrapResult)
        .then((res) => {
            console.log(res)
            if (res.type === 'Transaction was successful') {
                toaster({ ...res });
            }
        })
        .catch((e) => {
            console.log(e);
        });
};
/*

*/
export const getRefApi = createAsyncThunk(
    'post/paymentRef',
    async (payload) => {
        const { data } = await martApi
            .post('/getMyReference', payload, {})
            .then((e) => e)
            .catch((e) => e.response);
        console.log(data);
        return data;
    }
);

export const getReference = (dispatch, payload, setData) => {
    dispatch(getRefApi(payload))
        .then(unwrapResult)
        .then((res) => {
            if (res.type === 'success') {
                console.log(res);
                setData(res.message);
            }
        })
        .catch((e) => {});
};
