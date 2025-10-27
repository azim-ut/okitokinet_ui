<template>


  <div v-if="$props.bits.length > 0">
    <div class="centeredBlock">
      <div class="marginAuto qrDraw" :style="{'width': (150) + 'px', 'height': (150) + 'px'}">
        <div v-for="b in $props.bits"
             :style="{'width': (dotSize) + 'px', 'height': (dotSize) + 'px'}"
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
      maxSize: 1600,
      matrix: [] as number[][],
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

  },
  methods: {
    updateMatrixAndRender(bits: number[]) {
      if(!bits || !bits.length) {
        return
      }
      const maxBits = Math.min(10, bits.length);
      const sqrt = Math.floor(Math.sqrt(maxBits));
      const size = sqrt * sqrt;
      const trimmed = bits.slice(bits.length - size); // скользящее окно

      // Преобразование в матрицу NxN
      this.matrix = [];
      for (let i = 0; i < sqrt; i++) {
        this.matrix.push(trimmed.slice(i * sqrt, (i + 1) * sqrt));
      }


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
  padding: 0;
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