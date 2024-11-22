<!-- Уведомление -->
<template>
  <q-dialog v-model="model">
    <q-card >
      <q-card-section class="row" >
        <slot name="header">{{ header }}</slot>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>      
      <q-card-section>
        <slot>{{ text }}</slot>
        </q-card-section>                                                 
      </q-card>
    </q-dialog>
</template>

<script setup>
import { toRefs } from 'vue'

const model = defineModel()
const props = defineProps({
  header: {
    type: String,
    default: () => "Внимание",
  },
  text: {
    type: String,
    default: () => "",
  },
})
const { title, text } = toRefs(props)
</script>


<style lang="sass">
@import "src/components/vxv_styles/w_table.sass"

.q-card__section.q-card__section--vert.row
  align-items: center
  color: $indigo-1
  padding: 0  0 0 10px
  background: $color-header
  font-size: 16px

</style>