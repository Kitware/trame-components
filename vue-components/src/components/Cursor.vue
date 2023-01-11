<script>
export default {
  name: 'TrameCursor',
  props: {
    active: {
      type: Number,
      default: 0,
    },
    cursors: {
      type: Array,
      default: () => ['default', 'wait'],
    },
  },
  computed: {
    activeCursor() {
      return this.cursors[this.active] || 'default';
    },
  },
  watch: {
    activeCursor(name) {
      this.updateCursor(name);
    },
  },
  methods: {
    updateCursor(name) {
      if (this?.$el?.parentElement) {
        this.$el.parentElement.style.cursor = name;
      }
    },
  },
  mounted() {
    this.updateCursor(this.activeCursor);
  },
  beforeDestroy() {
    this.updateCursor('default');
  },
};
</script>
