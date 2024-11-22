<template>
  <!-- style="width: 100%; height: 100%;"  -->
  <div 
    class="parent unit_value"
    >
    <!-- 
      :style="edit ? 'cursor: default' : 'pointer-events: none' "
     -->
    <vxv_toggle v-if="type === 'boolean'"
      v-model="model"
      :id="id"
      :style="edit ? 'cursor: pointer' : 'cursor: default; pointer-events: none' "
    />
    <vxv_select v-if="foreign_key" 
      v-model="model" 
      :options="tablesRows[foreign_key]"
      :exclude_ids_for_options="exclude_ids_for_options"
      :edit="edit"
      :field="field"
      />
    <vxv_editable v-if="!foreign_key && type !== 'boolean'" 
      v-model.number="model"
      :edit="edit"
      
      />
      <!-- 
        :style="$attrs.style"
        v-model.number="model"
        <div class="border_hiden"></div>
       -->
  </div>
</template>


<script setup>
import { ref, onMounted, watch, watchEffect, computed, toRefs } from 'vue'
import vxv_select from './vxv_select.vue'
import vxv_toggle from './vxv_toggle.vue'
import vxv_editable from "./vxv_editable.vue"


defineOptions({
  name: 'unit_value',
  // inheritAttrs: false
})

const model = defineModel()
// const emit = defineEmits(['returnData'])

const props = defineProps({

  edit: {
    type: Boolean,
    default: () => false,
  },
  type: {
    type: String,
    default: () => null,
  },
  id: {
    type: String,
    default: () => null,
  },
  foreign_key: {
    type: String,
    default: () => null,
  },
  tablesRows: {
    type: Object,
    default: () => null,
  },
  exclude_ids_for_options: {
    type: Array,
    default: () => null,
  },  
  field: {
    type: String,
    default: () => "name",
  },
})

const {
  edit,
  type,
  foreign_key,
  field,
  tablesRows,
  exclude_ids_for_options,
  id,
} = toRefs(props)

// watchEffect(() => {
  // console.log(model.value, type.value);
  // console.log(foreign_key.value);
// })



</script>



<style lang="sass" >
@import "src/components/vxv_styles/base.sass"

// .border_hiden::after, .border_hiden::before
//   position: absolute
//   z-index: 10
//   top: -1.5px
//   width: 10px
//   height: 2px
//   border-top: 2px solid $blue-grey-1
//   // background-color: red
//   content:""
// .border_hiden::after    
//   right: 0  
// .border_hiden::before
//   left: 0

// .child[contenteditable="true"]
  // background-color: $color-edit 


// $color: #90A4AE
// $box-shadow: $blue-grey-5
// $column: 2
// $max-width: 600px
// $border: 1px solid $blue-grey-1
// $outline: 0.5px solid white

// input[type="checkbox"]
//   accent-color: $amber

// .parent
//   cursor: text
//   background-color: inherit
// .boxCell
//   position: relative
//   width: 100%
//   height: 100%
//   background-color: $blue-grey-2
//   white-space: pre-wrap
//   border: none
//   outline: none
//   cursor: text
//   border: none
//   outline: none  
//   // margin: 1px
//   // padding: 1px
//   background-color: inherit
  // &:hover 
  //   background-color: $blue-grey-2  

// .box_text
//   position: relative
//   background-color: blueviolet
//   color: black
//   border: none
//   width: 100%
//   // height: 100%
//   // padding: 2.5px
//   align-items: stretch
//   margin: auto
//   height: auto
//   outline: none
//   // display: table-cell
// // .vxv_select


</style>
