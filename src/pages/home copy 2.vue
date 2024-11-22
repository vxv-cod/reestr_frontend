<template>

  <div class="box-parent">
  
    <div class="box-childs co1_1">
      <!-- contener -->
      <!-- <div class="info"> -->
        <!-- class="box-childs co1_1" -->
        <w_table
          class="info"
          v-model="selectedInfo"
          title="Системы"
          :nameTable="'info'"
          :columns_of_all_tables="colsInfo"
          :rows_of_all_tables="rows_of_all_tables"
        />

      <!-- </div> -->
      <!-- <div class="contener"> -->
      <!-- <div class="business_process"> -->
        
        <vxv_card_mto_base v-if="rows_of_all_tables"
          class="business_process"
          title="Аппаратное обеспечение"
          nameTable="service_hardware"
          :rows_of_all_tables="rows_of_all_tables"
          :rows="rows_of_all_tables.service_hardware"
          :columns="columns_of_all_tables.service_hardware"
          :selected="selectedInfo"

          />
          
        
      <!-- </div> -->
      <!-- </div> -->
    </div>

    
   
    
      <!-- <div style="color: blue;"><pre>colsInfo = {{ colsInfo }}</pre></div> -->
              
      <div class="box-childs co1_2">
        <vxv_card 
          title="Общая информация"
          :nameTable="'info'"
          :columns_of_all_tables="colsInfo_others"
          :rows_of_all_tables="rows_of_all_tables"
          :selected="selectedInfo"
          />
        </div>

        <div class="box-childs co1_3">
        <vxv_card_files 
          :title="'Документация'"
          :column_one="rows_of_all_tables.doc_type"
          :selected="selectedInfo"
          v-model="files_data"
        />
      </div>






            <!-- </template >
          </q-splitter> -->

      <!-- </template>
    </q-splitter> -->
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
  import { api } from 'boot/axios'
  import axios from 'axios'
  // import { upload_pdf } from "src/api/load_file.js"
  import vxv_card_mto_base from "src/components/w_table_m2m_.vue"

  const store = useStore()
  const selectedInfo = ref(1)
  const splitterModel = ref(33)
  // const splitterModel_child = ref(50)
  const splitterModel_child = ref(50)




  const columns_of_all_tables = computed(() => store.getters.getTablesColumns)
  const rows_of_all_tables = computed(() => store.getters.getTablesRows)
  const excludes_colsInfo = ['id', 'sign_id', 'short_name', 'full_name', 'catalog']
  const excludes_doc_file = ['id', 'info_id',  'full_name']
  
  const files_data = ref({})
  const colsInfo = ref({})
  const colsInfo_others = ref({})
  const col_doc_file_others = ref({})
  // const business_process_info = ref({})
  const business_process_info = ref({})
  const hardware_info = ref({})
  // const ped_business_process_info = ref({})
  
  const colsInfo_ped_business_process = ref({})
  
  watchEffect(() => {
    if (columns_of_all_tables?.value?.length !== 0) {

      colsInfo.value = {'info': columns_of_all_tables.value?.info?.filter(e => excludes_colsInfo.includes(e.name))}
      colsInfo_others.value = {'info': columns_of_all_tables.value?.info?.filter(e => !excludes_colsInfo.includes(e.name))}
      colsInfo_ped_business_process.value = {'ped_business_process': columns_of_all_tables.value?.ped_business_process}
      col_doc_file_others.value = {'doc_file': columns_of_all_tables.value.doc_file.find(e => !excludes_doc_file.includes(e.name))}
    
    }
  })

  // watchEffect(() => {
  //   if (col_doc_file_others?.value?.length !== 0) {
  //     col_doc_file_others.value = {'doc_file': columns_of_all_tables.value.doc_file.find(e => !excludes_doc_file.includes(e.name))}
  //   }
  // })
  
  function many_to_many(info_id, table_two, table_relation) {
    const table_relation_obj = Object.values(table_relation)[0]
    const table_two_name = Object.keys(table_two)[0]
    const table_two_obj = Object.values(table_two)[0]
    const table_relation_filter = table_relation_obj?.filter(p => p.info_id === info_id)
    const table_relation_filter_ids = table_relation_filter?.map(y => y[`${table_two_name}_id`])
    return table_two_obj.filter(bp => table_relation_filter_ids?.includes(bp.id))
  }
  
  watchEffect(() => {
    if (rows_of_all_tables?.value?.length !== 0) {
      const { 
        doc_file, 
        doc_type, 
        info, 
        business_process, 
        ped_business_process,
        hardware,
        service_hardware,
      } = toValue(rows_of_all_tables.value)

      const default_dict = {
        id: null,
        name: null,
        default_name: null,
        info_id: null,
        doc_type_id: null,
        file: null,
        status: null,
        isShow: false
      }

      info?.map(item_info => {
        // Собираем объект: {info_id : {doc_type_id : {doc_file} }}
        const doc_file_info =  Object.assign({}, ...doc_file
          // Отвфильтроали по info_id 
          .filter(item_doc_file => item_doc_file.info_id === item_info.id)
          // Дополнили объекты в списке 
          .map(e => {return {
            [e.doc_type_id]: Object.assign({}, default_dict, e, {
              default_name: e.name
            })
          }})
        )
        // Дополняем путые типы default_dict
        doc_type.map(item_doc_type => {
          if (doc_file_info[item_doc_type.id] === undefined) {
            doc_file_info[item_doc_type.id] = Object.assign({}, default_dict, {
              doc_type_id: item_doc_type.id,
              info_id: item_info.id
            })
          }
        })
        
        files_data.value[item_info.id] = doc_file_info

        // Собираем объект: {info_id : {doc_type_id : {doc_file} }}

        // const ped_business_process_info = ped_business_process.filter(p => p.info_id === item_info.id)
        // const business_process_ids = ped_business_process_info.map(y => y.business_process_id)
        // business_process_info.value[item_info.id] = business_process.filter(bp => business_process_ids.includes(bp.id))
        
        // console.log(many_to_many(item_info.id, {business_process}, {ped_business_process}))
        business_process_info.value[item_info.id] = many_to_many(item_info.id, {business_process}, {ped_business_process})
        hardware_info.value[item_info.id] = many_to_many(item_info.id, {hardware}, {service_hardware})

      })

    console.log("business_process_info = ", business_process_info.value)
    console.log("hardware_info.value = ", hardware_info.value)

    }
})
    
