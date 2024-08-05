"""Example of using the Trame ListBrowser component."""

import os

from trame.app import get_server
from trame.widgets import trame
from trame.widgets import vuetify3 as v3

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue3")

if server.client_type == "vue2":
    from trame.ui.vuetify2 import SinglePageLayout
else:
    from trame.ui.vuetify3 import SinglePageLayout


FILE_LISTING = [
    {
        "text": "Hello.txt",
        "value": "hello.txt",
        "type": "File",
        "prependIcon": "mdi-file-document-outline",
    },
    {
        "text": "Many files *",
        "value": ["a.txt", "b.txt"],
        "type": "Group",
        "prependIcon": "mdi-file-document-multiple-outline",
    },
    {
        "text": "directory_name",
        "value": "directory_name",
        "type": "Directory",
        "prependIcon": "mdi-folder",
        "appendIcon": "mdi-chevron-right",
    },
]

FILLER_DATA = [
    {
        "text": f"File_{i}.txt",
        "value": f"file_{i}.txt",
        "type": "File",
        "prependIcon": "mdi-file-document-outline",
    }
    for i in range(40)
]

FILE_LISTING = FILE_LISTING + FILLER_DATA

PATH_HIERARCHY = ["Home", "parent", "child"]


def on_click(event: dict) -> None:
    """Trigger when a ListBrowser item is clicked."""
    print(event)


with SinglePageLayout(server) as layout:
    layout.title.set_text("List Browser")
    with layout.content:
        # Dummy container to give you an idea of how it'd look in a floating card
        with v3.VContainer(
            style=(
                "height:700px; width:50%; margin-left: auto; margin-right: auto; margin-top: 50px;"
                " border: 1px solid red;"
            ),
        ):
            trame.ListBrowser(
                classes="pa-8",
                location=("[100, 100]",),
                handle_position="bottom",
                filter=True,
                list=("listing", FILE_LISTING),
                path=("path", PATH_HIERARCHY),
                click=(on_click, "[$event]"),
                path_separator="/",
                show_path_with_icon=True,
            )

if __name__ == "__main__":
    server.start()
