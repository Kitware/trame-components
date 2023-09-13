import os
import random
from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import trame, html

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
state = server.state

print(f"Using {server.client_type}")

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


heat_maps = {
    "41": generate_heatmap([800, 600]),
    "74": generate_heatmap([800, 600]),
    "76": generate_heatmap([800, 600]),
}

IMAGE_IDS = [
    "41",
    "74",
    "76",
]

AREAS = [
    {
        "name": "cat",
        "area": [10, 20, 200, 300],
    },
    {
        "name": "dog",
        "area": [220, 20, 200, 300],
    },
    {
        "name": "under",
        "area": [10, 340, 420, 50],
    },
]


with DivLayout(server) as layout:
    layout.root.style = "height: 100vh; width: 100%; padding: 0; margin: 0;"

    with html.Select(v_model=("image_id", IMAGE_IDS[0])):
        for name in IMAGE_IDS:
            html.Option(name)

    html.Div("Full Range: {{ full_range }}")
    html.Div("Current Range: {{ current_range }}")
    html.Div("Hover: {{ hover }}")
    html.Div("Inside: {{ inside }}")
    html.Input(
        type="range", v_model_number=("heatmap_opacity", 0.2), min=0, max=1, step=0.01
    )
    html.Input(
        type="range", v_model_number=("max_height", 300), min=250, max=800, step=50
    )
    with html.Select(v_model=("heatmap_mode", COLOR_MODES[0])):
        for name in COLOR_MODES:
            html.Option(name)

    with html.Select(v_model=("heatmap_color_preset", PRESETS[0])):
        for name in PRESETS:
            html.Option(name)
    with html.Select(
        multiple=True, v_model=("selected_areas", [item.get("name") for item in AREAS])
    ):
        for item in AREAS:
            html.Option(item.get("name"))

    trame.XaiImage(
        src=("`https://picsum.photos/id/${image_id}/800/600`",),
        areas=("available_areas", AREAS),
        area_selected=("selected_areas", []),
        area_opacity=0.25,
        area_selected_opacity=1,
        max_height=("max_height",),
        area_style=("{ 'stroke-width': 3, rx: 10 }",),
        # props
        heatmaps=("heatmap_data", heat_maps),
        heatmap_opacity=("heatmap_opacity",),
        heatmap_active=("image_id",),
        heatmap_color_mode=("heatmap_mode",),
        heatmap_color_range=("heatmap_custom_range", [0, 1]),
        heatmap_color_preset=("heatmap_color_preset",),
        # events
        hover="hover = $event",
        enter="inside = 1",
        exit="inside = 0",
        full_range_change="full_range = $event",
        color_range_change="current_range = $event",
    )


if __name__ == "__main__":
    server.start()
