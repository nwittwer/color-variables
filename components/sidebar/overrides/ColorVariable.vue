<template lang="pug">
  div
    button(@click="removeStyles") Remove overrides
    div(v-for="style of styles")
      CopyStyleToClipboardButton(:styles="style")
      h4 {{style.name}}
      div.style(v-for="variable in style.variables")
        ColorPicker(:name="variable.key" :value="variable.value" @change="setStyle")
</template>

<script>
import { ref, unref, onMounted } from "@nuxtjs/composition-api";
import ColorPicker from "./ColorPicker.vue";
import CopyStyleToClipboardButton from "./CopyStyleToClipboardButton.vue";
import useColors from "~/compositions/useColors";

export default {
  components: {
    ColorPicker,
    CopyStyleToClipboardButton
  },
  setup(props, context) {
    const {
      state,
      setStyle,
      removeStyles,
      watchForStyleChanges,
      updateStyles
    } = useColors();

    onMounted(() => {
      watchForStyleChanges(); // Watch for changes!
      updateStyles(); // Get the styles
    });

    return { styles: state.styles, setStyle, removeStyles };
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
