<template lang="pug">
  div
    h2 Definitions
    div.element(
      v-for="element in definitions" 
      :key="element.selector" 
      @mouseover="highlight(element.selector)")

      div.selector-name {{ element.selector }}
      div(v-for="(properties, i) in element.values" :key="i")
        span {{ properties.key }}:
        span {{ properties.value }}
    hr
    h2 Usage
    div.element(v-for="element in properties" :key="element.selector" @mouseover="highlight(element.selector)")
      div.selector-name {{ stripVueDataAttrs(element.selector) }}
      div(v-for="(properties, i) in element.values" :key="i")
        span {{ properties.key }}:
        span {{ properties.value }}
    hr
    h2 Unused
    div {{unused}}
    div.element(v-for="element in unused" :key="element.selector" @mouseover="highlight(element.selector)")
      div.selector-name {{ stripVueDataAttrs(element.selector) }}
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
    const properties = computed(() => {
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

      const createDiff = (o1, o2) => {
        return Object.keys(o2).reduce((diff, key) => {
          // via: https://stackoverflow.com/a/37396358/1114901
          console.log(o1[key], o2[key]);
          if (o1[key] === o2[key]) return diff;
          return {
            ...diff,
            [key]: o2[key]
          };
        }, {});
      };

      // const arrayOfStyles = styles.value.map(i => {
      //   return i.variables; // Return just the variables Array[]
      // });

      // const diff = createDiff(
      //   arrayOfStyles,
      //   flatten(unref(elements).map(i => i.values))
      // );

      // console.log(flatten(unref(elements).map(i => i.values)));
      // console.log("diff", diff, styles.value, elements.value);

      const definedCssVariables = styles.value.reduce((res, iterator) => {
        // Return a flat array
        iterator.variables.map(
          e => res.push(e.key) // Returns only the name of the CSS var (e.g. "--brand-primary-color")
        );
        return res; // Return as an array
      }, []); // <-- new Array

      const filtered = unref(elements).filter(function(item) {
        // item = element array containing a list of key/value pairs

        // const matches = item.values.filter(j => {
        //   console.log(
        //     definedCssVariables,
        //     j.key,
        //     definedCssVariables.some(i => definedCssVariables.includes(i.key) === true)
        //   );
        //   return definedCssVariables.some(i => definedCssVariables.includes(i.key) !== true);
        // });

        console.log(item);

        // Find matches
        const matches = item.values.reduce(function(res, i) {
          // item = values[0][key,value] pairs <-- Parent data
          // i = [key, value] pair <-- Individual key/value pairs of CSS properties, not yet filtered

          // Regex to strip var(--xxx) into "--xxx"
          function stripCssPropToVars(val) {
            const cssVarRegex = new RegExp(
              "(-{2})(?!$.)([a-z]|[A-Z])[^:;)]*",
              "g"
            );

            const match = val.match(cssVarRegex);
            return match ? match[0] : false;
          }

          const target = stripCssPropToVars(i.value); // i.e. "--brand-color-primary"
          if (!target) return false; // Only allow CSS Variables

          // Remove any keys which aren't CSS variables (i.e. don't start with "--")
          if (target.includes("--") === false) return false;

          // We have a list of CSS Variables that were defined at :root
          // We have a list of selectors which use CSS variables

          // Case 1: Is the current selector's CSS variable defined?
          // We need to know when the root variable doesn't exist/was not found
          const isSelectorsVariableDefined = definedCssVariables.some(
            variable => variable.includes(target)
          );

          // Case 2: Are there any CSS variables that are defined but not used?
          // Defined, but not used
          // Context: Each DOMElement
          // Returns: filtered list of results || []
          const isVariableNotUsed = unref(properties).filter(
            propertiesUsingVariables => {
              console.log("properties", propertiesUsingVariables);

              // Find
              propertiesUsingVariables.values.find(kv => {});
            }
          ); // No results found

          // Return the CSS variables which are not used
          if (isSelectorsVariableDefined === false) {
            console.log(definedCssVariables, target, i.value);
            console.log(
              target,
              isSelectorsVariableDefined,
              definedCssVariables
            );
            res.push(i);
            return res;
          } else {
            // console.log(`failed isSelectorsVariableDefined: ${target}`, i.key);
            return false;
          }

          // return res; // Return the new Array
        }, []);

        return matches;
      });

      console.log(filtered);
      return filtered;
      // return diff;
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
      properties,
      activeTab,
      highlight,
      stripVueDataAttrs: selector => {
        const str = "asd-0.testing";
        const regex = /\[(.*?)\]/g;
        return selector.replace(regex, ""); // Remove the [data-v-*]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
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
}
</style>
