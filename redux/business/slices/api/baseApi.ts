import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { jsonHeader } from "./setAuthHeaders";

const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
};
// jsonHeader("store") likely returns an object with headers, not a string token.
// If you want to extract the Authorization header, do it like this:
(async () => {
    const authHeaders = await jsonHeader();
    if (
        authHeaders &&
        authHeaders.headers &&
        authHeaders.headers.Authorization
    ) {
        requestHeaders.Authorization = authHeaders.headers.Authorization;
    }
})();

// let server = "https://corislo-backend.onrender.com/api/v1/";
let server = "http://172.20.10.8:5000";
if (process.env.NODE_ENV === "production") {
    console.log("in production");
    server = "https://corislo-backend.onrender.com";
}

const Axios: AxiosInstance = axios.create({
    baseURL: `${server}/api/v1/`,
    headers: requestHeaders,
});

// Add a request interceptor
Axios.interceptors.request.use(
    function (config: any) {
        // Do something before request is sent
        return config;
    },
    function (error: AxiosError) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
Axios.interceptors.response.use(
    function (response: AxiosResponse) {
        // Any status code that lies within the range of 2xx causes this function to trigger
        // Do something with response data
        return response;
    },
    function (error: AxiosError) {
        // Any status codes that fall outside the range of 2xx cause this function to trigger
        // if (parseInt(error?.response?.status) === 406) {
        //   window.location.href = "/dashboard/account?section=plans";
        // }
        // if (parseInt(error?.response?.status) === 401) {
        //   window.location.href = "/login";
        // }
        // handleResponseError(error.response);
        return Promise.reject(error);
    }
);

export { server };
export default Axios;
