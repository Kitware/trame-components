export default {
  name: 'TrameClientStateChange',
  props: {
    value: {
      type: String,
    },
    immediate: {
      type: Boolean,
      default: false,
    },
    triggerChangeOnCreate: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(current) {
      if (this.immediate) {
        this.$emit('change', current);
      } else {
        this.$nextTick(() => {
          this.$emit('change', current);
        });
      }
    },
  },
  created() {
    if (this.triggerChangeOnCreate) {
      this.$emit('change', this.value);
    }
  },
};
