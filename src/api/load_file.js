// import { api } from 'boot/axios'
// import axios from 'axios'


// export const generateFile = async ({ api, url, payload }) => {
//     return await api({
//         url: url,
//         method: 'POST',
//         data: payload, // payload
//         responseType: 'blob'
//     }).catch((e) => {
//         throw e;
//     });
// };

// export const getFileName = (fileBlob, defaultFileName) => {
//     const contentDisposition = fileBlob.headers.get('content-disposition');
//     if (contentDisposition) {
//         const fileNameIdentifier = 'filename=';
//         const filenamePosition = contentDisposition.indexOf(fileNameIdentifier);
//         if (~filenamePosition) {
//             return contentDisposition.slice(filenamePosition + fileNameIdentifier.length, contentDisposition.length).replace(/"/g,'');
//         }
//     }
//     return defaultFileName;
// };

// export const downloadFile = (fileBlob, fileName) => {
//     const url = URL.createObjectURL(new Blob([fileBlob], {responseType: 'application/pdf'}));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `${fileName}`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     link.style.display = 'none';
//     URL.revokeObjectURL(url);
// };

// "api" is an instance of Axios (axios.create)
// "payload" is the payload you submit to the server





// export async function deleted_file_pdf({data, url=`/frontend/deleted_file_pdf`}) {
//   var formData = new FormData()
//   formData.append("data", JSON.stringify(data))
//   console.log("formData ==== ", formData)
//   return await api({
//     method: 'delete',
//     url: url,
//     data: formData,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
//   .then((res) => {
//     console.log('deleted_file_pdf -- SUCCESS!!')
//     console.log(res.data)
//   })
//   .catch((err) => {console.error(err.toJSON())})  
// }


// export async function upload_pdf_list({data, url=`/frontend/upload_pdf`}) {
//   var formData = new FormData()
//   formData.append("data", JSON.stringify(data))
//   console.log("formData = ", formData)
//   return await api({
//     method: 'post',
//     url: url,
//     data: formData,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
//   .then((res) => {
//     console.log('SUCCESS!!')
//     // console.log(res.data)
//     // return res.data
//     // store.commit(e[0])
//   })
//   .catch((err) => {console.error(err.toJSON())})
// }

// // const store = useStore()

// export async function upload_pdf({data, file, url=`/frontend/upload_pdf`}) {
//   var formData = new FormData()
//   formData.append("data", JSON.stringify(data))
//   formData.append("file", file)

//   console.log("formData = ", formData)
//   // console.log("data.get = ", data.get('doc_type_id'))

//   return await api({
//     method: 'post',
//     url: url,
//     data: formData,
//     // params: data.params,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
//   .then((res) => {
//     console.log('SUCCESS!!')
//     // console.log(res.data)
//     return res.data
//   })
//   .catch((err) => {console.error(err.toJSON())})
// }



    // api({
    //   method: 'post',
    //   url: url,
    //   data: formData,
    // }).then((res) => { console.log(res.data) })
          


// export async function upload_pdf({params, data, url=`/frontend/upload_pdf`}) {
//   var formData = new FormData()
//   Object.entries(data).forEach( ([k, v]) => formData.append(k, v) )
//   return await api({
//     method: 'post',
//     url: url,
//     data: formData,
//     params: params,
//     headers: {'Content-Type': 'multipart/form-data'}
//   })
//   .then((res) => {
//     console.log('SUCCESS!!')
//     return res
//   })
//   .catch((err) => {console.error(err.toJSON())})
// }

// export async function upload_pdf({params, data, url=`/doc_file/upload_pdf`}) {
//   try {
//     const res = await axios({
//       method: 'post',
//       url: url,
//       data: data,
//       params: params
//     })
//     console.log('SUCCESS!!')
//     return res
//   } catch  {
//     // console.error(err.toJSON())
//     (err) => err
//   }
// }

// type ContentType = AxiosHeaderValue | 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';
