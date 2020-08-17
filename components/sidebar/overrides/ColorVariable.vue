<template lang="pug">
  div
    div(v-for="style of styles")
      .group
        .group__header
          h4 {{style.name}}
          div.buttons
            b-field
              p.control
                CopyStyleToClipboardButton(:styles="style")
              p.control
                b-dropdown(position="is-bottom-left") 
                  b-button(type="is-primary" slot="trigger")
                    b-icon(icon="menu-down")
                  b-dropdown-item(@click="removeStyles") Clear overrides
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

.group {
  position: relative;
  margin-bottom: 3rem;

  .group__header {
    display: flex;
    justify-content: space-between;
    border-bottom: 2px solid #b3b3b3;
    position: sticky;
    top: 0;
    backdrop-filter: blur(10px);
    padding: 0.5rem;
    z-index: 1;
  }
}

.buttons {
  display: flex;
}
</style>
