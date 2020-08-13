import { ref, computed, unref, reactive } from "@nuxtjs/composition-api";

export const styles = ref([]); // Array of :root styles
export const elements = ref([]); // Array of DOM Element selectors (i.e. '.form', '.button')

export const computedValues = {
  // Filter down to the Elements where a CSS Var is defined
  definitions: computed(() => {
    return unref(elementArray).filter(i => {
      // We're inside of one Array
      return i.values.find(e => {
        return e.key.includes("--");
      });
    });
  }),
  // Filter down to the Elements where a CSS Var is used
  elementUsage: computed(() => {
    return unref(elementArray).filter(i => {
      // We're inside of one Array
      return i.values.find(e => {
        return e.value.includes("var(--");
      });
    });
  }),
  // Unused CSS variables
  unusedVariables: computed(() => {
    // // Flatten the array of arrays into one flat array
    // // https://stackoverflow.com/a/16299004/1114901
    const flatten = arr => arr.reduce((p, n) => p.concat(n), []);

    // Find out which CSS variables are not being used by any DOMElements
    // Return: ["--var-name-here", "--var-name-here-2"]
    function getUnusedVariables() {
      // This is an array of the variables as strings// All the variable definitions
      const strDefinitions = flatten(
        unref(computedValues.definitions).map(elem => elem.values)
      );
      // All the Elements
      const strElements = flatten(
        unref(computedValues.elementUsage).map(elem => elem.values)
      );

      const varsNotUsed = strElements.reduce((res, elem) => {
        // Does the def.key exist in the elem.value?
        // If not, it isn't being used
        for (let def of strDefinitions) {
          const val = def.key;
          // Find only the ones not included
          if (elem.value.includes(val) === false) {
            // Prevent adding duplicate values
            if (res.includes(val) === false) {
              res.push(val);
            }
            console.log(def, elem);
            return res;
          } else {
            return false;
          }
        }
      }, []);

      return varsNotUsed;
    }

    return getUnusedVariables(); // Finally, return a nice list back to the FE
  })
};

const elementArray = computed(() => {
  console.log("Updating computed", elements);
  // Get the items
  const items = unref(elements); // Expects a Vue Ref (Array)
  return items.filter(item => {
    return item;
  });
});
