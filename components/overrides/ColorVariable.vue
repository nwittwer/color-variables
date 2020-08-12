<template lang="pug">
  div
    button(@click="removeStyles") Remove overrides
    div(v-for="style of styles")
      h4 {{style.name}}
      div(v-for="variable in style.variables")
        ColorPicker(:name="variable.key" :value="variable.value" @change="setStyle")
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import ColorPicker from "./ColorPicker.vue";

export default {
  components: {
    ColorPicker
  },
  setup(props, context) {
    onMounted(() => {
      watchForStyleChanges(); // Watch for changes!
      updateStyles(); // Get the styles
    });

    return { styles, setStyle, removeStyles };
  }
};

const styles = ref([]); // Hold an Array of :root styles

function updateStyles() {
  const newStyles = getRootStyles();
  styles.value = JSON.parse(JSON.stringify(newStyles));
  console.info(`CSS vars ${styles.value.length}`, styles.value);
}

// Watch for :root variable changes
// via https://stackoverflow.com/a/20683311/1114901
function watchForStyleChanges() {
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type !== "attributes") return false;

      // Case: Class change (theme switch)
      if (mutation.attributeName === "class") {
        console.log("class changed!", mutation);
      }

      // Case: Style (override) change
      if (mutation.attributeName === "style") {
        console.log("style changed!", mutation);
      }

      updateStyles();

      // Temporarily highlight that DOMElement
      // TODO See which
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    characterData: false,
    attributeFilter: ["class", "style"]
  }); // Observe!
}

// Converts JS to CSS
function objToCss(style) {
  return Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

// Get all the :root styles
// https://stackoverflow.com/a/54851636/1114901
function getRootStyles() {
  const selectorsUsingCssVariables = []; // Store a list of all the selectors using CSS Variables

  const cssruleToArray = cssRule => {
    return cssRule.cssText
      .split("{")[1]
      .split("}")[0]
      .trim()
      .split(";")
      .flat()
      .filter(text => text !== "")
      .map(text => text.split(":"))
      .map(parts => ({ key: parts[0].trim(), value: parts[1].trim() }));
  };

  // Expects a CSS rule style
  const output = [].slice
    .call(document.styleSheets)
    .map(styleSheet => [].slice.call(styleSheet.cssRules))
    .flat()
    .filter(cssRule => {
      const getCssVariables = rule => {
        // Array of key/values
        const testArr = cssruleToArray(cssRule);

        // The regex expression to look for
        // Tests: https://regexr.com/5a2pp
        const test = new RegExp("(\-{2})(?!$.)([a-z]|[A-Z])[^:;)]*", "g");

        // Of the key/value pairs, which contain CSS Variables declarations or usages?
        const matches = testArr.filter(
          rule => test.exec(rule.key) || test.exec(rule.value)
        );

        if (testArr.length && matches.length) {
          return {
            selector: cssRule.selectorText,
            values: matches
          };
        } else {
          return false;
        }
      };

      // Create a list of all the classes that are using CSS Variables
      if (getCssVariables(cssRule)) {
        const arrayOfVariables = getCssVariables(cssRule);
        selectorsUsingCssVariables.push(arrayOfVariables.selector); // Add the name of the Class
      }

      if (
        cssRule.selectorText === ":root" ||
        cssRule.selectorText.includes("-mode")
      ) {
        return true;
      } else {
        return false;
      }
    })
    .map(cssRule => {
      const cssToJson = (style = "") => {
        return style.split(";").reduce((ruleMap, ruleString) => {
          const rulePair = ruleString.split(":");
          console.log(rulePair);
          ruleMap[rulePair[0].trim()] = rulePair[1].trim();
          return ruleMap;
        }, {});
      };

      const outputObject = (className, styles) => ({
        name: className,
        styles: [...styles]
      });

      // =====================

      const cssruleToArray = cssRule => {
        return cssRule.cssText
          .split("{")[1]
          .split("}")[0]
          .trim()
          .split(";")
          .flat()
          .filter(text => text !== "")
          .map(text => text.split(":"))
          .map(parts => ({ key: parts[0].trim(), value: parts[1].trim() }));
      };

      // =====================

      // Format it nicely
      return {
        name: cssRule.selectorText,
        variables: cssruleToArray(cssRule)
      };
    });

  console.log(selectorsUsingCssVariables);

  return output;
}

// Set a root style by key
// Alternative ways: https://stackoverflow.com/a/55180291/1114901
function setStyle({ key, value }) {
  document.documentElement.style.setProperty(key, value);
}

function removeStyles() {
  document.documentElement.style = "";
}
</script>

<style lang="scss" scoped></style>
