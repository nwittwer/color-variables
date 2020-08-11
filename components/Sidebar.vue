<template lang="pug">
  div
    h2 Themes
    ColorModePicker
    h2 Color overrides
    ColorVariable
</template>

<script>
import ColorModePicker from "~/components/overrides/ColorModePicker.vue";
import ColorVariable from "~/components/overrides/ColorVariable.vue";

export default {
  components: {
    ColorModePicker,
    ColorVariable
  }
};
</script>

<style lang="scss" scoped>
</style>