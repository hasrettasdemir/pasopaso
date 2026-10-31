#!/bin/bash
# Uygulamayi bilgisayarda acar: http://localhost:8765
set -u
cd "$(dirname "$0")"
echo "Tarayicida ac: http://localhost:8765  (durdurmak icin Ctrl+C)"
python3 -m http.server 8765
