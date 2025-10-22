import {NtfPosition, NtfType} from "@/models/enum/Notification";

export interface NotificationState {
    list: NotificationMsg[],
    loading: number
}


export interface NotificationMsg {
    type: NtfType,
    show: boolean,
    timeout: number,
    title: string,
    message: string,
    target: string|null
    position: NtfPosition
}
export let defaultInfoNotification: NotificationMsg = {
    type: NtfType.INFO,
    show: false,
    timeout: 0,
    title: "-",
    message: "-",
    target: null,
    position: NtfPosition.TOP
}
