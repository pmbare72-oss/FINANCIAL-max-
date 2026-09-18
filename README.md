# Financial Max 🐉💰

Standalone Flutter personal-finance app foundation.

## Important: GitHub is the code repository
Opening the repository does **not** show the running app. GitHub stores the source code.
The included GitHub Actions workflow builds an Android APK for you.

## Build the APK on GitHub (phone-friendly)

1. Upload/commit this whole project to your GitHub repository.
2. Open the repository's **Actions** tab.
3. Select **Build Financial Max APK**.
4. Tap **Run workflow** (or push a commit to `main` to trigger it automatically).
5. Wait for the workflow to finish.
6. Open the completed workflow run.
7. Under **Artifacts**, download `financial-max-apk`.
8. Extract it and install `app-release.apk` on Android.

## Current foundation
- Financial Max dark dashboard
- Income and expense entry
- Local persistence on the device
- Balance, cash-flow and basic net-worth calculations
- XP and financial levels
- Navigation foundation for Income, Expenses, Goals and Growth

## Planned maximum architecture
Accounts, vaults, budgets, goals, investments, quests, achievements, streaks, alerts, analytics, authentication, cloud sync and financial intelligence.

Never store M-Pesa PINs, bank passwords, card PINs or other authentication secrets in the app database.
