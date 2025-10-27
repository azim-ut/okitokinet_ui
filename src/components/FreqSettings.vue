<template>

  <div style="width: 100%;">

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>Настройки частот</v-expansion-panel-title>
        <v-expansion-panel-text>

          <div class="grid grid2">
            <div>

              <v-number-input
                  :reverse="false"
                  controlVariant="split"
                  label="Частота 0"
                  @change="setMinF"
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
                  @change="setMaxF"
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
                  @change="setTickMs"
                  v-model="tickMs"
                  :decimal-separator="'.'"
                  :hideInput="false"
                  :inset="false"
                  variant="outlined"
              ></v-number-input>
            </div>
            <div></div>
          </div>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {mapStores} from "pinia";
import {BackendStore} from "@/stores/backend/backend.ts";

export default defineComponent({
  computed: {...mapStores(BackendStore)},
  data(){
    return {
      minF: 1200,
      maxF: 2200,
      tickMs: 200,
      panel: [1],
      expand: false
    }
  },
  methods: {
    setMinF(){
      this.BackendStore.setMinF(this.minF)
    },
    setMaxF(){
      this.BackendStore.setMaxF(this.maxF)
    },
    setTickMs(){
      this.BackendStore.setTickMs(this.tickMs)
    }
  },
  created(){
  },
  mounted() {
    this.maxF = this.BackendStore.getMaxF
    this.minF = this.BackendStore.getMinF
    this.tickMs = this.BackendStore.getTickMs
  }
})
</script>


<style>
</style>