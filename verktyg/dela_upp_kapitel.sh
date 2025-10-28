#!/usr/bin/env bash

set -euo pipefail

projektrot="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

txt_fil="${projektrot}/resurser/Fadernas Gudasaga berattad for - Viktor Rydberg.txt"
kapitel_katalog="${projektrot}/resurser/kapitel"

if [[ ! -f "${txt_fil}" ]]; then
  echo "Error: could not find text file at: ${txt_fil}" >&2
  exit 1
fi

mkdir -p "${kapitel_katalog}"
find "${kapitel_katalog}" -maxdepth 1 -type f -name 'kapitel_*.txt' -delete

awk -v outdir="${kapitel_katalog}" '
function set_out() { out=sprintf("%s/kapitel_%02d.txt", outdir, chap) }
BEGIN {
  chap = 0
  set_out()
  printf "" > out
}
{
  if ($0 ~ /^[0-9]+\.$/) {
    match($0, /^([0-9]+)\.$/, m)
    num = m[1] + 0
    if (num == chap + 1) {
      close(out)
      chap++
      set_out()
      print $0 > out
      next
    }
  }
  if (index($0, "MYTOLOGISK NAMNF") == 1) {
    close(out)
    chap++
    set_out()
    print $0 > out
    next
  }
  print $0 >> out
}
END {
  close(out)
}
' "${txt_fil}"

echo "Done: chapters written to ${kapitel_katalog}"
