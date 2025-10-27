<template>
  <HeadTabs></HeadTabs>
  <div class="centeredBlock">
    <div class="marginAuto">
      <FreqSettings ></FreqSettings>
      <v-card>
        <v-card-title style="background: #151517; font-size: 80%;">
          <div><b>Текст для передачи</b></div>
          <div>Ваш текст будет зашифрован и преобразован в звук</div>
        </v-card-title>
        <v-card-text>
          <br />
          <v-textarea label="Label" v-model="sendForm.textToSend"></v-textarea>
          <v-btn @click="sendText()"
                 style="width: 100%;"
                 color="orange-lighten-2">Конвертировать в звук</v-btn>
        </v-card-text>
        <v-card-actions>
          <div style="width: 100%;">

            <div>

            </div>
            <v-spacer></v-spacer>
            <div>
              <div style="font-size:12px; max-width: 350px; width: 100%; margin: auto;">
                {{player.textEncoded}}
              </div>
              <br/>
              <audio ref="playerDiv" width="100%" class="" controls></audio>
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, type Ref} from "vue"
import {mapStores} from "pinia"
import {BackendStore} from "@/stores/backend/backend.ts";
import {appText, fetchLocalizedText} from "@/main.ts";
import Recorder from "@/components/Recorder.vue";
import HeadTabs from "@/components/HeadTabs.vue";
import FreqSettings from "@/components/FreqSettings.vue";


export default defineComponent({
  components: {FreqSettings, Recorder, HeadTabs},
  computed: {...mapStores(BackendStore)},
  data(){
    return {
      text: appText,
      player: {
        audioPlayer: null as Ref|null,
        blobUrl: null as Ref|null,
        blob: {} as Blob,
        text: null as null|string,
        textEncoded: null as null|string,
      },
      sendForm: {
        textToSend: "Test" as string|null,
        loading: false,
      }
    }
  },
  async created() {
    this.text = fetchLocalizedText(appText)
  },
  async mounted() {
  },
  methods: {
    sendText(){
      if(this.sendForm.textToSend){
        this.sendForm.loading = true

        this.BackendStore.fetchSound(
            this.sendForm.textToSend,
            this.BackendStore.minF,
            this.BackendStore.maxF,
            this.BackendStore.tickMs
        ).then(res => {
          const blob = this.base64ToBlob(res.blob, 'audio/wav');
          this.player.text = res.text
          this.player.textEncoded = res.textEncoded
          this.setBlobToPlay(blob)
          this.sendForm.loading = false
        })
      }
    },
    setBlobToPlay(blob: Blob){
      this.player.audioPlayer = this.$refs.playerDiv
      if (this.player.audioPlayer && blob) {
        const blobUrl = URL.createObjectURL(blob)
        this.player.audioPlayer.src = blobUrl
      }
    },
    base64ToBlob(base64: string, mimeType = 'audio/wav'): Blob {
      const binary = atob(base64);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return new Blob([bytes], { type: mimeType });
    }


  }
})
</script>

<style scoped>
code{
  overflow-wrap: break-word;
}
</style>
