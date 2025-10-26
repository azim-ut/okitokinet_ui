import type {AxiosInstance} from "axios";
import {NotificationStore} from "@/stores/notification/notification.ts";


export const defaultAxiosOptions: any = {
    withCredentials: true,
    xsrfHeaderName: "X-XSRF-TOKEN",
    xsrfCookieName: "XSRF-TOKEN",
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
}

export function defineAxios(api: AxiosInstance){
    api.interceptors?.request.use(
        (config: any) => {
            NotificationStore().startLoading()
            return config;
        },
        (error: any) => {
            console.log("ERROR1", error)
            NotificationStore().stopLoading()
            return Promise.reject(error);
        })

    api.interceptors?.response.use(
        (response: any) => {
            NotificationStore().stopLoading()
            return response
        },
        (error: any) => {

            NotificationStore().stopLoading()
            if(error.status == 401){
                // location.href = "/backoffice/auth"
            }

            NotificationStore().addInfoTopNotification((error.response?.data?.message)??"INTERNALEXCEPTION", 4000)
            return Promise.reject(error)
        }
    )
    return api
}

export function defineSilentAxios(api: AxiosInstance){
    api.interceptors?.request.use(
        (config: any) => {
            return config;
        },
        (error: any) => {
            return Promise.reject(error);
        })

    api.interceptors?.response.use(
        (response: any) => {
            return response
        },
        (error: any) => {
            if(error.status == 401){
                // location.href = "/backoffice/auth"
            }
            return Promise.reject(error)
        }
    )
    return api
}