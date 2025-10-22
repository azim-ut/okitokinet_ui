import {BackendEndpoints, silentApiBackend} from "@/api/axios-backend-config.ts";
import type {TextToSoundResponse} from "@/stores/backend/types.ts";

export class BackendService {

    public static async fetchSound(data: string): Promise<TextToSoundResponse> {
        const response = await silentApiBackend.post<TextToSoundResponse>(`${BackendEndpoints.textToSound}`,{text: data})
        if (!response.data) throw new Error('Failed to fetch WAV')

        return response.data as TextToSoundResponse
    }
}