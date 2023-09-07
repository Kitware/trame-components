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
      () => props.cursor[props.active] || "default"
    );
    watch(activeCursor, updateCursor);

    onMounted(() => updateCursor(activeCursor));
    onBeforeUnmount(() => updateCursor("default"));

    return {
      activeCursor,
      updateCursor,
    };
  },
  template: '<div ref="elem" style="display: none"></div>',
};
