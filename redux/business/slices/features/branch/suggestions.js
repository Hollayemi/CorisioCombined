import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { userLogout } from "../../auth/Login";
import { getShopInfo } from "../shopInfo";
import { storeLogout } from "../shopInfo";
import tokens from "@/app/configs/tokens";

const loadSuggestionApi = createAsyncThunk(
  "post/addStaff",
  async (category) => {
    const storeToken = tokens.store;
    const { data } = await martApi
      .get(`/branch/product-suggestion/${category}`, jsonHeader(storeToken))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const productSuggestions = (dispatch, category, setState) => {
  dispatch(loadSuggestionApi(category))
    .then(unwrapResult)
    .then((res) => {
      if (res.type === "success") {
        setState(res.data);
      }
    })
    .catch((e) => {});
};

const suggActionApi = createAsyncThunk("post/addStaff", async (payload) => {
  const storeToken = tokens.store;
  const { data } = await martApi
    .post(`/branch/product-suggestion-action`, payload, jsonHeader(storeToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const suggestionAction = (dispatch, payload, setState) => {
  dispatch(suggActionApi(payload))
    .then(unwrapResult)
    .then((res) => {
      if (res.type === "success") {
        setState(res.data);
      }
    })
    .catch((e) => {});
};
