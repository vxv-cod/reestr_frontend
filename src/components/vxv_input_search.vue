<template>
  <!-- // Поиск по таблице -->
  <div class="search" style="" >
    <input type="text" placeholder="Поиск по таблице" v-model="search">
    <q-icon v-if="search === ''" name="search" size="sm" />
    <q-icon v-else name="clear" class="cursor-pointer" @click="search = ''" size="sm" />
  <!-- <vxv_button>
    <vxv_icon color="white" name="plus-circle" :style="'width: inherit; height: inherit'"/>
  </vxv_button> -->
  </div>
</template>


<script setup>
import { ref, watch, toRefs, watchEffect, computed } from 'vue'
import { useStore } from 'vuex'
// import vxv_button from "./vxv_button.vue"
// import vxv_icon from "./vxv_icon.vue"



defineOptions({
  name: 'vxv_input_search',
})

const rows = defineModel()

const props = defineProps({
  nameTable: {type: String, default: null},
})
// const {
// } = toRefs(props)

const search = ref('')
const test = ref('')

const store = useStore()
const defaultColumns = computed(() => store.getters.getTablesColumns[props.nameTable])
const rows_of_all_tables = computed(() => store.getters.getTablesRows)
const defaultRows = computed(() => rows_of_all_tables?.value?.[props.nameTable])

const defaultRows_include_forenkey = computed(() => {
  // Заменяем значение в ячейках из внешних таблиц по id
  return defaultRows?.value?.map(e => {
    return Object.fromEntries(Object.entries(e).map(([k, v]) => {
      const foreign_key = defaultColumns?.value?.find(g => g.name === k).foreign_key
      if (foreign_key !== null) {
        const foreign_key_table = rows_of_all_tables?.value?.[foreign_key]
        const find_data = foreign_key_table?.find(x => x.id == v)?.name
        return [k, find_data]
    } else {
      return [k, v]
    }
    }))
  })
})

watch(() => search.value, (v) => {
  // Ищем id строк
  const temp = defaultRows_include_forenkey?.value?.filter(e => {
    for (let i in e) {
      if (
        (e[i] || '').toString().toLowerCase()
        .includes((v || '').toString().toLowerCase())
      ) {
        return e
      }}}).map(el => el.id)
      // Фильтруем дефолтный список по id найденных строк
    rows.value = defaultRows?.value?.filter(e => temp?.includes(e.id))
}, { deep: true })

</script>

<style lang="sass">
@import "src/components/vxv_styles/base.sass"

.search
  display: flex
  margin: 0 10px
  background-color: $blue-grey
  outline: $border
  color: white
  // color: red
  input
    background-color: inherit
    border: none
    margin: 0
    padding: 0 10px
    font-size: 12px
    // text-align: center
    display: inline-block
    color: inherit
    width: 100%
    opacity: 1
  input:focus, input:focus + .q-icon
    outline: $outline
    background-color: white
    color: black
  .q-icon
    color: inherit
    opacity: 0.8
.search:hover
  background-color: $color
  color: black

</style>

