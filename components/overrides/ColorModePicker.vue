<template lang="pug">
  div
    select(v-model="selected" @input="changed")
      option(disabled value="") Please select one
      option(v-for="color of colors" :key="color" :value="color") {{ color }}
</template>

<script>
export default {
  data() {
    return {
      selected: "system",
      colors: ["system", "edc-3", "epro-light", "epro-dark"]
    };
  },
  methods: {
    changed(event) {
      const val = event.target.value;
      this.selected = val;
      this.$colorMode.preference = val;
    }
  }
};
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  margin: 1rem auto;
}
</style>