<template lang="pug">
  div
    div.group
      div.group__header
        h2 Definitions
      div.element(
        v-for="element in definitions" 
        :key="element.selector" 
        @mouseover="highlight(element.selector)")
        div.selector-name {{ element.selector }}
        div.instances {{ element.values.length > 1 ? `${element.values.length} definitions` : `${element.values.length} definition` }}
        div(v-for="(properties, i) in element.values" :key="i" :class="{ 'is-unused' : !isVariableUsed(properties.key) }")
          span {{ properties.key }}: {{ properties.value }}
    div.group
      div.group__header
        h2 Unused CSS Variables
        p Variables which were defined but never used by any DOM Elements
      div.element(v-for="element in unused" :key="element.selector")
        div {{ element }}
    div.group
      div.group__header
        h2 Usage
      div.element(v-for="element in elementUsage" :key="element.selector" @mouseover="highlight(element.selector)")
        div.selector-name {{ stripVueDataAttrs(element.selector) }}
        div.instances {{ element.values.length > 1 ? `${element.values.length} variables used` : `${element.values.length} variable used` }}
        div(v-for="(properties, i) in element.values" :key="i")
          span {{ properties.key }}:
          span {{ properties.value }}
</template>

<script>
import { ref, unref, computed } from "@nuxtjs/composition-api";
import useColors from "~/compositions/useColors.js";

