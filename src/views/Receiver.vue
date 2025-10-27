<template>
  <HeadTabs></HeadTabs>
  <div class="centeredBlock">
    <div class="marginAuto">
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

      audioContext: null,
      analyser: null,
      source: null,
      micStream: null,
      isListening: false,
      testBits: bytesDefault,
      bits: [],
      bitsEpoch: 0,
      intervalId: null,
      lastTickTime: null,
      tickGapMs: 600,
    }
  },
  methods: {
    async startListening() {
      if (this.isListening) return

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      this.source = this.audioContext.createMediaStreamSource(this.micStream)
      this.analyser = this.audioContext.createAnalyser()
      this.source.connect(this.analyser)

      this.analyser.fftSize = 2048
      this.isListening = true
      this.bits = []
      this.lastTickTime = null

      this.intervalId = setInterval(this.analyzeFrequency, 100)
    },

    stopListening() {
      if (!this.isListening) return

      clearInterval(this.intervalId)
      this.micStream.getTracks().forEach(track => track.stop())
      this.audioContext.close()

      this.audioContext = null
      this.analyser = null
      this.source = null
      this.micStream = null
      this.isListening = false
      this.lastTickTime = null
    },

    analyzeFrequency() {
      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      this.analyser.getByteFrequencyData(dataArray)

      const sampleRate = this.audioContext.sampleRate
      const binSize = sampleRate / this.analyser.fftSize

      let maxVal = 0
      let maxIndex = -1

      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] > maxVal) {
          maxVal = dataArray[i]
          maxIndex = i
        }
      }

      const dominantFreq = maxIndex * binSize
      let absF = Math.round(Math.abs(dominantFreq))
      let minF = this.BackendStore.getMinF
      let maxF = this.BackendStore.getMaxF
      let tickMs = this.BackendStore.getTickMs


      if(this.lastF != absF){
        this.lastF = absF
      }
      const now = Date.now()
      if (Math.abs(absF - minF) < 100) {
        this.handleDetectedBit(0, now)
      } else if (Math.abs(absF - maxF) < 100) {
        this.handleDetectedBit(1, now)
      }else{
        this.handleDetectedBit(0, now)
      }
    },

    handleDetectedBit(bit, now) {
      if (this.lastTickTime === null) {
        this.bits.push(bit)
      } else {
        const delta = now - this.lastTickTime
        if (delta > this.tickGapMs) {
          // была пауза → добавляем 0 перед новым битом
          this.bits.push(0)
        }
        this.bits.push(bit)
      }
      this.lastTickTime = now

      this.bitsEpoch++
      if (this.bits.length > 1600) {
        this.bitsEpoch = 0
        this.bits.shift()
      }

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