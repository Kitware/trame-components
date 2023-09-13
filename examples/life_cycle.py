import os
from trame.app import get_server
from trame.widgets import trame, html
from trame.ui.html import DivLayout

server = get_server()
server.client_type = os.environ.get("VUE_VERSION", "vue2")
print(f"Using {server.client_type}")

state = server.state
global_layout = None

state.a = 1
state.last_event = None


def add():
    state.a += 1


def add_div():
    with global_layout:
        html.Div("Hello")


with DivLayout(server) as layout:
    global_layout = layout
    layout.root.add_child(
        "a={{ a }} - LifeCycle {{ last_event }}<br> template_ts={{ tts }} <br> "
    )
    html.Button("a+", click="a+=1")
    html.Button("set(a+)", click="set('a', a+1)")
    html.Button("server", click=add)
    html.Button("modify layout", click=add_div)
    trame.LifeCycleMonitor(
        type="emit",
        created="last_event += 'created '",
        before_mount="last_event += 'beforeMount '",
        mounted="last_event += 'mounted '",
        before_update="last_event += 'beforeUpdate' ",
        updated="last_event += 'updated '",
        before_destroy="last_event += 'beforeDestroy '",
        destroyed="last_event += 'destroyed '",
    )


if __name__ == "__main__":
    server.start()
