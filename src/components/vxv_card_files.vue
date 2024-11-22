<template>
  <!-- style="display: flex;"   -->
    <div class="contener"  :class="$attrs.class"
      >
      <vxv_panel :title="title" v-model:edit="edit" />
      
      <div class="tableBox" >
        <!-- <vxv_panel :title="title" v-model:edit="edit"/> -->
        <!-- <vxv_panel :title="title" v-model:edit="edit" style="margin-bottom: 1.5px;"/> -->
        <table >
          <!-- <thead> -->
            <!-- <tr><th ><vxv_panel :title="title" v-model:edit="edit"/></th></tr> -->
          <!-- </thead> -->
          <tbody >
            <tr  v-for="(col, idx) in column_one" :key="col.name"  >
              <td class="rowVal" > 
                <!-- При включенном редактировании -->
                <div v-if="edit" class="parent">
                   
                  <vxv_card_files_menu v-if="files[col.id] && files[col.id]['name'] !== null"
                    v-model="files[col.id]"
                    :bgColor="computed_color_btn(files[col.id])"
                    @change="handleFileChange($event, files[col.id])"
                    :placeholder="col.name"
                    style="justify-content: left; text-align: left; padding: 0 2.5px"
                    />
                    <!-- 
                      -->
                    <vxv_input_file v-else 
                      v-model="files[col.id]"
                      :id="`Upload-${col.id}`"
                      :placeholder="col.name"
                      @change="handleFileChange($event, files[col.id])"
                      style="justify-content: left; text-align: left; padding: 0 2.5px"
                      
                    />
                </div>
                <!-- При включенном просмотра (скачаивания) -->
                <vxv_button v-if="!edit" 
                  :class="files[col.id].name ? 'edit_true' : 'edit_false'"
                  :hover-text="col.name"
                  @click="() => {
                    if (files[col.id].name) {
                      get_file(files[col.id].id, files[col.id].name)
                    } else { nonefile = true }
                  }"
                  />


            </td>
          </tr>
        </tbody>          
      </table>
    </div>    

  </div>    
  
  <!-- <vxv_notice v-model="noPdf" text="Выбранный файл должен быть в формате PDF" />
  <vxv_notice v-model="nonefile">
    <template  v-slot:header >
      Внимание 
    </template >
    <q-icon name="mdi-text-box-search-outline" color="white-1" size="32px" />
    Файла нет в архиве
  </vxv_notice> -->

  <!-- <div style="color: black"><pre>column_one = {{ column_one }}</pre></div> -->
  
    <!-- <blackout :menuShow="menuShow"/> -->

</template>



<script setup>
import { ref, onMounted, watch, watchEffect, computed, toRef, toRefs } from 'vue'
// import { saveAs } from 'file-saver'

// import { generateFile, getFileName, downloadFile } from "src/api/load_file.js"
import { base_api } from 'boot/axios'
import vxv_panel from './vxv_panel.vue'
import vxv_input_file from "./vxv_input_file.vue"
import vxv_button from "./vxv_button.vue"
import vxv_card_files_menu from "./vxv_card_files_menu.vue"
import vxv_notice from "./vxv_notice.vue"
import blackout from "./vxv_blackout.vue"



defineOptions({
    name: 'vxv_card'
  })

const props = defineProps({
  title: {
    type: String,
    default: 'title',
  },
  column_one: {
    type: Array,
    default: () => [],
  },
  selected: {
    type: Number,
    // default: () => 1,
  },
})

const model = defineModel()
const noPdf = ref(false)
const nonefile = ref(false)

const title = computed(() => props.title)
const selected = computed(() => props.selected)
const column_one = computed(() => props.column_one)
// const column_one_length = computed(() => props.column_one.length)

const edit = ref(false)
const files = ref({})

watchEffect(() => {
  files.value = model?.value[selected.value]
})

