import {BackendEndpoints, silentApiBackend} from "@/api/axios-backend-config.ts";
import type {SoundToTextResponse, TextToSoundResponse} from "@/stores/backend/types.ts";

export class BackendService {

    public static async fetchSound(data: string, minF: number, maxF: number, tickMs: number): Promise<TextToSoundResponse> {
        const response = await silentApiBackend.post<TextToSoundResponse>(`${BackendEndpoints.textToSound}`,{
            text: data,
            minF: minF,
            maxF: maxF,
            tickMs: tickMs
        })
        if (!response.data) throw new Error('Failed to fetch WAV')

        return response.data as TextToSoundResponse
    }

    public static async soundToText(blob: Blob): Promise<any> {
        const formData = new FormData();
        formData.append("file", blob, "audio.webm");
        const response = await silentApiBackend.post<SoundToTextResponse>(
            `${BackendEndpoints.warToText}`,formData,
            {
                headers: {
                    "Content-Type": "audio/webm" // or "application/octet-stream"
                }
            },
        )
        if (!response.data) throw new Error('Failed to fetch WAV')

        return response.data
    }
}