from pathlib import Path

# Compute local path to serve
serve_path = str(Path(__file__).with_name("serve").resolve())

# Serve directory for JS/CSS files
serve = {"__trame_components": serve_path}

# List of JS files to load (usually from the serve path above)
scripts = ["__trame_components/trame-components.umd.min.js"]
styles = ["__trame_components/trame-components.css"]

# List of Vue plugins to install/load
vue_use = ["trame_components"]
