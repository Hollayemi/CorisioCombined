import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import toaster from "@/app/configs/toaster";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";
import { REQUEST_STATUS } from "../../constants";
import { deleteHandler } from "../delete";
import { myBusinessFiles, storeFiles } from "../display/displayAll";
import tokens from "@/app/configs/tokens";
import { mutate } from "swr";

const createCollection = createAsyncThunk(
  "post/createCollection",
  async (payload) => {
    const { data } = await martApi
      .post(`/store/collection/new`, payload, jsonHeader("store"))
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

//
//
//
//
export const createHandler = (values, dispatch, setDone) => {
  dispatch(createCollection(values))
    .then(unwrapResult)
    .then((res) => {
      console.log(res);
      toaster({ ...res });
      if (res.type === "success") {
        
      }
      mutate("/store/brief-categories");
      reFetchData();
    })
    .catch((e) => {});
};

//
//
//

export const deleteCol = (splited, dispatch, eventFunc, reFetchData) => {
  const payload = {
    delCase: "collection",
    _id: splited[2],
    name: splited[3],
  };
  // setOpen(true);
  dispatch(deleteHandler(payload))
    .then(unwrapResult)
    .then((resr) => {
      dispatch(myBusinessFiles())
        .then(unwrapResult)
        .then(() => {
          toaster({ ...resr });
          reFetchData();
        });
      eventFunc("");
    })
    .catch((e) => {});
};
