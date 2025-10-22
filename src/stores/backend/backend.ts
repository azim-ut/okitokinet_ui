import {defineStore} from "pinia";
import type {BackendState} from "./types";
import {BackendService} from "@/stores/backend/BackendService.ts";

export const BackendStore = defineStore('Backend', {
    state: (): BackendState => ({
        loading: 0
    }),
    getters: {
        isLoading: (state: BackendState): boolean => state.loading > 0,
        getLoading: (state: BackendState): number => state.loading,
    },
    actions: {
        async fetchSound(data: string) {
            return BackendService.fetchSound(data)
        }
    }
})