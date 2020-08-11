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

<!-- NOTE: The below is NOT scoped! -->
<style lang="scss">
:root {
  --color: #243746;
  --color-primary: #158876;
  --color-secondary: #0e2233;
  --bg: #f3f5f4;
  --bg-secondary: #fff;
  --border-color: #ddd;
}

// Using Nuxt's color-mode module
// It always appends "-mode"
// https://nuxtjs.org/blog/going-dark-with-nuxtjs-color-mode/#how-does-it-work

.edc-3-mode {
  --color: #ebf4f1;
  --color-primary: #41b38a;
  --color-secondary: #fdf9f3;
  --bg: #091a28;
  --bg-secondary: #071521;
  --border-color: #0d2538;
}

.epro-dark-mode {
  --color: #ebf4f1;
  --color-primary: #41b38a;
  --color-secondary: #fdf9f3;
  --bg: #091a28;
  --bg-secondary: #071521;
  --border-color: #0d2538;
}

.epro-light-mode {
  --color: #433422;
  --color-secondary: #504231;
  --bg: #f1e7d0;
  --bg-secondary: #eae0c9;
  --border-color: #ded0bf;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-seriff;
  line-height: 1.5;
  background-color: var(--bg);
  color: var(--color);
  transition: background-color 0.3s;
}

a {
  color: var(--color-primary);
}
</style>

<style lang="scss" scoped>
li {
  cursor: pointer;
  margin: 1rem auto;
}
</style>
