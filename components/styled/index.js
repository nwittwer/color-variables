// Select all .vue files in this directory
// Inspired by https://dev.to/wonder95/dynamically-importing-vuex-store-modules-from-directory-structure-o54
function load() {
  const context = require.context("./", true, /[A-Z]\w+\.(vue)$/, "lazy");
  return context
    .keys()
    .map(context) // import module
    .map(m => m.default); // get `default` export from each resolved module
}

export const components = {}; // Create a new object with each component in it
load().forEach(resource => {
  components[resource.name] = resource;
});

// // Load each vue file into a component
// components.keys().forEach(filePath => {
//   // load the component
//   components(filePath).then(module => {
//     // module.default is the vue component
//     console.log(module.default);
//   });
// });
