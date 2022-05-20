from trame_client.widgets.core import AbstractElement
from trame_components import module

__all__ = [
    "ClientStateChange",
    "ClientTriggers",
    "LifeCycleMonitor",
    "MouseTrap",
    "SizeObserver",
    "FloatCard",
    "ListBrowser",
    "GitTree",
    "XaiHeatMap",
    "XaiImage",
]


class HtmlElement(AbstractElement):
    def __init__(self, _elem_name, children=None, **kwargs):
        super().__init__(_elem_name, children, **kwargs)
        if self.server:
            self.server.enable_module(module)


# -----------------------------------------------------------------------------
# TrameClientStateChange
# -----------------------------------------------------------------------------
class ClientStateChange(HtmlElement):
    """
    Allow the client side to trigger an event when a state element change.

    :param value: Name of the state variable to monitor
    :param change: Event triggered when state[value] change
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-client-state-change", children, **kwargs)
        self._attr_names += ["value"]
        self._event_names += ["change"]


# -----------------------------------------------------------------------------
# TrameClientTriggers
# -----------------------------------------------------------------------------
class ClientTriggers(HtmlElement):
    """
    Allow to trigger an event on the client side

    :param ref: Identifier for the client side DOM elem
    :param **kwargs: List of events to registers with their callbacks
    """

    def __init__(self, ref="trame_triggers", children=None, **kwargs):
        self.__name = ref
        super().__init__("trame-client-triggers", children=None, ref=ref, **kwargs)
        self._attr_names += ["ref"]
        self._event_names += list(kwargs.keys())

    def call(self, method, *args):
        """
        Perform the call on the client

        :param method: Key used in the kwargs at construction time
        """
        self.server.js_call(self.__name, "emit", method, *args)


# -----------------------------------------------------------------------------
# TrameLifeCycleMonitor
# -----------------------------------------------------------------------------
class LifeCycleMonitor(HtmlElement):
    """
    LifeCycleMonitor is a debug purpose tool to validate a sub-tree get the proper
    expected life cycle event.

    This component allow to print into the client side console when any of the
    monitored event happen.

    :param name: User specific text to easily identify which component the event
                was comming from.
    :param type: console[type](...) so you can use 'log', 'error', 'info', 'warn'
    :param value: Another value that is printed when an event occur
    :param events: List of events to monitor such as created, beforeMount,
        mounted, beforeUpdate, updated, beforeDestroy, destroyed
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-life-cycle-monitor", children, **kwargs)
        self._attr_names += [
            "name",
            "type",
            "value",
            "events",
        ]


# -----------------------------------------------------------------------------
# TrameMouseTrap
# -----------------------------------------------------------------------------
class MouseTrap(HtmlElement):
    """
    MouseTrap allow to capture client side event and bind them
    to server side trigger.

    :param **kwargs: The keys are meant to be assigned to events.

    .. code-block::

        widget = MouseTrap(Save=save_fn, Open=open_fn, Edit=edit_fn, Escape=exit_fn)

        widget.bind(["ctrl+s", "mod+s"], "Save", stop_propagation=True)
        widget.bind(["ctrl+o", "mod+o"], "Open", stop_propagation=True)
        widget.bind("mod+e", "Edit")
        widget.bind("esc", "Escape")

    """

    def __init__(self, **kwargs):
        super().__init__("trame-mouse-trap", **kwargs)
        self._attributes["_trame_mapping"] = ':mapping="trame__mousetrap"'
        self._event_names += [*kwargs.keys()]

    def bind(self, keys, event_name, stop_propagation=False, listen_to=None):
        """
        Create binding for key stroke to event name.
        """
        self._event_names += [event_name]
        entry = {
            "keys": keys,
            "event": event_name,
        }
        if stop_propagation:
            entry["stop"] = 1

        if listen_to:
            entry["listen"] = listen_to
        self.server.state.trame__mousetrap.append(entry)

    def reset(self):
        self.server.state.trame__mousetrap = []


# -----------------------------------------------------------------------------
# TrameSizeObserver
# -----------------------------------------------------------------------------
class SizeObserver(HtmlElement):
    """
    SizeObserver allow to monitor the space available in the UI and bind that
    information onto a state variable.

    :param _name: Name of the state variable to bound the component size to
    """

    def __init__(self, _name, **kwargs):
        super().__init__("trame-size-observer", name=_name, **kwargs)
        self._attr_names += [
            "name",
        ]
        self.server.state[_name] = None


# -----------------------------------------------------------------------------
# TrameFloatCard
# -----------------------------------------------------------------------------


