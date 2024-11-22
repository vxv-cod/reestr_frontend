<template>
   
   <!-- :tabindex="-1" Разрешает события фокусировки для своего елемента -->
  <div class="parent" v-ripple 
      :class="isShow ? 'bg-blue-grey-4' : bgColor"
      :style="isShow ? 'z-index: 5' : 'эindex: 1'"
      :tabindex="-1"
      @focusout="isShow = false"
      >
      <div class="child"  
        @click="isShow = !isShow"
        :style="$attrs.style"
      >
        {{ placeholder ?? model.name }}
      </div>
      
      <div class="rows" v-show="isShow" >
        <label class="row" :for="`file-${model.id}`" 
          @click="isShow = !isShow" >
            Заменить файл
          </label>
        <input type="file" hidden :id="`file-${model.id}`" 
          @change="$emit('change', $event.target.files[0])" 
        />
        
        <div class="row" v-show="model.status !== null" 
          @click="isShow = !isShow; cansel_edit()" 
        > Отменить изменения </div>
        <div class="row" v-show="!['add', 'deleted', 'replace'].includes(model.status)" 
          @click="isShow = !isShow; deletedFaile()" 
        > Удалить файл </div>
      </div>
    </div>

</template>


<script setup>
import { toRefs, watchEffect, watch, computed, ref } from 'vue'
import vxv_input_file from "./vxv_input_file.vue"


const model = defineModel()
const emit = defineEmits(['change'])

const props = defineProps({
  bgColor: {
    type: String,
    default: () => null,
  },
  placeholder: {
    type: String,
    default: () => null,
  },
  },
)

const isShow = ref(false)
const bgColor = computed(() => props.bgColor)


function deletedFaile() {
  console.log('deletedFaile')
  const cell = model.value
  cell.file = null
  if (cell.default_name) {
    cell.name = cell.default_name
    cell.status = 'deleted'
  } else {
    cell.name = null
    cell.status = null
  }
  console.log('Файлы будут уделены')
}

function cansel_edit() {
  console.log('cansel_edit')
  const cell = model.value
  cell.file = null
  cell.name = cell.default_name ?? null
  cell.status = null
  console.log(`'Изменения отменены для ${cell.default_name}`)
}

</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/w_table.sass"
// .child
  // padding: 0
</style>
