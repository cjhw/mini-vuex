<script setup>
import { computed } from 'vue'
import { useStore } from '@/vuex'

const store = useStore()
function add() {
  store.commit('add', 1)
}

function asyncAdd() {
  store.dispatch('asyncAdd', 1).then(() => {
    alert('ok')
  })
}

const count = computed(() => store.state.count)

const double = computed(() => store.getters.double)

const aCount = computed(() => store.state.aCount.count)

const bCount = computed(() => store.state.bCount.count)

const cCount = computed(() => store.state.aCount.cCount.count)
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
  <button @click="$store.commit('aCount/add', 1)">修改a模块 +1</button>
  <hr />
  b模块: {{ bCount }}
  <button @click="$store.commit('bCount/add', 1)">修改b模块 +1</button>
  <hr />
  c模块: {{ cCount }}
  <button @click="$store.commit('aCount/cCount/add', 1)">修改c模块 +1</button>
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
