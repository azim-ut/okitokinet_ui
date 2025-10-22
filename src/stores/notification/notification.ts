import {defineStore} from "pinia";
import type {NotificationMsg, NotificationState} from "./types";
import {defaultInfoNotification} from "./types";
import {NtfPosition, NtfType} from "@/models/enum/Notification";

export const NotificationStore = defineStore('Notification', {
    state: (): NotificationState => ({
        list: [],
        loading: 0
    }),
    getters: {
        isLoading: (state: NotificationState): boolean => state.loading > 0,
        getLoading: (state: NotificationState): number => state.loading,
        getList: (state: NotificationState): NotificationMsg[] => state.list,
        getListTop: (state: NotificationState): NotificationMsg[] => state.list.filter(n => n.position === NtfPosition.TOP),
        getListBottom: (state: NotificationState): NotificationMsg[] => state.list.filter(n => n.position === NtfPosition.BOTTOM),
    },
    actions: {
        startLoading(){
            this.$state.loading++
        },
        stopLoading(){
            this.$state.loading--
            if(this.$state.loading < 0){
                this.$state.loading = 0
            }
        },
        resetNotifications(){
            this.$state.list = []
        },
        addNotification(row: NotificationMsg){
            row.show = true
            this.$state.list.push(row)
        },
        addQuestionBottomNotification(message: string, timeout: number){
            this.createNotification(NtfType.QUESTION, message, NtfPosition.BOTTOM, timeout)
        },
        addInfoBottomNotification(message: string, timeout: number){
            this.createNotification(NtfType.INFO, message, NtfPosition.BOTTOM, timeout)
        },
        addWarningBottomNotification(message: string, timeout: number){
            this.createNotification(NtfType.WARNING, message, NtfPosition.BOTTOM, timeout)
        },
        addSuccessBottomNotification(message: string, timeout: number){
            this.createNotification(NtfType.SUCCESS, message, NtfPosition.BOTTOM, timeout)
        },
        addErrorBottomNotification(message: string, timeout: number){
            this.createNotification(NtfType.ERROR, message, NtfPosition.BOTTOM, timeout)
        },
        addQuestionTopNotification(message: string, timeout: number){
            this.createNotification(NtfType.QUESTION, message, NtfPosition.TOP, timeout)
        },
        addInfoTopNotification(message: string, timeout: number){
            this.createNotification(NtfType.INFO, message, NtfPosition.TOP, timeout)
        },
        addWarningTopNotification(message: string, timeout: number){
            this.createNotification(NtfType.WARNING, message, NtfPosition.TOP, timeout)
        },
        addSuccessTopNotification(message: string, timeout: number){
            this.createNotification(NtfType.SUCCESS, message, NtfPosition.TOP, timeout)
        },
        addErrorTopNotification(message: string, timeout: number){
            this.createNotification(NtfType.ERROR, message, NtfPosition.TOP, timeout)
        },
        createNotification(type: NtfType, message: string, position: NtfPosition, timeout: number){
            let row = defaultInfoNotification
            row.type = NtfType.ERROR
            row.message = message
            row.position = position
            row.show = true
            if(timeout && timeout>0){
                row.timeout = timeout
                let ind = this.$state.list.indexOf(row)
                this.$state.list.splice(ind, 1)
            }
            this.$state.list.push(row)
        },
        notified(row: NotificationMsg){
            let ind = this.$state.list.indexOf(row)
            if(ind>=0){
                this.$state.list.splice(ind, 1);
            }
        }
    }
})