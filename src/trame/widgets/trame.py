from trame_components.widgets.trame import *  # noqa: F403


def initialize(server):
    from trame_components import module

    server.enable_module(module)