// const ped_business_process_info = computed(() => rows_of_all_tables?.value?.ped_business_process?.filter(e => e.info_id === selectedInfo.value))
// const qqq_business_process_info = computed(() => {
//   const xxx = rows_of_all_tables?.value?.business_process?.filter(e => e.id === ped_business_process_info.value.map(e => e.business_process_id))
//   console.log('xxx = ', xxx)
//   return xxx
// })

  // const business_process_info_selected = ref({business_process: {}})
  // // const business_process_ids_xxx = computed(() => rows_of_all_tables?.value.ped_business_process_info?.map(y => y.business_process_id))

  // watch(() => selectedInfo.value, () => {
  //   business_process_info_selected.value['business_process'] = business_process_info?.value[selectedInfo.value]
  // }, { deep: true })








</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/base.sass"

.box-parent
  // display: flex
  flex-direction: row
  flex-wrap: nowrap
  justify-content: center
  align-items: stretch
  width: 100%
  height: 100vh
  padding: 5px
  // position: relative
  // z-index: 1  
  // .box-childs
.box-childs
  overflow: auto
  width: 100%
  margin: 0 5px 0 0
  // position: relative
  // z-index: 1    
.co1_1
  display: flex
  flex-direction: column
  justify-content: space-between
  // height: 100%

.info
  height: 50%
  // height: 100%
// position: relative
// top: 0
// right: 0

.business_process
  height: 50%
  // height: 100%
  
  // width: 50%

  // box-shadow: 0px 0px 7px $blue-grey-5

// .box-childs.co1_2
.co1_2
  width: 50%
  // border-right: 0.5px solid $blue-grey-5
  // border-left: 0.5px solid $blue-grey-5
  // position: relative
.co1_3
  width: 30%
  margin: 0
  // padding-left: 5px
  // padding-right: 0px



</style>


<!-- 
  // business_process_info.value = Object.assign(
  //     {}, ...info.map(e => {
  //       return {
  //         [e.id]: business_process.filter(bp => {
  //           ped_business_process.filter(p => p.info_id === e.id)
  //           .map(y => y.business_process_id)
  //           .includes(bp.id)
  //         })
  //       }
  //     })
  //   )  
  
  
      info.value.map(e => {
    const xxx = ped_business_process.value
      .filter(p => p.info_id === e.id)
      .map(y => y.business_process_id)
      business_process_info.value[e.id] = business_process.value.filter(bp => xxx.includes(bp.id))
  })
        // Собираем объект: {info_id : {doc_type_id : {doc_file} }}
      // business_process_info.value[item_info.id] = business_process.filter(bp => {
      //   return ped_business_process.filter(p => p.info_id === item_info.id)
      //     .map(y => y.business_process_id).includes(bp.id)
    // })
    -->