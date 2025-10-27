<template>
  <div class="centeredBlock">
    <div class="grid grid2 forced headBlock marginAuto">
      <div @click="toPage('broadcaster')" :class="{'on': pageName == 'broadcaster'}">
        <span>Передача</span>
      </div>
      <div @click="toPage('receiver')" :class="{'on': pageName == 'receiver'}">
        <span>Приём</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  data(){
    return {
      pageName: 'broadcaster'
    }
  },
  methods: {
    toPage(pageName: string){
      this.pageName = pageName
      this.$router.push({name: this.pageName})
    }
  },
  created(){
  },
  mounted() {
    this.pageName = this.$route.name as string
  }
})
</script>


<style>
.headBlock{
  min-width: 350px;
}
.headBlock div{
  height: 40px;
  cursor: pointer;
  line-height: 40px;
  text-align: center;
}
.headBlock div span{
  padding: 7px;
  border-bottom: transparent 5px solid;
}
.headBlock div.on span,
.headBlock div:hover span{
  border-bottom: #7a8897 5px solid;

}
</style>