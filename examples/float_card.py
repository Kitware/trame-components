import os
from trame.app import get_server
from trame.widgets import trame

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

if server.client_type == "vue2":
    from trame.ui.vuetify2 import SinglePageLayout
else:
    from trame.ui.vuetify3 import SinglePageLayout

with SinglePageLayout(server) as layout:
    layout.title.set_text("FloatCard Demo")

    with layout.content:
        trame.FloatCard(
            "Drag the handle to move me anywhere",
            classes="pa-8",
            location=("[100, 100]",),
            handle_position="bottom",
        )

if __name__ == "__main__":
    server.start()
