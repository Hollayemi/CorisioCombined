import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import toaster from "@/app/configs/toaster";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { mutate } from "swr";

const addStaffApi = createAsyncThunk("post/addStaff", async (payload) => {
  const { data } = await martApi
    .post(`/branch/staff`, payload, jsonHeader("store"))
    .then((res) => res)
    .catch((e) => e.response);
  return data;
});

export const addStaff = (formData, dispatch, showSnackbar) => {
  dispatch(addStaffApi(formData))
    .then(unwrapResult)
    .then((res) => {
      showSnackbar(res.message, res.type)
      if (res.type === "success") {
        mutate("/branch/staffs")
      }
    })
    .catch((e) => {});
};
//
//
//
//
//
//
//
//
//
// update staff auth api

const updateStaffApi = createAsyncThunk(
  "post/fetchBranch",
  async (payload) => {
    const { data } = await martApi
      .patch(`/branch/staff`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const updateStaff = (dispatch, payload, showSnackbar, callback) => {
  dispatch(updateStaffApi(payload))
    .then(unwrapResult)
    .then((res) => {
      showSnackbar(res.message, res.type)
      mutate("/branch/staffs")
      mutate("/branch/logged-in-staff");
      if (res.type === "success" && res.message.startsWith("Viewing")) {
        callback()
      }
    })
    .catch((e) => {});
};


const updatePictureApi = createAsyncThunk(
  "post/updateAdminAccount",
  async (payload) => {
    const { data } = await martApi
      .post("/staff/update-picture", payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

export const updateStaffPicture = (payload, dispatch, setLoading) => {
  setLoading(true)
  dispatch(updatePictureApi(payload))
    .then(unwrapResult)
    .then((res) => {
      toaster({ ...res });
      mutate("/branch/logged-in-staff");
      setLoading(false)
    })
    .catch((e) => {
      setLoading(false)
    });
};