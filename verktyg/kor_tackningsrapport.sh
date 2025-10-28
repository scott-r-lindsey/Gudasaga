#!/usr/bin/env bash

set -euo pipefail

# Kör Vitest med täckning och skriver ut en file://-URL till HTML-rapporten.

skriptkatalog="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
rot="${skriptkatalog}/.."
appkatalog="${rot}/Gudasaga"
rapportkatalog="${appkatalog}/coverage"
htmlrapport="${rapportkatalog}/lcov-report/index.html"

cd "${appkatalog}"
npm run test:coverage

if [[ ! -f "${htmlrapport}" ]]; then
  echo "Kunde inte hitta täckningsrapport vid ${htmlrapport}" >&2
  exit 1
fi

printf 'file://%s\n' "${htmlrapport}"
