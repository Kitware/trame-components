import os
from trame.app import get_server
from trame.widgets import trame, html
from trame.ui.html import DivLayout

# -----------------------------------------------------------------------------
# Trame setup
# -----------------------------------------------------------------------------

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

state = server.state

CURSORS = [
    "auto",
    "default",
    "none",
    "context-menu",
    "help",
    "pointer",
    "progress",
    "wait",
    "cell",
    "crosshair",
    "text",
    "vertical-text",
    "alias",
    "copy",
    "move",
    "no-drop",
    "not-allowed",
    "grab",
    "grabbing",
    "e-resize",
    "n-resize",
    "ne-resize",
    "nw-resize",
    "s-resize",
    "se-resize",
    "sw-resize",
    "w-resize",
    "ew-resize",
    "ns-resize",
    "nesw-resize",
    "nwse-resize",
    "col-resize",
    "row-resize",
    "all-scroll",
    "zoom-in",
    "zoom-out",
]

# -----------------------------------------------------------------------------
# UI setup
# -----------------------------------------------------------------------------

NB_REGIONS = 5

with DivLayout(server) as layout:
    html.Input(
        type="range",
        min=0,
        max=len(CURSORS) - NB_REGIONS - 1,
        v_model_number=("active", 0),
    )

    with html.Div(
        style="display: flex; flex-direction: row; flex-wrap: wrap; justify-content: space-around;"
    ):
        for i in range(NB_REGIONS):
            with html.Div(
                f"{{{{ options[active + {i}] }}}}",
                style="width: 150px; height: 150px; border: solid 1px #333;",
            ):
                trame.Cursor(
                    active=(f"active + {i}",),
                    cursors=("options", CURSORS),
                )

# -----------------------------------------------------------------------------
# start server
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    server.start()
