<template>
  <!-- @click="console.log('object'); model=!model" -->
  <div class="parent" @click="model = !model" >
    <div class="child">
      <input
        type="checkbox"
        v-model="model"
        class="demoToggleCheckbox"
        :id="id"
        />
      <label :for="id" @click.stop ></label>
    </div>
  </div>
</template>


<script setup>
import { toRefs } from 'vue'

defineOptions({name: 'vxv_toggle'})
const model = defineModel()
const props = defineProps(['id'])
const { id } = toRefs(props)
</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/base.sass"

.demoToggleCheckbox
  display: none
  // width: 100%
  // height: 100%  
  // background-color: blue

.demoToggleCheckbox + label 
    display: inline-block
    width: 40px
    height: 20px
    background-color: $blue-grey-3
    border-radius: 10px
    position: relative
    cursor: pointer
    margin: auto
    padding: auto
    outline: 0.5px solid white
.demoToggleCheckbox + label:after 
    content: ''
    position: absolute
    top: 0px
    left: 0px
    width: 20px
    height: 20px
    border-radius: 50%
    background-color: $blue-grey-5
    transition: transform 0.3s

.demoToggleCheckbox:checked + label 
    background-color: $amber

.demoToggleCheckbox:checked + label:after 
    transform: translateX(20px)
    outline: 2px solid white

</style>
