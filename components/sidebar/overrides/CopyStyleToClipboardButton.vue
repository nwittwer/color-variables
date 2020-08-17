<template lang="pug">
  div
    button(@click="copyToClipboard(props.styles)") Copy overrides
</template>

<script>
import { ref, unref, onMounted } from "@nuxtjs/composition-api";
import useColors from "~/compositions/useColors";
import {
  cssVariablesFromString,
  cssStringToArray
} from "~/compositions/useColors/helpers.js";

export default {
  props: {
    styles: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    const {
      state,
      setStyle,
      removeStyles,
      watchForStyleChanges,
      updateStyles
    } = useColors();

    function copyToClipboard(styleDeclaration) {
      if (!styleDeclaration) return console.error("Missing selector");

      let overrideStyles = document.documentElement.style.cssText;

      const copy = str => {
        const el = document.createElement("textarea");
        el.value = str;
        el.setAttribute("readonly", "");
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      };

      // Filter only down to the current Selector
      console.log(styleDeclaration);
      const rootStyles = unref(state.styles).filter(
        style => style.name === styleDeclaration.name
        // style => style.name === ":root"
      );

      // Create a list of all the styles
      const allStyles = rootStyles.reduce((res, style) => {
        console.log("style", style);

        // Create an array of all the override styles
        // Strip it down to only the variable names
        // This will be empty if there's no overrides
        const arrayOfOverrides = overrideStyles
          ? cssStringToArray(overrideStyles)
          : [];

        // Check if each rootstyle has an override
        // If there is an override, use the override instead of the original value
        for (let kv of style.variables) {
          // We'll check if another override for that key exists
          const hasOverride = arrayOfOverrides.find(
            override => override.key === kv.key
          );

          // Case: 1+ overrides set
          if (hasOverride) {
            // Check if {this} CSS variable has an override
            // Iterate over each override
            console.log("testing", kv);
            const oldValue = kv;
            const newValue = { key: hasOverride.key, value: hasOverride.value };

            if (oldValue.value === newValue.value) continue; // No change, go to next

            // If a CSS variable with the same key is already defined, replace the old one with this override
            // This is the index where the override should appear in the list of all the styles
            const index = style.variables.findIndex(
              override => kv.key === override.key
            );

            console.log(
              `testing Using override ${oldValue.key}`,
              style.variables[index],
              oldValue.value,
              newValue.value
            );

            // Change the oldValue to the newValue
            res.splice(index, 1, newValue);
          } else {
            // Because no overrides exist, just add each value directly
            // Use original style
            res.push({ key: kv.key, value: kv.value });
          }
        }

        console.log("testing Final output", res);
        return res;
      }, []);

      // Notify the FE user
      // TODO Make independent?
      context.root.$buefy.toast.open({
        message: "Copied to clipboard",
        type: "is-success"
      });

      const output = allStyles
        .map(function(i) {
          return `${i.key}: ${i.value}`;
        })
        .join("; \n"); // Convert Array to a string in CSS (prop: value;) format

      console.info(
        "Copied to clipboard",
        output,
        allStyles,
        `Overrides used? ${overrideStyles.length}`
      );

      copy(output);
    }

    return { props, copyToClipboard };
  }
};
</script>

<style lang="scss" scoped></style>
