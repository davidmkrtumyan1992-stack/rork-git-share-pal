# Sync project with GitHub repo (6 categories, renamed "10 Ethical Principles", bug fixes)

## What will happen

Pull all latest files from your GitHub repository `davidmkrtumyan1992-stack/rork-git-share-pal` (branch: main) and replace the current project files.

### Changes from GitHub (5 commits):
- **Removed Pratimoksha vow category** — now 6 categories total
- **Renamed "10 Principles"** → "10 Ethical Principles"
- **Fixed N+1 queries in AdminPanel** — improved database query performance
- **Fixed race condition in saveVowsToServer** — prevents data conflicts when saving

### Files to sync from GitHub repo:
- **App screens**: Layout, home screen, auth callback, error pages
- **Components**: AdminPanel, Dashboard, LoginForm, OnboardingCarousel
- **Data files**: Vows data (updated categories), translations
- **Hooks**: useVows, useVowCycle, useUnlockedVows, useVowNotifications
- **Auth & config**: AuthContext, Supabase client, theme, types
- **Database types**: Updated type definitions

All files will be pulled from the `expo/` folder in the repo and placed into the project root.
