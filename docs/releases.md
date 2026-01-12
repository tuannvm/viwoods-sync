# Releases

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **Major** - Breaking changes
- **Minor** - New features (backwards compatible)
- **Patch** - Bug fixes (backwards compatible)

## Release Process

### 1. Bump Version

```bash
npm run version
```

This updates:
- `manifest.json` - `version` field
- `versions.json` - Maps plugin version → minimum app version

### 2. Build Production Bundle

```bash
npm run build
```

Ensure `main.js` is generated at the plugin root.

### 3. Create GitHub Release

1. Go to **Releases → New release**
2. Tag version: use exact version from `manifest.json` (no `v` prefix)
   - Example: `1.0.26` (not `v1.0.26`)
3. Title: Use version as title
4. Description: Add release notes
5. Attach artifacts:
   - `manifest.json`
   - `main.js`
   - `styles.css` (if present)

### 4. Publish

Click **Publish release**. The plugin will be available for installation through Obsidian's community plugin browser.

## Manifest Rules

Critical `manifest.json` fields:
- `id` - Never change after release (treat as stable API)
- `version` - Must match GitHub release tag exactly
- `minAppVersion` - Keep accurate when using newer APIs
- `isDesktopOnly` - `false` for mobile support

## Post-Release

After the initial release, add/update the plugin in the Obsidian community catalog:
- https://github.com/obsidianmd/obsidian-releases/blob/master/plugins.md

## Verification

After release:
1. Install plugin in a fresh vault
2. Test all commands
3. Verify settings persist
4. Check mobile if applicable
