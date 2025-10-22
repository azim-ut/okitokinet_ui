import axios from "axios";
import {defaultAxiosOptions, defineAxios, defineSilentAxios} from "@/api/axios-config";


export const apiBackend = defineAxios(axios.create(Object.assign(defaultAxiosOptions, {
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})))
export const silentApiBackend = defineSilentAxios(axios.create(Object.assign(defaultAxiosOptions, {
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
})))

export const BackendEndpoints = {
    textToSound: "/api/v1/income/text/to/sound",
    textToImage: "/api/v1/income/text/to/image",
    textDecoded: "/api/v1/income/text/decoded",
}
