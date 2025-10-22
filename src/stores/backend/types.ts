import {NtfPosition, NtfType} from "@/models/enum/Notification";

export interface BackendState {
    loading: number
}

export interface TextToSoundResponse {
    text: string,
    textEncoded: string,
    bytes: number[],
    blob: Blob
}

export interface RadioMsg {
    type: NtfType,
    show: boolean,
    timeout: number,
    title: string,
    message: string,
    target: string|null
    position: NtfPosition
}
export let defaultInfoNotification: RadioMsg = {
    type: NtfType.INFO,
    show: false,
    timeout: 0,
    title: "-",
    message: "-",
    qr: null,
    position: NtfPosition.TOP
}
