import { createAsyncThunk, createSlice, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { REQUEST_STATUS } from "../../constants";
import tokens from "@/app/configs/tokens";

export const myBusinessFiles = createAsyncThunk("post/allFiles", async () => {
  const storeToken = tokens.store;
  const { data } = await martApi
    .get(`/store/files`, jsonHeader(storeToken))
    .then((e) => {
      return e;
    })
    .catch((e) => {
      return e.response;
    });
  return data;
});

const initialState = {
  status: "idle",
  data: {},
};
//
//
//
const myBusinessFile = createSlice({
  name: "getBrands_Categories",
  initialState,
  reducers: {},
  extraReducers: {
    [myBusinessFiles.pending]: () => {
      return { ...initialState, status: REQUEST_STATUS.PENDING };
    },
    [myBusinessFiles.fulfilled]: (state, { payload }) => {
      return {
        ...initialState,
        data: payload.message[0],
        status: REQUEST_STATUS.FULFILLED,
      };
    },
    [myBusinessFiles.rejected]: () => {
      return { ...initialState, status: REQUEST_STATUS.REJECTED };
    },
  },
});

export const { getTheInfo } = myBusinessFile.actions;
export default myBusinessFile.reducer;
//

export const storeFiles = (dispatch, setFiles) => {
  dispatch(myBusinessFiles())
    .then(unwrapResult)
    .then((res) => {
      if (res?.type === "success") {
        setFiles(res.message[0]);
        return res;
      }
    })
    .catch((e) => {});
};
