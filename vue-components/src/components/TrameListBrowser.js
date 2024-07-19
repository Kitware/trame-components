const { ref, computed, version } = window.Vue;

const ICON_ATTR = version[0] === "2" ? "v-text" : ":icon";
const LIST_ITEM =
  version[0] === "2"
    ? `
  <v-list-item-icon v-if="item.prependIcon">
      <v-icon v-text="item.prependIcon"/>
  </v-list-item-icon>
  <v-list-item-content>
      <v-list-item-title v-text="item.text" />
  </v-list-item-content>
  <v-list-item-icon v-if="item.appendIcon">
      <v-icon v-text="item.appendIcon"/>
  </v-list-item-icon>
`
    : `
  <template v-slot:prepend v-if="item.prependIcon">
    <v-icon :icon="item.prependIcon"></v-icon>
  </template>
  <v-list-item-title v-text="item.text"></v-list-item-title>
  <template v-slot:append v-if="item.appendIcon">
    <v-icon :icon="item.appendIcon"></v-icon>
  </template>
`;
const QUERY =
  version[0] === "2"
    ? `<v-text-field
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
      />`
    : `<v-text-field
          name="filter-algo"
          v-model="filterText"
          label="Filter"
          clearable
          class="mx-3"
          :prepend-inner-icon="filterIcon"
          dense="compact"
          filled
          single-line
          variant="outlined"
          hide-details
      />`;

export default {
  props: {
    showPathWithIcon: {
      type: Boolean,
      default: false
    },
    pathIcon: {
      type: String,
      default: "mdi-folder-outline",
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    // showIcon, showPathWithIcon, separ
    pathSelectedIcon: {
      type: String,
      default: "mdi-folder",
    },
    pathSeparator: {
      type: String,
      default: ">",
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
    stickyHeader: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const filterText = ref("");
    const activeFolderIndex = ref(-1);
    const stickyHeaderStyle = ref({
      position: "sticky",
      width: "100%",
      zIndex: 999,
    });

    const filterValues = computed(() => {
      if (props.filterQuery) {
        return props.filterQuery.toLowerCase().split(" ");
      }
      if (!filterText.value) {
        return [];
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
      stickyHeaderStyle,
      ...methods,
    };
  },

  template: `
      <v-col style="padding: 0 !important; height: 100%; display: flex; flex-direction: column;">
        <v-sheet :style=" stickyHeader ? stickyHeaderStyle : {}">
          <v-divider v-if="path" class="mb-3" />
          <v-row v-if="path" class="mx-2 py-2 rounded-0 align-center">
              <div v-for="item, idx in path" :key="idx" class="d-flex" >
                  <span v-if="idx">&nbsp; {{ pathSeparator }} &nbsp;</span>
                  <div
                      @click="goToPath(idx)"
                      @mouseenter="activatePath(idx)"
                      @mouseleave="deactivatePath">
                      <v-icon
                          v-if="showIcon"
                          class="mx-1"
                          ${ICON_ATTR}="activeFolderIndex === idx ? pathSelectedIcon : pathIcon"
                      />
                      <span v-if="showPathWithIcon"
                          :style="{ textDecoration: activeFolderIndex === idx ? 'underline' : 'none'}">
                          {{path[idx]}}
                      </span>
                  </div>
              </div>
              <div v-if="!showPathWithIcon"class="text-truncate text-body-2 pl-1">{{ activeFolderName }}</div>
          </v-row>
          <v-divider v-if="path" class="mt-3" />
          <v-row v-if="filter" class="px-2 py-0 ma-0" :class="{ 'mt-3': path }">
              ${QUERY}
          </v-row>
        </v-sheet>
        <v-list dense v-if="list" class="overflow-y-auto" fill-height>
            <v-list-item
                v-for="(item, i) in list"
                :key="i"
                @click="selectItem(i)"
                v-show="show(item)"
            >
              ${LIST_ITEM}
            </v-list-item>
        </v-list>
      </v-col>
    `,
};
