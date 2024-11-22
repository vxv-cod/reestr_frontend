import { boot } from 'quasar/wrappers'
import axios from 'axios'


// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] = '*';

// const server_detals = (location.protocol + '//' + location.host + location.pathname).
// console.log("server_detals = ", server_detals);
// console.log("origin = ", location.origin);
// console.log("pathname = ", location.pathname);
// console.log("location = ", location);


const base_api = axios.create({ baseURL: process.env.ROOT_PATH_API})
// const base_api = axios.create({ baseURL: "http://127.0.0.1:5050"})
// const base_api = axios.create({ baseURL: `http://127.0.0.1:443/reestr_is_api`})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$base_api = base_api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

// console.log('server_detals = ', server_detals);
// console.log('location = ', location);


export { base_api }
