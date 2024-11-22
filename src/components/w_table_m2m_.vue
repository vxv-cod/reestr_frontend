<template >
   <!-- :class="$attrs.class" -->
  <div class="contener" >
    <vxv_panel 
      v-model:edit="edit" 
      :title="title" 
      @edit-false="send_to_the_backend(
        add_data,
        update_data,
        delete_data,
        second_primary_key,
        nameTable,
        store        
      )"
      btn-del
      @del-row="deleteRowChanged(
        selected,
        outside_id,
        delete_data,
        primary_keys_all        
      )"
      btn-plus
      @plus-row="plusRowChanged()"
      />
    <div class="tableBox"   >
      <table >
        <thead  v-if="columns">
          <tr>
            <th class="fist_column">№</th>
            <th  v-for="col in columns" :key="col.name"> {{ col.label }}</th>
          </tr>
        </thead>
        <tbody v-if="rowsDict">
          <tr v-for="(row, idx) in rows" :key="row" 
            v-ripple
            @click="selectedRowsChanged(row, selected)"
            :class="selected[outside_id] === row ? 'select_tr' : null"
            :style="`background-color: ${style_tr(row, selected, delete_data)}`"
            >
            <!-- 
             -->
            <td class="rowName">{{ idx + 1 }}</td>
            <td class="" v-for="col in columns" :key="col.name" 
              >
              <!-- 
                :style="style_td( row, col.name)"
              :class="hover_field ? 'edit_true' : null"
              -->
              <unit_value 
                class="edit_true"
                v-model="row[col.name]"
                :edit="edit && !primary_keys_all?.includes(col.name)"
                :foreign_key="col.foreign_key"
                :types="col.type"
                :tablesRows="rows_of_all_tables"
                :id="`${props.nameTable}-${selected[row.info_id]}-${[col.name]}`"
                @focusout="modify_td(
                  $event, 
                  row, 
                  col, 
                  update_data, 
                  outside_id,
                  second_primary_key,
                  defaultRowsDict
                  )"
                />

                <!-- <vxv_button v-if="!edit" :ripple="false"
                  class="edit_false"
                  :text="foreign_tables?.[col.name]?.[row[col.name]] ?? row[col.name]"
                  /> -->

            </td>
          </tr>
        </tbody>
        <tfoot v-if="edit && add_data[outside_id]">
          <tr v-for="row in add_data[outside_id]" :key="row[second_primary_key]">
            <th >
              <vxv_button @click="delete_add_data(row)"  style="height: 35px;" >
                <vxv_icon 
                  :color="'white'"
                  :name="'minus-box'" 
                  />
              </vxv_button>
            </th>
            <th class="rowVal" v-for="col in columns" :key="col.name" >
              <unit_value 
                v-model="row[col.name]"
                :edit="edit"
                :foreign_key="col.foreign_key"
                :types="col.type"
                :tablesRows="rows_of_all_tables"
                :id="`add_data-${props.nameTable}-${selected[row.info_id]}-${[col.name]}`"
                :exclude_ids_for_options="exclude_ids_for_options"
                @focusout="valid_td($event, row, col)"
              />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>    
    
    <div style="display: flex; flex-direction: row; justify-content: space-around;">
      <!-- <div class="test"><pre>list_info_id = {{ list_info_id }}</pre></div> -->
      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->
      <!-- <div class="test"><pre>null_row = {{ null_row }}</pre></div> -->
      
      <!-- <div class="test"><pre>update_data = {{ update_data }}</pre></div> -->
      <!-- <div class="test"><pre>delete_data = {{ delete_data }}</pre></div> -->
      <!-- <div class="test"><pre>add_data = {{ add_data[outside_id] }}</pre></div> -->
       
      <!-- <div class="test"><pre>defaultRowsDict = {{ defaultRowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rowsDict = {{ rowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>foreign_tables = {{ foreign_tables }}</pre></div> -->
      <!-- <div class="test"><pre>rows = {{ rows }}</pre></div> -->
      <!-- <div class="test"><pre>defaultRows = {{ defaultRows }}</pre></div> -->
      <!-- <div class="test"><pre>props?.columns = {{ props?.columns }}</pre></div> -->
      <!-- <div class="test" ><pre>exclude_ids_for_options = {{ exclude_ids_for_options }}</pre></div> -->
    </div>
  </div>    
</template>



<script setup>
import { ref, watch, watchEffect, computed, toRefs, toValue } from 'vue'
import unit_value from './unit_value.vue'
import vxv_panel from './vxv_panel.vue'
import vxv_button from "./vxv_button.vue"
import vxv_icon from "./vxv_icon.vue"
import { useStore } from 'vuex'

import {
  style_tr,
  style_td,
  modify_td,
  valid_td,
  selectedRowsChanged,
  deleteRowChanged,
  filter_dictionary_in_array,
  send_to_the_backend,
 } from './scripts/m2m.js'

const store = useStore()

defineOptions({
    name: 'w_table_m2m_'
  })

const props = defineProps({
  hover_field: {
    type: String,
    default: null,
  },
  exclude_column: {
    type: String,
    default: 'info_id',
  },
  nameTable: {
    type: String,
    default: null,
  },
  title: {
    type: String,
    default: 'title',
  },
  columns: {
    type: Array,
    default: () => null,
  },
  rows_of_all_tables: {
    type: Object,
    required: true,
    default: {}
  },  
  outside_id: {
    type: Number,
    default: () => null,
  },
})

const {
  title,
  exclude_column,
  rows_of_all_tables,
  outside_id,
  // hover_field,
} = toRefs(props)

const row_null = computed(() => Object.fromEntries(props?.columns?.map((col => [col.name, null]))))
const columns = computed(() => props.columns.filter(e => e.name !== exclude_column.value))
const defaultRows = computed(() => props.rows_of_all_tables[props.nameTable])
const primary_keys_all = computed(() => {
  return props?.columns?.filter(col => col.primary_key === true).map(e => e.name)
})
const second_primary_key = computed(() => {
  return props?.columns?.filter(col => col.primary_key === true).map(e => e.name)[1]
})


const edit = ref(false)
const defaultRowsDict = ref({})
const rowsDict = ref({})
const rows = ref([])
const update_data = ref({})
const delete_data = ref({})
const selected = ref({})
const add_data = ref({})

const list_info_id = computed(() => props?.rows_of_all_tables?.['info']?.map(e => e.id))

const foreign_tables = computed(() => {
  if (Object.keys(rows_of_all_tables?.value).length !== 0) {
    // const base = {}
    // props?.columns.filter(e => e.name !== exclude_column.value && e?.foreign_key)
    //   .forEach(e => {base[e.name] = Object.fromEntries(
    //     rows_of_all_tables?.value?.[e?.foreign_key]?.map(t => [t.id, t.name])
    //   )})
    // return base

    return Object.assign({}, 
      ...props?.columns?.filter(e => e.name !== exclude_column.value && e?.foreign_key)
      .map(col => new Object({[col.name]: Object.fromEntries(
        rows_of_all_tables?.value?.[col?.foreign_key]?.map(t => [t.id, t.name])
      )}))
    )
  }
})


watchEffect(() => {
  if (defaultRows?.value !== undefined) {
    defaultRowsDict.value = {}
    rowsDict.value = {}       
    defaultRows?.value?.forEach(row => {
      update_data.value[row.info_id] = []
      delete_data.value[row.info_id] = []
      selected.value[row.info_id] = {}
      add_data.value[row.info_id] = []
      defaultRowsDict.value[row.info_id] = []
      rowsDict.value[row.info_id] = []
    })
    
    defaultRows?.value?.forEach(row => {
      defaultRowsDict.value[row.info_id]?.push(row)
      rowsDict.value[row.info_id]?.push(Object.assign({}, row))
    })
  }
})


watchEffect(() => {
  list_info_id?.value?.forEach(info_id => {
    add_data.value[info_id] = []
    update_data.value[info_id] = []
    delete_data.value[info_id] = []
    selected.value[info_id] = {}
  })
})

// watchEffect(() => {
//   if (rowsDict.value[outside_id.value] === undefined) {
//     update_data.value[outside_id.value] = []
//     delete_data.value[outside_id.value] = []
//     add_data.value[outside_id.value] = []
//     selected.value[outside_id.value] = {}
//     defaultRowsDict.value[outside_id.value] = []
//     rowsDict.value[outside_id.value] = []
//   }
// })


// watchEffect(() => {
//   if (rowsDict.value[outside_id.value] === undefined) rowsDict.value[outside_id.value] = []
//   console.log("select_name =>> ", select_name.value)
// })

watchEffect(() => {
  // console.log("selected = ", props.nameTable, selected.value)
})

watchEffect(() => {
  rows.value = rowsDict.value[outside_id.value]
  // console.log("rows== w_table_m2m_ =>> ", props.nameTable, rows.value)
})

function plusRowChanged() {
  const default_obj = Object.assign({}, row_null.value)
  default_obj[exclude_column.value] = outside_id.value
  add_data.value[outside_id.value].push(Object.assign({}, default_obj))
}

function delete_add_data(row) {
  const arr = add_data.value[outside_id.value]
  add_data.value[outside_id.value] = filter_dictionary_in_array(arr, row, false)
}

`Фильтруем список таблицы внешнего ключа на исключение существующий строк`
// Существующие id внешней таблицы
const existing_foreign_ids = computed(() => rows?.value?.map(e => e[second_primary_key.value]))
// // Существующие id добавленных строк
const existing_plus_ids = computed(() => {
  return add_data?.value?.[outside_id?.value]?.filter( e => {
    return e[second_primary_key?.value] !== null
  })?.map(el => el[second_primary_key?.value])
})
// Все id старые и новые
const exclude_ids_for_options = computed(() => [
  ...existing_foreign_ids?.value ?? [], 
  ...existing_plus_ids?.value ?? []
])



</script>



<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"

th:nth-child(3n)
  width: 70px

.fist_column
  width: 80px




</style>

