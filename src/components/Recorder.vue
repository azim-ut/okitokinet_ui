<template>


  <v-card
      title="Запись с микрофона"
      subtitle="Пытаемся распознать в звуковом сигнале QR-код"
  >
    <v-card-text>
      <v-btn @click="startRecording" v-if="!isRecording">Start</v-btn>
      <v-btn @click="stopRecording" v-if="isRecording">Stop</v-btn>
      <button @click="playBufferedAudio" :disabled="audioBlobs.length === 0">Play Combined</button>
    </v-card-text>
    <v-card-actions>
      <div>
        <div v-for="url in audioUrls">
          <audio :src="url" ref="combinedAudioPlayer" controls></audio>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {defineComponent, type Ref} from "vue";
import {mapStores} from "pinia";
import {appText, fetchLocalizedText} from "@/main";
import {BackendStore} from "@/stores/backend/backend.ts";

export default defineComponent({
  components: {},
  computed: {...mapStores(BackendStore)},
  data(){
    return {
      player: {
        text: appText,
        audioPlayer: null as Ref|null,
        blobUrl: null as Ref|null,
        blob: {} as Blob
      },
      audioBlobs: [] as Blob[],
      audioUrls: [] as string[],
      mediaRecorder: null as MediaRecorder | null,
      stream: null as MediaStream | null,
      isRecording: false,
      recorder: null as MediaRecorder | null,
      mimeType: 'audio/webm',
    }
  },
  methods: {

    async startRecording() {
      this.audioBlobs = []
      this.audioUrls = []
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        this.recorder = new MediaRecorder(this.stream, {
          mimeType: this.mimeType,
        });

        this.recorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            this.audioBlobs.push(e.data)
            const blobUrl = URL.createObjectURL(event.data)
            this.audioUrls.push(blobUrl)
          }
        };

        this.recorder.onstop = () => {
          if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
          }
        };

        this.recorder.start(5000); // 🔁 Flush every 5 seconds
        this.isRecording = true;
      } catch (err) {
        console.error('Mic access error:', err);
      }
    },
    stopRecording() {
      if (this.recorder?.state === 'recording') {
        this.recorder.stop();
        this.isRecording = false;
      }
    },
    setBlobToPlay(blob: any){
      this.player.audioPlayer = this.$refs.playerDiv
      if (this.player.audioPlayer && blob) {
        const blobUrl = URL.createObjectURL(blob)
        this.player.audioPlayer.src = blobUrl
      }
    },
    playBufferedAudio() {
      const fullBlob = new Blob(this.audioBlobs, { type: this.mimeType });
      const url = URL.createObjectURL(fullBlob);
      const player = this.$refs.combinedAudioPlayer as HTMLAudioElement;
      player.src = url;
      player.play();
    },
  },
  created(){
    this.text = fetchLocalizedText(appText)
  },
  mounted() {

  }
})
</script>


<style>

</style>