<template>
  <div class="centeredBlock">
    <div class="marginAuto">
      <HeadTabs></HeadTabs>
      <FreqSettings ></FreqSettings>
      <v-card>
        <v-card-title style="background: #151517; font-size: 80%;">
          <div><b>Прием сигнала</b></div>
          <div>Включите сигнал на ДРУГОМ устройстве</div>
        </v-card-title>
        <v-card-text style="padding: 0;">
          <div style="margin: 16px;">
            <div>Массив значений:</div>
          </div>

          <div class="grid grid2 forced">
            <v-btn @click="startListening" :disabled="isListening">🎙 Начать</v-btn>
            <v-btn @click="stopListening" :disabled="!isListening">⛔️ Стоп</v-btn>
          </div>
          <div>
            <QrCanvas :bits="bits" :key="bitsEpoch" />
          </div>
          <div>
            {{bits}}
          </div>
        </v-card-text>

      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {BackendStore} from "@/stores/backend/backend.ts";
import QrCanvas from "@/components/QrCanvas.vue";
import bytesDefault from "./../../../okitokinet/file/res/temp.json";
import HeadTabs from "@/components/HeadTabs.vue";
import FreqSettings from "@/components/FreqSettings.vue";

export default defineComponent({
  components: {HeadTabs, QrCanvas, FreqSettings},
  computed: {...mapStores(BackendStore)},
  data(){
    return {
      lastF: 0,

      tickDetector: -1,
      audioContext: null as AudioContext|null,
      analyser: null as null|AnalyserNode,
      source: null as null|MediaStreamAudioSourceNode,
      micStream: null,
      isListening: false,
      testBits: bytesDefault,
      bits: [] as number[],
      bufferChunks: [] as number[],
      bitsEpoch: 0,
      intervalId: null,
      lastTickTime: null,
      tickGapMs: 600,
    }
  },
  methods: {
    startAccurateTickDetection() {
      this.isListening = true
      const TICK_DURATION_MS = this.BackendStore.getTickMs
      const SAMPLE_INTERVAL = 50
      // const SAMPLE_INTERVAL = Math.round(this.BackendStore.getTickMs/4)
      const DETECT_FREQS = { '0': this.BackendStore.getMinF, '1': this.BackendStore.getMaxF }
      const FREQ_TOLERANCE = 15 // +- Гц

      this.bits = []
      this.bufferChunks = [] // накопление частот за тик

      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
            if(!this.audioContext) {
              return
            }

            this.source = this.audioContext.createMediaStreamSource(stream)
            this.analyser = this.audioContext.createAnalyser()

            this.analyser.fftSize = 2048
            this.source.connect(this.analyser)

            const bufferSize = this.analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferSize)

            let elapsedMs = 0

            this.tickDetector = setInterval(() => {
              if(!this.analyser || !this.audioContext){
                return
              }
              this.analyser.getByteFrequencyData(dataArray)

              // Находим доминирующую частоту
              let maxAmp = 0
              let peakIndex = -1
              for (let i = 0; i < bufferSize; i++) {
                if (dataArray[i] > maxAmp) {
                  maxAmp = dataArray[i]
                  peakIndex = i
                }
              }

              const sampleRate = this.audioContext.sampleRate
              const binSize = sampleRate / this.analyser.fftSize
              const dominantFreq = peakIndex * binSize

              this.bufferChunks.push(dominantFreq)
              elapsedMs += SAMPLE_INTERVAL

              // Если набрали один тик (~200 мс)
              if (elapsedMs >= TICK_DURATION_MS) {
                const avgFreq = this.getAverageFreq(this.bufferChunks)

                if (Math.abs(avgFreq - DETECT_FREQS['0']) < FREQ_TOLERANCE) {
                  this.bits.push(0)
                } else if (Math.abs(avgFreq - DETECT_FREQS['1']) < FREQ_TOLERANCE) {
                  this.bits.push(1)
                } else {
                  // Не распознано — игнорируем
                }

                // Очистим тик
                this.bufferChunks = []
                elapsedMs = 0
              }
            }, SAMPLE_INTERVAL)
      })
    },

    getAverageFreq(freqArray: number[]) {
      const valid = freqArray.filter(f => f > 0 && isFinite(f))
      if (!valid.length) return 0
      const sum = valid.reduce((a, b) => a + b, 0)
      return sum / valid.length
    },

    async startListening() {
      this.startAccurateTickDetection()
    },

    stopListening() {
      if (this.tickDetector) {
        clearInterval(this.tickDetector)
        this.tickDetector = -1
      }

      if (this.source?.mediaStream) {
        this.source.mediaStream.getTracks().forEach(track => track.stop())
      }

      if (this.audioContext) {
        this.audioContext.close()
        this.audioContext = null
      }

      this.source = null
      this.analyser = null
    }
  },
  created(){
  },
  mounted() {

  }
})
</script>


<style>

</style>