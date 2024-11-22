<template>
  <div class="contener" >
    <vxv_panel
      v-model:edit="edit"
      :title="title"
      @edit-false="send_to_the_backend()"
      btn-plus
      @plus-row="plusRowChanged()"
      v-model:rows="rows"
      :nameTable="props.nameTable"
      />
    <div class="tableBox"  >
      <table >
        <thead>
          <!-- <tr><th :colspan="columns.length"><vxv_panel :title="title" v-model:edit="edit"/></th></tr> -->
          <tr>
            <th v-for="col in columns" :key="col.name"> {{ col.label }} </th>
          </tr>
        </thead>
        <tbody v-if="rows">
          <tr v-for="row in rows" :key="row.id"
            @click="selectedRowsChanged(row.id)"
            :class="selected === row.id ? 'select_tr' : null"
            >
          <td v-for="col in columns" :key="col.name"
            class="rowVal"
            >
            <!--
              :style="`background-color: ${style_tr(row)}`"
              :style="edit ? style_td(row, col.name) : null"
                @click="!edit ? selectedRowsChanged(row.id) : null"
                :class="td_edit(row, col, row[col.name]) ? `bg-blue-grey-3` : null"
                :style="`height: ${100/rows.length}%`"
                -->
              <unit_value
                v-model="row[col.name]"
                :edit="edit"
                :foreign_key="col.foreign_key"
                :types="col.type"
                :tablesRows="rows_of_all_tables"
                @focusout="td_edit($event, row, col)"
                />
                <!--
                  :style="edit ? style_td(row, col.name) : null"
               -->
            </td>
          </tr>
        </tbody>
        <tfoot v-if="edit && add_data.length !== 0">
          <tr v-for="row in add_data" :key="row">
            <th >
              <vxv_button @click="delete_add_data(row)"  style="height: 35px;" >
                <vxv_icon
                  :color="'white'"
                  :name="'minus-box'"
                  />
              </vxv_button>
            </th>
            <th class="rowVal" v-for="col in columns_add_rows" :key="col.name" >
              <unit_value
                v-model="row[col.name]"
                :edit="edit"
                :foreign_key="col.foreign_key"
                :types="col.type"
                :tablesRows="rows_of_all_tables"
                :id="`add_data-info-${selected[row.id]}-${[col.name]}`"
                @focusout="valid_td($event, row, col)"

              />
            </th>
          </tr>
        </tfoot>
      </table>

      <!-- </div> -->

      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->

    </div>
    <div style="display: flex; flex-direction: row; justify-content: space-around;">
      <!-- <div class="test"><pre>selected = {{ selected }}</pre></div> -->
      <!-- <div class="test"><pre>null_row = {{ null_row }}</pre></div> -->
      <!-- <div class="test"><pre>update_data = {{ update_data }}</pre></div> -->
      <!-- <div class="test"><pre>delete_data = {{ delete_data }}</pre></div> -->
      <!-- <div class="test"><pre>add_data = {{ add_data }}</pre></div> -->
      <!-- <div class="test"><pre>defaultRowsDict = {{ defaultRowsDict }}</pre></div> -->
      <!-- <div class="test"><pre>rows = {{ rows[1] }}</pre></div> -->
      <!-- <div class="test"><pre>row_null = {{ row_null }}</pre></div> -->
      <!-- <div class="test"><pre>columns = {{ columns }}</pre></div> -->
      <!-- <div class="test"><pre>columns_add_rows = {{ columns_add_rows }}</pre></div> -->
    </div>
  </div>
</template>




<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  watchEffect,
  watchSyncEffect,
  watchPostEffect,
  unref,
  toValue,
  toRefs,
  toRef,
  onMounted,
  onUpdated,
  onBeforeMount,
  getCurrentInstance,
  isRef,
  isReactive,
} from 'vue'

// import edit_cell from './vxv_table/edit_cell.vue'
import { useStore } from 'vuex'
import unit_value from './unit_value.vue'
import vxv_panel from './vxv_panel.vue'
import vxv_button from "./vxv_button.vue"
import vxv_icon from "./vxv_icon.vue"

// import {send_data_for_an_update} from 'src/api'
import {send_data} from 'src/api'

