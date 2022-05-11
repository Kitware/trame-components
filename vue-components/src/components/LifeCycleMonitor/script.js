export default {
  name: 'TrameLifeCycleMonitor',
  props: {
    name: {
      type: String,
      default: 'TrameLifeCycleMonitor',
    },
    type: {
      type: String,
      default: 'log',
    },
    value: {
      type: String,
      default: 'value',
    },
    events: {
      type: Array,
      default: () => [
        'created',
        'beforeMount',
        'mounted',
        'beforeUpdate',
        'updated',
        'beforeDestroy',
        'destroyed',
      ],
    },
  },
  created() {
    if (this.events.includes('created')) {
      console[this.type](this.name, `created(${this._uid})`, this.value);
    }
  },
  beforeMount() {
    if (this.events.includes('beforeMount')) {
      console[this.type](this.name, `beforeMount(${this._uid})`, this.value);
    }
  },
  mounted() {
    if (this.events.includes('mounted')) {
      console[this.type](this.name, `mounted(${this._uid})`, this.value);
    }
  },
  beforeUpdate() {
    if (this.events.includes('beforeUpdate')) {
      console[this.type](this.name, `beforeUpdate(${this._uid})`, this.value);
    }
  },
  updated() {
    if (this.events.includes('updated')) {
      console[this.type](this.name, `updated(${this._uid})`, this.value);
    }
  },
  beforeDestroy() {
    if (this.events.includes('beforeDestroy')) {
      console[this.type](this.name, `beforeDestroy(${this._uid})`, this.value);
    }
  },
  destroyed() {
    if (this.events.includes('destroyed')) {
      console[this.type](this.name, `destroyed(${this._uid})`, this.value);
    }
  },
};
