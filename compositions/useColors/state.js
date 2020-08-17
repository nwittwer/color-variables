import { ref, computed, unref, reactive } from "@nuxtjs/composition-api";
import { cssVariablesFromString } from "./helpers";

export const styles = ref([]); // Array of :root styles
export const elements = ref([]); // Array of DOM Element selectors (i.e. '.form', '.button')

export const computedValues = {
  // Filter down to the Elements where a CSS Var is defined
  definitions: computed(() => {
    return unref(elementArray).filter(i => {
      // We're inside of one Array
      return i.values.find(e => {
        // console.log("test5", e.key.includes("--") ? true (${e.key}): `false (${e.key})`);
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
  usedVariables: computed(() => {
    const { used } = getVariableUsage();
    return used;
  }),
  // Unused CSS variables
  unusedVariables: computed(() => {
    const { unused } = getVariableUsage();
    console.log("unused", unused, getVariableUsage());
    return unused;
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

// Find out which CSS variables are not being used by any DOMElements
// Return: ["--var-name-here", "--var-name-here-2"]
// Returns two array: [used], [unused]
function getVariableUsage() {
  // // Flatten the array of arrays into one flat array
  // // https://stackoverflow.com/a/16299004/1114901
  const flatten = arr => arr.reduce((p, n) => p.concat(n), []);

  // All the variable definitions, stripped down to an Array of [key, value] pairs
  let strDefinitions = unref(computedValues.definitions).flatMap(def => {
    // Return a new array that's filtered
    return def.values.reduce(
      (previousValue, currentValue, currentIndex, array) => {
        previousValue.push(currentValue);
        return previousValue.flat();
      },
      []
    );
  });
  strDefinitions = flatten(strDefinitions.map(elem => elem));

  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////
  ///////////////////////////////

  // All the Elements
  const strElements = flatten(
    unref(computedValues.elementUsage).map(elem => elem.values)
  );

  const used = strDefinitions.filter(def => {
    // console.log("testing1", strElements, def.key);
    // Return the elements which used a defined CSS variable
    return strElements.find(el => cssVariablesFromString(el.value) === def.key);
  });

  const unused = strDefinitions.filter(def => {
    if (!def) return false;
    return !used.find(used => cssVariablesFromString(used.key) === def.key);
  });
  console.log("quick", {
    used,
    unused
  });

  return {
    used,
    unused
  };
}
