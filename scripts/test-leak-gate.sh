#!/usr/bin/env bash
# Checks the one piece of logic in sync-obsidian.ts that matters: the leak gate.
# Run: scripts/test-leak-gate.sh
#
# The fixtures are GENERATED from the vault's denylist at runtime, never committed here.
# This repo is public -- a test file containing real private project names would leak
# exactly what the gate exists to prevent.
set -euo pipefail
cd "$(dirname "$0")/.."

VAULT="${OBSIDIAN_VAULT:-$HOME/Projects/Nordorn}"
LIST="$VAULT/scripts/private-names.json"
[ -f "$LIST" ] || { echo "FAIL: no denylist at $LIST"; exit 1; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/vault/scripts" "$TMP/vault/notes" "$TMP/out"
cp "$LIST" "$TMP/vault/scripts/"

# Pull one real pattern from the denylist and strip regex syntax to get a literal.
SECRET="$(python3 -c "
import json,re,sys
d=json.load(open('$LIST'))
print(re.sub(r'\\\\\\\\b|\\[.*?\\]','-',d['ventures']['any'][0]))")"

cat > "$TMP/vault/notes/clean.md" <<EOF
---
title: Clean Fixture
visibility: public
---
Written under the author's own byline, which must NOT trip the gate.
EOF

cat > "$TMP/vault/notes/leaky.md" <<EOF
---
title: Leaky Fixture
visibility: public
---
This note mentions $SECRET and must never be published.
EOF

run() { OBSIDIAN_VAULT="$TMP/vault" PORTFOLIO_POSTS="$TMP/out" \
        PORTFOLIO_ASSETS="$TMP/out" npx tsx scripts/sync-obsidian.ts 2>&1; }

out="$(run)"
echo "$out" | grep -q "BLOCKED 1 post" || { echo "FAIL: leaky note was not blocked"; echo "$out"; exit 1; }
[ ! -f "$TMP/out/leaky-fixture.mdx" ]  || { echo "FAIL: leaky note was WRITTEN"; exit 1; }
[   -f "$TMP/out/clean-fixture.mdx" ]  || { echo "FAIL: clean note was not published"; echo "$out"; exit 1; }

# Fail closed: no denylist must mean publish nothing, never publish everything.
rm "$TMP/vault/scripts/private-names.json"
if run >/dev/null 2>&1; then echo "FAIL: synced with no denylist present"; exit 1; fi

echo "PASS: leak gate blocks private names, passes the byline, and fails closed."
