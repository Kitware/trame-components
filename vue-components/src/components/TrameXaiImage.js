import XaiHeatMap from "./TrameXaiHeatMap";

const { ref, toRefs, reactive, computed, onBeforeUnmount, watch } = window.Vue;

export default {
  components: {
    XaiHeatMap,
  },
  emits: [
    "areaSelectionChange",
    "fullRange",
    "colorRange",
    "hover",
    "enter",
    "exit",
  ],
  props: {
    // Image handling
    src: {
      type: String,
    },
    maxHeight: {
      type: [String, Number],
    },
    maxWidth: {
      type: [String, Number],
    },
    width: {
      type: String,
    },
    // Areas handling (object detection)
    colors: {
      type: Array,
      default() {
        return ["#e1002a", "#417dc0", "#1d9a57", "#e9bc2f", "#9b3880"];
      },
    },
    areas: {
      type: Array,
    },
    areaKey: {
      type: String,
      default: "name",
    },
    areaStyle: {
      type: Object,
      default() {
        return {
          "stroke-width": 3,
          rx: 10,
        };
      },
    },
    areaSelected: {
      type: Array,
    },
    areaSelectedOpacity: {
      type: [Number, String],
    },
    areaOpacity: {
      type: [Number, String],
    },
    // Heatmap handling
    heatmaps: {
      type: Object,
    },
    heatmapOpacity: {
      type: [String, Number],
    },
    heatmapColorPreset: {
      type: [String, Object],
      default: "rainbow",
    },
    heatmapColorRange: {
      type: Array,
    },
    heatmapActive: {
      type: String,
    },
    heatmapColorMode: {
      type: String,
      default: "full",
    },
  },
  setup(props, { emit, expose }) {
    const image = new Image();
    const imageWidth = ref(0);
    const imageHeight = ref(0);
    const areaSelectedOpacityValue = ref(1);
    const areaOpacityValue = ref(1);
    const selectedAreas = reactive({});
    const containerStyle = reactive({ position: "relative" });
    const imageStyle = reactive({ position: "relative" });
    const annotationStyle = ref({ position: "absolute", top: 0, left: 0 });

    // Computed ---------------------------------------------------------------

    const decoratedAreas = computed(() => {
      props.areaSelected;
      const so = props.areaSelectedOpacity ?? areaSelectedOpacityValue.value;
      const o = props.areaOpacity ?? areaOpacityValue.value;
      return props.areas.map((item, idx) => ({
        ...item,
        opacity: isAreaSelected(idx) ? so : o,
        color: props.colors[idx % props.colors.length],
      }));
    });

    const activeHeatmap = computed(() => {
      return props.heatmaps && props.heatmaps[props.heatmapActive];
    });

    const heatMapStyle = computed(() => {
      return { ...annotationStyle.value, opacity: props.heatmapOpacity };
    });

    const shape = computed(() => [imageWidth.value, imageHeight.value]);

    // Methods ----------------------------------------------------------------

    function updateSizes() {
      console.log("updateSizes");
      imageStyle.height = "auto";
      imageStyle.width = "auto";
      const annotationStyleTmp = { ...annotationStyle.value };

      if (props.maxHeight) {
        imageStyle.maxHeight = `min(${props.maxHeight}px, ${
          imageHeight.value || props.maxHeight
        }px)`;
        annotationStyleTmp.maxHeight = `min(${props.maxHeight}px, ${
          imageHeight.value || props.maxHeight
        }px)`;
      } else {
        delete imageStyle.maxHeight;
        delete annotationStyleTmp.maxHeight;
      }

      if (props.maxWidth) {
        imageStyle.maxWidth = `min(${props.maxWidth}px, ${
          imageWidth.value || props.maxWidth
        }px)`;
        annotationStyleTmp.maxWidth = `min(${props.maxWidth}px, ${
          imageWidth.value || props.maxWidth
        }px)`;
      } else {
        imageStyle.maxWidth = "100%";
        annotationStyleTmp.maxWidth = "100%";
      }

      if (props.width) {
        containerStyle.width = props.width;
        imageStyle.width = props.width;
        annotationStyleTmp.width = props.width;
      } else {
        delete containerStyle.width;
        delete annotationStyleTmp.width;
      }

      annotationStyle.value = annotationStyleTmp;
    }

    function isAreaSelected(idx) {
      const selection = props.areas[idx][props.areaKey];
      if (!props.areaSelected) {
        return false;
      }
      return !!props.areaSelected.find((item) => selection == item);
    }

    function updateAreaSelection(idx, selected) {
      const selection = props.areas[idx];
      selectedAreas[selection[props.areaKey]] = selected;
      const array = [];
      for (let i = 0; i < props.areas.length; i++) {
        const key = props.areas[i][this.areaKey];
        if (selectedAreas[key]) {
          array.push(key);
        }
      }
      emit("areaSelectionChange", array);
    }

    function updateImageSize() {
      imageWidth.value = this.width;
      imageHeight.value = this.height;
    }

    // Watch ------------------------------------------------------------------
    watch(
      () => props.url,
      (url) => (image.src = url)
    );
    watch(() => props.maxWidth, updateSizes);
    watch(() => props.maxHeight, updateSizes);

    // Created ----------------------------------------------------------------

    image.addEventListener("load", updateImageSize);
    image.src = props.src;

    onBeforeUnmount(() => {
      image.removeEventListener("load", updateImageSize);
    });

    updateSizes();

    // Public API -------------------------------------------------------------

    expose({ updateAreaSelection });

    return {
      // props
      ...toRefs(props),
      // ref
      imageWidth,
      imageHeight,
      areaSelectedOpacityValue,
      areaOpacityValue,
      // reactive
      containerStyle,
      imageStyle,
      annotationStyle,
      selectedAreas,
      // computed
      decoratedAreas,
      activeHeatmap,
      heatMapStyle,
      shape,
      // methods
      emit,
    };
  },
  template: `
    <div :style="containerStyle">
      <img :src="src" :style="imageStyle" />
      <xai-heat-map
        :style="heatMapStyle"
        :heatmap="activeHeatmap"
        :shape="shape"
        :colorMode="heatmapColorMode"
        :colorRange="heatmapColorRange"
        :colorPreset="heatmapColorPreset"
        @fullRange="emit('fullRange', $event)"
        @colorRange="emit('colorRange', $event)"
        @hover="emit('hover', $event)"
        @enter="emit('enter')"
        @exit="emit('exit')"
      />
      <svg :style="annotationStyle" :viewBox="\`0 0 \${imageWidth} \${imageHeight}\`" xmlns="http://www.w3.org/2000/svg">
        <rect
          v-for="item, idx in decoratedAreas"
          :key="idx"
          :x="item.area[0]"
          :y="item.area[1]"
          :width="item.area[2]"
          :height="item.area[3]"
          :stroke="item.color"
          :opacity="item.opacity"
          fill="none"
          v-bind="areaStyle"
        />
      </svg>
    </div>`,
};
