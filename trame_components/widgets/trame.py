from trame_client.widgets.core import AbstractElement
from trame_components import module


class HtmlElement(AbstractElement):
    def __init__(self, _elem_name, children=None, **kwargs):
        super().__init__(_elem_name, children, **kwargs)
        if self.server:
            self.server.enable_module(module)


# -----------------------------------------------------------------------------
# TrameClientStateChange
# -----------------------------------------------------------------------------
class ClientStateChange(HtmlElement):
    def __init__(self, children=None, **kwargs):
        super().__init__("trame-client-state-change", children, **kwargs)
        self._attr_names += ["value"]
        self._event_names += ["change"]


# -----------------------------------------------------------------------------
# TrameClientTriggers
# -----------------------------------------------------------------------------
class ClientTriggers(HtmlElement):
    def __init__(self, ref="trame_triggers", children=None, **kwargs):
        self.__name = ref
        super().__init__("trame-client-triggers", children=None, ref=ref, **kwargs)
        self._attr_names += ["ref"]
        self._event_names += list(kwargs.keys())

    def call(self, method, *args):
        self.server.js_call(self.__name, "emit", method, *args)


# -----------------------------------------------------------------------------
# TrameLifeCycleMonitor
# -----------------------------------------------------------------------------
class LifeCycleMonitor(HtmlElement):
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
    def __init__(self, **kwargs):
        super().__init__("trame-mouse-trap", **kwargs)
        self._attributes["_trame_mapping"] = ':mapping="trame__mousetrap"'
        self._event_names += [*kwargs.keys()]

    def bind(self, keys, event_name, stop_propagation=False, listen_to=None):
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
