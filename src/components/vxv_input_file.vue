<template>
  <div class="parent" >
      <label class="child" :for="id" 
        :style="$attrs.style" 
        style="cursor: pointer" 
        v-ripple 
        >
         {{ placeholder }} 
      </label>
      <input :id="id" type="file" hidden @change="$emit('change', $event.target.files[0])" />
  </div>

</template>


<script setup>
import { toRefs, ref } from 'vue'

defineOptions({
  name: 'vxv_input_file',
  // inheritAttrs: false
})

// const model = defineModel()
defineEmits(['change'])

const props = defineProps({
  // style: {
  //   type: String,
  //   default: () => "",
  // },
  id: {
    type: String,
    default: () => "",
  },
  placeholder: {
    type: String,
    default: () => "",
  },
})

const {
  id,
  placeholder,
} = toRefs(props)


</script>


<style lang="sass" scoped>
// div
//   width: 100%
//   height: 100%
//   label
//     background-color: $blue-grey-1
//     width: 100%
//     height: 100%
//     // display: flex
//     // justify-content: center
//     // align-items: center
//     font-size: 12px
//     padding: 0
//     margin: 0  
//     border: none
//     outline: none    
//     &:hover
//       background-color: $blue-grey-2

// .box-input
//   display: table
//   height: 100%
//   width: 100%
//   background-color: $blue-grey-1
//   label
//     position: relative
//     display: table-cell 
//     vertical-align: middle
//     width: 100%
//     height: 100%
//     // background-color: $blue-grey-1
//     background-color: inherit

//     // display: flex
//     // justify-content: center
//     // align-items: center
//     cursor: pointer
//     font-size: 12px
//     padding: 0
//     margin: 0  
//     border: none
//     outline: none
    
//     &:hover
//       background-color: $blue-grey-2
    
    

</style>