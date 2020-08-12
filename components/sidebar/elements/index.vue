<template lang="pug">
  div
    h2 hi {{ elements }}
    div(v-for="(element, index) in elements" :key="index")
      div {{ element }}
</template>

<script>
// import { ref, onMounted } from "@nuxtjs/composition-api";
import useColors from "~/compositions/useColors.js";

export default {
  setup(props, context) {
    const { elements } = useColors();
    console.log(elements);
    return { elements };
  }
};
</script>

<style lang="scss" scoped></style>
