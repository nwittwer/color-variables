import { ref, computed, unref } from "@nuxtjs/composition-api";
import * as state from "./state";

const elementArray = computed(() => {
  console.log("Updating computed", state.elements);
  // Get the items
  const items = unref(state.elements); // Expects a Vue Ref (Array)
  return items.filter(item => {
    return item;
  });
});

// Filter down to the Elements where a CSS Var is defined
export const definitions = computed(() => {
  return unref(elementArray).filter(i => {
    // We're inside of one Array
    return i.values.find(e => {
      return e.key.includes("--");
    });
  });
});

// Filter down to the Elements where a CSS Var is used
export const elementUsage = computed(() => {
  return unref(elementArray).filter(i => {
    // We're inside of one Array
    return i.values.find(e => {
      return e.value.includes("var(--");
    });
  });
});

// Return elements that aren't in either the definitions or the properties
// Return keys/values from o2 that are not identical/exist in o1
export const unused = computed(() => {
  // // Flatten the array of arrays into one flat array
  // // https://stackoverflow.com/a/16299004/1114901
  const flatten = arr => arr.reduce((p, n) => p.concat(n), []);

  // Find out which CSS variables are not being used by any DOMElements
  // Return: ["--var-name-here", "--var-name-here-2"]
  function getUnusedVariables() {
    // This is an array of the variables as strings// All the variable definitions
    const strDefinitions = flatten(unref(definitions).map(elem => elem.values));
    // All the Elements
    const strElements = flatten(unref(elementUsage).map(elem => elem.values));

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
});