import {
  // style_tr,
  // style_td,
  // modify_td,
  // find_cell_in_table,
  // fun_hover_field,
  // selectedRowsChanged,
  // deleteRowChanged,
  filter_dictionary_in_array,
  // existence_dictionary_in_array,
  // send_to_the_backend,
 } from './scripts/m2m.js'

defineOptions({
  name: 'InfoPage',
  // inheritAttrs: false
})

const store = useStore()

const selected = defineModel()

const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  nameTable: {
    type: String,
    required: true,
    default: ''
  },
  rows_of_all_tables: {
    type: Object,
    required: true,
    default: {}
  },
  columns_of_all_tables: {
    type: Object,
    required: true,
    default: {}
  },
  select_name: {
    type: Array,
    default: () => ["name"]
  },
  // filter_kye: {
  //   type: String,
  //   default: null,
  // },
  filter_value: {
    type: Number,
    default: null,
  },
})

const tablesRows = computed(() => props.rows_of_all_tables)
const defaultColumns = computed(() => props.columns_of_all_tables[props.nameTable])
const defaultRows = computed(() => props.rows_of_all_tables[props.nameTable])
// const filter_kye = computed(() => props.filter_kye)
// const filter_value = computed(() => props.filter_value)
// const select_name = computed(() => props.select_name)

const edit = ref(false)
const rows = ref([])
const columns = ref([])
const columns_add_rows = ref([])
const defaultRowsDict = ref({})
const rowsDict = ref({})
const update_data = ref({})
// const update_data = ref([])
// const delete_data = ref({})
// const add_data = ref({})
const add_data = ref([])
// const outside_id = ref(null)

// const default_style = {'background-color': 'red', 'color': 'inherit'}


function obj_dop(e) {
  return {
    sortable: true,
    align: 'center',
    // style: default_style,
    field: (row) => row[e.name],
    format: (val) => `${val}`,
  }
}

// onUpdated(() => {console.log('onUpdated_Table')})

watchEffect(() => {
  // console.log(props.rows_of_all_tables);
})
watchEffect(() => {
  // columns.value = []
  // columns_add_rows.value = []
  defaultColumns.value?.forEach(e => {
    columns.value.push(Object.assign({}, e, obj_dop(e)))
  })
  columns_add_rows.value = columns?.value?.slice(1)
}, { flush: 'pre' })


// watchEffect(() => {
//   if (defaultRows?.value !== undefined) {
//     defaultRowsDict.value = {}
//     rows.value = []
//     defaultRows?.value?.forEach(row => {
//       add_data.value = []
//       // update_data.value = []
//       // delete_data.value[row.info_id] = []
//       defaultRowsDict.value[row.id] = row
//       rows.value.push(Object.assign({}, row))
//     })
//   }
// })


watch(() => defaultRows?.value, () => {
  if (defaultRows?.value !== undefined) {
    // console.log('rows.value = ', rows.value);
    defaultRowsDict.value = {}
    rows.value = []
    defaultRows?.value?.forEach(row => {
      add_data.value = []
      defaultRowsDict.value[row.id] = row
      rows.value.push(Object.assign({}, row))
    })
  }
}, { deep: true })


function valid_td(event, row, col) {
  const style = event.target.style  //  из события фокуса достаем стили ячейки
  style.backgroundColor = 'inherit'
  let vals = row[col.name]  //  текущее значение ячейки
  vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null
  const col_type = col.type === 'integer' ? 'number' : col.type
  if (vals && vals !== null && col_type !== typeof vals) {
    style.backgroundColor = 'red'
    return alert(`Тип данных должен быть: ${col_type}`)
  }
}


function td_edit(event, row, col) {
  // console.log(event.target);
  const style = event.target.style  //  из события фокуса достаем стили ячейки
  style.backgroundColor = 'inherit'
  let vals = row[col.name]  //  текущее значение ячейки
  vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null
  const old = defaultRowsDict?.value?.[row.id]?.[col.name]  //  начальное значение ячейки
  let add_update_item = update_data.value[row.id]   // искомый элемент в add_data

  const col_type = col.type === 'integer' ? 'number' : col.type
  if (vals && vals !== null && col_type !== typeof vals) {
    style.backgroundColor = 'red'
    alert(`Тип данных должен быть: ${col_type}`)
    row[col.name] = null
    return
  }

  if (vals != old) {  //  если старое и новое значение ячейки не равны
    if (add_update_item === undefined) {
      // добавляем пустой объект с ключом строки
      update_data.value[row.id] = {}
    }
    // добавляем данные в этот объект
    update_data.value[row.id]['id'] = row.id
    update_data.value[row.id][col.name] = vals
    // красим ячейку
    style.color = 'white'
    style.backgroundColor = '#90a4ae'
  }
  if (vals == old) {  //  если старое и новое значение ячейки равны
    //  проверяем существует ли искомом элементе ключ колонки
    if (add_update_item?.[col.name]) {
      delete add_update_item[col.name]  // удаляем данный ключ
      if (Object.keys(add_update_item).length === 1) {
        // если остался один ключ, а именно с id строки - удаляем
        delete update_data.value[row.id]
      }
      // возвращаем цвлета ячейки
      style.color = 'inherit'
      style.backgroundColor = 'inherit'
    }
  }
}

