# Sync project with GitHub repo (Phase 3: Architecture Refactor)

**What will happen:**

1. Clone the latest code from your GitHub repository (branch: main)
2. Copy all files into the current project, replacing existing ones
3. Clean up the temporary clone

**Changes included in this sync:**
- Removed pratimoksha from AdminPanel locked vow types
- New shared constants file for locked vow types (tantric, nuns, monks)
- All relevant screens now use the shared constants instead of duplicating lists
- New error recovery screen that catches crashes and shows a "Try again" button
- Error boundary wraps the entire app

**No existing functionality will be removed** — this is a refactor and stability improvement.