import { base_api } from 'boot/axios'



export async function api_get(url, data) {
  const params = {table_name: data}
  try {
    const res = await base_api.get(url, {params: params})
    return res.data
  } catch (err) {
    return console.error('Ошибка: ', err)
  }
}


async function api_post(url, name, data) {
  const formData = new FormData()
  formData.append("data", JSON.stringify({ name: name, value: data }))
  try {
    const res = await base_api.post(url, formData)
    // return JSON.parse(res.data)
    return res.data
  } catch (err) {
    return console.error('Ошибка: ', err)
  }
}


export function send_data_for_an_update(name, data) {
  return api_post('/frontend/update', name, data)
}


export function send_data(name, data) {
  return api_post('/frontend/send_data', name, data)
}
