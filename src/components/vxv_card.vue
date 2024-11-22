<template>
  <!-- <div class="contener"> -->
    <!-- style="display: flex; flex-direction: column; " -->

  <div class="contener" >
    <!-- <div style="display: flex; flex-direction: row; ">
      <div style="color: black"><pre>update_data = {{ update_data }}</pre></div>
    </div> -->

    <vxv_panel :title="title" v-model:edit="edit" />
      <div class="tableBox" >
        <!-- <vxv_panel :title="title" v-model:edit="edit" style="margin-bottom: 1.5px;"/> -->
        <table  >
        <!-- <thead>
          <tr><th colspan="2"><vxv_panel :title="title" v-model:edit="edit"/></th></tr>
        </thead> -->

        <tbody v-if="columns">
          <tr  v-for="col in columns" :key="col.name"  >
            <td class="rowName" >
              <span >{{ col.label }}</span>
            </td>
            <!-- @click.capture.stop="console.log('object');" -->
            <td class="rowVal" >
              <!-- {{ rows }} -->
              <unit_value v-if="rows[selected]"
                v-model="rows[selected][col.name]"
                :class="rows[selected][col.name] !== defaultRows_keys[selected][col.name] ? `bg-blue-grey-3` : null"
                :edit="edit"
                :foreign_key="col.foreign_key"
                :type="col.type"
                :tablesRows="rows_of_all_tables"
                @click="td_edit(rows[selected], col.name)"
                @focusout="td_edit(rows[selected], col.name)"
                :id="`all-info-${selected}-${[col.name]}`"
                />
            </td>
          </tr>
      </tbody>
    </table>
    </div>    
  </div>    

</template>



<script setup>
import { useStore } from 'vuex'
import {
  toRef, isRef, ref, unref, toRaw, onMounted, 
  watch, watchEffect, computed, toRefs, toValue,
} from 'vue'
import unit_value from './unit_value.vue'
import vxv_panel from './vxv_panel.vue'
// import {send_data, useFetch} from 'src/api'
// import { base_api } from 'boot/axios'
import {send_data_for_an_update} from 'src/api'
  // import * as src_api from "src/api"



defineOptions({
    name: 'vxv_card'
  })

// import edit_cell from './edit_cell.vue'
const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  nameTable: {
    type: String,
    default: null,
  },
  rows_of_all_tables: {
    type: Object,
    default: () => null,
  },
  columns_of_all_tables: {
    type: Object,
    default: () => null,
  },
  selected: {
    type: Number,
    // default: () => null,
  },
})

const {
  title,
  rows_of_all_tables,
  columns_of_all_tables,
  selected,
} = toRefs(props)

const store = useStore()

const edit = ref(false)

const defaultColumns = computed(() => columns_of_all_tables?.value[props.nameTable])
const defaultRows = computed(() => rows_of_all_tables?.value[props.nameTable])


// const row = ref({})
const rows = ref({})
const columns = ref([])
const update_data = ref({})
const defaultRows_keys = ref({})


watchEffect(() => {
  defaultColumns?.value?.forEach(e => {
    columns.value.push(Object.assign({}, e))
  })
})


watchEffect(() => {
  defaultRows?.value?.forEach(row => {
    defaultRows_keys.value[row.id] = row
    rows.value[row.id] = Object.assign({}, row)
    update_data.value[row.id] = new Object()
  })
})

function td_edit(row, col_name) {
  const vals = row[col_name]
  const row_id = row.id
  const old = defaultRows_keys.value[row_id][col_name]
  if (vals !== undefined && vals !== old) {
    update_data.value[row_id][col_name] = vals
  }
  if (vals !== undefined && vals === old && update_data.value[row_id][col_name]) {
    delete update_data.value[row_id][col_name]
    return false
  }
}


watch(() => edit.value, (v) => {
  // При нажатии сохранить изменения
  if (v === false) {
    let rows_import = []      // Список с измененными строками вместе с id
    Object.entries(update_data?.value).map(([k, v]) => {
      if (Object.keys(v).length !== 0) {
        v['id'] = Number(k) ?? k
        rows_import.push(v)
      }
    })

    if (rows_import.length !== 0) {
      send_data_for_an_update(props.nameTable, rows_import).then((res) => {
        const data = Object.values(rows.value).map(e => Object.assign({}, e))
        store.commit('editTableRows', {table: 'info', data: data})
        console.log(`Обновлено в ДБ: ${res}`);
      })
    }
  }  
})

</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"
table
  table-layout: fixed
td
  height: 1%
  border-right: 0.5px solid $blue-grey-5
  padding: 0 25px

.rowName
  background-color: $color-header
  text-align: left  
  padding: 0 5px
.rowVal
  padding: 0 2.5px

</style>