export default {
  setup(props, context) {
    const { elements, styles } = useColors();
    const activeTab = ref(0);

    const elementArray = computed(() => {
      console.log("updating array of elements", elements);
      // Get the items
      const items = unref(elements); // Expects a Vue Ref (Array)
      return items.filter(item => {
        return item;
      });

      // Flatten the array of arrays into one flat array
      // https://stackoverflow.com/a/16299004/1114901
      const flattened = items.reduce((p, n) => p.concat(n), []);
      return flattened;
    });

    // Filter down to the Elements where a CSS Var is defined
    const definitions = computed(() => {
      return elementArray.value.filter(i => {
        // We're inside of one Array
        return i.values.find(e => {
          return e.key.includes("--");
        });
      });
    });

    // Filter down to the Elements where a CSS Var is used
    const elementUsage = computed(() => {
      return elementArray.value.filter(i => {
        // We're inside of one Array
        return i.values.find(e => {
          return e.value.includes("var(--");
        });
      });
    });

    // Return elements that aren't in either the definitions or the properties
    // Return keys/values from o2 that are not identical/exist in o1
    const unused = computed(() => {
      // // Flatten the array of arrays into one flat array
      // // https://stackoverflow.com/a/16299004/1114901
      const flatten = arr => arr.reduce((p, n) => p.concat(n), []);

      // const createDiff = (o1, o2) => {
      //   return Object.keys(o2).reduce((diff, key) => {
      //     // via: https://stackoverflow.com/a/37396358/1114901
      //     console.log(o1[key], o2[key]);
      //     if (o1[key] === o2[key]) return diff;
      //     return {
      //       ...diff,
      //       [key]: o2[key]
      //     };
      //   }, {});
      // };

      // Find out which CSS variables are not being used by any DOMElements
      // Return: ["--var-name-here", "--var-name-here-2"]
      function getUnusedVariables() {
        // This is an array of the variables as strings// All the variable definitions
        const strDefinitions = flatten(
          unref(definitions).map(elem => elem.values)
        );
        // All the Elements
        const strElements = flatten(
          unref(elementUsage).map(elem => elem.values)
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
    });

    function highlight(el) {
      if ([":root", "html, body"].some(i => el.includes(i))) {
        console.error(
          "Cannot highlight this element. Proabably :root, html, or body"
        );
        return false;
      }

      const pseudos = [
        ":hover",
        ":active",
        ":visited",
        ":focus",
        ":before",
        ":after"
      ];
      const isPseudo = pseudos.some(i => el.includes(i));

      let _el = null; // DOMElement || null

      if (isPseudo) {
        // Strip each pseudo
        for (let pseudo of pseudos) {
          el = el.split(pseudo).join("");
        }
        _el = document.querySelector(el);
      } else {
        _el = document.querySelector(el);
      }

      if (!_el) {
        // Notify the user
        notify(
          "error",
          "Element not highlighted. That element is either a pseudo (e.g. :hover) or it isn't a real DOMElement."
        );
        return false;
      }

      // Check if a CSS rule already exists from a previoius highlight
      // via https://stackoverflow.com/questions/983586/how-can-you-determine-if-a-css-class-exists-with-javascript
      function getDefinedCss(s) {
        return [].slice
          .call(document.styleSheets)
          .filter(styleSheet => {
            const internalStyleSheets = !styleSheet.href; // Remove external styleSheets from our search

            const notBuefy = () => {
              const rules = Array.from(styleSheet.rules); // Array
              const styleSheetIsBuefy = rules.some(
                i => i.cssText.includes(".is-noscroll") // search for unique class name to identify Buefy
              );
              return styleSheetIsBuefy ? false : true;
            };

            return internalStyleSheets && notBuefy();
          })
          .map(styleSheet => [].slice.call(styleSheet.cssRules))
          .flat()
          .map(cssRule => {
            const cssruleToArray = cssRule => {
              return cssRule.cssText
                .split("{")[1]
                .split("}")[0]
                .trim()
                .split(";")
                .flat()
                .filter(text => text !== "")
                .map(text => text.split(":"))
                .map(parts => ({
                  key: parts[0].trim(),
                  value: parts[1].trim()
                }));
            };

            // Format it nicely
            return {
              name: cssRule.selectorText,
              properties: cssruleToArray(cssRule)
            };
          });
      }

      const highlightSelectorName = "temporary-highlight";
      const allStyles = getDefinedCss(highlightSelectorName);

      // Find an existing selector
      // True: returns a filtered object
      // False: returns false
      function findExistingSelector(selector) {
        return allStyles.filter(styles => {
          return styles.name.includes(selector);
        });
      }

      // Case: Highlight style hasn't been created yet
      if (!findExistingSelector(highlightSelectorName).length) {
        console.log(`Added highlight selector: .${highlightSelectorName}`);
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `.${highlightSelectorName} { transform: scale(1.2); box-shadow: 0 0 2px gray inset, 0 0 10px gray!important; transition: all 150ms ease-out}"`;
        document.getElementsByTagName("head")[0].appendChild(style);
      }

      // Start the FE effects
      _el.classList.add(highlightSelectorName); // Temporarily add highlight styles
      _el.scrollIntoView({
        behavior: "auto", // smooth
        block: "center",
        inline: "center"
      }); // Scroll into view

      // Remove after a few seconds
      setTimeout(() => {
        _el.classList.remove(highlightSelectorName);
      }, 250);
    }

    function notify(status, msg) {
      if (status === "success") {
        context.root.$buefy.toast.open({
          message: msg,
          type: "is-success"
        });
      }

      if (status === "error") {
        context.root.$buefy.snackbar.open({
          duration: 5000,
          message: msg,
          type: "is-danger",
          position: "is-top-left",
          actionText: "Close",
          queue: false,
          onAction: () => {}
        });
      }
    }

    return {
      elements,
      definitions,
      unused,
      elementUsage,
      activeTab,
      highlight,
      stripVueDataAttrs: selector => {
        const str = "asd-0.testing";
        const regex = /\[(.*?)\]/g;
        return selector.replace(regex, ""); // Remove the [data-v-*]
      },
      isVariableUsed: variable => {
        return !unref(unused).includes(variable);
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.group {
  position: relative;
  margin-bottom: 3rem;

  .group__header {
    border-bottom: 2px solid #b3b3b3;
    position: sticky;
    top: 0;
    backdrop-filter: blur(10px);
    padding: 0.5rem;
  }
}

.element {
  padding: 0.25rem;
  cursor: default;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  &:hover {
    background: #e0e0e0;
  }

  .selector-name {
    color: blue;
    user-select: none;
    font-weight: bold;
    cursor: pointer;
  }

  .is-unused {
    color: red;
  }
}
</style>
