import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkColorMaps from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction/ColorMaps";

import { getPixels } from "../utils/canvasHelper";

const { ref, computed, onMounted, nextTick, watch } = window.Vue;

export default {
  props: {
    heatmap: {
      type: [
        Array,
        Float32Array,
        Float64Array,
        Uint8Array,
        Uint16Array,
        Uint32Array,
        Int8Array,
        Int16Array,
        Int32Array,
      ],
      default: () => [],
    },
    shape: {
      type: Array,
      default: () => [10, 10],
    },
    colorMode: {
      type: String,
      default: "full",
    },
    colorRange: {
      type: Array,
      default: () => [-1, 1],
    },
    colorPreset: {
      type: String,
      default: "erdc_rainbow_bright",
    },
  },
  emits: ["fullRange", "colorRange", "hover", "enter", "exit"],
  setup(props, { emit, expose }) {
    const canvasElem = ref(null);
    const containerBounds = ref(null);
    const lut = vtkColorTransferFunction.newInstance();
    lut.applyColorMap(vtkColorMaps.getPresetByName(props.colorPreset));

    const color = [0, 0, 0, 255];
    function toColor(v) {
      lut.getColor(v, color);
      color[0] *= 255;
      color[1] *= 255;
      color[2] *= 255;
      return color;
    }

    // Computed ---------------------------------------------------------------

    const width = computed(() => props.shape[0]);
    const height = computed(() => props.shape[1]);
    const fullRange = computed(() => {
      let min = props.heatmap[0];
      let max = props.heatmap[0];
      for (let i = 0; i < props.heatmap.length; i++) {
        const v = props.heatmap[i];
        if (min > v) {
          min = v;
        }
        if (max < v) {
          max = v;
        }
      }
      emit("fullRange", [min, max]);
      return [min, max];
    });
    const maxSymRange = computed(() => {
      const [min, max] = fullRange.value;
      const value = Math.max(-min, max);
      return [-value, value];
    });
    const minSymRange = computed(() => {
      const [min, max] = fullRange.value;
      const value = Math.min(-min, max);
      return [-value, value];
    });
    const positiveRange = computed(() => {
      const [, max] = fullRange.value;
      if (max < 0) {
        return [max, 0];
      }
      return [0, max];
    });
    const negativeRange = computed(() => {
      const [min] = fullRange.value;
      if (min > 0) {
        return [0, min];
      }
      return [min, 0];
    });
    const colorRanges = computed(() => {
      return {
        full: fullRange.value,
        maxSym: maxSymRange.value,
        minSym: minSymRange.value,
        positive: positiveRange.value,
        negative: negativeRange.value,
        custom: props.colorRange.map(Number),
      };
    });

    const colorRangeToUse = computed(() => {
      return colorRanges.value[props.colorMode] || fullRange.value;
    });

    // Methods ----------------------------------------------------------------

    function render() {
      const [min, max] = colorRangeToUse.value;
      if (!width.value || !height.value || !(max - min) || !props.heatmap) {
        return;
      }

      emit("colorRange", [min, max]);
      lut.setMappingRange(min, max);
      lut.updateRange();

      if (!width.value || !height.value) {
        return;
      }

      const rawPixels = getPixels(
        width.value,
        height.value,
        props.heatmap,
        toColor
      );
      const ctx = canvasElem.value.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, width.value, height.value);
      ctx.putImageData(rawPixels, 0, 0);
    }

    function deferedRender() {
      nextTick(render);
    }

    function onMouseMove(e) {
      const { clientX, clientY } = e;
      const { top, left, width: w, height: h } = containerBounds.value;
      const xNorm = (clientX - left) / w;
      const yNorm = 1 - (clientY - top) / h;
      const i = Math.round(xNorm * (width.value - 1));
      const j = Math.round(yNorm * (height.value - 1));
      emit("hover", { i, j });
    }

    function onMouseEnter() {
      emit("enter");
      containerBounds.value = canvasElem.value.getBoundingClientRect();
    }
    // Watch ------------------------------------------------------------------

    watch(() => colorRangeToUse.value, deferedRender);
    watch(() => props.shape, deferedRender);
    watch(() => props.heatmap, deferedRender);
    watch(
      () => props.colorPreset,
      (preset) => {
        lut.applyColorMap(vtkColorMaps.getPresetByName(preset));
        deferedRender();
      }
    );

    // LifeCycles -------------------------------------------------------------

    onMounted(deferedRender);

    // Public API -------------------------------------------------------------

    expose({ render });

    return {
      // ref
      canvasElem,
      // props
      width,
      height,
      fullRange,
      maxSymRange,
      minSymRange,
      positiveRange,
      negativeRange,
      colorRanges,
      colorRangeToUse,
      // methods
      onMouseMove,
      onMouseEnter,
      emit,
    };
  },
  template: `
    <canvas 
        ref="canvasElem" 
        :width="width" 
        :height="height"
        @mousemove="onMouseMove" 
        @mouseenter="onMouseEnter" 
        @mouseleave="emit('exit')"
    >
    </canvas>`,
};
