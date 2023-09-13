import MouseTrap from "mousetrap";
const { watch, onBeforeUnmount } = window.Vue;

export default {
  inject: ["trame"],
  props: {
    mapping: {
      type: Array,
      // [{ keys: ['ctrl+s'], stop: 1, event: 'save', listen: 'keypress'}]
    },
  },
  emits: [],
  setup(props, { emit, expose }) {
    const methods = {
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
    };

    function processMapping() {
      if (!props.mapping) {
        return;
      }
      MouseTrap.reset();
      props.mapping.forEach(({ keys, event, stop, listen }) => {
        MouseTrap.bind(
          keys,
          (e) => {
            emit(event, e);
            if (stop) {
              return false;
            }
          },
          listen
        );
      });
    }

    processMapping();

    watch(props.mapping, processMapping);

    onBeforeUnmount(() => {
      MouseTrap.reset();
    });

    expose(methods);
    return methods;
  },
};
