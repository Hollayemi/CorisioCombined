import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";

const generateDescApi = createAsyncThunk(
  "post/genDesc",
  async (payload) => {
    console.log(payload)
    const { data } = await axios.post("https://corisio-desc-generator.onrender.com/generate-description", {...payload, prodPrice: parseFloat(payload.prodPrice)})
      .then((res) => res)
      .catch((e) => e.response);
    return data;
  }
);

const validate = (payload) => {
  if(!payload.prodPrice) return false
  if(!payload.specification) return false
  if(!payload.deliveryMethod) return false
  if(!payload.category) return false
  if(!payload.subcategory) return false

  return true

}

export const generateDescApiHandler = (payload, dispatch,showSnackbar, setLoading, callback) => {
  setLoading(true)
  if(validate(payload)){
    dispatch(generateDescApi(payload))
      .then(unwrapResult)
      .then((res) => {
        console.log(res)
        setLoading(false)
        callback(res?.description?.replaceAll("**", " ").replaceAll("#", "") || "")
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
        if (e?.status === 400) {
          showSnackbar("Error: " + e?.data?.message, "error")
        } else {
          showSnackbar("Something went wrong", "error")
        }
      });
    }else{
      showSnackbar("Set the Categories, Product price, Specifications before you generate", "error")
      setLoading(false)
    }
  }