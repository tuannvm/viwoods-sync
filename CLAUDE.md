# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Type

This is an **Obsidian Community Plugin** - "Viwoods Notes Importer" - that imports `.note` files from Viwoods note-taking software into Obsidian. It processes handwritten notes (converts strokes to SVG), audio recordings, page thumbnails, and supports PDF export.

## Common Commands

```bash
# Install dependencies
npm install

# Development (watches for changes, rebuilds automatically)
npm run dev

# Production build (typechecks + bundles)
npm run build

# Bump version (updates manifest.json and versions.json)
npm run version

# Lint (requires global eslint)
npx eslint main.ts
```

## Architecture

The entire plugin is currently in a single large `main.ts` file (~26K tokens). While not ideal for maintainability, the key architectural components are:

### Plugin Lifecycle (`ViwoodsImporterPlugin` class)
- Extends Obsidian's `Plugin`
- `onload()` - Registers 4 commands and initializes settings
- `onunload()` - Cleanup
- `loadData()`/`saveData()` - Persists settings and import manifests

### Commands
- `import-viwoods-note` - Main import flow from Viwoods .note files
- `export-viwoods-book` - Export book data
- `export-page-to-pdf` - PDF generation per page
- `reset-book-hashes` - Reset import tracking

### Core Data Structures
- `ImportManifest` - Tracks imported pages with hashes, dates, metadata
- `PageData` - Raw page data (image blob, stroke data, audio blob)
- `BookResult` - Parsed book with pages and thumbnail
- `PageChange` - Change detection (new/modified/unchanged/deleted)

### Key Features
1. **Viwoods .note parsing** - Reads proprietary Viwoods format (XML/JSON structure)
2. **Change detection** - Uses image hashes to detect modified pages
3. **SVG generation** - Converts stroke data to SVG for handwritten notes
4. **Audio handling** - Extracts and saves audio recordings
5. **PDF export** - Uses jsPDF library (loaded dynamically via script tag)

### Folder Structure (Configurable in Settings)
- Notes folder - Markdown files
- Images folder - Page images
- Audio folder - Audio recordings
- Strokes folder - SVG files
- PDF folder - Generated PDFs

## Important Constraints

### Build System
- **esbuild** bundles TypeScript → `main.js`
- `obsidian` and editor modules are external (not bundled)
- Output must be at plugin root: `main.js`, `manifest.json`, `styles.css`
- No runtime dependencies (everything bundled or loaded dynamically)

### External Libraries
- **JSZip** and **jsPDF** are loaded via script tags in markdown post-processor, not npm bundles
- Check for `window.JSZip` and `window.jspdf` before use

### Manifest Rules
- `id`: `viwoods-notes-importer` (never change after release)
- `isDesktopOnly`: `false` (supports mobile)
- Version must match git tag when releasing

## Development Guidelines

### Code Organization (Future Refactoring)
The AGENTS.md file recommends splitting into modules:
```
src/
  main.ts           # Plugin lifecycle only
  settings.ts       # Settings interface + defaults
  commands/         # Command implementations
  ui/              # Modals, views
  utils/           # Helpers, constants
  types.ts         # Type definitions
```

### TypeScript
- Strict mode enabled
- Use Obsidian API types from `obsidian` package
- Declare global window extensions for external libs:
  ```ts
  declare global {
    interface Window {
      JSZip: any;
      jspdf: any;
    }
  }
  ```

### Cleanup & Safety
- Use `this.registerEvent()` for app events
- Use `this.registerDomEvent()` for DOM events
- Use `this.registerInterval()` for intervals
- This ensures proper cleanup on plugin unload

### Settings Persistence
```ts
this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
await this.saveData(this.settings);
```

## Release Process

1. Bump version in `manifest.json`
2. Run `npm run version` (updates `versions.json`)
3. Create GitHub release with tag matching version (no `v` prefix)
4. Attach `manifest.json`, `main.js`, `styles.css` as release assets

## Testing

Manual install for testing:
```bash
# Copy to Obsidian plugin folder
cp main.js manifest.json styles.css <vault>/.obsidian/plugins/viwoods-notes-importer/

# Or use symbolic link for development
ln -s /path/to/repo/main.js <vault>/.obsidian/plugins/viwoods-notes-importer/main.js
```

## References

- AGENTS.md - Comprehensive Obsidian plugin development guide
- Obsidian API: https://docs.obsidian.md
- Plugin guidelines: https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines
