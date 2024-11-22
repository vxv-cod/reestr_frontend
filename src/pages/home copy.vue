<template>

  <!-- <div style="color: blue;"><pre>colsInfo = {{ colsInfo }}</pre></div> -->
  <div class="box-parent">
    
    <q-splitter
      v-model="splitterModel"
      separator-class="bg-blue-grey-5"
      separator-style="width: 3px; "
      style="height: 100%"
      >
      <template v-slot:before>
        <w_table
          title="Системы"
          v-model="selectedInfo"
          :nameTable="'info'"
          :rows_of_all_tables="rows_of_all_tables"
          :columns_of_all_tables="colsInfo"
          class="box-childs"
          />

        
        <!-- <div style="color: black"><pre>files = {{ files_data[selectedInfo] }}</pre></div> -->
      </template >
      
      <template v-slot:after >
          <q-splitter 
            v-model="splitterModel_child"
            separator-class="box-childs bg-blue-grey-5"
            separator-style="width: 3px; "
            style="height: 100%"
            class="box-childs"
            >
            <template v-slot:before >
              <vxv_card_files
                :title="'Тип Документация'"
                :column_one="rows_of_all_tables.doc_type"
                :selected="selectedInfo"
                v-model="files_data"
                />
              </template>
            <template v-slot:after class="child_col">
              <vxv_card
                title="Общая информация"
                :nameTable="'info'"
                :columns_of_all_tables="colsInfo_others"
                :rows_of_all_tables="rows_of_all_tables"
                :selected="selectedInfo"
              />
              <!-- <vxv_card_files
                :title="'Тип Документация'"
                :column_one="rows_of_all_tables.doc_type"
                :selected="selectedInfo"
                v-model="files_data"
                />               -->
            </template >
          </q-splitter>

      </template>
    </q-splitter>
  </div>
</template>

<script setup>
  defineOptions({
    name: 'home'
  })
  import { useStore } from 'vuex'
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

  import w_table from "components/w_table.vue"
  import child_comp from "components/child_comp.vue"
  import vxv_card from "src/components/vxv_card.vue"
  import vxv_card_files from "src/components/vxv_card_files.vue"
  // import { base_api } from 'boot/axios'
  // import axios from 'axios'
  // import { upload_pdf } from "src/api/load_file.js"

  const store = useStore()
  const selectedInfo = ref(1)
  const splitterModel = ref(33)
  // const splitterModel_child = ref(50)
  const splitterModel_child = ref(50)

  const columns_of_all_tables = computed(() => store.getters.getTablesColumns)
  const rows_of_all_tables = computed(() => store.getters.getTablesRows)
  const excludes_colsInfo = ['id', 'sign_id', 'short_name', 'full_name']
  const excludes_doc_file = ['id', 'info_id',  'full_name']
  
  const files_data = ref({})

  watchEffect(() => {
      // const obj = {}
    if (rows_of_all_tables?.value !== undefined) {
      const rows_doc_file = rows_of_all_tables.value.doc_file
      const info_keys = rows_of_all_tables.value.info?.map(e => e.id)
      const doc_type_keys = rows_of_all_tables.value.doc_type?.map(e => e.id)
      if (rows_doc_file && info_keys && doc_type_keys) {
        info_keys.map(e => {
          files_data.value[e] = Object.assign(
            {}, Object.assign(
              {}, ...doc_type_keys.map(type => {
              return { [type]: {
                id: null,
                name: null,
                info_id: e,
                doc_type_id: type,
                file: null,
                status: null,
                isShow: false
                }}
              })
            )
          )
        })
        
        rows_doc_file.map(e => {
          files_data.value[e["info_id"]][e["doc_type_id"]] = {
            id: e.id,
            name: e.name,
            default_name: e.name,
            info_id: e.info_id,
            doc_type_id: e.doc_type_id,
            file: null,
            status: null,
            isShow: false
          }            
        })
      }
    }
  })
  



  const colsInfo = ref({})
  const colsInfo_others = ref({})
  const col_doc_file_others = ref({})
  
  watchEffect(() => {
    colsInfo.value = {'info': columns_of_all_tables.value?.info?.filter(e => excludes_colsInfo.includes(e.name))}
    colsInfo_others.value = {'info': columns_of_all_tables.value?.info?.filter(e => !excludes_colsInfo.includes(e.name))}
  })
  watchEffect(() => {
    col_doc_file_others.value = {'doc_file': columns_of_all_tables.value?.doc_file?.filter(e => !excludes_doc_file.includes(e.name))}
  })
  
  
  // const rows_doc_file_file = ref({})

  // watchEffect(() => {
  //   const eee = rows_of_all_tables.value?.doc_file?.filter(e => e.info_id === selectedInfo.value)
  //   if (eee) {
  //     const xxx = eee.map(e => {return { [e.doc_type_keys]: e} })
  //     rows_doc_file_file.value = Object.assign({}, ...xxx)
  //     console.log('rows_doc_file_file.value = ', rows_doc_file_file.value);
  //   }
  // })
  



  // watch(() => rows_of_all_tables.value, () => {
  //   const eee = rows_of_all_tables.value?.doc_file?.filter(e => e.info_id === selectedInfo.value)
  //   if (eee) {
  //     const xxx = eee.map(e => {return { [e.doc_type_keys]: e} })
  //     rows_doc_file_file.value = Object.assign({}, ...xxx)
  //     // console.log('rows_doc_file_file.value = ', rows_doc_file_file.value);
  //   }    
  // }, { deep: true })


  // const board_files = computed(() => {
  //   if (column_two.value !== undefined) {
  //   Object.entries(column_two.value).map(
  //     ([type_id, row]) => {
  //     files.value[type_id] = {
  //       info_id: selected.value,
  //       doc_type_keys: type_id,
  //       file: null,
  //       patch: row.patch,
  //       name: row.patch.split('\\').slice(-1)[0]
  //     }
  //   })
  // }    
  // })




