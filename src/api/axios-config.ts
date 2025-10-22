import type {AxiosError, AxiosInstance} from "axios";
import router from "@/router";
import {NotificationStore} from "@/stores/notification/notification.ts";
import {appText, fetchLocalizedText} from "@/main.ts";


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

export function toastMessage(response: any, targetSelector: string|null = null){
    let messages = fetchLocalizedText(appText)
    if(response && response.data && response.data.message){
        if(targetSelector){
            document.querySelectorAll(targetSelector).forEach(element => {
                element.classList.add('scaleUpEffect');
                setTimeout(() => {
                    element.classList.remove('scaleUpEffect');
                }, 800)
            })
        }
        NotificationStore().addInfoTopNotification(messages[response.data.message]??null, 2000)
    }
}

export function defaultErrorHandler(error: AxiosError){
    if(error){
        // console.log([401,403], error.toJSON())
    }
    if(error && error.response?.status){
        let errorsText = fetchLocalizedText(appText)

        if(error.response && [413].includes(error.response.status) && location.href != '/backoffice/auth'){
            NotificationStore().addErrorTopNotification(errorsText.PAYLOAD_TOO_LARGE, 2000)
        }
        if(error.response && [500].includes(error.response.status) && error.response.data){
            NotificationStore().addErrorTopNotification(errorsText[error.response.data.message]??error.response.data.message, 2000)
        }
        if(error.response && [401,403].includes(error.response.status) && location.href != '/backoffice/auth'){
            console.log("NO USER")
            router.push('/auth')
        }
    }else if(error){
        NotificationStore().addErrorTopNotification("POSSIBLE_PAYLOAD_TOO_LARGE", 2000)
    }
    return
}

export function userErrorHandler(error: AxiosError){
    // @ts-ignore
    if(error.response?.data?.level === "ERROR"){
        // @ts-ignore
        const row = error.response.data
        // notificationStore().addErrorTopNotification(row.message, 1000)
        throw error
    }
    return
}