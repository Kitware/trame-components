export default {
  name: 'TrameSizeObserver',
  props: {
    name: {
      type: String,
    },
  },
  created() {
    this.observer = new ResizeObserver(() => {
      if (!this.$el) {
        return;
      }
      const size = this.$el.getBoundingClientRect();
      const pixelRatio = window.devicePixelRatio;
      const dpi = 96 * pixelRatio;
      const event = { size, pixelRatio, dpi };
      if (this.name) {
        event.name = this.name;
      }

      if (this.trame) {
        this.trame.state.set(this.name, event);
      }

      this.$emit('change', event);
    });
  },
  mounted() {
    this.observer.observe(this.$el);
  },
  beforeUnmount() {
    this.observer.unobserve(this.$el);
  },
  inject: ['trame'],
};
