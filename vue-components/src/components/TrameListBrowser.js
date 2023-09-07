const { ref, computed } = window.Vue;

export default {
  props: {
    pathIcon: {
      type: String,
      default: "mdi-folder-outline",
    },
    pathSelectedIcon: {
      type: String,
      default: "mdi-folder",
    },
    filterIcon: {
      type: String,
      default: "mdi-magnify",
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
  emits: ["click"],
  setup(props, { emit }) {
    const filterText = ref("");
    const activeFolderIndex = ref(-1);

    const filterValues = computed(() => {
      if (props.filterQuery) {
        return props.filterQuery.toLowerCase().split(" ");
      }
      return filterText.value.toLowerCase().split(" ");
    });

    const activeFolderName = computed(() => {
      return props.path.slice(activeFolderIndex.value)[0];
    });

    const methods = {
      show(item) {
        if (!filterValues.value.length) {
          return true;
        }
        const txt = [item.text.toLowerCase(), item.type.toLowerCase()].join(
          "  "
        );
        const tokens = filterValues.value;
        for (let i = 0; i < tokens.length; i++) {
          if (!txt.includes(tokens[i])) {
            return false;
          }
        }
        return true;
      },
      goToPath(index) {
        emit("click", {
          type: "path",
          value: props.path.slice(0, index + 1).join("/"),
        });
      },
      selectItem(index) {
        const item = props.list[index];
        emit("click", {
          type: item.type || "item",
          value: item.value || index,
        });
      },
      activatePath(index) {
        activeFolderIndex.value = index;
      },
      deactivatePath() {
        activeFolderIndex.value = -1;
      },
    };

    return {
      filterText,
      activeFolderIndex,
      filterValues,
      activeFolderName,
      ...methods,
    };
  },
  template: `
    <v-col class="pa-0">
        <v-divider v-if="path" class="mb-3" />
        <v-row v-if="path" class="mx-2 py-2 rounded-0">
            <div v-for="item, idx in path" :key="idx" class="d-flex">
                <span v-if="idx">></span>
                <v-icon
                    class="mx-1"
                    v-text="activeFolderIndex === idx ? pathSelectedIcon : pathIcon"
                    @click="goToPath(idx)"
                    @mouseenter="activatePath(idx)"
                    @mouseleave="deactivatePath"
                />
            </div>
            <div class="text-truncate text-body-2 pl-1">{{ activeFolderName }}</div>
        </v-row>
        <v-divider v-if="path" class="mt-3" />
        <v-row v-if="filter" class="px-2 py-0 ma-0" :class="{ 'mt-3': path }">
            <v-text-field
                name="filter-algo"
                v-model="filterText"
                label="Filter"
                clearable
                class="mx-3"
                :prepend-inner-icon="filterIcon"
                dense
                filled
                rounded
                single-line
                hide-details
                outlined
            />
        </v-row>
        <v-list dense v-if="list" class="overflow-y-auto" fill-height>
            <v-list-item
                v-for="(item, i) in list"
                :key="i"
                @click="selectItem(i)"
                v-show="show(item)"
            >
                <v-list-item-icon v-if="item.prependIcon">
                    <v-icon v-text="item.prependIcon"/>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title v-text="item.text" />
                </v-list-item-content>
                <v-list-item-icon v-if="item.appendIcon">
                    <v-icon v-text="item.appendIcon"/>
                </v-list-item-icon>
            </v-list-item>
        </v-list>
    </v-col>
    `,
};
