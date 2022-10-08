<script setup>
import { computed } from 'vue'
import { useStore } from '@/vuex'

const store = useStore()
function add() {
  store.commit('add', 1)
}

function asyncAdd() {
  store.dispatch('asyncAdd', 1)
}

const count = computed(() => store.state.count)

const double = computed(() => store.getters.double)

const aCount = computed(() => store.state.aCount.count)

const bCount = computed(() => store.state.bCount.count)
</script>

<template>
  <div>计数器:{{ count }} {{ $store.state.count }}</div>
  <button @click="$store.state.count++">+1</button>
  <hr />
  double:{{ double }} {{ $store.getters.double }}
  <hr />
  同步修改: <button @click="add">+1</button>
  <hr />
  异步修改: <button @click="asyncAdd">+1</button>
  <hr />
  a模块: {{ aCount }}
  <hr />
  b模块: {{ bCount }}
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
