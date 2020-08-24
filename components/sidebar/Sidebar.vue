<template lang="pug">
  div
    div.sidebar()
      ColorModePicker
      b-tabs(v-model="activeTab")
        b-tab-item(label="Tokens")
          ColorVariable
        b-tab-item(label="Implementations")
          DomElements
</template>

<script>
import ColorModePicker from "./overrides/ColorModePicker.vue";
import ColorVariable from "./overrides/ColorVariable.vue";
import DomElements from "./elements/index.vue";

export default {
  components: {
    ColorModePicker,
    ColorVariable,
    DomElements
  },
  data() {
    return {
      activeTab: 0
    };
  }
};
</script>

<style lang="scss" scoped></style>
