<template lang="pug">
  div
    button(@click="removeStyles") Remove overrides
    div(v-for="style of styles")
      h4 {{style.name}}
      div(v-for="variable in style.variables")
        ColorPicker(:name="variable.key" :value="variable.value" @change="setStyle")
</template>

<script>
import { ref, onMounted } from "@nuxtjs/composition-api";
import ColorPicker from "./ColorPicker.vue";
import useColors from "~/compositions/useColors.js";

export default {
  components: {
    ColorPicker
  },
  setup(props, context) {
    const {
      styles,
      setStyle,
      removeStyles,
      watchForStyleChanges,
      updateStyles
    } = useColors();

    onMounted(() => {
      watchForStyleChanges(); // Watch for changes!
      updateStyles(); // Get the styles
    });

    return { styles, setStyle, removeStyles };
  }
};
</script>

<style lang="scss" scoped></style>
