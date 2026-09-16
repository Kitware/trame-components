from pathlib import Path
from trame_components import __version__


# Compute local path to serve
serve_path = str(Path(__file__).with_name("serve").resolve())

# Serve directory for JS/CSS files
serve = {f"__trame_components_{__version__}": serve_path}

# List of JS files to load (usually from the serve path above)
scripts = [f"__trame_components_{__version__}/trame-components.umd.js"]

# List of Vue plugins to install/load
vue_use = ["trame_components"]
