# Architecture

## Overview

The Viwoods Notes Importer is an Obsidian plugin that processes Viwoods `.note` files and converts them into Obsidian-compatible formats (Markdown, SVG, PNG, MP3, PDF).

## Plugin Lifecycle

The entire plugin is implemented in `main.ts` as a single `ViwoodsImporterPlugin` class extending Obsidian's `Plugin`:

```typescript
class ViwoodsImporterPlugin extends Plugin {
  async onload()   // Register commands and load settings
  async onunload() // Cleanup
}
```

## Data Structures

### ImportManifest
Tracks imported pages with hashes, dates, and metadata:
```typescript
interface ImportManifest {
  [bookId: string]: {
    [pageId: string]: {
      hash: string;
      date: string;
      audioDate?: string;
    }
  }
}
```

### PageData
Raw page data extracted from Viwoods files:
```typescript
interface PageData {
  imageBlob: Blob;
  strokeData?: any;
  audioBlob?: Blob;
}
```

### BookResult
Parsed book with pages and thumbnail:
```typescript
interface BookResult {
  pages: Map<string, PageData>;
  thumbnail?: Blob;
}
```

### PageChange
Change detection result:
```typescript
enum PageChange {
  New, Modified, Unchanged, Deleted
}
```

## Commands

| Command ID | Description |
|------------|-------------|
| `import-viwoods-note` | Main import flow from Viwoods `.note` files |
| `export-viwoods-book` | Export book data |
| `export-page-to-pdf` | PDF generation per page |
| `reset-book-hashes` | Reset import tracking |

## Key Components

### Viwoods File Parser
- Reads proprietary Viwoods `.note` format (XML/JSON structure)
- Extracts images, stroke data, and audio blobs
- Generates thumbnails from book covers

### Change Detection
- Uses image hashing to detect modified pages
- Compares stored hashes in `ImportManifest`
- Identifies new, modified, unchanged, and deleted pages

### SVG Generator
- Converts stroke data to SVG format
- Embedded in Markdown files for handwritten notes viewing
- Preserves pen strokes and colors

### Audio Handler
- Extracts audio recordings from notes
- Saves as MP3 files in configured audio folder
- Links to audio in generated Markdown

### PDF Export
- Uses jsPDF library (loaded dynamically via script tag)
- Generates per-page PDFs
- Checks for `window.jspdf` before use

## Folder Structure

All folders are configurable in plugin settings:

```
<Vault>/
├── <notes folder>/      # Markdown files
├── <images folder>/     # Page images (PNG)
├── <audio folder>/      # Audio recordings (MP3)
├── <strokes folder>/    # SVG files (handwritten notes)
└── <pdf folder>/        # Generated PDFs
```

## External Libraries

- **JSZip** - Loaded via script tag in markdown post-processor
- **jsPDF** - Loaded via script tag, checked via `window.jspdf`

Declared globally:
```typescript
declare global {
  interface Window {
    JSZip: any;
    jspdf: any;
  }
}
```

## Settings Persistence

Settings and import manifests are persisted using Obsidian's data API:
```typescript
this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
await this.saveData(this.settings);
```

## Cleanup & Safety

All event listeners use `register*` helpers for proper cleanup:
- `this.registerEvent()` - App events
- `this.registerDomEvent()` - DOM events
- `this.registerInterval()` - Intervals
