import os
from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import trame, html

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

selection = ["2"]
tree = [
    {"id": "1", "parent": "0", "visible": 0, "name": "Wavelet"},
    {"id": "2", "parent": "1", "visible": 0, "name": "Clip"},
    {"id": "3", "parent": "1", "visible": 1, "name": "Slice"},
    {"id": "4", "parent": "2", "visible": 1, "name": "Slice 2"},
]


def on_visibility_change(event):
    node_id = event.get("id")
    visible = 1 if event.get("visible", 0) else 0
    for node in tree:
        if node.get("id") == node_id:
            node["visible"] = visible
    server.state.dirty("tree")


def on_active_change(event):
    server.state.selection = event


with DivLayout(server) as layout:
    layout.root.style = "height: 100vh; width: 100%; padding: 0; margin: 0;"
    with html.Div(style="display: flex;"):
        html.Button("Toggle", click="show = !show")
        html.Button("Clear active", click="selection = []")
        html.Div("Selection {{ selection }}", style="margin: 5px 10px;")
        html.Div(
            "Visible {{ tree.filter(({ visible }) => visible).map(({ id }) => id) }}",
            style="margin: 5px 10px;",
        )

    with html.Div(style="display: flex;"):
        trame.GitTree(
            sources=("tree", tree),
            actives=("selection", selection),
            visibility_change=(on_visibility_change, "[$event]"),
            actives_change=(on_active_change, "[$event]"),
        )
        trame.GitTree(
            v_if=("show", True),
            sources=("tree", tree),
            actives=("selection", selection),
        )


if __name__ == "__main__":
    server.start()
