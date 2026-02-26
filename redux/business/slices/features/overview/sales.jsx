import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import tokens from '@/app/configs/tokens';

export const StoreSalesApi = createAsyncThunk(
  "post/listOrdersItems",
  async (payload) => {
    const storeToken = tokens.store;
    const { data } = await martApi
      .get(`/store/branch-sales?start=${payload.time}`, jsonHeader(storeToken))
      .then((res) => res)
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        // res.type === "success" && payload.setState(res.data);
      })
      .catch((e) => e.response);
    return data;
  }
);

// export const listOrdersItems = (dispatch, orderId, setState) => {
//   const payload = {
//     orderId,
//   };
//   dispatch(listOrdersItemsApi(payload))
// };
