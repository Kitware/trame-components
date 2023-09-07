const { ref, watch, computed } = window.Vue;

const ORIENTATION = {
  top: "horizontal",
  bottom: "horizontal",
  left: "vertical",
  right: "vertical",
};

export default {
  props: {
    handleColor: {
      type: String,
      default: "#aaa",
    },
    handlePosition: {
      type: String,
      default: "top", // "top, left, right, bottom"
    },
    handleSize: {
      type: Number,
      default: 12,
    },
    location: {
      type: Array,
      default: () => [100, 50],
    },
    // v-cards props
    color: {
      type: String,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
    height: {
      type: [Number, String],
    },
    elevation: {
      type: [Number, String],
    },
    hover: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
    },
    light: {
      type: Boolean,
      default: false,
    },
    loaderHeight: {
      type: [Number, String],
      default: 4,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: [Number, String],
    },
    maxWidth: {
      type: [Number, String],
    },
    minHeight: {
      type: [Number, String],
    },
    minWidth: {
      type: [Number, String],
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    raised: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: false,
    },
    shaped: {
      type: Boolean,
      default: false,
    },
    tile: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
    },
  },
  setup(props) {
    const left = ref(props.location[0]);
    const top = ref(props.location[1]);
    let lastUpdate = null;
    let deltaX = 0;
    let deltaY = 0;
    let drag = false;

    function onMouseUp() {
      drag = false;
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousemove", onMouseMove);
    }

    function onMouseMove(e) {
      if (drag) {
        e.preventDefault();
        top.value = e.clientY + deltaY;
        left.value = e.clientX + deltaX;
      }
    }

    function onMouseDown(e) {
      deltaX = left.value - e.clientX;
      deltaY = top.value - e.clientY;
      drag = true;
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mousemove", onMouseMove);
    }

    watch(props.location, (pos) => {
      if (lastUpdate !== JSON.stringify(pos)) {
        [left.value, top.value] = pos;
        lastUpdate = JSON.stringify(pos);
      }
    });

    const positionStyle = computed(() => {
      return {
        zIndex: 100,
        position: "fixed",
        top: `${top.value}px`,
        left: `${left.value}px`,
      };
    });

    const handleStyle = computed(() => {
      const style = {
        position: "absolute",
        cursor: "grab",
        backgroundImage: `radial-gradient(${props.handleColor} 25%, transparent 20%), radial-gradient(${props.handleColor} 25%, transparent 20%)`,
        backgroundPosition: `-${props.handleSize / 12}px 0, ${
          props.handleSize / 6
        }px ${props.handleSize / 4}px`,
        backgroundSize: `${props.handleSize / 2}px ${props.handleSize / 2}px`,
        backgroundRepeat: `repeat, repeat-${
          props.handlePosition in ["top", "bottom"] ? "x" : "y"
        }`,
      };

      if (ORIENTATION[props.handlePosition] === "horizontal") {
        style.backgroundRepeat = "repeat, repeat-x";
        style.left = 0;
        style.width = `calc(100% - ${props.handleSize / 3}px)`;
        style.height = `${props.handleSize}px`;
        style.margin = `0 ${props.handleSize / 6}px`;
      } else {
        style.backgroundRepeat = "repeat, repeat-y";
        style.top = 0;
        style.height = `calc(100% - ${props.handleSize / 3}px)`;
        style.width = `${props.handleSize}px`;
        style.margin = `${props.handleSize / 6}px 0`;
      }

      if (props.handlePosition == "top") {
        style.top = 0;
      }
      if (props.handlePosition == "bottom") {
        style.bottom = 0;
      }
      if (props.handlePosition == "left") {
        style.left = 0;
      }
      if (props.handlePosition == "right") {
        style.right = 0;
      }

      return style;
    });

    return { left, top, positionStyle, handleStyle, onMouseDown };
  },
  template: `
    <v-card
      :style="positionStyle"
      :color="color"
      :dark="dark"
      :flat="flat"
      :height="height"
      :elevation="elevation"
      :hover="hover"
      :img="img"
      :light="light"
      :loaderHeight="loaderHeight"
      :loading="loading"
      :maxHeight="maxHeight"
      :maxWidth="maxWidth"
      :minHeight="minHeight"
      :minWidth="minWidth"
      :outlined="outlined"
      :raised="raised"
      :rounded="rounded"
      :shaped="shaped"
      :tile="tile"
      :width="width"
    >
      <div @mousedown="onMouseDown" :style="handleStyle" />
      <slot></slot>
    </v-card>
    `,
};