watch(() => edit.value, (v) => {
  // При нажатии сохранить изменения
  if (v === false) {
    const delete_id_files = []
    Object.values(model.value).forEach(file_data => {
      // Добавление и изменения файла
      Object.values(file_data).map(e => {
        if (e.file !== null ) {
          console.log('e === ', e);
          const data = {
            id: e.id,
            info_id: e.info_id,
            doc_type_id: e.doc_type_id
          } 
          const formData = new FormData()
          formData.append("data", JSON.stringify(data))
          formData.append("file", e.file)
          base_api.post("/frontend/upload_pdf", formData).then((res) => {
            const e = res.data
            model.value[e.info_id][e.doc_type_id] = {
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
        if (e.status === "deleted") delete_id_files.push(e.id)
      })
    })
    
    // Удаление файла
    if (delete_id_files.length !== 0) {
      const formData_deleted = new FormData()
      formData_deleted.append("data", JSON.stringify(delete_id_files))
      base_api.delete("/frontend/deleted_file_pdf", {data: formData_deleted}).then((res) => { 
        console.log(res.data) 
        const ress = res.data
        ress.map(e => {
          model.value[e.info_id][e.doc_type_id] = {
              id: null,
              name: null,
              // default_name: e.name,
              info_id: e.info_id,
              doc_type_id: e.doc_type_id,
              file: null,
              status: null,
              isShow: false
            }

        })
      })
    }
  }
})

function computed_color_btn(col) {
  if (col !== undefined) {
    if (col.status === null) return 'bg-blue-grey-3'
    if (col.status === 'add') return 'bg-green-3'
    if (col.status === 'replace') return 'bg-blue-3'
    if (col.status === 'deleted') return 'bg-red-3'
  }
}

function style_edit_false(file) { 
  return {
    'background-color' : file ? '#b0bec5' : 'inherit',
    'cursor' : file ? 'pointer' : 'default',
    // 'pointer-events' : file ? 'default' : 'none'    
  }
}


function handleFileChange( file, data ) {
  if (file.type === "application/pdf") {
    console.log('model.value = ', model?.value);
    // const cell = model.value[data.info_id][data.doc_type_id]
    const cell = files.value[data.doc_type_id]
    cell.file = file
    cell.name = file.name
    if (cell.default_name) cell.status = 'replace'
    else cell.status = 'add'
  } else {
    noPdf.value = true
  }
}

function get_file(id, name) {
  if (name) {
    const formData = new FormData()
    formData.append("id", JSON.stringify(id))  
    base_api.post("/frontend/download_file", formData, {responseType: 'blob'})
    .then((res) => {
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)   //  создаёт уникальный URL для Blob
      link.download = name
      link.target = '_blank'
      link.click()   // клик по ссылке загрузит файл
      link.remove()
      URL.revokeObjectURL(link.href)  // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
    })
  }
// else {nonefile.value = true}
}

    
//     // window.open(link.href)  //  откроет файл в новом окне
//     // `Вариант 2`
//     // import FileSaver from "file-saver"
//     // `Только сохранение`
//     // let  blob = new Blob([res.data], { type: 'application/pdf' })
//     // const xxx = FileSaver.saveAs(blob, name);
//     // `или`
//     // var file = new File([res.data], name, {type: "application/pdf"});
//     // FileSaver.saveAs(file);
//     // // или
//     // let href = URL.createObjectURL(blob)   //  создаёт уникальный URL для Blob
//     // window.open(href)  //  откроет файл в новом окне
//     // URL.revokeObjectURL(href)  // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память    

</script>



<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"

// table
  // height: calc( 100% - 35px )

.rowVal
  // border-right: 0.5px solid $blue-grey-5
  // border-left: 0.5px solid $blue-grey-5
  border: 0.5px solid $blue-grey-5
  min-height: 1%

  
tbody td
  height: 1%
  white-space: pre-wrap
  box-sizing: border-box
  border-top: 1.0px solid $blue-grey-5
  border-bottom: 1.0px solid $blue-grey-5 




.edit_true, .edit_false
  text-align: left
  padding: 0 5px

  &::before, &::after
    content: attr(hover-text)
    padding: 0 5px

  &::before
    visibility: hidden

  &::after
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0    
    display: flex
    justify-content: left
    align-items: center 
    transition: 0.3s
  
  &:hover::after
    color: $blue
    justify-content: center
    position: absolute
  
.edit_true
  background-color: $blue-grey-3
  cursor: pointer
  &:hover:after
    content: 'Скачать'

.edit_false
  background-color: $blue-grey-1
  cursor: default
  &:hover:after
    color: $red
    content: 'Файла нет в архиве'





</style>