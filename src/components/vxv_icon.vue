<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
    :fill="$attrs.color"
    >
      <path :d="path" />
  </svg>
  <!-- <svg-icon v-if="path" type="mdi"  :path="path"></svg-icon> -->
</template>



<script setup>
import {toRef, ref, onMounted, watch, watchEffect, computed, toRefs } from 'vue'
import * as mdi_js from '@mdi/js'

defineOptions({name: 'IconBase'})
  const props = defineProps({
    name: {
      type: String,
      default: 'mdiPencilCircle'
    },
  })

  const path = computed(() => mdi_js[
    'mdi' + (
      props.name.split('-')
      .map(e => e[0]
      .toUpperCase() + e.slice(1))
      .join('')
    )
  ])
  
  
  // import SvgIcon from '@jamescoyle/vue-icon';
  // const name = computed(() => props.name)
  // watchEffect(() => {
  //   if (name?.value !== undefined) {
  //     // Преобразуем кебаб в камел кейс
  //     const camalCase = 'mdi' + (name.value.split('-')
  //       .map(e => e[0]
  //       .toUpperCase() + e.slice(1))
  //       .join(''))
  //     path.value = mdi_js[camalCase]
  //     // Динамический импорт как вариант
  //     // import("@mdi/js").then((module) => {path.value = module[camalCase]})
  //   }
  // })

</script>


<style lang="sass" scoped>
svg
  width: 100%
  height: 100%
  padding: 3px
</style>

