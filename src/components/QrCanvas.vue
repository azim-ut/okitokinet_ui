<template>


  <div v-if="$props.bits.length > 0">
    <div class="centeredBlock">
      <div class="marginAuto qrDraw" :style="{'width': (dotSize*2) + 'px', 'height': (dotSize*2) + 'px'}">
        <div v-for="b in $props.bits"
             :class="{'qrPoint': true, 'white': b === 1, 'black': b === 0}">
        </div>
      </div>
    </div>
  </div>
  <br />
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  props: {
    bits: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      canvasSize: 400,
      maxSize: 1600,
      matrix: [],
      stop: false,
      dotSize: 2
    };
  },
  created(){
  },
  mounted() {

    this.updateMatrixAndRender(this.$props.bits);

    const sz = Math.sqrt(this.$props.bits.length)
    this.dotSize = Math.round(150/sz)
    if(this.dotSize<2){
      this.dotSize = 2
    }
    this.canvasSize = Math.round(this.$props.bits.length*this.dotSize);
    console.log("--->", this.canvasSize)
  },
  methods: {
    updateMatrixAndRender(bits) {
      if(!bits || !bits.length || this.canvasSize <= 3) {
        return
      }
      this.canvasSize *= 1
      const maxBits = Math.min(10, bits.length);
      const sqrt = Math.floor(Math.sqrt(maxBits));
      const size = sqrt * sqrt;
      const trimmed = bits.slice(bits.length - size); // скользящее окно

      // Преобразование в матрицу NxN
      const matrix = [];
      for (let i = 0; i < sqrt; i++) {
        matrix.push(trimmed.slice(i * sqrt, (i + 1) * sqrt));
      }
      this.matrix = matrix;


      // Попытка декодирования QR
      // this.tryDecodeQR();
    }
  }
});
</script>

<style scoped>
.matrix .white{
  width: 3px;
  height: 3px;
  border-radius: 1px;
}
.matrix .white{ background: white;}

.qrDraw{
  position: relative;
  overflow: hidden;
  margin: auto;
  padding: 10px;
  border: white 1px solid;
}

.qrDraw .qrPoint{
  float: left;
  width: 2px;
  height: 2px;
}
.qrDraw .qrPoint.white{
  background: white;
}
.qrDraw .qrPoint.black{
  background: darkblue;
}
</style>