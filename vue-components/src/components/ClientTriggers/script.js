export default {
  name: 'TrameClientTriggers',
  methods: {
    emit(topic, event) {
      this.$emit(topic, event);
    },
  },
  created() {
    this.emit('created');
  },
  mounted() {
    this.emit('mounted');
  },
  beforeDestroy() {
    this.emit('beforeDestroy');
    this.emit('beforeUnmount');
  },
};
