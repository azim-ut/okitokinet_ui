<template>
  <div>
    <h2>Массив значений:</h2>

    <button @click="startListening" :disabled="isListening">🎙 Начать</button>
    <button @click="stopListening" :disabled="!isListening">⛔️ Стоп</button>
  </div>
  <div>
    <QrCanvas :bits="bits" :key="bitsEpoch" />
  </div>
  <div>
    {{bits}}
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {BackendStore} from "@/stores/backend/backend.ts";
import QrCanvas from "@/components/QrCanvas.vue";
import bytesDefault from "./../../../okitokinet/file/res/temp.json";

export default defineComponent({
  components: {QrCanvas},
  computed: {...mapStores(BackendStore)},
  props: {
    minF: {
      type: Number,
      required: true
    },
    maxF: {
      type: Number,
      required: true
    }
  },
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
      if(this.lastF != absF){
        this.lastF = absF
        console.log(this.lastF)
      }
      const now = Date.now()
      if (Math.abs(absF - this.$props.minF) < 100) {
        console.log(0, Math.abs(absF - this.$props.minF))
        this.handleDetectedBit(0, now)
      } else if (Math.abs(absF - this.$props.maxF) < 100) {
        console.log(1, Math.abs(absF - this.$props.maxF))
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