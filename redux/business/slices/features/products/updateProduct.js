import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";

import toaster from "@/app/configs/toaster";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { mutate } from "swr";

const editProduct = createAsyncThunk(
  "post/editProduct",
  async (payload) => {
    const { data } = await martApi
      .put("/store/editProduct", payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const editProductHandler = (formData, dispatch) => {
  console.log(formData)
    dispatch(editProduct(formData))
      .then(unwrapResult)
      .then((res) => {
        toaster({ ...res });
      })
      .catch((e) => {
        
      });
  }

const productStatusApi = createAsyncThunk(
  "post/editProduct",
  async (payload) => {
    const { data } = await martApi
      .put("/store/product", payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const productStatusUpdate = (formData, dispatch, endpoint) => {
  console.log(formData)
    dispatch(productStatusApi(formData))
      .then(unwrapResult)
      .then((res) => {
        toaster({ ...res });
        mutate("/store/get-products")
endpoint && mutate(endpoint)
      })
      .catch((e) => {
        
      });
  }