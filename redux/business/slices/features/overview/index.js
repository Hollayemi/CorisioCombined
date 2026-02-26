import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import tokens from '@/app/configs/tokens';

const myActivities = createAsyncThunk("post/myActivities", async () => {
  const userToken = tokens.auth;
  const { data } = await martApi
    .get("/store/activities", jsonHeader(userToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

const myTools = createAsyncThunk("post/myTools", async () => {
  const userToken = tokens.auth;
  const { data } = await martApi
    .get("/store/tools", jsonHeader(userToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const getActivities = (dispatch, id, setState) => {
  dispatch(myActivities(id))
    .then(unwrapResult)
    .then((res) => {
      setState(res);
    })
    .catch((err) => {});
};

export const getMyTools = (dispatch, setState) => {
  dispatch(myTools())
    .then(unwrapResult)
    .then((res) => {
      res.type !== "error" && setState(res.message[0]);
    })
    .catch((err) => {});
};
/*

fetch notifications
delet notifications

*/

const notificationApi = createAsyncThunk("post/fetchNotification", async () => {
  const storeToken = tokens.store;
  const { data } = await martApi
    .get("/store/notification", jsonHeader(storeToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const myNotifications = (dispatch, setState) => {
  dispatch(notificationApi())
    .then(unwrapResult)
    .then((res) => {
      setState(res);
    })
    .catch((err) => {});
};
//
//
//

const deleteNotificationApi = createAsyncThunk(
  "post/deleteNotification",
  async (payload) => {
    const storeToken = tokens.store;
    const { data } = await martApi
      .post("/store/delete/notification", payload.body, jsonHeader(storeToken))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const deleteNotifications = (dispatch, store) => {
  const payload = {
    body: {
      store,
    },
  };
  dispatch(deleteNotificationApi(payload));
};

//
//
//
//
//
//
const storeCartsApi = createAsyncThunk("post/fetchStoreCarts", async () => {
  const storeToken = tokens.store;
  const { data } = await martApi
    .get("/branch/cart-products", jsonHeader(storeToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const storeCarts = (dispatch, setState) => {
  dispatch(storeCartsApi())
    .then(unwrapResult)
    .then((res) => res.type === "success" && setState(res.message))
    .catch((err) => {});
};

//
//
//
//
//
//
const storeOrdersApi = createAsyncThunk("post/fetchStoreCarts", async () => {
  const storeToken = tokens.store;
  const { data } = await martApi
    .get("/branch/order-request", jsonHeader(storeToken))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const OrderRequestsHandler = (dispatch, setState) => {
  dispatch(storeOrdersApi())
    .then(unwrapResult)
    .then((res) => res.type === "success" && setState(res.data))
    .catch((err) => {});
};
//
//
//
//
//
//
const listOrdersItemsApi = createAsyncThunk(
  "post/listOrdersItems",
  async (payload) => {
    const storeToken = tokens.store;
    const { data } = await martApi
      .get(`/branch/order/${payload.orderId}`, jsonHeader(storeToken))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const listOrdersItems = (dispatch, orderId, setState) => {
  const payload = {
    orderId,
  };
  dispatch(listOrdersItemsApi(payload))
    .then(unwrapResult)
    .then((res) => res.type === "success" && setState(res.data))
    .catch((err) => {});
};
