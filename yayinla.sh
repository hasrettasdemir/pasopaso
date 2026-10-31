#!/bin/bash
# Uygulamanin son halini siteye (GitHub Pages) gonderir.
#   1. eksik sesleri uretir
#   2. sw.js surumunu bir artirir (telefonlar yeni hali alsin)
#   3. degisiklikleri GitHub'a gonderir; site 1-2 dakikada guncellenir
# Kullanim: ./yayinla.sh
set -e
cd "$(dirname "$0")"

python3 araclar/ses-uret.py

if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "Degisiklik yok, gonderilecek bir sey yok."
  exit 0
fi

eski=$(grep -o 'paso-v[0-9]*' sw.js | head -1)
yeni="paso-v$(( ${eski#paso-v} + 1 ))"
sed -i '' "s/$eski/$yeni/" sw.js
echo "Surum: $eski -> $yeni"

git add -A
git commit -q -m "Guncelleme $(date '+%Y-%m-%d %H:%M') ($yeni)"
git push -q
echo "Gonderildi. 1-2 dakika icinde https://hasrettasdemir.github.io/pasopaso/ guncellenir."
