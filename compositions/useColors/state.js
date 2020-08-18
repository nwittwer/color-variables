import { ref, computed, watch, unref, reactive } from "@nuxtjs/composition-api";
import { cssVariablesFromString } from "./helpers";

export const styles = ref([]); // Array of :root styles
export const elements = ref([]); // Array of DOM Element selectors (i.e. '.form', '.button')

export const variableUsage = ref([]); // Array of used/unused information

// Update usage variables when styles change
watch(styles, () => {
  const { used, unused } = getVariableUsage();
  variableUsage.value = { used, unused };
});

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
  // Used CSS variables
  usedVariables: computed(() => {
    const { used } = unref(variableUsage);
    return used;
  }),
  // Unused CSS variables
  unusedVariables: computed(() => {
    const { unused } = unref(variableUsage);
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

  let used = []; // Used
  // let unused = []; // Unused

  // via https://stackoverflow.com/a/52003732/1114901
  const unused = strDefinitions.reduce((newArray, item, index, array) => {
    const definedVariableName = item.key; // Each definition
    const usedVariableNames = strElements.map(el =>
      cssVariablesFromString(el.value)
    );

    const diff = usedVariableNames.filter(
      name => !definedVariableName.includes(name)
    );

    if (diff.length && !newArray.some(i => i.key === item.key)) {
      // Make sure this doesn't exist in the new array
      newArray.push(item); // Add this item
    }

    console.log("used", newArray, item);

    return newArray; // return the end Array
  }, []);

  // For each definition...
  // Return the definitions which match
  // for (const definition of strDefinitions) {
  //   // Return the objects for Elements that used a defined CSS variable

  //   // Check if there's a definition matching the element
  //   // If so, it's a match!
  //   strElements.find(el => {
  //     // Check
  //     const match = definition.key === cssVariablesFromString(el.value);

  //     if (match) {
  //       // return true;
  //       // Used
  //       const exists = used.some(i => {
  //         return i.key === definition.key;
  //       });
  //       if (!exists) used.push(definition); // Make sure it doesn't already exist
  //     } else {
  //       // Unused
  //       const exists = unused.some(i => i.key === definition.key);
  //       if (!exists) {
  //         console.log("unused", definition, el);
  //         unused.push(definition);
  //       } // Make sure it doesn't already exist
  //     }

  //     console.log("quick", match, el.value, definition.key);
  //   });
  // }
  // strDefinitions.filter(def => {});

  // const unused = strDefinitions.filter(def => {

  //   // Get a list of the elements that aren't in the definitions nor the elements
  //   // These are the unused ones

  //   // const match = used.find(
  //   //   used => cssVariablesFromString(used.key) !== def.key
  //   // );

  //   // console.log("quick", !!match);

  //   // return match ? match : match;

  //   const array1 = strElements; // All
  //   const array2 = used; // Used

  //   // What's in array 1 that's not in array 2?
  //   // const missing = array1.filter((i => a => a !== array2[i] || !++i)(0));
  //   // const missing = array1.filter(
  //   //   e => !array2.includes(e.key) || !array2.includes(e.value)
  //   // );
  //   // const missing = array1.filter(e => array2.indexOf(e.key) > -1);
  //   // const missing = array1.filter(e => array2.indexOf(def.key) === -1);

  //   // Check if

  //   console.log("quick", {
  //     all: array1.length,
  //     used: array2.length,
  //     missing: missing.length
  //   });

  //   return missing;
  // });
  console.log("quick", {
    total: strElements,
    used,
    unused
  });

  return {
    used,
    unused
  };
}