// const doc_file = ref({})

// watch(() => [rows_of_all_tables.value.doc_file, selectedInfo.value], () => {
//   const eee = rows_of_all_tables.value?.doc_file?.filter(e => e.info_id === selectedInfo.value)
//   if (eee) {
//     const xxx = eee.map(e => {return { [e.doc_type_keys]: e} })
//     console.log('xxx = ', xxx);
//     const yyy  = Object.assign({}, ...xxx)
//     console.log('yyy = ', yyy);
//     Object.entries(yyy).map(
//       ([type_id, row]) => {

//         doc_file.value[type_id] = {
//         info_id: selectedInfo.value,
//         doc_type_keys: type_id,
//         file: null,
//         patch: row.patch,
//         name: row.patch.split('\\').slice(-1)[0]
//       }
      
//     })
// }    

//   }, { deep: true })


//   const files = ref({})

//   watch(() => [rows_doc_file_file.value, columns.value], () => {
//   // rows.value = defaultRows.value
//   if (rows_doc_file_file.value !== undefined) {
//     Object.entries(rows_doc_file_file.value).map(
//       ([type_id, row]) => {
//         // console.log(type_id, row)

//       rows.value[type_id] = Object.assign({}, row)
//       // es.value[type_id]['patch'] = {}
//       files.value[type_id] = {
//         info_id: selected.value,
//         doc_type_keys: row.id,
//         file: null,
//         patch: row.patch,
//         name: row.patch.split('\\').slice(-1)[0]
//       }
      
//     })
//   }
// }, { deep: true })



// const file = ref(null)



// async function loadfile() {
//   console.log(file.value)
//   const params = {
//     'info_id': 1,
//     'doc_type_keys': 1      
//   }
//   const respo = await upload_pdf({params: params, data: {['file']: file.value}})
//   // console.log('respo = ', respo.statusText)
//   // console.log('respo = ', respo.statusText === "OK")
// }




</script>


<style lang="sass">
@import "src/components/vxv_styles/base.sass"
// html, body
//   height: 100vh


.box-parent
  background-color: blue
  border: 5px solid green
  padding: 5px
  height: inherit
  width: 100%
  .box-childs
    height: 100%
    width: 100%
    .child_col
      height: 100%
      width: 100%
</style>


