#!/bin/bash
# AIDLC Status Line for Claude Code
# Visualizes workflow status from the manifest file.
# Shows main phase progress and active unit status (incremental mode).
#
# Install:
#   1. Copy to .claude/aidlc-statusline.sh
#   2. chmod +x .claude/aidlc-statusline.sh
#   3. Add to .claude/settings.local.json:
#      { "statusLine": { "type": "command", "command": ".claude/aidlc-statusline.sh" } }
#
# Output:
#   Simple:       Phases: context ✓ → requirements ✓ → [design] → tasks → implement
#   Incremental:  Phases: context ✓ → requirements ✓ → decomposition ✓ → foundation ✓ | auth: [implement] · payments: [design] · notif: ○

input=$(cat)
DIR=$(echo "$input" | jq -r '.workspace.current_dir // .cwd')

# Find manifest
MANIFEST=$(find "$DIR/.aidlc/workflow" -name "aidlc-manifest.yaml" 2>/dev/null | head -1)

if [ -z "$MANIFEST" ]; then
    exit 0
fi

# Colors
GREEN='\033[32m'
YELLOW='\033[1;33m'
DIM='\033[2m'
CYAN='\033[36m'
RESET='\033[0m'

# --- Parse sharedPhases ---
PHASES_RAW=""
IN_PHASES=false
while IFS= read -r line; do
    if echo "$line" | grep -q "sharedPhases:"; then
        INLINE=$(echo "$line" | sed -n 's/.*sharedPhases: *\[//p' | sed 's/\].*//')
        if echo "$line" | grep -q '\[\]'; then
            PHASES_RAW=""
            break
        fi
        if [ -n "$INLINE" ]; then
            PHASES_RAW="$INLINE"
            break
        fi
        IN_PHASES=true
        continue
    fi
    if [ "$IN_PHASES" = true ]; then
        if echo "$line" | grep -q "^ *- "; then
            PHASE=$(echo "$line" | sed 's/^ *- *//;s/"//g' | tr -d ' ')
            PHASES_RAW="${PHASES_RAW:+$PHASES_RAW,}$PHASE"
        else
            break
        fi
    fi
done < "$MANIFEST"

# --- Parse mode ---
MODE=$(grep "mode:" "$MANIFEST" | grep -v "implementationMode" | head -1 | sed 's/.*mode: *//;s/"//g;s/null//' | tr -d ' ')

# --- Parse foundationSkipped ---
FOUNDATION_SKIPPED=$(grep "foundationSkipped:" "$MANIFEST" | head -1 | sed 's/.*foundationSkipped: *//;s/"//g' | tr -d ' ')

# --- Build completed set ---
COMPLETED=""
IFS=',' read -ra PARTS <<< "$PHASES_RAW"
for p in "${PARTS[@]}"; do
    key=$(echo "$p" | tr -d ' ')
    [ -n "$key" ] && COMPLETED="$COMPLETED $key "
done

# --- Define shared phase sequence ---
if [ "$MODE" = "incremental" ]; then
    if [ "$FOUNDATION_SKIPPED" = "true" ]; then
        SHARED_PHASES=("context" "requirements" "decomposition")
    else
        SHARED_PHASES=("context" "requirements" "decomposition" "foundation")
    fi
elif [ "$MODE" = "comprehensive" ]; then
    SHARED_PHASES=("context" "requirements" "decomposition" "design" "tasks" "implement")
else
    if echo "$COMPLETED" | grep -q " decomposition "; then
        SHARED_PHASES=("context" "requirements" "decomposition" "design" "tasks" "implement")
    else
        SHARED_PHASES=("context" "requirements" "design" "tasks" "implement")
    fi
fi

# --- Build main phases output ---
OUTPUT=""
FOUND_CURRENT=false

for i in "${!SHARED_PHASES[@]}"; do
    phase="${SHARED_PHASES[$i]}"
    sep=""
    [ -n "$OUTPUT" ] && sep=" → "

    if echo "$COMPLETED" | grep -q " ${phase} "; then
        OUTPUT="${OUTPUT}${sep}${GREEN}${phase} ✓${RESET}"
    elif [ "$FOUND_CURRENT" = false ]; then
        OUTPUT="${OUTPUT}${sep}${YELLOW}[${phase}]${RESET}"
        FOUND_CURRENT=true
    fi
done

# All shared phases done (non-incremental)
if [ "$FOUND_CURRENT" = false ] && [ "$MODE" != "incremental" ]; then
    OUTPUT="${OUTPUT} ${GREEN}✓${RESET}"
fi

# --- Parse units (incremental mode) ---
if [ "$MODE" = "incremental" ] && [ "$FOUND_CURRENT" = false ]; then
    # All shared phases done — show unit status
    UNIT_OUTPUT=""
    IN_UNIT=false
    UNIT_NAME=""
    UNIT_STATUS=""
    UNIT_PHASE=""

    while IFS= read -r line; do
        if echo "$line" | grep -q "^  - name:"; then
            # Output previous unit
            if [ -n "$UNIT_NAME" ]; then
                case "$UNIT_STATUS" in
                    completed) UNIT_OUTPUT="${UNIT_OUTPUT}  ${GREEN}✓ ${UNIT_NAME}${RESET}\n" ;;
                    in-progress) UNIT_OUTPUT="${UNIT_OUTPUT}  ${YELLOW}▸ ${UNIT_NAME}: ${UNIT_PHASE}${RESET}\n" ;;
                    *) UNIT_OUTPUT="${UNIT_OUTPUT}  ${DIM}○ ${UNIT_NAME}${RESET}\n" ;;
                esac
            fi
            UNIT_NAME=$(echo "$line" | sed 's/.*name: *//;s/"//g' | tr -d ' ')
            UNIT_STATUS=""
            UNIT_PHASE=""
            IN_UNIT=true
        elif [ "$IN_UNIT" = true ]; then
            if echo "$line" | grep -q "status:"; then
                UNIT_STATUS=$(echo "$line" | sed 's/.*status: *//;s/"//g' | tr -d ' ')
            elif echo "$line" | grep -q "phase:"; then
                UNIT_PHASE=$(echo "$line" | sed 's/.*phase: *//;s/"//g;s/null//' | tr -d ' ')
            fi
        fi
    done < <(sed -n '/^units:/,$ p' "$MANIFEST")

    # Output last unit
    if [ -n "$UNIT_NAME" ]; then
        case "$UNIT_STATUS" in
            completed) UNIT_OUTPUT="${UNIT_OUTPUT}  ${GREEN}✓ ${UNIT_NAME}${RESET}\n" ;;
            in-progress) UNIT_OUTPUT="${UNIT_OUTPUT}  ${YELLOW}▸ ${UNIT_NAME}: ${UNIT_PHASE}${RESET}\n" ;;
            *) UNIT_OUTPUT="${UNIT_OUTPUT}  ${DIM}○ ${UNIT_NAME}${RESET}\n" ;;
        esac
    fi

    if [ -n "$UNIT_OUTPUT" ]; then
        echo -e "Phases: $OUTPUT"
        echo -e "$UNIT_OUTPUT"
        exit 0
    fi
fi

echo -e "Phases: $OUTPUT"
