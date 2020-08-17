<template lang="pug">
  div
    div.sidebar()
      ColorModePicker
      b-tabs(v-model="activeTab")
        b-tab-item(label="Colors")
          h2 Color overrides
          ColorVariable
        b-tab-item(label="Elements")
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
