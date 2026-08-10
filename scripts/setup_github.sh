#!/usr/bin/env bash
# HealthDoc GitHub bootstrap — creates labels, milestones, and all issues.
# Prerequisites: gh CLI installed and authenticated (gh auth login), repo pushed.
# Usage: ./scripts/setup_github.sh owner/repo
set -euo pipefail
REPO="${1:?Usage: $0 owner/repo}"
DIR="$(cd "$(dirname "$0")/.." && pwd)"
ISSUES="$DIR/.github/issues/issues.json"
MILESTONES="$DIR/.github/issues/milestones.json"
ASSIGNEES="$DIR/.github/issues/assignees.json"

command -v gh >/dev/null || { echo "gh CLI not found"; exit 1; }
command -v jq >/dev/null || { echo "jq not found"; exit 1; }

echo "== Creating labels =="
while read -r name color; do
  gh label create "$name" --repo "$REPO" --color "$color" --force >/dev/null && echo "  label: $name"
done <<'EOF'
backend 1d76db
frontend 0e8a16
infra 5319e7
security d93f0b
migrations fbca04
patients c2e0c6
opd c2e0c6
queue c2e0c6
lab c2e0c6
radiology c2e0c6
pharmacy c2e0c6
billing c2e0c6
consent c2e0c6
audit c2e0c6
emergency c2e0c6
ipd c2e0c6
abdm c2e0c6
files c2e0c6
components bfdadc
electron bfdadc
receptionist-ui bfdadc
doctor-ui bfdadc
nurse-ui bfdadc
lab-ui bfdadc
pharmacy-ui bfdadc
billing-ui bfdadc
admin-ui bfdadc
reports-ui bfdadc
patient-portal-ui bfdadc
hardening e99695
docs d4c5f9
task ededed
carry-over f9d0c4
bug-P0 b60205
bug-P1 d93f0b
bug-P2 fbca04
bug-P3 c5def5
week-1 ededed
week-2 ededed
week-3 ededed
week-4 ededed
week-5 ededed
week-6 ededed
week-7 ededed
week-8 ededed
EOF

echo "== Creating milestones =="
jq -c '.[]' "$MILESTONES" | while read -r m; do
  TITLE=$(echo "$m" | jq -r .title)
  DUE=$(echo "$m" | jq -r .due_on)
  DESC=$(echo "$m" | jq -r .description)
  gh api "repos/$REPO/milestones" -f title="$TITLE" -f due_on="$DUE" -f description="$DESC" >/dev/null 2>&1 \
    && echo "  milestone: $TITLE" || echo "  milestone exists: $TITLE"
done

echo "== Creating issues =="
jq -c '.[]' "$ISSUES" | while read -r issue; do
  TITLE=$(echo "$issue" | jq -r .title)
  BODY=$(echo "$issue" | jq -r .body)
  MILESTONE=$(echo "$issue" | jq -r .milestone)
  PLACEHOLDER=$(echo "$issue" | jq -r .assignee)
  REAL=$(jq -r --arg k "$PLACEHOLDER" '.[$k]' "$ASSIGNEES")
  LABELS=$(echo "$issue" | jq -r '.labels | join(",")')
  ARGS=(--repo "$REPO" --title "$TITLE" --body "$BODY" --milestone "$MILESTONE" --label "$LABELS,task")
  if [[ "$REAL" != "REPLACE_WITH_GITHUB_USERNAME" && "$REAL" != "null" ]]; then
    ARGS+=(--assignee "$REAL")
  fi
  gh issue create "${ARGS[@]}" >/dev/null && echo "  issue: $TITLE"
  sleep 1   # avoid secondary rate limits
done

echo "Done. Created $(jq length "$ISSUES") issues across 8 milestones."
