import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import toaster from "@/app/configs/toaster";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { getAccount } from "../../auth/Login";
import tokens from "@/app/configs/tokens";
import { mutate } from "swr";

export const storeAuthHandler = () => <></>;
export const editShopAuth = () => <></>;

const editEntryModeApi = createAsyncThunk(
  "post/fetchBranch",
  async (payload) => {
    const { data } = await martApi
      .patch(`/store/profile`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const editEntryModeHandler = (dispatch, payload) => {
  dispatch(editEntryModeApi(payload))
    .then(unwrapResult)
    .then((res) => {
      toaster({ ...res });
      if (res.type === "success") {
        dispatch(getAccount());
        // dispatch(storeLogout());
      }
    })
    .catch((e) => {});
};
//
//
//
//
//
const updateStoreProfileApi = createAsyncThunk(
  "patch/storeProfile",
  async (payload) => {
    const { data } = await martApi
      .patch(`/store/profile`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const updateStoreProfile = (dispatch, payload, callback = () => {}) => {
  dispatch(updateStoreProfileApi(payload))
    .then(unwrapResult)
    .then((res) => {
      toaster({ ...res });
      if (res.type === "success") {
        dispatch(getAccount());
        callback()
      }
      mutate("/store");
    })
    .catch((e) => {});
};
//
//
//
//
//
const addStoreProfileApi = createAsyncThunk(
  "patch/storeProfile",
  async (payload) => {
    const { data } = await martApi
      .post(`/create/branch`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const addSubStore = (dispatch, payload) => {
  console.log(payload);
  dispatch(addStoreProfileApi(payload))
    .then(unwrapResult)
    .then((res) => {
      toaster({ ...res });
      mutate("/store");
    })
    .catch((e) => {});
};
