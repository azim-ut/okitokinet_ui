import {defineStore} from "pinia";
import type {BackendState, TextToSoundResponse} from "./types";
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