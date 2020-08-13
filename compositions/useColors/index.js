// This will be our central state for Color Variables
// It will also manage
import { ref, unref } from "@nuxtjs/composition-api";
import * as state from "./state";
import { cssruleToArray } from "./helpers";

export default function useColors() {
  function updateStyles() {
    getRootStyles();
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

  // Get all the :root styles
  // https://stackoverflow.com/a/54851636/1114901
  function getRootStyles() {
    console.log("Stylesheets loaded:", document.styleSheets);

    const newElementsArray = []; // Temporarily hold a new array of elements

    // Expects a CSS rule style
    const output = [].slice
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
      .filter(cssRule => {
        // Create a list of all the classes that are using CSS Variables
        if (getCssVariables(cssRule)) {
          const arrayOfVariables = getCssVariables(cssRule);
          newElementsArray.push(arrayOfVariables); // Add the name of the Class
        }

        // Continue creating a nice array of all the classes & variables in them
        // We'll only focus on the root <HTML> declarations and our themes "-mode"
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
        // Format it nicely
        return {
          name: cssRule.selectorText,
          variables: cssruleToArray(cssRule.cssText)
        };
      });

    // Update the elements
    state.elements.value = [...newElementsArray];

    // Set the new styles
    state.styles.value = JSON.parse(JSON.stringify(output));

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

  // Expose the following:
  return {
    state,
    setStyle,
    removeStyles,
    updateStyles,
    watchForStyleChanges
  };
}

const getCssVariables = rule => {
  // Array of key/values
  const testArr = cssruleToArray(rule.cssText);

  // The regex expression to look for
  // Tests: https://regexr.com/5a2pp
  const regex = new RegExp("(-{2})(?!$.)([a-z]|[A-Z])[^:;)]*", "g");

  // Of the key/value pairs, which contain CSS Variables declarations or usages?
  const matches = testArr.filter(
    rule => regex.test(rule.key) || regex.test(rule.value)
  );

  if (testArr.length && matches.length) {
    return {
      selector: rule.selectorText,
      values: matches
    };
  } else {
    return false;
  }
};

///////////////////////////////////
///////////////////////////////////
///////////////////////////////////

// Converts JS to CSS
function objToCss(style) {
  return Object.entries(style)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

function cssToJson(style = "") {
  return style.split(";").reduce((ruleMap, ruleString) => {
    const rulePair = ruleString.split(":");
    console.log(rulePair);
    ruleMap[rulePair[0].trim()] = rulePair[1].trim();
    return ruleMap;
  }, {});
}
