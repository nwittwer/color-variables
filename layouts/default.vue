<template lang="pug">
  div.container
    .content
      Nuxt
    .nav
      Sidebar
</template>

<script>
import Sidebar from "~/components/Sidebar.vue";

export default {
  components: {
    Sidebar
  }
};
</script>

<style>
html,
body {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.container {
  /* max-width: 1200px; */
  width: 100%;
  /* padding: 0 2rem; */
  margin: 0 auto;
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-template-areas:
    "content nav"
    "content nav";
}

.content {
  grid-area: content;
  padding: 0 2rem;
  max-width: 850px;
  margin: 0 auto;
}

.nav {
  grid-area: nav;
  position: sticky;
  height: 100vh;
  top: 0;
  overflow: auto;
  border-left: 1px solid var(--utility-divider);
  padding: 0 0.5rem;
}
</style>
