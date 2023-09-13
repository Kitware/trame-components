import os
import random
from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import trame, html

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

state = server.state
state.full_range = [0, 1]
state.current_range = [0, 1]
state.hover = None
state.inside = False

PRESETS = [
    "erdc_rainbow_bright",
    "Cool to Warm",
    "Rainbow Desaturated",
    "Black-Body Radiation",
]

COLOR_MODES = ["full", "maxSym", "minSym", "positive", "negative", "custom"]


def generate_heatmap(shape):
    heat_map = []
    for j in range(shape[1]):
        for i in range(shape[0]):
            heat_map.append(random.random() * 1.5 - 0.5)

    return heat_map


heat_map_shape = [100, 50]
heat_map = generate_heatmap(heat_map_shape)


with DivLayout(server) as layout:
    trame.XaiHeatMap(
        # props
        heatmap=("heatmap_data", heat_map),
        shape=("heatmap_shape", heat_map_shape),
        color_mode=("heatmap_mode",),
        color_range=("heatmap_custom_range", [0, 1]),
        color_preset=("heatmap_color_preset",),
        # events
        hover="hover = $event",
        enter="inside = 1",
        exit="inside = 0",
        full_range_change="full_range = $event",
        color_range_change="current_range = $event",
        # html
        style="height: 300px;",
    )
    html.Div("Full Range: {{ full_range }}")
    html.Div("Current Range: {{ current_range }}")
    html.Div("Hover: {{ hover }}")
    html.Div("Inside: {{ inside }}")
    with html.Select(v_model=("heatmap_mode", COLOR_MODES[0])):
        for name in COLOR_MODES:
            html.Option(name)

    with html.Select(v_model=("heatmap_color_preset", PRESETS[0])):
        for name in PRESETS:
            html.Option(name)


if __name__ == "__main__":
    server.start()
