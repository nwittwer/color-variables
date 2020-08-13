<template lang="pug">
  div
    button(@click="removeStyles") Remove overrides
    button(@click="copyToClipboard") Copy overrides
    div(v-for="style of styles")
      h4 {{style.name}}
      div.style(v-for="variable in style.variables")
        ColorPicker(:name="variable.key" :value="variable.value" @change="setStyle")
</template>

<script>
import { ref, unref, onMounted } from "@nuxtjs/composition-api";
import ColorPicker from "./ColorPicker.vue";
import useColors from "~/compositions/useColors";
import {
  cssVariablesFromString,
  cssStringToArray
} from "~/compositions/useColors/helpers.js";

export default {
  components: {
    ColorPicker
  },
  setup(props, context) {
    const {
      state,
      setStyle,
      removeStyles,
      watchForStyleChanges,
      updateStyles
    } = useColors();

    function copyToClipboard() {
      let overrideStyles = document.documentElement.style.cssText;
      if (!overrideStyles) return console.error("No styles");

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

      // Create a list of all the styles
      // If an override exists, remove the original
      const allStyles = unref(state.styles).reduce((res, style) => {
        for (let kv of style.variables) {
          // Check if an override for that key exists
          // Strip to only the variable names
          const overrideAsArray = cssStringToArray(overrideStyles);
          const overrideExists = overrideAsArray.find(style => {
            return style.key === kv.key;
          });

          if (overrideExists) {
            // Use the override!
            console.log("Using override", overrideExists);
            res.push(`${overrideExists.key}:${overrideExists.value}`);
          } else {
            // Use original style
            res.push(`${kv.key}:${kv.value}`);
          }
        }

        return res;
      }, []);

      context.root.$buefy.toast.open({
        message: "Copied to clipboard",
        type: "is-success"
      });

      console.info("Copied to clipboard", allStyles);
      copy(allStyles);
    }

    onMounted(() => {
      watchForStyleChanges(); // Watch for changes!
      updateStyles(); // Get the styles
    });

    return { styles: state.styles, setStyle, copyToClipboard, removeStyles };
  }
};
</script>

<style lang="scss" scoped>
.style {
  margin-bottom: 1rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #d6d6d6;
}
</style>
