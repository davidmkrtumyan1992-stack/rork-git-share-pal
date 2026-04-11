# Trigger a fresh rebuild to fix "Snapshot not found"

**Problem:** The QR code shows "Snapshot not found" — the app files are all present in the workspace, but there's no active build snapshot.

**Fix:**
- Make a tiny harmless update to the main layout file (update a log message version number) to trigger a fresh build
- This will generate a new snapshot and a working QR code

**No code changes** to app logic, design, or architecture — just a rebuild trigger.