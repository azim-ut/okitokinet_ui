import {defineStore} from "pinia";
import type {BackendState, TextToSoundResponse} from "./types";
import {BackendService} from "@/stores/backend/BackendService.ts";

export const BackendStore = defineStore('Backend', {
    state: (): BackendState => ({
        loading: 0,
        minF: 1200,
        maxF: 2200,
        tickMs: 200
    }),
    getters: {
        isLoading: (state: BackendState): boolean => state.loading > 0,
        getLoading: (state: BackendState): number => state.loading,
        getMinF: (state: BackendState): number => state.minF,
        getMaxF: (state: BackendState): number => state.maxF,
        getTickMs: (state: BackendState): number => state.tickMs,
    },
    actions: {
        setMinF(val: number) {
            return this.$state.minF = val
        },
        setMaxF(val: number) {
            return this.$state.maxF = val
        },
        setTickMs(val: number) {
            return this.$state.tickMs = val
        },
        async fetchSound(data: string, minF: number, maxF: number, tickMs: number): Promise<TextToSoundResponse> {
            return await BackendService.fetchSound(data, minF, maxF, tickMs);
        },
        async soundToText(blob: Blob): Promise<void> {
            return BackendService.soundToText(blob).then((res) => {
                console.log(res)
            })
        }
    }
})