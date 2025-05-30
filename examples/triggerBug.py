from trame.app import get_server
from trame.ui.html import DivLayout
from trame.widgets import client, html, trame


server = get_server(client_type="vue3")


def app_exit():
    print("App exited")


with DivLayout(server):
    a = client.ClientTriggers(exit=app_exit)
    b = trame.ClientTriggers(exit=app_exit)
    print(f"{a=}")
    print(f"{b=}")
    html.H1("App")

    # trame.ListBrowser()  # Uncommenting this line makes the `exit` event not trigger the callback

if __name__ == "__main__":

    server.start()
