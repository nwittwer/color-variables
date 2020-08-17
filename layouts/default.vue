<template lang="pug">
    div.container(:class="{ 'container--with-sidebar':sidebarIsOpen }")
      transition(name="main")
        .content-container(v-show="sidebarIsOpen || !sidebarIsOpen")
          .sidebar-trigger(@click="toggleSidebar") {{ sidebarIsOpen ? "Hide colors" : "Show colors" }}
          .content
            Nuxt
      transition(name="side" mode="out-in")
        .nav-container(v-show="sidebarIsOpen")
          //- The innerds (CSS grid column) which is not animated
          .nav(:class="{ 'nav--is-open':sidebarIsOpen }")
            Sidebar
</template>

<script>
import Sidebar from "~/components/sidebar/Sidebar.vue";

export default {
  components: {
    Sidebar
  },
  data() {
    return {
      sidebarIsOpen: false // default
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarIsOpen = !this.sidebarIsOpen;
    }
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
  grid-template-columns: 1fr;
  grid-template-areas:
    "content"
    "content";
  transition: all 1s ease-out;

  // Show the sidebar element
  &.container--with-sidebar {
    grid-template-columns: 4fr minmax(350px, 1fr);
    grid-template-areas:
      "content nav"
      "content nav";
  }
}

.content-container {
  position: relative;
  width: 100%;
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
  text-overflow: ellipsis;
  width: 0;
  border-left: 1px solid #a0a0a0;
  color: #353535;
  background: #efefef;
  // transition: all 1s ease-out;

  &.nav--is-open {
    width: 100%;
    box-shadow: -20px 0 20px rgba(black, 0.15);
  }
}

.sidebar-trigger {
  // content: "";
  position: absolute;
  top: 25%;
  right: 1rem;
  color: white;
  background: #bd0000;
  // height: 2rem;
  // width: 4rem;
  padding: 0.75rem 1rem;
  text-align: center;
  z-index: 10;
  cursor: pointer;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.main-enter,
.main-leave-to {
  // visibility: hidden;
  // height: 0;
  // width: 0;
  // margin: 0;
  // padding: 0;
  // opacity: 0;
  // width: 100%;
  // transform: translateX(2rem);
}

.main-enter-active,
.main-leave-active {
  transition: all 250ms;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.side-enter,
.side-leave-to {
  // visibility: hidden;
  // height: 0;
  // width: 0;
  // margin: 0;
  // padding: 0;
  opacity: 0.5;
  // transform: translateX(2rem);
}

.side-enter-active,
.side-leave-active {
  transition: all 250ms;
}
</style>
