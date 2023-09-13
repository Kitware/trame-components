import os
from trame.app import get_server
from trame.widgets import trame, html
from trame.ui.html import DivLayout

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")


def a_changed():
    print(f"a={server.state.a}")


with DivLayout(server) as layout:
    html.Div("{{ a }}")
    html.Input(type="range", v_model=("a", 1))
    trame.ClientStateChange(value="a", change=a_changed)


if __name__ == "__main__":
    server.start()
