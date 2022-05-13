export default {
  name: 'TrameListBrowser',
  props: {
    pathIcon: {
      type: String,
      default: 'mdi-folder-outline',
    },
    pathSelectedIcon: {
      type: String,
      default: 'mdi-folder',
    },
    filterIcon: {
      type: String,
      default: 'mdi-magnify',
    },
    filter: {
      type: Boolean,
      default: false,
    },
    path: {
      type: Array,
    },
    list: {
      type: Array,
    },
    filterQuery: {
      type: String,
    },
  },
  computed: {
    filterValues() {
      if (this.filterQuery) {
        return this.filterQuery.toLowerCase().split(' ');
      }
      return this.filterText.toLowerCase().split(' ');
    },
    activeFolderName() {
      return this.path.slice(this.activeFolderIndex)[0];
    },
  },
  data() {
    return {
      filterText: '',
      activeFolderIndex: -1,
    };
  },
  methods: {
    show(item) {
      if (!this.filterValues.length) {
        return true;
      }
      const txt = [item.text.toLowerCase(), item.type.toLowerCase()].join('  ');
      const tokens = this.filterValues;
      for (let i = 0; i < tokens.length; i++) {
        if (!txt.includes(tokens[i])) {
          return false;
        }
      }
      return true;
    },
    goToPath(index) {
      this.$emit('click', {
        type: 'path',
        value: this.path.slice(0, index + 1).join('/'),
      });
    },
    selectItem(index) {
      const item = this.list[index];
      this.$emit('click', {
        type: item.type || 'item',
        value: item.value || index,
      });
    },
    activatePath(index) {
      this.activeFolderIndex = index;
    },
    deactivatePath() {
      this.activeFolderIndex = -1;
    },
  },
};
