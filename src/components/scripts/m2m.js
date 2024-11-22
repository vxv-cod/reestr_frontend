// import { ref, watch, watchEffect, computed, toRefs, toValue } from 'vue'
import {send_data} from 'src/api'



export function _print(data) {
  console.log(JSON.stringify(data, null, 2));
}

export function existence_dictionary_in_array(arr, dict) {
  // Проверяем каждый словарь массива по ключам на совпадение с искомым словарем
  return arr?.some(tag => Object.entries(tag).every(([k, v]) => dict[k] == v))
}


export function filter_dictionary_in_array(arr, dict, bool) {
  // Находим существующий объект и фильтруем по наличию или нет
  return arr.filter(tag => bool === Object.entries(tag).every(([k, v]) => dict[k] == v))
}


export function modify_td(
  event, 
  row, 
  col, 
  update_data, 
  outside_id,
  second_primary_key,
  defaultRowsDict
) {
  //  Работа с массивом изменненных строк
  const style = event.target.style  //  из события фокуса достаем стили ячейки
  style.backgroundColor = 'inherit'

  let arr = update_data[outside_id]
  let vals = row[col.name]  //  текущее значение ячейки
  vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null

  const col_type = col.type === 'integer' ? 'number' : col.type
  if (vals && vals !== null && col_type !== typeof vals) {
    style.backgroundColor = 'red'
    alert(`Тип данных должен быть: ${col_type}`)
    row[col.name] = null
    return 
  }
  
  const key = second_primary_key
  const old = defaultRowsDict[outside_id].find(e => e[key] == row[key])?.[col.name]
  const existence = existence_dictionary_in_array(arr, row)

  // Добавляем объект в массив
  if (existence === false && vals != old) {
    arr.push(row)
    // красим ячейку
    style.color = 'white'
    style.backgroundColor = '#90a4ae'    
  }
  // Находим существующий объект и фильтруем без него
  if (existence === true && vals == old) {
    update_data[outside_id] = filter_dictionary_in_array(arr, row, false)
    // возвращаем цвлета ячейки
    style.color = 'inherit'
    style.backgroundColor = 'inherit'
  }  
}


export function style_td(
  row, 
  col_name, 
  second_primary_key,
  defaultRowsDict,
  outside_id,
) {
  // Стиль ячейки в сравнении текущих даннх и дефолтных
  let vals = row[col_name]  //  текущее значение ячейки
  const key = second_primary_key ?? row[col_name]
  const old = defaultRowsDict?.[outside_id]?.find(e => e[key] == row[key])?.[col_name]
  if (vals != old) return 'background-color: #90a4ae; color: white'
}


export function style_tr(row, selected, delete_data) {
  // Стиль строки при удалении иши выборе
  const del_var = existence_dictionary_in_array(delete_data[row.info_id], row)
  const select_var = selected[row.info_id] === row
  if (del_var && !select_var) return "#e57373"
  if (del_var && select_var) return "#ef5350"
}

export function find_cell_in_table(cell, table, rows_of_all_tables) {
  return rows_of_all_tables?.[table]?.find(e => e.id === cell)
}

// export function fun_hover_field(cell, table) {
//   if (this.hover_field === null) return null
//   else {
//     const temp = find_cell_in_table.call(this, cell, table)
//     return temp?.[this.hover_field] ?? temp?.name}
// }

// export function selectedRowsChanged(row) { 
//   // self.selected.value[row.info_id] = row 
//   // this.devtoolsRawSetupState.selected.value[row.info_id] = row 
//   this.selected[row.info_id] = row 
// }

export function selectedRowsChanged(row, selected) { 
  selected[row.info_id] = row 
}


export function deleteRowChanged(
  selected,
  outside_id,
  delete_data,
  primary_keys_all
) {
  // Выбранная строка
  const select_var = Object.assign({}, selected?.[outside_id])
  // Список удаляемых объектов по системе
  const arr = delete_data[outside_id]
  if (Object.keys(select_var).length !== 0) {
    // Выбираем из строки только primary_keys
    const delete_var = Object.fromEntries(Object.entries(select_var).filter(([k, v]) => primary_keys_all.includes(k)))
    // Проверяем наличие объекта по всем ключам для каждого элемента из массива
    const existence = existence_dictionary_in_array(arr, delete_var)
    // Добавляем объект в массив
    if (existence === false) delete_data[outside_id].push(delete_var)
    // Находим существующий объект и фильтруем без него
    if (existence === true) {
      delete_data[outside_id] = filter_dictionary_in_array(arr, delete_var, false)
    }
  }
}


export function send_to_the_backend(
  add_data,
  update_data,
  delete_data,
  second_primary_key,
  nameTable,
  store
) {
  // При нажатии сохранить изменения
  const merge_value = (items) => Object.values(items).reduce((sum, current) => [...sum, ...current], [])
  const add_data_filter_not_null = [
    ...Object.entries(add_data).map(([k, v]) => (
      v.filter(e => e[second_primary_key] !== null)
    ))
  ]
  const export_data = {
    add_data    : merge_value(add_data_filter_not_null),
    update_data : merge_value(update_data),
    delete_data : merge_value(delete_data),
  }    
  // Отправляем на бэкенд
  send_data(nameTable, export_data).then((res) => {
    store.commit('setOneTablesRows', {table: nameTable, data: res})
  })
}

export function valid_td(event, row, col) {
  const style = event.target.style  //  из события фокуса достаем стили ячейки
  style.backgroundColor = 'inherit'
  let vals = row[col.name]  //  текущее значение ячейки
  vals = vals === "" ? null : vals  //  переводим пустые строковые значения в null  
  const col_type = col.type === 'integer' ? 'number' : col.type
  if (vals && vals !== null && col_type !== typeof vals) {
    style.backgroundColor = 'red'
    row[col.name] = null
    return alert(`Тип данных должен быть: ${col_type}`)
  }
}


function removeKeys(obj) {
  // Рекурсивное удаление ключа, не используется, просто пример
  if (obj && Object.keys(obj).length) {
      delete obj.name

      Object.keys(obj).forEach(key => {
          if (Array.isArray(obj[key])) {
              obj[key].forEach(removeKeys);
          } else if (obj[key] !== null && typeof obj[key] === 'object' ) {
              removeKeys(obj[key]);
          }
      });
  }
return obj
}