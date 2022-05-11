import MouseTrap from 'mousetrap';

export default {
  name: 'TrameMouseTrap',
  inject: ['trame'],
  props: {
    mapping: {
      type: Array,
      // [{ keys: ['ctrl+s'], stop: 1, event: 'save', listen: 'keypress'}]
    },
  },
  created() {
    this.processMapping();
  },
  beforeDestroy() {
    MouseTrap.reset();
  },
  watch: {
    mapping() {
      this.processMapping();
    },
  },
  methods: {
    processMapping() {
      if (!this.mapping) {
        return;
      }
      MouseTrap.reset();
      this.mapping.forEach(({ keys, event, stop, listen }) => {
        MouseTrap.bind(
          keys,
          (e) => {
            this.$emit(event, e);
            if (stop) {
              return false;
            }
          },
          listen
        );
      });
    },
    bind(...args) {
      MouseTrap.bind(...args);
    },
    unbind(keys) {
      MouseTrap.unbind(keys);
    },
    trigger(keys) {
      MouseTrap.trigger(keys);
    },
    addKeycodes(...args) {
      MouseTrap.trigger(...args);
    },
  },
};
