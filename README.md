# Financial Max 🐉💰

A standalone, installable personal-finance PWA. No Flutter, no APK build pipeline, no GitHub Actions, and no backend is required for the basic app.

## Easiest setup

1. Create/open your GitHub repository.
2. Upload the **contents** of this folder to the repository root:
   - `index.html`
   - `style.css`
   - `app.js`
   - `manifest.json`
   - `sw.js`
   - `icons/`
3. Commit to the `main` branch.
4. Enable **GitHub Pages**:
   - Repository → Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Save
5. Open the Pages URL GitHub gives you.
6. In Chrome on Android, use the browser menu and choose **Install app** or **Add to Home screen**.

## Important

Financial Max stores its records in the browser's local storage on the device. Use **System → Export backup** regularly. Never put M-Pesa PINs, bank passwords, card PINs, or other secrets into the app.

## Included

- Command Center dashboard
- Income and expense tracking
- Categories and activity filters
- Accounts
- Savings goals / vault-style targets
- Investment account tracking
- XP and levels
- Quests and achievements
- Financial health indicators
- Compound growth calculator
- Financial intelligence based on recorded data
- JSON backup and restore
- Dark/light mode
- Offline cache / installable PWA
