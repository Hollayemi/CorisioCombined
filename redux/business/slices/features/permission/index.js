import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import toaster from "@/app/configs/toaster";
import martApi from "../../api/baseApi";
import { mutate } from "swr";
import { jsonHeader } from "../../api/setAuthHeaders";

const createRoleApi = createAsyncThunk(
  "post/createRole",
  async (payload) => {
      console.log(payload)
    const { data } = await martApi
      .post(`/store/role`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const createRole = (payload, dispatch) => {
  dispatch(createRoleApi(payload))
    .then(unwrapResult)
    .then((res) => {
      toaster({ ...res });
      mutate("/store/roles")
    })
    .catch((e) => {});
};

//
//
//
const deleteRoleApi = createAsyncThunk("post/fetchBranch", async (title) => {
  const { data } = await martApi
    .delete(`/store/role?title=${title}`, jsonHeader("store"))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});
export const deleteRole = (dispatch, title) => {
  dispatch(deleteRoleApi(title))
    .then(unwrapResult)
    .then((res) => {
         toaster({ ...res });
       mutate("/store/roles")
    })
    .catch((e) => {});
};

//
//
//
const updatePermissionApi = createAsyncThunk("post/fetchBranch", async (payload) => {
  const { data } = await martApi
    .put(`/store/role`, payload, jsonHeader("store"))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});
export const updatePermission = (dispatch, payload) => {
  dispatch(updatePermissionApi(payload))
    .then(unwrapResult)
    .then((res) => {
         toaster({ ...res });
       mutate("/store/roles")
    })
    .catch((e) => {});
};
