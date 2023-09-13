const { ref, toRefs, watch, computed, onMounted } = window.Vue;

// Generic global methods -----------------------------------------------------

function sortById(a, b) {
  return Number(a.id) - Number(b.id);
}

function generateModel(list, rootId) {
  const model = {
    // Temporary structures
    tree: { [rootId]: [] },
    map: {},
    leaves: [],

    // Helper variables
    rootId,
    y: 0,

    // Results
    nodes: [],
    forks: [],
    branches: [],
    actives: [],
  };

  list.forEach((el) => {
    // Make sure we don't share the same reference
    // with the outside world.
    const node = Object.assign({}, el);

    // Register node as a child of its parent
    if (!{}.hasOwnProperty.call(model.tree, node.parent)) {
      model.tree[node.parent] = [node];
    } else {
      model.tree[node.parent].push(node);
    }

    // Register node to easily find it later by its 'id'
    model.map[node.id] = node;
  });

  // Sort the children of the root
  model.tree[rootId].sort(sortById);

  // All set for the processing
  return model;
}

/* eslint-disable no-param-reassign */
function assignNodePosition(model, node, x) {
  // Get children if any
  const children = model.tree[node.id];

  // Expand node with position information
  node.x = x;
  node.y = model.y;
  model.y += 1;

  // Register node in the list
  model.nodes.push(node);

  // Process children
  if (!children || children.length === 0) {
    // This node is a leaf, keep track of it for future processing
    model.leaves.push(node);
  } else {
    // Guaranty unique branching order logic
    children.sort(sortById);

    // Move down the tree with the most right side of the tree
    children.forEach((child, index) => {
      assignNodePosition(model, child, x + children.length - (index + 1));
    });
  }
}

function extractBranchesAndForks(model, leaf) {
  const { x, y } = leaf;
  const { rootId, map, branches, forks } = model;
  const branch = { x, y };
  let currentNode = leaf;

  // Move currentNode to the top before fork while stretching the branch
  while (
    currentNode.parent !== rootId &&
    map[currentNode.parent].x === branch.x
  ) {
    if (!branch.color) {
      branch.color = currentNode.color;
    }
    currentNode = map[currentNode.parent];
    branch.to = currentNode.y;
  }

  // Do we really have a new branch?
  if (typeof branch.to !== "undefined" && branch.to !== branch.y) {
    branches.push(branch);
  }

  // Do we have a fork?
  if (currentNode.parent !== rootId) {
    forks.push({
      x: map[currentNode.parent].x,
      y: map[currentNode.parent].y,
      toX: currentNode.x,
      toY: currentNode.y,
      color: currentNode.color,
    });
  }
}

function fillActives(model, activeIds = []) {
  const { nodes, actives } = model;

  // Fill the actives list with the position instead of ids
  nodes.forEach((node) => {
    if (activeIds.indexOf(node.id) !== -1) {
      actives.push(node.y);
    }
  });
}

function processData(list, activeIds = [], rootIdRef = "0") {
  const model = generateModel(list, rootIdRef);
  const { tree, leaves, rootId } = model;
  const { nodes, branches, forks, actives } = model;

  // Assign each node position starting from the root
  tree[rootId].forEach((rootNode) => assignNodePosition(model, rootNode, 0));

  // Update active list
  fillActives(model, activeIds);

  // Create branches and forks starting from the leaves
  leaves.forEach((leaf) => extractBranchesAndForks(model, leaf));

  // Sort forks for better rendering
  forks.sort((a, b) => a.toX > b.toX);

  // Save computed structure to state
  return { nodes, branches, forks, actives, leaves };
}

function toAction(y, maxX, lineSize, iconSize, actions) {
  const yOffset = 0.5 * (Number(lineSize) - Number(iconSize));
  return (name, idx) => ({
    name,
    x: maxX - 1.1 * iconSize * (idx + 1),
    y: Number(y) + yOffset,
    size: iconSize,
    href: actions[name],
  });
}

// ----------------------------------------------------------------------------