function style_td(row, col_name) {
  // Стиль ячейки в сравнении текущих даннх и дефолтных
  let vals = row[col_name]  //  текущее значение ячейки
  vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null
  const old = defaultRowsDict?.value?.[row.id]?.[col_name]  //  начальное значение ячейки
  console.log(vals, old, vals != old);
  if (vals != old) return 'background-color: #90a4ae; color: white'
}

// function style_tr(row) {
//   // Стиль строки при удалении иши выборе
//   // const del_var = existence_dictionary_in_array(this.delete_data[row.id], row)
//   const del_var = false
//   const select_var = this.selected === row.id
//   console.log('select_var ', select_var);
//   if (del_var && !select_var) return "#e57373"
//   // if (!del_var && select_var) {return "#cfd8dc"}
//   if (del_var && select_var) return "#ef5350"
// }


// function modify_td(row, col_name) {
//   console.log("arguments ===", [...arguments]);
//   console.log("this ===", this);
//   //  Работа с массивом изменненных строк
//   let arr = this.update_data
//   const vals = row[col_name]
//   const old = this.defaultRows?.find(e => e.id === row.id)[col_name]
//   // Если старых данных нет, то меняем списко на add_data
//   if (old === undefined) {
//     arr = this.add_data
//   }
//   const existence = existence_dictionary_in_array(arr, row)
//   // Добавляем объект в массив
//   if (existence === false && vals != old) {
//     arr.push({id: row.id, [col_name]: vals})
//     return '#90a4ae; color: white'
//   }
//   // Находим существующий объект и фильтруем без него
//   if (existence === true && vals == old) {
//     this.update_data = filter_dictionary_in_array(arr, row, false)
//     return 'inherit'
//   }
// }








const selectedRowsChanged = (row_id) => {
  selected.value = row_id
}

const row_null = computed(() => {
  const xxx = Object.fromEntries(
    defaultColumns?.value?.map((col => [col.name, null]))
  )
  delete xxx.id
  return xxx
})

function plusRowChanged() {
  const default_obj = Object.assign({}, row_null?.value)
  add_data?.value?.push(Object.assign({}, default_obj))
}


function delete_add_data(row) {
  const arr = add_data.value
  add_data.value = filter_dictionary_in_array(arr, row, false)
}


function send_to_the_backend() {
  // При нажатии сохранить изменения
  const merge_value = (items) => Object.values(items).filter(e => Object.keys(e).length !== 0)
  const export_data = {
    add_data    : add_data.value,
    update_data : merge_value(update_data.value),
    // delete_data : merge_value(delete_data.value),
  }
    console.log('export_data = ', export_data);
  // Отправляем на бэкенд
  send_data(props.nameTable, export_data, rows.value).then((res) => {
    store.commit('setOneTablesRows', {table: props.nameTable, data: res})
    if (Object.keys(export_data.add_data).length !== 0) {
      selected.value = res.slice(-1)[0].id
    }
  })
}

</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"
// .rowVal
//   background-color: red

//
table tr
  // height: 1px
  // position: sticky
  // top: 38px
  // top: 0
  // right: 0
  // left: 0
  // z-index: 5
  // height: 1px
thead
  // height: 1px
  // border: none
  // tr
    // height: 1px


tbody
  box-sizing: border-box
  tr
    // height: 1%
  td
    max-height: 1%
    // height: 1px
    // height: 50%
  td:first-child
    border-left: 0.5px solid $blue-grey-5
  td:last-child
    border-right: 0.5px solid $blue-grey-5



</style>
