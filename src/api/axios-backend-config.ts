import axios from "axios";
import {defaultAxiosOptions, defineAxios, defineSilentAxios} from "@/api/axios-config";


export const apiBackend = defineAxios(axios.create(Object.assign(defaultAxiosOptions, {
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})))
export const silentApiBackend = defineSilentAxios(axios.create(Object.assign(defaultAxiosOptions, {
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})))

export const BackendEndpoints = {
    textToSound: "/api/v1/okitoki_back/text/to/sound",
    textToImage: "/api/v1/okitoki_back/text/to/image",
    warToText: "/api/v1/okitoki_back/wav/to/text/decoder"
}