export default {
  props: {
    sources: {
      type: Array,
      default: () => [],
    },
    actives: {
      type: Array,
      default: () => [],
    },
    activeBackground: {
      type: String,
      default: "#757575",
    },
    deltaX: {
      type: Number,
      default: 20,
    },
    deltaY: {
      type: Number,
      default: 30,
    },
    fontSize: {
      type: Number,
      default: 16,
    },
    margin: {
      type: Number,
      default: 3,
    },
    multiselect: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Number,
      default: 15,
    },
    palette: {
      type: Array,
      default: () => ["#e1002a", "#417dc0", "#1d9a57", "#e9bc2f", "#9b3880"],
    },
    radius: {
      type: Number,
      default: 6,
    },
    rootId: {
      type: String,
      default: "0",
    },
    stroke: {
      type: Number,
      default: 3,
    },
    width: {
      type: Number,
      default: 500,
    },
    activeCircleStrokeColor: {
      type: String,
      default: "black", // if 'null', the branch color will be used
    },
    notVisibleCircleFillColor: {
      type: String,
      default: "white", // if 'null', the branch color will be used
    },
    textColor: {
      type: Array,
      default: () => ["black", "white"], // Normal, Active
    },
    textWeight: {
      type: Array,
      default: () => ["normal", "bold"], // Normal, Active
    },
    actionMap: {
      type: Object,
    },
    actionSize: {
      type: [String, Number],
      default: 25,
    },
  },
  emits: ["activesChange", "visibilityChange", "action"],
  setup(props, { emit, expose }) {
    const elem = ref(null);
    const nodes = ref([]);
    const branches = ref([]);
    const forks = ref([]);
    const activesToRender = ref([]);

    function update() {
      const {
        nodes: n,
        branches: b,
        forks: f,
        actives: a,
      } = processData(props.sources, props.actives, props.rootId);
      nodes.value = n;
      branches.value = b;
      forks.value = f;
      activesToRender.value = a;
    }

    function toggleActive(event) {
      const { actives, deltaY, multiselect } = props;
      const newActive = actives.slice();

      if (event.target.nodeName !== "circle") {
        const size = elem.value.getClientRects()[0];

        // Firefox vs Chrome/Safari// Firefox vs Chrome/Safari
        const originTop = size.y || size.top;
        const yVal = Math.floor((event.clientY - originTop) / deltaY);
        const index = actives.indexOf(yVal);

        // command key for osx, control key for windows
        if (multiselect && (event.metaKey || event.ctrlKey)) {
          if (index === -1) {
            newActive.push(yVal);
          } else {
            newActive.splice(index, 1);
          }
          activesToRender.value = newActive;
          emit(
            "activesChange",
            activesToRender.value.map((i) => nodes.value[i].id)
          );
        } else {
          newActive[0] = yVal;
          activesToRender.value = newActive;
          emit(
            "activesChange",
            activesToRender.value.map((i) => nodes.value[i].id)
          );
        }
      }
    }

    function toggleVisibility(event) {
      const yVal = parseInt(event.currentTarget.dataset.id, 10);
      const node = Object.assign({}, nodes.value[yVal]);

      node.visible = !node.visible;
      nodes.value = nodes.value.map((n, i) => (i === yVal ? node : n));

      emit("visibilityChange", { id: node.id, visible: node.visible });
    }

    function triggerAction(event) {
      const yVal = parseInt(event.currentTarget.dataset.id, 10);
      const action = event.currentTarget.dataset.name;
      const { id } = nodes.value[yVal];
      emit("action", { id, action });
    }

    watch(() => props.sources, update);
    watch(() => props.actives, update);

    const branchesToRender = computed(() => {
      return branches.value.map((branch, index) => {
        const x1 = props.deltaX * branch.x + props.offset;
        const y1 = props.deltaY * branch.y + props.deltaY / 2;
        const y2 = props.deltaY * branch.to + props.deltaY / 2;
        const strokeColor =
          branch.color || props.palette[branch.x % props.palette.length];

        return {
          key: `branch-${index}`,
          d: `M${x1},${y1} L${x1},${y2}`,
          stroke: strokeColor,
        };
      });
    });
    const forksToRender = computed(() => {
      return forks.value.map((fork, index) => {
        const x1 = props.deltaX * fork.x + props.offset;
        const y1 = props.deltaY * fork.y + props.deltaY / 2 + props.radius;
        const x2 = props.deltaX * fork.toX + props.offset;
        const y2 = props.deltaY * fork.toY + props.deltaY / 2 + props.radius;
        const strokeColor =
          fork.color || props.palette[fork.toX % props.palette.length];
        const dPath =
          `M${x1},${y1} ` +
          `Q${x1},${y1 + props.deltaY / 3},${(x1 + x2) / 2},${
            y1 + props.deltaY / 3
          } ` +
          `T${x2},${y1 + props.deltaY} L${x2},${y2}`;

        return {
          key: `fork-${index}`,
          d: dPath,
          stroke: strokeColor,
        };
      });
    });

    const nodesToRender = computed(() => {
      return nodes.value.map((node, index) => {
        const isActive = activesToRender.value.includes(index);
        const isVisible = !!node.visible;
        const branchColor =
          node.color || props.palette[node.x % props.palette.length];

        // Styles
        const currentTextColor = props.textColor[isActive ? 1 : 0];
        const weight = props.textWeight[isActive ? 1 : 0];
        const strokeColor = isActive
          ? props.activeCircleStrokeColor
          : branchColor || branchColor;
        const fillColor = isVisible
          ? branchColor
          : props.notVisibleCircleFillColor || branchColor;

        // Positions
        const cx = props.deltaX * node.x + props.offset;
        const cy = props.deltaY * node.y + props.deltaY / 2;
        const tx = cx + props.radius * 2;
        const ty = cy + (props.radius - 1);

        // Actions
        const actions = (node.actions || []).map(
          toAction(
            props.deltaY * node.y,
            props.width,
            props.deltaY,
            props.actionSize,
            props.actionMap
          )
        );

        return {
          key: `node-${index}`,
          id: node.y,
          circle: {
            cx,
            cy,
            radius: props.radius,
            stroke: strokeColor,
            fill: fillColor,
          },
          text: {
            x: tx,
            y: ty,
            fill: currentTextColor,
            fontWeight: weight,
            fontSize: props.fontSize,
            content: node.name,
          },
          actions,
        };
      });
    });

    onMounted(update);

    expose({
      toggleActive,
      toggleVisibility,
      triggerAction,
    });

    return {
      elem,
      ...toRefs(props),
      nodes,
      branches,
      forks,
      activesToRender,
      branchesToRender,
      forksToRender,
      nodesToRender,
      toggleActive,
      toggleVisibility,
      triggerAction,
    };
  },
  template: `
    <svg
    :width="width"
    :height="deltaY * nodes.length"
    v-on:click="toggleActive"
    ref="elem"
  >
    <!-- active nodes [fill BG line] -->
    <rect
      v-for="(activeIdx, idx) in activesToRender"
      :key="idx"
      :data-id="nodes[activeIdx].id"
      :y="activeIdx * deltaY + margin / 2"
      :height="deltaY - margin"
      x="-50"
      width="1000"
      :fill="activeBackground"
    />
  
    <!-- branches [vertical lines] -->
    <path
      v-for="(branch, idx) in branchesToRender"
      :key="branch.key"
      :d="branch.d"
      :stroke="branch.stroke"
      :stroke-width="stroke"
    />
  
    <!-- forks [curvy connection] -->
    <path
      v-for="(fork, idx) in forksToRender"
      :key="fork.key"
      :d="fork.d"
      :stroke="fork.stroke"
      :stroke-width="stroke"
      fill="transparent"
    />
  
    <!-- nodes [circles] -->
    <g
      v-for="(node, idx) in nodesToRender"
      :key="node.key"
      style="cursor: pointer"
    >
      <circle
        :data-id="node.id"
        :cx="node.circle.cx"
        :cy="node.circle.cy"
        :r="node.circle.radius"
        :stroke="node.circle.stroke"
        :fill="node.circle.fill"
  
        :stroke-width="stroke"
  
        v-on:click="toggleVisibility"
      />
      <text
        style="font-family: sans-serif; background-color: transparent;"
        :data-id="node.id"
        :x="node.text.x"
        :y="node.text.y"
        :fill="node.text.fill"
        :font-weight="node.text.fontWeight"
  
        :font-size="fontSize"
      >
        {{node.text.content}}
      </text>
      <image
  
        v-for="(action, idx) in node.actions"
        :key="action.name"
  
        :data-id="node.id"
        :data-name="action.name"
  
        :x="action.x"
        :y="action.y"
        :width="action.size"
        :height="action.size"
        :href="action.href"
        preserveAspectRatio="xMidYMid meet"
        @click="triggerAction"
      />
    </g>
  </svg>  
    `,
};
