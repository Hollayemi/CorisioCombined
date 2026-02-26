import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import tokens from "@/app/configs/tokens";

const toWaitingApi = createAsyncThunk("post/toWaiting", async (payload) => {
  const storeToken = tokens.store;
  console.log(storeToken);
  const { data } = await martApi
    .post("/branch/order-waiting", payload.body, jsonHeader(storeToken))
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((e) => {
      console.log(e);
      return e.response;
    });
  return data;
});

export const toWaiting = (dispatch, orderId, info, user, store, setState) => {
  const ReactionArr = info.map((x) => (x[1] === "rejected" ? x[0] : ""));
  const messArray = ReactionArr.filter((x) => x !== "" && x);
  const pre_mess = messArray.length > 1 ? messArray.join(", ") : messArray[0];
  const mess = `${pre_mess} ${
    messArray.length > 1 ? "are" : "is"
  } not available at the moment from ${store} store, you can check later or try another store`;
  const payload = {
    body: {
      orderId,
      message: mess,
      user,
      store,
    },
  };
  dispatch(toWaitingApi(payload))
    .then(unwrapResult)
    .then((res) => res.type === "success" && setState(res.data))
    .catch((err) => {
      console.log(err);
    });
};

const toProcessingApi = createAsyncThunk(
  "post/toProcessing",
  async (payload) => {
    const storeToken = tokens.store;
    const { data } = await martApi
      .post("/branch/order-processing", payload.body, jsonHeader(storeToken))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const toProcessing = (dispatch, orderId, Reactions, store, setState) => {
  console.log(Reactions);
  const products = Reactions.map((x) => x[0]);
  console.log(products);
  const payload = {
    body: { orderId, store, products },
  };
  dispatch(toProcessingApi(payload))
    .then(unwrapResult)
    .then((res) => res.type === "success" && setState(res.data))
    .catch((err) => {});
};
