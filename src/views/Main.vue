<template>
  <div class="centeredBlock">
    <div class="marginAuto">
      <v-card
          title="Текст для передачи"
          subtitle="Ваш текст будет зашифрован и преобразован в звук"
      >
        <v-card-text>
          <v-textarea label="Label" v-model="sendForm.textToSend"></v-textarea>
          <div class="grid grid2">
            <div>

              <v-number-input
                  :reverse="false"
                  controlVariant="split"
                  label="Частота 0"
                  v-model="minF"
                  :hideInput="false"
                  :inset="false"
                  variant="outlined"
              ></v-number-input>
            </div>
            <div>

              <v-number-input
                  :reverse="false"
                  controlVariant="split"
                  label="Частота 1"
                  v-model="maxF"
                  :hideInput="false"
                  :inset="false"
                  variant="outlined"
              ></v-number-input>
            </div>
            <div>

              <v-number-input
                  :reverse="false"
                  controlVariant="split"
                  label="Тик мс"
                  v-model="tickMs"
                  :decimal-separator="'.'"
                  :hideInput="false"
                  :inset="false"
                  variant="outlined"
              ></v-number-input>
            </div>
            <div></div>
          </div>
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
      <hr />
      <MicrophoneListener :minF="minF" :maxF="maxF" />
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent, type Ref, ref} from "vue"
import {mapStores} from "pinia"
import {BackendStore} from "@/stores/backend/backend.ts";
import {appText, fetchLocalizedText} from "@/main.ts";
import Recorder from "@/components/Recorder.vue";
import MicrophoneListener from "@/components/MicrophoneListener.vue";


export default defineComponent({
  components: {MicrophoneListener, Recorder},
  computed: {...mapStores(BackendStore)},
  data(){
    return {
      text: appText,
      minF: 1200,
      maxF: 2200,
      tickMs: 200,
      player: {
        audioPlayer: null as Ref|null,
        blobUrl: null as Ref|null,
        blob: {} as Blob,
        text: null as null|string,
        textEncoded: null as null|string,
      },
      sendForm: {
        textToSend: "кто ходит в гости по утрам" as string|null,
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

        this.BackendStore.fetchSound(this.sendForm.textToSend, this.minF, this.maxF, this.tickMs).then(res => {
          console.log(res)
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
    },
    playAudio() {
      if (this.player.audioPlayer.value) {
        this.player.audioPlayer.value.play();
      }
    },

    pauseAudio() {
      if (this.player.audioPlayer.value) {
        this.player.audioPlayer.value.pause();
      }
    },


  }
})
</script>

<style scoped>
code{
  overflow-wrap: break-word;
}
</style>
