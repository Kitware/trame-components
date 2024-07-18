import os

from trame.app import get_server

from trame.widgets import trame

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")

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

PATH_HIERARCHY = ["Home", "parent", "child"]


def on_click(e):
    print(e)


with SinglePageLayout(server) as layout:
    layout.title.set_text("List Browser")
    with layout.content:
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
