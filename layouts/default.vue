<template lang="pug">
  div.container
    .content
      Nuxt
    .nav
      Sidebar
</template>

<script>
import Sidebar from "~/components/sidebar/Sidebar.vue";

export default {
  components: {
    Sidebar
  }
};
</script>

<style lang="scss">
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
  border: none;
  overflow: hidden;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

.container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 4fr minmax(350px, 1fr);
  grid-template-areas:
    "content nav"
    "content nav";
}

.content {
  grid-area: content;
  max-width: 100%;
  padding: 0 2rem;
  height: 100vh;
  overflow: auto;

  & > * {
    margin: 0 auto;
    max-width: 850px;
    overflow: hidden;
  }
}

.nav {
  grid-area: nav;
  position: sticky;
  height: 100vh;
  top: 0;
  overflow: auto;
  border-left: 1px solid #a0a0a0;
  padding: 0 0.5rem;
  text-overflow: ellipsis;
}
</style>
