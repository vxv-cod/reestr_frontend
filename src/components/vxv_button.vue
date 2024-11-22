<template>
  <div class="parent" v-ripple="$attrs.ripple">
    <slot >
      <div 
        v-if="$attrs.text && !$attrs.hover_field" 
        class="child" 
        :style="$attrs.style"
        >
        {{ $attrs.text }}
      </div>
    </slot>
  </div>
</template>


<script setup>
import { toRefs } from 'vue'

defineOptions({
  name: 'vxv_button', 
})

// const model = defineModel()
// const props = defineProps({
// })

// const {
//   // text,
// } = toRefs(props)

</script>


<style lang="sass" scoped>

div[round]
  border-radius: 50%
  cursor: pointer
  position: relative
  // background-color: $green
  // position: relative

// .tip
//   position: sticky
//   z-index: 9999
//   top: -25px  
//   left: 0
//   color: red
//   background-color: $green

//   // visibility: hidden
//   content: attr(tip)

// p[class *= "details"]

</style>