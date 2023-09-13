import os
from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import trame, html

# -----------------------------------------------------------------------------
# Trame app
# -----------------------------------------------------------------------------

server = get_server()
state = server.state
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

state.last_action = ""
state.action_count = 1


def save():
    print("Save")
    state.action_count += 1
    state.last_action = "Save"


def open():
    print("Open")
    state.action_count += 1
    state.last_action = "Open"


def edit():
    print("Edit")
    state.action_count += 1
    state.last_action = "Edit"


def esc():
    print("Escape")
    state.action_count += 1
    state.last_action = "Escape"


# -----------------------------------------------------------------------------
# UI setup
# -----------------------------------------------------------------------------
with DivLayout(server):
    mt = trame.MouseTrap(
        Save=save,
        Open=open,
        Edit=edit,
        Escape=esc,
    )
    html.Div("{{ last_action }} #{{action_count}}")


# Do binding after
mt.bind(["ctrl+s", "mod+s"], "Save", stop_propagation=True)
mt.bind(["ctrl+o", "mod+o"], "Open", stop_propagation=True)
mt.bind("mod+e", "Edit")
mt.bind("esc", "Escape")

# -----------------------------------------------------------------------------
# start server
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    server.start()