class FloatCard(HtmlElement):
    """
    A |floatcard_vuetify_link| which floats above the application and can be moved freely from a handle

    .. |floatcard_vuetify_link| raw:: html

        <a href="https://vuetifyjs.com/api/v-card" target="_blank">vuetify VCard container</a>


    :param handle_color:
    :param handle_position:
    :param handle_size:
    :param location:

    Vuetify VCard attributes

    :param color:
    :param dark:
    :param flat:
    :param height:
    :param elevation:
    :param hover:
    :param img:
    :param light:
    :param loader_height:
    :param loading:
    :param max_height:
    :param max_width:
    :param min_height:
    :param min_width:
    :param outlined:
    :param raised:
    :param rounded:
    :param shaped:
    :param tile:
    :param width:
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-float-card", children, **kwargs)
        self._attr_names += [
            "handle_color",
            "handle_position",
            "handle_size",
            "location",
            "color",
            "dark",
            "flat",
            "height",
            "elevation",
            "hover",
            "img",
            "light",
            "loader_height",
            "loading",
            "max_height",
            "max_width",
            "min_height",
            "min_width",
            "outlined",
            "raised",
            "rounded",
            "shaped",
            "tile",
            "width",
        ]


# -----------------------------------------------------------------------------
# TrameListBrowser
# -----------------------------------------------------------------------------


class ListBrowser(HtmlElement):
    """
    A component that list items that be used for browsing directories or simple item picking

    :param list: List stored in state
    :param filter: Function to filter list
    :param path_icon:
    :param path_selected_icon:
    :param filter_icon:
    :param path:
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-list-browser", children, **kwargs)
        self._attr_names += [
            "path_icon",
            "path_selected_icon",
            "filter_icon",
            "filter",
            "path",
            "list",
            ("query", "filterQuery"),
        ]


# -----------------------------------------------------------------------------
# TrameGitTree
# -----------------------------------------------------------------------------


class GitTree(HtmlElement):
    """
    A component to present a Tree the same way Git does it (Like a subway map)

    :param sources: All of the elements of the tree
    :param actives: Any active elements of the tree

    Vuetify styling attributes

    :param active_background:
    :param delta_x:
    :param delta_y:
    :param font_size:
    :param margin:
    :param multiselect:
    :param offset:
    :param palette:
    :param radius:
    :param root_id:
    :param stroke:
    :param width:
    :param active_circle_stroke_color:
    :param not_visible_circle_fill_color:
    :param text_color:
    :param text_weight:
    :param action_map:
    :param action_size:

    Events

    :param actives_change:
    :param visibility_change:
    :param action:

    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-git-tree", children, **kwargs)
        self._attr_names += [
            "sources",
            "actives",
            "active_background",
            "delta_x",
            "delta_y",
            "font_size",
            "margin",
            "multiselect",
            "offset",
            "palette",
            "radius",
            "root_id",
            "stroke",
            "width",
            "active_circle_stroke_color",
            "not_visible_circle_fill_color",
            "text_color",
            "text_weight",
            "action_map",
            "action_size",
        ]
        self._event_names += [
            ("actives_change", "activesChange"),
            ("visibility_change", "visibilityChange"),
            "action",
        ]


# -----------------------------------------------------------------------------
# TrameXaiHeatMap
# -----------------------------------------------------------------------------


class XaiHeatMap(HtmlElement):
    """
    XaiHeatMap create a visual representation of a numerical array
    representing a 2D image.

    :param heatmap: Array to display
    :param shape: expect [width, height]
    :param color_mode: full, maxSym, minSym, positive, negative, custom (default: full)
    :param color_range: Range to be used when `color_mode="custom"`
    :param color_preset: Preset name from `vtk.js <https://github.com/Kitware/vtk-js/blob/master/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json>`_

    Events:

    :param hover: event triggered when moving over the map
    :param enter: event triggered when entring the map area
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-xai-heat-map", children, **kwargs)
        self._attr_names += [
            "heatmap",
            "shape",
            "color_mode",
            "color_range",
            "color_preset",
        ]
        self._event_names += [
            "hover",
            "enter",
        ]


# -----------------------------------------------------------------------------
# TrameXaiImage
# -----------------------------------------------------------------------------


class XaiImage(HtmlElement):
    """
    XaiImage show an image with a XaiHeatMap as overlay

    :param src: URL to the image to display
    :param max_height: Limit the size of the image vertically
    :param max_width: Limit the size of the image horizontally
    :param width: If present use as style.width = "..."
    :param colors: Palette to use for areas
    :param areas: (optional) Array containing bounding box info
    :param area_key: (optional) Key in the area[i][key] that id the area
    :param area_style: (optional) css style to apply (default: { stroke-width: 3, rx: 10 })
    :param area_selected: (optional) Array of area ids
    :param area_selected_opacity: Opacity to use for selected areas 0-1
    :param area_opacity: Opacity to use for all areas 0-1
    :param heatmaps: Dict of arrays
    :param heatmap_opacity: Opacity of the heatmap overlay
    :param heatmap_color_preset: Preset name from `vtk.js <https://github.com/Kitware/vtk-js/blob/master/Sources/Rendering/Core/ColorTransferFunction/ColorMaps.json>`_
    :param heatmap_color_range: Range to be used when `heatmap_color_mode="custom"`
    :param heatmap_active: Key in heatmaps to select
    :param heatmap_color_mode: full, maxSym, minSym, positive, negative, custom (default: full)

    Events:

    :param hover: event triggered when moving over the map
    :param enter: event triggered when entring the map area
    """

    def __init__(self, children=None, **kwargs):
        super().__init__("trame-xai-image", children, **kwargs)
        self._attr_names += [
            "src",
            "max_height",
            "max_width",
            "width",
            "colors",
            "areas",
            "area_key",
            "area_style",
            "area_selected",
            "area_selected_opacity",
            "area_opacity",
            "heatmaps",
            "heatmap_opacity",
            "heatmap_color_preset",
            "heatmap_color_range",
            "heatmap_active",
            "heatmap_color_mode",
        ]
        self._event_names += [
            ("area_selection_change", "areaSelectionChange"),
            ("color_range", "colorRange"),
            "hover",
            "enter",
        ]
