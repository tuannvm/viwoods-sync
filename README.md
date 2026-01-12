# Viwoods Notes Importer

Import Viwoods `.note` files directly into Obsidian with support for handwritten notes, audio recordings, and stroke data conversion to SVG.

## Features

- **Import Viwoods notes** - Reads proprietary Viwoods `.note` file format
- **Handwritten notes** - Converts stroke data to SVG for viewing in Obsidian
- **Audio recordings** - Extracts and saves audio recordings from notes
- **Page thumbnails** - Generates page images for quick preview
- **Change detection** - Uses image hashes to detect modified pages
- **PDF export** - Export pages to PDF using jsPDF
- **One-to-one sync** - Auto-import mode that preserves folder structure

## Quick Start

### Installation

1. Download the latest release from [GitHub Releases](https://github.com/farsonic/viwoods-obsidian/releases)
2. Extract `main.js`, `manifest.json`, and `styles.css` to:
   ```
   <Vault>/.obsidian/plugins/viwoods-notes-importer/
   ```
3. Enable the plugin in **Settings → Community plugins**

### Usage

Open the command palette (Ctrl/Cmd+P) and run:
- `Import Viwoods note` - Import a single `.note` file
- `Export Viwoods book` - Export entire book data
- `Export page to PDF` - Generate PDF for a page
- `Reset book hashes` - Reset import tracking

## Configuration

Configure folders and import behavior in **Settings → Viwoods Notes Importer**:
- Notes folder location
- Images, audio, strokes, and PDF folders
- Auto-sync settings and folder structure preferences

## Documentation

- [Architecture](docs/architecture.md) - Plugin architecture and data structures
- [Development](docs/development.md) - Build system, coding conventions, and testing
- [Contributing](docs/contributing.md) - Contribution guidelines
- [Releases](docs/releases.md) - Release process and versioning

## Acknowledgments

This plugin is based on the original [viwoods-import-notes](https://github.com/farsonic/viwoods-import-notes) project by [Francois Prowse](https://github.com/farsonic).

## License

MIT
