const { ref, computed, watch, unref, toRefs, onMounted, onBeforeUnmount } =
  window.Vue;

export default {
  props: {
    point1: {
      type: Array,
      default() {
        return [0, 0, 0];
      },
    },
    point2: {
      type: Array,
      default() {
        return [0, 0, 0];
      },
    },
    numberOfSteps: {
      type: Number,
      default: 255,
    },
    bounds: {
      type: Array,
      default() {
        return [-1, 1, -1, 1, -1, 1];
      },
    },
    image: {
      default: null,
    },
    nbSliders: {
      type: Number,
      default: 0,
    },
  },
  emit: ["update-seed"],
  setup(props, { emit }) {
    let dragging = 0;
    let lastEvent = null;
    let lastPoint = null;

    const svgContainer = ref(null);
    const normalDelta = ref([0, 0]);
    const scaling2d = ref(1);
    const radius = ref(10);
    const p1 = ref([0, 0]);
    const p2 = ref([0, 0]);
    const userInput = ref(false);
    const x1 = ref(props.point1[0]);
    const y1 = ref(props.point1[1]);
    const z1 = ref(props.point1[2]);
    const x2 = ref(props.point2[0]);
    const y2 = ref(props.point2[1]);
    const z2 = ref(props.point2[2]);

    const pointColor2 = computed(() =>
      unref(props.nbSliders) == 2 ? "#4CAF50" : "#2196F3"
    );
    const step = computed(
      () => (props.bounds[5] - props.bounds[4]) / props.numberOfSteps
    );
    // const xScaling = computed(() => (props.bounds[1] - props.bounds[0]) / 500);
    const yScaling = computed(() => (props.bounds[3] - props.bounds[2]) / 500);
    const zScaling = computed(() => (props.bounds[5] - props.bounds[4]) / 500);

    function update2DPoints() {
      p1.value = [
        500 - (unref(y1) - props.bounds[2]) / unref(yScaling),
        500 - (unref(z1) - props.bounds[4]) / unref(zScaling),
      ];
      p2.value = [
        500 - (unref(y2) - props.bounds[2]) / unref(yScaling),
        500 - (unref(z2) - props.bounds[4]) / unref(zScaling),
      ];
    }

    function pushLineSeed() {
      if (!unref(userInput)) {
        return;
      }
      const xSelected = props.nbSliders == 1 ? x1 : x2;
      emit("update-seed", {
        p1: [unref(x1), unref(y1), unref(z1)],
        p2: [unref(xSelected), unref(y2), unref(z2)],
      });
    }

    function onMouseMove(e) {
      if (!unref(userInput)) {
        userInput.value = true;
      }
      if (dragging) {
        const dx = lastEvent.clientX - e.clientX;
        const dy = lastEvent.clientY - e.clientY;
        switch (dragging) {
          case 1:
            p1.value = [
              lastPoint[0] - unref(scaling2d) * dx,
              lastPoint[1] - unref(scaling2d) * dy,
            ];
            y1.value = (500 - unref(p1)[0]) * unref(yScaling) + props.bounds[2];
            z1.value = (500 - unref(p1)[1]) * unref(zScaling) + props.bounds[4];
            break;
          case 2:
            p2.value = [
              lastPoint[0] - unref(scaling2d) * dx,
              lastPoint[1] - unref(scaling2d) * dy,
            ];
            y2.value = (500 - unref(p2)[0]) * unref(yScaling) + props.bounds[2];
            z2.value = (500 - unref(p2)[1]) * unref(zScaling) + props.bounds[4];
            break;
          case 3:
            p1.value = [
              lastPoint[0][0] - unref(scaling2d) * dx,
              lastPoint[0][1] - unref(scaling2d) * dy,
            ];
            y1.value = (500 - unref(p1)[0]) * unref(yScaling) + props.bounds[2];
            z1.value = (500 - unref(p1)[1]) * unref(zScaling) + props.bounds[4];
            p2.value = [
              lastPoint[1][0] - unref(scaling2d) * dx,
              lastPoint[1][1] - unref(scaling2d) * dy,
            ];
            y2.value = (500 - unref(p2)[0]) * unref(yScaling) + props.bounds[2];
            z2.value = (500 - unref(p2)[1]) * unref(zScaling) + props.bounds[4];
            break;
          default:
            break;
        }

        // Compute delta for line offset connection in svg
        const vect = [unref(p1)[0] - unref(p2)[0], unref(p1)[1] - unref(p2)[1]];
        const norm = Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1]);
        if (norm > 0.0001) {
          vect[0] /= norm;
          vect[1] /= norm;
        }
        normalDelta.value = vect;

        pushLineSeed();
      }
    }

    function onMousePress(pointIdx, e) {
      dragging = pointIdx;
      lastEvent = e;
      switch (pointIdx) {
        case 1:
          lastPoint = unref(p1).slice();
          break;
        case 2:
          lastPoint = unref(p2).slice();
          break;
        case 3:
          lastPoint = [unref(p1).slice(), unref(p2).slice()];
          break;
        default:
          break;
      }
    }

    function onMouseRelease() {
      dragging = 0;
    }

    function onResize() {
      scaling2d.value = 500 / unref(svgContainer).getBoundingClientRect().width;
    }
    const resizeObserver = new ResizeObserver(onResize);
    onMounted(() => {
      console.log("svgContainer", unref(svgContainer));
      resizeObserver.observe(unref(svgContainer));
    });
    onBeforeUnmount(() => resizeObserver.disconnect());

    watch(
      () => props.point1,
      (v) => {
        [x1.value, y1.value, z1.value] = v;
        update2DPoints();
      }
    );
    watch(
      () => props.point2,
      (v) => {
        [x2.value, y2.value, z2.value] = v;
        update2DPoints();
      }
    );
    watch(() => props.nbSliders, pushLineSeed);

    update2DPoints();
    const { image } = toRefs(props);
    return {
      svgContainer,
      onMouseMove,
      onMousePress,
      onMouseRelease,
      normalDelta,
      radius,
      p1,
      p2,
      x1,
      x2,
      step,
      pointColor2,
      pushLineSeed,
      image,
    };
  },

  template: `<v-col class="mt-2">
  <svg viewBox="0 0 500 500"
    ref="svgContainer"
    width="100%"
    @mousemove="onMouseMove"
    @mouseup="onMouseRelease"
  >
    <image
      :href="image"
      x="0"
      y="0"
      width="500"
      height="500"
    />
    <line
      :x1="p1[0] - normalDelta[0] * radius"
      :y1="p1[1] - normalDelta[1] * radius"
      :x2="p2[0] + normalDelta[0] * radius"
      :y2="p2[1] + normalDelta[1] * radius"
      style="cursor: grab;stroke: rgba(0,0,0,0.25);stroke-width:8"
      @mousedown="onMousePress(3, $event)"
    />
    <circle
      :cx="p2[0]"
      :cy="p2[1]"
      :r="radius"
      :stroke="pointColor2"
      stroke-width="8"
      fill="rgba(0,0,0,0)"
      @mousedown="onMousePress(2, $event)"
      style="cursor: pointer;"
    />
    <circle
      :cx="p1[0]"
      :cy="p1[1]"
      r="10"
      stroke="#2196F3"
      stroke-width="8"
      fill="rgba(0,0,0,0)"
      @mousedown="onMousePress(1, $event)"
      style="cursor: pointer;"
    />
  </svg>
  <v-col class="pt-0">
    <v-row>
        <v-slider 
            v-show="nbSliders > 1"
            v-model="x2" 
            track-color="green" 
            color="green" 
            density="compact" 
            hide-details 
            @update:modelValue="pushLineSeed" 
            :min="bounds[0]" 
            :max="bounds[1]" 
            :step="step" 
        />
    </v-row>
    <v-row>
        <v-slider 
            v-show="nbSliders > 0"
            v-model="x1" 
            track-color="blue" 
            color="blue" 
            density="compact"  
            hide-details 
            @update:modelValue="pushLineSeed"
            :min="bounds[0]" 
            :max="bounds[1]" 
            :step="step" 
        />
    </v-row>
  </v-col>
</v-col>
`,
};
