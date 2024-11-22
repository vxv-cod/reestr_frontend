<template>
  <div class="parent vxv_select" v-ripple="edit"
    :class="isShow ? 'bg-blue-grey-4' : bgColor"
    :tabindex="-1"
    @focusout="isShow = false"
    :style="!edit ? 'background-color: inherit' : null"
    >
    <div class="child"
      @click="isShow = !isShow"
      :style="edit ? 'cursor: pointer' : 'cursor: default; pointer-events: none' "
      v-text="selected"
      />
      <!--
        :hover_field="options?.find(e => e.id === model)?.phone ?? null"
        :default-text="selected"
        :style="$attrs.style"
      -->

    <div class="rows" v-show="isShow">
      <div class="row" v-for="option in options" :key="option.id" >
        <div class="parent"
          v-if="display_data(option.id)"
          v-text="option[field]"
          @click="isShow = false; model = option.id"
          />
          <!-- :hover_field="option[hover_field]" -->
      </div>
  </div>
</div>
</template>


<script setup>
import { toRefs, ref, watch, watchEffect } from 'vue'
import vxv_editable from "./vxv_editable.vue"

// defineOptions({name: 'vxv_select'})

defineOptions({
  name: 'vxv_select',
  // inheritAttrs: false
})

const model = defineModel()
// const model = defineModel({ default: 1 })

const props = defineProps({
edit: {
  type: Boolean,
  default: () => false,
},
field: {
  type: String,
  default: () => "name",
},
bgColor: {
  type: String,
  default: () => null,
},
options: {
  type: Array,
  default: () => [],
},
exclude_ids_for_options: {
  type: Array,
  default: () => [],
},

})

const {
  edit,
  field,
  options,
  bgColor,
  exclude_ids_for_options,
} = toRefs(props)

const isShow = ref(false)
const selected = ref(null)

const display_data = (data) => !exclude_ids_for_options?.value?.includes(data)

// watchEffect(() => {
//   const option = options?.value?.find(e => e.id === model.value)
//   selected.value = null
//   if (option) selected.value = option[field.value]
// })

watchEffect(() => {
  selected.value = options?.value?.find(e => e.id === model?.value)?.[field.value]
})

// watch(() => [model, options], () => {
//   const temp = options?.value?.find(e => e.id === model.value)
//   if (temp) selected.value = temp[field.value]
// }, { deep: true })


</script>



<style lang="sass" scoped>
@import "src/components/vxv_styles/base.sass"
.row
  color: black
.child
  align-items: center
  display: flex
  flex-direction: column

  &:hover
    background-color: $blue-grey-3
  &:focus
    background-color: $blue-grey-4
  &:active
    background-color: $blue-grey-5
    box-shadow: inset 0 0 5px $blue-grey-6



</style>
