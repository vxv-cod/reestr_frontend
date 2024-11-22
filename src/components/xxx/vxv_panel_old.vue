
<template>
  <div class="panel">
    <div class="box-buttons" >
      <div class="item edit" >
        <vxv_button @click="edit = !edit" round >
          <vxv_icon 
            :color="edit ? '#ffc107' : 'white'"
            :name="edit ? 'content-save-all-outline' : 'pencil'" 
            />
        </vxv_button>
      </div>
      
      <div class="item del" v-if="edit && btnDel">
        <vxv_button round @click="$emit('delRow')" >
          <vxv_icon color="white" name="delete" />
        </vxv_button>
        <!-- <div class="tip" >Удалить выделенную строку</div> -->
      </div>
      <div class="item plus" v-if="edit && btnPlus" >
        <vxv_button round @click="$emit('plusRow')" >
          <vxv_icon color="white" name="plus-circle" />
        </vxv_button>
      </div>
      
      <!-- <img class="icon" src="./vxv_icon/pencil-circle.svg" alt="dots icon"> -->

    </div>
    <span class="title">{{ title }}</span>
  </div>
</template>


<script setup>
import { toRefs } from 'vue'
import vxv_icon from "./vxv_icon.vue"
import vxv_button from "./vxv_button.vue"


const emit = defineEmits(['delRow', 'plusRow'])


const props = defineProps({
  title: {type: String, default: "title"},
  btnDel: {type: Boolean, default: false},
  btnPlus: {type: Boolean, default: false},
})
const {
  title,
  btnDel,
  btnPlus,
} = toRefs(props)

const edit = defineModel("edit", {type: Boolean, default: false})

</script>


<style lang="sass" scoped>
@import "src/components/vxv_styles/base.sass"
.panel
  background-color: $blue-grey
  color: white
  display: flex
  align-items: center
  text-align: center
  height: 35px
  position: sticky
  // z-index: 6
  top: 0
  left: 0
  right: 0
  bottom: 0
  outline: none  
  width: 100%
  margin-bottom: 1.5px
.box-buttons
  height: inherit
  display: flex
  justify-content: center
  align-items: center
  // flex-direction: row
  min-width: 35px
.item
  min-width: 40px
  height: inherit
  // width: 100%
  // width: 35px
  padding: 2.5px
  position: relative
.edit
  border-right: 1.5px solid white  
  // width: 40px
.del
  // z-index: 1
  // &:after
  //   // &:hover:after
  //   position: absolute
  //   z-index: 50
  //   top: 415px
  //   top: -12px
  //   left: 750px
  //   color: red
  //   background-color: $green
  //   content: 'Удалить выделенную строку'
  //   // display: inline-block

.title
  text-horizontal: center
  width: inherit
  height: inherit 
  display: flex
  justify-content: center
  align-items: center
    


</style>