<template lang="pug">
  div.color-picker-container
    div.form-group
      div {{ props.name }}
      div.picker
        span.color-preview(@click.stop="togglePicker" :style="`background: ${colorValue}`")
        chrome-picker(v-show="pickerIsOpen" ref="domElement" v-model="colorValue" @input="updateValue")
      input(type="text" class="form-control" v-model="colorValue")
</template>

<script>
import { Chrome } from "vue-color";
import { ref, watch, onMounted } from "@nuxtjs/composition-api";

export default {
  // Example: https://codepen.io/peiman/pen/drXmxm
  components: {
    "chrome-picker": Chrome
  },
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: "#000000"
    }
  },
  setup(props, { emit }) {
    const colorValue = ref(props.value);
    const pickerIsOpen = ref(false);
    const domElement = ref(null);

    // Update the props
    function setProps() {
      colorValue.value = props.value;
    }

    // Set initial value
    onMounted(() => {
      setProps();
    });

    // Update value if props change
    watch(() => props.value, () => setProps());

    // Notify parent when the color value is changed
    watch(colorValue, () =>
      emit("change", {
        key: props.name,
        value: colorValue.value
      })
    );

    // Watch for click outside
    function documentClick(e) {
      const { $el: el } = domElement.value;
      const target = e.target;

      if (el !== target && !el.contains(target)) {
        hidePicker(); // Hide
      }
    }

    const showPicker = () => {
      pickerIsOpen.value = true;
      document.addEventListener("click", documentClick);
    };

    const hidePicker = () => {
      pickerIsOpen.value = false;
      document.removeEventListener("click", documentClick);
    };

    const togglePicker = () => {
      pickerIsOpen.value ? hidePicker() : showPicker();
    };

    return {
      props,
      colorValue,
      pickerIsOpen,
      domElement,
      showPicker,
      hidePicker,
      togglePicker,
      updateValue: val => {
        const { hex } = val;
        colorValue.value = hex;
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.color-picker-container {
  margin: 1rem auto;
}

.form-group {
  display: inline-flex;

  input {
    width: 4rem;
  }
}

.picker {
  position: relative;

  .color-preview {
    cursor: pointer;
    display: inline-block;
    height: 1.5rem;
    width: 1.5rem;
    margin: 0 0.5rem;
    border-radius: 100%;
    border: 1px solid rgba(black, 0.2);
  }

  .vc-chrome {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
  }
}
</style>