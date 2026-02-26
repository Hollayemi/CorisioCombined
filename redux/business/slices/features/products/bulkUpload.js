import toaster from "@/app/configs/toaster";
import { createAsyncThunk, unwrapResult } from "@reduxjs/toolkit";
import martApi from "../../api/baseApi";
import { jsonHeader } from "../../api/setAuthHeaders";

const getBulkTemplateApi = createAsyncThunk(
    "post/store/product/bulk/template",
    async (payload) => {
        const { data } = await martApi
        .get("/store/products/bulk-upload-template", {
          responseType: 'blob',
        })
        .then((res) => res)
        .catch((e) => e.response);
        return data;
    }
    )

export const getBulkTemplateHandler = (formData, dispatch) => {
    dispatch(getBulkTemplateApi(formData))
        .then(unwrapResult)
        .then((res) => {
            console.log(res);
            toaster({ ...res });
            if (res.type === "success") {
                // mutate("/store/products");
            }
        })
        .catch((e) => {
            console.log(e);
        });
}

const uploadBulkProductsApi = createAsyncThunk(
    "post/store/product/bulk/upload",
    async (payload) => {
        const { data } = await martApi
        .post("/store/products/bulk-upload", payload.formData, {
          ...jsonHeader("store"),
          onUploadProgress: (progressEvent) => {
            // This won't be accurate for base64 but can simulate progress
            const percentCompleted = Math.min(
              99, // Never reach 100% here as we're not tracking actual upload
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
            payload.setUploadProgress(percentCompleted);
          },
        })
        .then((res) => res)
        .catch((e) => e.response);
        return data;
    }
)

export const uploadBulkProductsHandler = (formData, dispatch, setUploadProgress, setUploadStatus, setUploadResults) => {
    dispatch(uploadBulkProductsApi({ formData, setUploadProgress}))
        .then(unwrapResult)
        .then((res) => {
            console.log(res);
            toaster({ ...res });
            setUploadStatus('success')
            setUploadResults(res.data)
            setUploadProgress(100)
            if (res.type === "success") {
                // mutate("/store/products");
            }
        })
        .catch((e) => {
            console.log(e);
            console.error('Upload error:', error)
            setUploadStatus('error')
            setUploadResults(error.response?.data || { message: error.message })
        });
}

const exportAllProductsApi = createAsyncThunk(
    "post/store/product/bulk/export",
    async (payload) => {
        const { data } = await martApi
        .post("/store/products/bulk-export", payload, {
            ...jsonHeader("store"),
          responseType: 'blob',
        })
        .then((res) => res)
        .catch((e) => e.response);
        return data;
    }
)

export const exportAllProductsHandler = (name, formData, dispatch) => {
    dispatch(exportAllProductsApi(formData))
        .then(unwrapResult)
        .then((res) => {
            console.log(res);
            const url = window.URL.createObjectURL(new Blob([res]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${name}.xlsx`) //or any other extension
            document.body.appendChild(link)
            link.click()
            link.remove()
        })
        .catch((e) => {
            console.log(e);
        });
}
