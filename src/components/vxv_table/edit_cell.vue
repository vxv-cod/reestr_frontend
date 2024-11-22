<template>
  <!-- @blur="val => model = val.target.textContent" -->
  <span class="edit_cell" @input="val => model = val.target.textContent" :contenteditable="edit">
    {{ model }}
  </span>
</template>

<script setup>
defineOptions({
  name: 'edit_cell'
})
const model = defineModel()
const props = defineProps({
  edit: {
    type: Boolean,
    default: () => false,
  },
})
</script>

<style lang="sass" scoped>
.edit_cell
  outline: 0
  padding: 2px
</style>
