<template>
    <!-- <q-list>

    </q-list> -->
    <div  class="box-childs">
      <q-list dense >
        <q-item  v-for="col in columns" :key="col.name" tag="label" >
          <!-- <q-item-section>Single line item</q-item-section> -->
          <q-item-section class="rowName" >
            <!-- <q-item-label overline>{{ col.label }}</q-item-label> -->
            <span >
              {{ col.label }}
            </span>
          </q-item-section>
          <q-item-section class="rowVal" >
            <span >
              {{ rows[col.name] }}
            </span>
          </q-item-section>
        </q-item>
      </q-list>
    </div>    
</template>



<script setup>
import { ref, onMounted, watch, watchEffect, computed, toRefs } from 'vue'
import unit_value from './unit_value.vue'


// import edit_cell from './edit_cell.vue'
const props = defineProps({
  rows: {
    type: Object,
    default: () => {},
  },
  columns: {
    type: Array,
    default: () => [],
  },
})

// const {
//   rows,
//   columns,
// } = toRefs(props)

const defaultRows = computed(() => props.rows)
const defaultColumns = computed(() => props.columns)

const rows = ref({})
const columns = ref([])

watchEffect(() => {
  defaultColumns.value?.forEach(e => {
    columns.value.push(Object.assign({}, e))
  })
})

watchEffect(() => {
  rows.value = Object.assign({}, defaultRows.value)
})



</script>




<style lang="sass" scoped>
.box-childs
  // background-color: $amber-3
  margin: 5px
  // padding: auto
  // min-height: 50px
  color: black

  .rowName
    background-color: #90A4AE
    // height: 100%
    width: 100%
    // padding: 5px
    // outline: 0
    // padding: 2px
    // padding: 0
    // margin: 0
  .rowVal
    background-color: $blue-grey-1
    // height: 100%
    width: 100%
    // outline: 0
    padding: 5px
    // margin: 0
.q-list--dense > .q-item, .q-item--dense
  padding: 1.0px
  font-size: 12px
  // .q-focus-helper
  //   padding: 0
  //   margin: 0
</style>