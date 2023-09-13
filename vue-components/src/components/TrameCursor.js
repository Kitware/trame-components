const { ref, computed, watch, onMounted, onBeforeUnmount } = window.Vue;

export default {
  props: {
    active: {
      type: Number,
      default: 0,
    },
    cursors: {
      type: Array,
      default: () => ["default", "wait"],
    },
  },
  setup(props) {
    const elem = ref(null);
    function updateCursor(name) {
      if (elem.value?.parentElement) {
        elem.value.parentElement.style.cursor = name;
      }
    }

    const activeCursor = computed(
      () => props.cursors[props.active] || "default"
    );
    watch(() => activeCursor.value, updateCursor);

    onMounted(() => updateCursor(activeCursor.value));
    onBeforeUnmount(() => updateCursor("default"));

    return {
      elem,
      activeCursor,
      updateCursor,
    };
  },
  template: '<div ref="elem" style="display: none"></div>',
};
