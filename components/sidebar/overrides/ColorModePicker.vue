<template lang="pug">
  div.header
    span Theme 
    b-select(v-model="selected" @input="changed")
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
    changed(newValue) {
      this.selected = newValue;
      this.$colorMode.preference = newValue;
    }
  },
  mounted() {
    this.selected = this.$colorMode.preference;
  }
};
</script>

<style lang="scss" scoped>
li {
  cursor: pointer;
  margin: 1rem auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;

  & > * {
    margin-left: 1rem;
  }
}
</style>
