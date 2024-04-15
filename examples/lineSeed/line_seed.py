from pathlib import Path
from trame.app import get_server
from trame.ui.vuetify3 import SinglePageLayout
from trame.widgets import vuetify3, trame
from trame.assets.local import to_url

server = get_server()
IMAGE = str(Path(__file__).with_name("seeds.jpg").resolve())


def new_seed_points(p1, p2):
    print(f"{p1=}")
    print(f"{p2=}")


with SinglePageLayout(server, full_height=True) as layout:
    with layout.toolbar:
        vuetify3.VSpacer()
        vuetify3.VLabel("{{ width }}")
        vuetify3.VSlider(
            v_model=("width", 500),
            max=500,
            min=150,
            step=10,
            density="compact",
            hide_details=True,
        )
    with layout.content:
        with vuetify3.VContainer(classes="fill-height", fluid=True):
            trame.LineSeed(
                style=("`max-width: ${width}px;`",),
                image=to_url(IMAGE),
                point_1=("p1", [-0.5, 0, 0]),
                point_2=("p2", [-0.5, 0, 1.25]),
                bounds=("[-0.5, 1.80, -1.12, 1.11, -0.43, 1.79]",),
                update_seed=(new_seed_points, "[]", "$event"),
            )

server.start()
