<template lang="pug">
  div.sidebar
    h2 Themes
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

<style lang="scss" scoped>
.sidebar {
  border-left: 1px solid #a0a0a0;
  color: #353535;
  background: #efefef;
}
</style>
