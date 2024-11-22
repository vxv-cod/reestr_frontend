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
        <tbody v-if="rowsDict ">
          <tr v-for="(row, idx) in rows" :key="row"
            @click="selectedRowsChanged(row, selected)"
            :class="selected[outside_id] === row ? 'select_tr' : null"
            :style="`background-color: ${style_tr(row, selected, delete_data)}; cursor: default`"
            >
            <td class="rowName">{{ idx + 1 }}</td>
            <td class="" v-for="col in columns" :key="col.name"
              >
              <vxv_button
                :text="row[col.name]"
                :ripple="false"
                />
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
              <unit_value v-if="col.name !== 'name'"
                v-model="row[col.name]"
                :edit="edit"
                :foreign_key="col.foreign_key"
                :types="col.type"
                :tablesRows="rows_of_all_tables"
                :id="`add_data-info-${selected[row.info_id]}-${[col.name]}`"
                :exclude_ids_for_options="exclude_ids_for_options"
                @focusout="row.name = find_cell_in_table(
                  row[col.name],
                  col.foreign_key,
                  rows_of_all_tables
                  )?.name"
                field="id"
                />
              <vxv_button v-if="col.name === 'name'"
                :ripple="false"
                :text="row.name"
                style="background-color: #ccc"
                />
            </th>
          </tr>
        </tfoot>
      </table>
    </div>

    <div style="display: flex; flex-direction: row; justify-content: space-around;">
      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->
      <!-- <div class="test"><pre>null_row = {{ null_row }}</pre></div> -->

      <!-- <div class="test"><pre>add_data = {{ add_data }}</pre></div> -->
      <!-- <div class="test"><pre>update_data = {{ update_data }}</pre></div> -->
      <!-- <div class="test"><pre>delete_data = {{ delete_data }}</pre></div> -->

      <!-- <div class="test"><pre>defaultRows = {{ defaultRows }}</pre></div> -->
      <!-- <div class="test">xxx = {{ xxx }}</div> -->
      <!-- <div class="test"><pre>defaultRowsDict = {{ defaultRowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rowsDict = {{ rowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rowsDict = {{ rowsDict[outside_id] }}</pre></div> -->
      <!-- <div class="test"><pre>rows = {{ rows }}</pre></div> -->
      <!-- <div><pre>rows = {{ rows }}</pre></div> -->
      <!-- <div class="test"><pre>props?.columns = {{ props?.columns }}</pre></div> -->
      <!-- <div class="test" ><pre>exclude_ids_for_options = {{ exclude_ids_for_options }}</pre></div> -->
      <!-- <div class="test"><pre>defaultColumns = {{ defaultColumns }}</pre></div> -->
      <!-- <div class="test"><pre>columns = {{ columns }}</pre></div> -->
      <!-- <div class="test"><pre>props.columns_of_all_tables = {{ props.columns_of_all_tables }}</pre></div> -->
    </div>
  </div>
</template>



<script setup>
import { ref, watch, watchEffect, computed, toRefs, toValue } from 'vue'
import { useStore } from 'vuex'
import unit_value from './unit_value.vue'
import vxv_panel from './vxv_panel.vue'
import vxv_button from "./vxv_button.vue"
import vxv_icon from "./vxv_icon.vue"

import {
  style_tr,
  // style_td,
  // modify_td,
  find_cell_in_table,
  selectedRowsChanged,
  deleteRowChanged,
  filter_dictionary_in_array,
  send_to_the_backend,
 } from './scripts/m2m.js'


defineOptions({
    name: 'w_table_m2m_child_columns'
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
    required: true,
  },
  title: {
    type: String,
    default: 'title',
  },
  parent_table_name: {
    type: String,
    required: true,
    default: () => null,
  },
  rows_of_all_tables: {
    type: Object,
    required: true,
    default: null
  },
  columns_of_all_tables: {
    type: Object,
    required: true,
    default: null
  },
  outside_id: {
    type: Number,
    default: () => null,
  },
})

const {
  title,
  nameTable,
  exclude_column,
  rows_of_all_tables,
  columns_of_all_tables,
  outside_id,
  hover_field,
  parent_table_name,
} = toRefs(props)

const parent_table_rows = computed(() => props.rows_of_all_tables[props.parent_table_name])
const defaultColumns = computed(() => props.columns_of_all_tables[props.nameTable])
const defaultRows = computed(() => props.rows_of_all_tables[props.nameTable])
const primary_keys_all = computed(() => {
  return defaultColumns?.value?.filter(col => col.primary_key === true).map(e => e.name)
})
const second_primary_key = computed(() => {
  return primary_keys_all.value[1]
})

const store = useStore()

const edit = ref(false)
const rows = ref([])
const columns = ref([])
const defaultRowsDict = ref({})
const rowsDict = ref({})
const update_data = ref({})
const delete_data = ref({})
const add_data = ref({})
const selected = ref({})


watchEffect(() => {
  defaultColumns?.value?.filter(e => e.name !== exclude_column.value).forEach(col => {
    if (col.foreign_key !== null) {
      // columns.value.push(defaultColumns?.value[second_primary_key.value])
      columns.value.push(col)
      columns.value.push(props.columns_of_all_tables[col.foreign_key].find(e => e.name === 'name'))
    }
    else {columns.value.push(col)}
  })
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
      defaultRowsDict.value[row.info_id].push(row)
      // rowsDict.value[row.info_id].push(Object.assign({}, row))
      const find_row = parent_table_rows.value.find(e => e.id === row[second_primary_key.value])
      rowsDict.value[row.info_id].push(Object.assign({}, row, find_row ))
    })
  }
})


watchEffect(() => {
  if (rowsDict.value[outside_id.value] === undefined) {
    update_data.value[outside_id.value] = []
    delete_data.value[outside_id.value] = []
    add_data.value[outside_id.value] = []
    selected.value[outside_id.value] = {}
    defaultRowsDict.value[outside_id.value] = []
    rowsDict.value[outside_id.value] = []
  }
})


watchEffect(() => {
  rows.value = rowsDict?.value?.[outside_id.value]
})


// `Фильтруем список таблицы внешнего ключа на исключение существующий строк`
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


const row_null = computed(() => Object.fromEntries(defaultColumns?.value?.map((col => [col.name, null]))))

function plusRowChanged() {
  const default_obj = Object.assign({}, row_null.value)
  default_obj[exclude_column.value] = outside_id.value
  default_obj['name'] = null
  add_data.value[outside_id.value].push(Object.assign({}, default_obj))
}

function delete_add_data(row) {
  const arr = add_data.value[outside_id.value]
  add_data.value[outside_id.value] = filter_dictionary_in_array(arr, row, false)
}

</script>



<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"

th:nth-child(1)
  width: 80px
th:nth-child(2)
  width: 80px

</style>

