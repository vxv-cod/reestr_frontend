<template>
  <div class="parent vxv_select" v-ripple="edit"
    :tabindex="-1"
    :class="isShow ? 'bg-blue-grey-4' : bgColor"
    :style="!edit ? 'background-color: inherit; pointer-events: none' : null"
    @focusin="isShow = true"
    @focusout="isShow = false"
    >
    <!--
     -->
  <div class="child"
    ref="fistCell"
    :textContent="selected"
    :tabindex="-1"
    @click="isShow = true"
    @focusin="$event.target.contentEditable = true"
    @focusout="$event.target.contentEditable = false"
    @input="search = text_cell($event)"
    @keyup.down="push_key($event, 'down')"
    @keyup.up="push_key($event, 'up')"
    @keyup.esc="push_key($event, 'esc')"
    @keypress.enter.native.prevent="push_key($event, 'enter')"
    :style="[
      edit ? 'cursor: pointer' : 'cursor: default; pointer-events: none',
      options.length === 0 ? 'color: red;' : 'color: inherit'
    ]"
    />
    <!--
    count_keyup < 0 ? 'color: red;' : 'color: inherit'
        :style="edit ? 'cursor: pointer' : 'cursor: default; pointer-events: none' "
        style="color: blue;"
        @keypress.enter.prevent="push_key('enter')"
        @keyup.enter.prevent="push_key('enter')"
       -->

    <div class="rows" v-show="isShow">
      <div class="row" v-for="option in options" :key="option.id" >
        <div
          v-if="display_data(option.id)"
          class="parent"
          v-text="option[field]"
          @click.stop="[
            model = option.id,
            isShow = false,
          ]"
          :style="model === option.id ? 'background-color: #b0bec5; color: white;' : 'background-color: inherit' "
          />
          <!--
            color_row($event, option)
           -->

      </div>
  </div>
</div>
</template>


<script setup>
import { toRefs, ref, watch, watchEffect, computed } from 'vue'

// defineOptions({name: 'vxv_select'})

defineOptions({
  name: 'vxv_select',
  // inheritAttrs: false
})

const model = defineModel()

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
  bgColor,
  exclude_ids_for_options,
} = toRefs(props)

const isShow = ref(false)
const selected = ref(null)
const search = ref('')
const options = ref(null)
// const count_keyup = ref(null)


// watchEffect(() => {
//   index_options.value = index_options.value + 1
// })

watchEffect(() => {
  options.value = copy_object(props.options)
})

watchEffect(() => {
  selected.value = props.options?.find(e => e.id === model?.value)?.[field.value]
})

watch(() => search.value, () => {
  options.value = filter_rows(search.value, props.options)
  // console.log('options.value | search.value = ', options.value)
}, { deep: true })


function copy_object(old_obj) {
  return old_obj?.map(row => Object.assign({}, row))
}

function filter_rows(find_data, old_obj) {
  // Фильтруем строки по совпадению в одной из ячеек
  const res = old_obj?.filter(row =>
    Object.values(row)?.some(cell => (cell || '').toString().toLowerCase()
      .includes((find_data || '').toString().toLowerCase()))
  )

  return res
}

function text_cell(event) {
  const textContent = event.target.textContent
  return textContent === '' ? null : textContent
}





const display_data = (data) => !exclude_ids_for_options?.value?.includes(data)
// const color_row = (event, option) => {event.target.style.backgroundColor = model === option.id ? '#b0bec5' : 'inherit'}


const count_keyup = ref(null)


watchEffect(() => {
// watch(() => options.value, () => {
  // count_keyup.value = options?.value.indexOf(options.value.indexOf(e => e.id === model?.value))
  count_keyup.value = options?.value.findIndex(e => e.id === model?.value)
  // console.log('count_keyup.value = ', count_keyup.value)
// }, { deep: true })
})


function push_key(event, val) {
  const style = event.target.style
  const max_options = options.value.length - 1

  if (val === 'enter') {
    console.log('enter');
    isShow.value = false
    return
  }
  if (val === 'esc') {
    console.log('esc');
    options.value = copy_object(props.options)
    search.value = ''
    event.target.textContent = selected.value
    return
  }
  if (val === 'down') {
    if (isShow.value === false) {
      isShow.value = true
      return
    }
    count_keyup.value = count_keyup.value < max_options ? count_keyup.value + 1 : max_options
  }
  if (val === 'up') {
    if (isShow.value === false) {
      isShow.value = true
      return
    }
    count_keyup.value = count_keyup.value < 0 ? count_keyup.value : count_keyup.value - 1
  }

  const search_row = options.value[count_keyup.value]
  model.value = search_row?.id ?? model.value
  selected.value = search_row?.[field.value] ?? selected.value

}


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

// .selected_row
//   background-color: $blue-grey-4

</style>
