// Returns
export function cssVariablesFromString(string) {
  if (!string || typeof string !== "string") new Error("Not a string");
  const regex = new RegExp("(-{2})(?!$.)([a-z]|[A-Z])[^:;)]*", "g");
  const match = string.match(regex, "")[0]; // return (e.g. --variable-name-here)
  return match ? match : console.error("No CSS variables found");
}

/**
 * Convert a CSS Rule into an key/value array
 * Example: style.cssText
 * NOTE: SHOULD contain a selector
 * @param {*} cssRule CSS Rule declaration
 */
export function cssruleToArray(cssText) {
  if (!cssText) throw new Error("CSS Rule error");
  return cssText
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
}

/**
 * Convert a string containing multiple styles into an key/value array
 * NOTE: Should not contain a selector
 * @param {*} cssRule CSS Rule declaration
 */
export function cssStringToArray(str) {
  if (!str) return console.error("CSS Rule error");
  console.log(str.split("{")[0]);
  return (
    str
      // .split("{")[0]
      // .split("}")[0]
      // .trim()
      .split(";")
      .flat()
      .filter(text => text !== "")
      .map(text => text.split(":"))
      .map(parts => ({
        key: parts[0].trim(),
        value: parts[1].trim()
      }))
  );
}

//////////////////////
//////////////////////
//////////////////////
// Internal

function cssSplitter() {}

const mergeDedupe = arr => {
  return [...new Set([...arr].flat())];
};
