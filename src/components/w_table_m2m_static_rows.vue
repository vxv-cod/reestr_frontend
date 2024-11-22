<template >
   <!-- :class="$attrs.class" -->
  <div class="contener" >
    <vxv_panel 
      :title="title" 
      v-model:edit="edit" 
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
      />
    <div class="tableBox"   >
      <table >
        <thead v-if="columns">
          <tr>
            <th v-for="(header, idx) in headers" :key="header.id"> {{ header.label }}</th>
          </tr>
        </thead>
        <!-- <tbody v-if="rowsDict && rows.length != 0"> -->
        <tbody v-if="rowsDict">
          <tr v-for="row in rows" :key="row" 
            @click="selectedRowsChanged(row, selected)"
            :style="`background-color: ${style_tr(row, selected, delete_data)}`"
            :class="selected[outside_id] === row ? 'select_tr' : null"
            >
            <!-- 
            @click="selectedRowsChanged(row)"
           -->
          <td class="" v-for="col in columns" :key="col.name" 
          >
          <!-- 
            :style="lock_edit(col) ? style_td(
              row, 
              col.name,
              second_primary_key,
              defaultRowsDict,
              outside_id      
            ) : null"
             -->
            <unit_value 
              class="edit_true"
              v-model="row[col.name]"
              :edit="lock_edit(col)"
              :foreign_key="col.foreign_key"
              :types="col.type"
              :tablesRows="rows_of_all_tables"
              :id="`${props.nameTable}-${selected[row.info_id]}-${[col.name]}`"
              @focusout="lock_edit(col) ? modify_td(
                $event, 
                row, 
                col.name,
                ) : null"
              />
          </td>
        </tr>          
        </tbody>
      </table>
    </div>    

    <div style="display: flex; flex-direction: row; justify-content: space-around;">
      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->

      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->
      <!-- <div class="test"><pre>defaultRows = {{ defaultRows }}</pre></div> -->
      <!-- <div class="test"><pre>defaultRowsDict = {{ defaultRowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rowsDict = {{ rowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rows = {{ rows }}</pre></div> -->
      <!-- <div class="test"><pre>first_column = {{ first_column }}</pre></div> -->
      <!-- <div class="test"><pre>headers = {{ headers }}</pre></div> -->
      <!-- <div class="test"><pre>columns = {{ columns }}</pre></div> -->
      <!-- <div class="test"><pre>props.columns = {{ props.columns }}</pre></div> -->

      <!-- <div class="test"><pre>add_data = {{ add_data }}</pre></div> -->
      <!-- <div class="test"><pre>update_data = {{ update_data }}</pre></div> -->
      <!-- <div class="test"><pre>delete_data = {{ delete_data }}</pre></div> -->

      <!-- <div class="test" ><pre>exclude_ids_for_options = {{ exclude_ids_for_options }}</pre></div> -->
    </div>
  </div>    
</template>



<script setup>
import { ref, watch, watchEffect, computed, toRefs, toValue } from 'vue'
import { useStore } from 'vuex'
import unit_value from './unit_value.vue'
import vxv_panel from './vxv_panel.vue'
import vxv_button from "./vxv_button.vue"

import { inject } from 'vue'

// import {send_data} from 'src/api'
import * as api from 'src/api'
import {
  style_tr,
  // style_td,
  // modify_td,
  existence_dictionary_in_array,
  filter_dictionary_in_array,
  // find_cell_in_table,
  selectedRowsChanged,
  deleteRowChanged,
  send_to_the_backend,
 } from './scripts/m2m.js'

const store = useStore()  // Не удалять, уходит в функции через this

defineOptions({
    name: 'w_table_m2m_static_rows'
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
  rows: {
    type: Object,
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
const headers = computed(() => props.columns.filter(e => ![exclude_column.value].includes(e.name)))
const columns = computed(() => props.columns.filter(e => e.name !== exclude_column.value))
const defaultRows = computed(() => props.rows_of_all_tables[props.nameTable])

const primary_keys_all = computed(() => {
  return props?.columns?.filter(col => col.primary_key === true).map(e => e.name)
})

const second_primary_key = computed(() => primary_keys_all?.value[1])

const first_column = computed(() => rows_of_all_tables?.value[
  props?.columns?.find(e => e.name === second_primary_key.value)?.foreign_key
])

const lock_edit = (col) => edit?.value && !primary_keys_all?.value?.includes(col.name)

const edit = ref(false)
const defaultRowsDict = ref({})
const rowsDict = ref({})
const rows = ref([])
const update_data = ref({})
const delete_data = ref({})
const selected = ref({})
const add_data = ref({})

// const rows = ref(Array(defaultRows.value.length).fill({}))


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
      rowsDict.value[row.info_id].push(Object.assign({}, row))
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
  // rows.value = []
  // if (rowsDict?.value?.[outside_id?.value]) {
    rows.value = rowsDict?.value?.[outside_id?.value] ?? []
    first_column?.value?.map(one => {
      const find_row = rows.value.find(f => f[second_primary_key.value] === one.id)
      if (!find_row) {
        const default_obj = Object.assign({}, row_null.value)
        default_obj[exclude_column.value] = outside_id.value
        default_obj[second_primary_key.value] = one.id
        rows.value.push(Object.assign({}, default_obj))
      }})
    rows?.value?.sort( (a, b) => a[second_primary_key.value] - b[second_primary_key.value] )
  // }
})


function modify_td(event, row, col_name) {
  //  Работа с массивом изменненных строк
  const style = event.target.style  //  из события фокуса достаем стили ячейки
  style.backgroundColor = 'inherit'

  let arr = update_data?.value[outside_id?.value]
  let vals = row[col_name]  //  текущее значение ячейки
  // vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null
  const key = second_primary_key?.value
  const old = defaultRowsDict.value[outside_id.value].find(e => e[key] == row[key])?.[col_name]
  // Если старых данных нет, то меняем списко на add_data
  if (old === undefined) {
    arr = add_data.value[outside_id.value]
  } 
  const existence = existence_dictionary_in_array(arr, row)
  // Добавляем объект в массив
  if (existence === false && vals != old) {
    arr.push(row)
    // красим ячейку
    style.color = 'white'
    style.backgroundColor = '#90a4ae'       
  }
  // Находим существующий объект и фильтруем без него
  if (existence === true && vals == old) {
    update_data.value[outside_id.value] = filter_dictionary_in_array(arr, row, false)
    // возвращаем цвлета ячейки
    style.color = 'inherit'
    style.backgroundColor = 'inherit'
  }  
}

// function eee() {
//   console.log('this ------- ', this)
// }

// watch(() => edit.value, (v) => {
//   if (v === false) {
//     eee.call(this)
//   }
// })



// watch(() => edit.value, (v) => {
  // При нажатии сохранить изменения
  // if (v === false) {
  //   eee($options)
  // }
  // if (v === false) {
  //   const merge_value = (items) => Object.values(items).reduce((sum, current) => [...sum, ...current], [])
  //   const add_data_filter_not_null = [...Object.entries(add_data.value).map(([k, v]) => (v.filter(e => e[second_primary_key.value] !== null)))]
  //   const export_data = {
  //     add_data    : merge_value(add_data_filter_not_null),
  //     update_data : merge_value(update_data.value),
  //     delete_data : merge_value(delete_data.value),
  //   }    
  //   // Отправляем на бэкенд
  //   api.send_data(props.nameTable, export_data, rows.value).then((res) => {
  //     store.commit('setOneTablesRows', {table: props.nameTable, data: res})
  //   })
  // }  
// })


// function find_cell_in_table(cell, table) {
//   return rows_of_all_tables?.value?.[table]?.find(e => e.id === cell)
// }


// function fun_hover_field(cell, table) {
//   if (hover_field?.value === null) return null
//   else {
//     const temp = find_cell_in_table(cell, table)
//     return temp?.[hover_field.value] ?? temp?.name}
// }




// function existence_dictionary_in_array(arr, dict) {
//   // Проверяем каждый словарь массива по ключам на совпадение с искомым словарем
//   return arr.some(tag => Object.entries(tag).every(([k, v]) => dict[k] == v))
// }


// function filter_dictionary_in_array(arr, dict, bool) {
//   // Находим существующий объект и фильтруем по наличию или нет
//   return arr.filter(tag => bool === Object.entries(tag).every(([k, v]) => dict[k] == v))
// }


// function deleteRowChanged() {
//   // Выбранная строка
//   const select_var = Object.assign({}, selected?.value?.[outside_id.value])
//   // Список удаляемых объектов по системе
//   const arr = delete_data.value[outside_id.value]
//   if (Object.keys(select_var).length !== 0) {
//     // Выбираем из строки только primary_keys
//     const delete_var = Object.fromEntries(Object.entries(select_var).filter(([k, v]) => primary_keys_all.value.includes(k)))
//     // Проверяем наличие объекта по всем ключам для каждого элемента из массива
//     const existence = existence_dictionary_in_array(arr, delete_var)
//     // Добавляем объект в массив
//     if (existence === false) delete_data.value[outside_id.value].push(delete_var)
//     // Находим существующий объект и фильтруем без него
//     if (existence === true) {
//       delete_data.value[outside_id.value] = filter_dictionary_in_array(arr, delete_var, false)
//     }
//   }
// }


// function style_tr(row) {
//   // Стиль строки при удалении иши выборе
//   const del_var = existence_dictionary_in_array(delete_data.value[row.info_id], row)
//   const select_var = selected.value[row.info_id] === row
//   if (del_var && !select_var) return "#e57373"
//   if (!del_var && select_var) {return "#cfd8dc"}
//   if (del_var && select_var) return "#ef5350"
// }


// function style_td(row, col_name) {
//   // Стиль ячейки в сравнении текущих даннх и дефолтных
//   const vals = row[col_name]
//   const key = second_primary_key.value
//   const old = defaultRowsDict?.value?.[outside_id?.value].find(e => e[key] == row[key])?.[col_name]
//   if (vals && old && vals != old) return 'background-color: #90a4ae; color: white'
// }


// function modify_td(row, col_name) {
//   //  Работа с массивом изменненных строк
//   let arr = update_data.value[outside_id.value]
//   const vals = row[col_name]
//   const key = second_primary_key.value
//   const old = defaultRowsDict.value[outside_id.value].find(e => e[key] == row[key])?.[col_name]
//   // Если старых данных нет, то меняем списко на add_data
//   if (old === undefined) {
//     arr = add_data.value[outside_id.value]
//   } 
//   const existence = existence_dictionary_in_array(arr, row)
//   // Добавляем объект в массив
//   if (existence === false && vals != old) {
//     arr.push(row)
//     return '#90a4ae; color: white'
//   }
//   // Находим существующий объект и фильтруем без него
//   if (existence === true && vals == old) {
//     update_data.value[outside_id.value] = filter_dictionary_in_array(arr, row, false)
//     return 'inherit'
//   }  
// }

function comtext_this() {
  return this
}

</script>



<style lang="sass" scoped>
// @import "src/components/vxv_styles/base.sass"
@import "src/components/vxv_styles/w_table.sass"

th
  width: 50%
  // box-shadow: 0px 5px 7px $blue-grey-5

//   max-height: 30px
//   height: 30px
td
  width: 50%

td:first-child
  background-color: $blue-grey-3
  

</style>

