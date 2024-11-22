// import axios from 'axios';
import { base_api } from 'boot/axios'

function add_id_row(respons, field) {
  const obj = {}
  Object.entries(respons).map(([k, v]) => {
    const child = {}
    for (let e of v) child[e[field]] = e
    obj[k] = child
  })
  return obj
}

export default {
  name: 'reestr_info',

  state: {
    tablesRows: {},
    tablesColumns: {},
    // tablesRowsKey: [],
    // tablesColumnsKey: {},
    // selectedInfo: null,
  },

  actions: {
    async loadTablesColumns({commit}) {
      await base_api.get('/frontend/get_tables_columns')
      .then(res => commit("setTablesColumns", res.data))
      .catch(err => console.error('Ошибка : ', err.toJSON()))
    },
    async loadTablesRows({commit}) {
      await base_api.get('/frontend/get_tables_rows')
      .then(res => commit("setTablesRows", res.data))
      .catch(err => console.error('Ошибка : ', err.toJSON()))
    },
  },

  mutations: {
    setTablesRows(state, respons) {state.tablesRows = respons},
    setTablesColumns(state, respons) {state.tablesColumns = respons},
    editTableRows(state, payload) {state.tablesRows[payload.table] = payload.data},
    setOneTablesRows(state, payload) {state.tablesRows[payload.table] = payload.data},

    // setTablesRowsKey(state, respons) {state.tablesRowsKey = add_id_row(respons, "id")},
    // setTablesColumnsKey(state, respons) {state.tablesColumnsKey = add_id_row(respons, "name")},
  },

  getters: {
    getTablesRows: (state) => state.tablesRows,
    getTablesColumns: (state) => state.tablesColumns,
    // getTablesRowsKey: (state) => state.tablesRowsKey,
    getTablesColumnsKey: (state) => state.tablesColumnsKey,

    // getSelectedInfo: (state) => state.selectedInfo,
  }

}

