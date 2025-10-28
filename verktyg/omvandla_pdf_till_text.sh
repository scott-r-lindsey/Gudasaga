#!/usr/bin/env bash

set -euo pipefail

# Bestäm projektets rotkatalog baserat på skriptets placering.
projektrot="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

pdf_fil="${projektrot}/resurser/Fadernas Gudasaga berattad for - Viktor Rydberg.pdf"
txt_fil="${projektrot}/resurser/Fadernas Gudasaga berattad for - Viktor Rydberg.txt"

if ! command -v pdftotext >/dev/null 2>&1; then
  echo "Fel: verktyget 'pdftotext' saknas. Installera paketet 'poppler-utils'." >&2
  exit 1
fi

if [[ ! -f "${pdf_fil}" ]]; then
  echo "Fel: kunde inte hitta PDF-filen: ${pdf_fil}" >&2
  exit 1
fi

pdftotext -nopgbrk "${pdf_fil}" "${txt_fil}"

echo "Klar: text sparad i ${txt_fil}"
