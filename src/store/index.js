import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */



// async function loadStores() {
//   const resourceModules = {};
//   const modules = import.meta.globEager('./modules/**/*.js');
//   console.log('modules = ', modules);
//   for (const path in modules) {
//     resourceModules[modules[path].default.name] = modules[path].default;
//   }
//   return resourceModules;
// };
// const resourceModules = await loadStores();

function loadStores() {
  const resourceModules = {};
  const modules = import.meta.globEager('./modules/**/*.js');
  console.log('modules = ', modules);
  for (const path in modules) {
    resourceModules[modules[path].default.name] = modules[path].default;
  }
  return resourceModules;
};
const resourceModules = loadStores();



export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: resourceModules,

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  // Запускаем все actions
  Object.values(resourceModules).map((module) => {
    Object.entries(module.actions).map(e => {
      Store.dispatch(e[0])
    })
  })





  return Store
})











// import { store } from 'quasar/wrappers'
// import { createStore } from 'vuex'

// // import example from './module-example'

// /*
//  * If not building with SSR mode, you can
//  * directly export the Store instantiation;
//  *
//  * The function below can be async too; either use
//  * async/await or return a Promise which resolves
//  * with the Store instance.
//  */

// async function loadStores() {
//   const resourceModules = {};
//   const modules = import.meta.globEager('./modules/**/*.js');
//   console.log('modules = ', modules);

//   for (const path in modules) {
//     resourceModules[modules[path].default.name] = modules[path].default;
//   }

//   return resourceModules;
// };

// const resourceModules = await loadStores();

// console.log("=== ", resourceModules.info.actions)
// console.log("resourceModules = ", resourceModules)


// export default store(function (/* { ssrContext } */) {
//   const Store = createStore({
//     modules: resourceModules,

//     // enable strict mode (adds overhead!)
//     // for dev mode and --debug builds only
//     strict: process.env.DEBUGGING
//   })

//   // Запускаем все actions
//   // Object.values(resourceModules).map((resource) => {
//   //   Object.entries(resource.actions).map(e => {
//   //     Store.dispatch(e[0])
//   //   })
//   // })

//   return Store
// })
