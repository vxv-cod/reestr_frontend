<template>
  <!-- <div class="parent"  > -->
    <div class="child"  v-ripple="edit"
      :contenteditable="edit" 
      @blur="val => model = text_cell(val)" 
      :style="edit ? 'cursor: text' : 'pointer-events: none' "
      v-text="model"
      />
    <!--
        :tabindex="-1"
        @blur="val => model = val.target.textContent" 
      -->
  <!-- </div> -->


    <!-- <div class="parent" 
      style="width: 100%; height: 100%"
      >
      <div class="child mirror-text"  data-placeholder="-- \\ --">{{ model }}</div>
      <textarea id="textarea"  class="child textarea-auto-expand" v-model="model" ></textarea>
    </div> -->

</template>


<script setup>
import { toRefs, watchEffect } from 'vue'

const model = defineModel()

const props = defineProps({
  edit: {
    type: Boolean,
    default: () => false,
  },  
})

const { edit } = toRefs(props)

function text_cell(val) {
  let data = val.target.textContent
  if (data === '') return null
  // else return Number(data) ?? data
  else return data
}


</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/base.sass"
// @import "src/components/vxv_styles/menu.sass"


// .textarea-auto-expand
//   background-color: inherit
//   // background-color: red
//   // height: 100%
//   // --textarea-height: 100%
//   width: 100%
//   resize: none
//   overflow: hidden
//   box-sizing: border-box
//   border: none
//   outline: none
//   position: absolute
//   // position: relative
//   z-index: 5
//   top: 0
//   top: 0
//   left: 0
//   right: 0
//   bottom: 0
  
//   // align-items: stretch
//   margin: auto
//   display: block
//   padding-top: auto
//   padding-bottom: auto
//   display: flex
//   vertical-align: middle
//   align-items: center
//   text-align: center

//   display: flex
//   // flex-direction: column
//   align-items: center
//   justify-content: safe center
  

// .mirror-text
//   width: 100%
//   height: 100%
//   background-color: green
//   position: relative
//   visibility: hidden
//   // z-index: -1
//   // z-index: 5
//   top: 0
//   left: 0
//   right: 0
//   bottom: 0  

//   &.mirror-text[contenteditable="true"]:empty::before
//     content: attr(data-placeholder)
//     color: #999

</style>