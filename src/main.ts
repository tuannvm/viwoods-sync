// main.ts - Viwoods Notes Importer Plugin for Obsidian
// Minimal plugin class with lifecycle management only

import {
    App,
    Plugin,
    Notice
} from 'obsidian';

// Type imports
import type {
    ViwoodsSettings,
    PenMappings
} from './types.js';

// Import settings and defaults
import { DEFAULT_SETTINGS } from './utils/constants.js';

// Import modals
import { ProgressModal } from './ui/modals.js';

// Import services
import { ImporterService } from './services/importer-service.js';
import { PageProcessor } from './services/page-processor.js';
import { ViewerService } from './services/viewer-service.js';
import { ImportWorkflow } from './services/import-workflow.js';

// Import handlers
import { DragDropHandler } from './handlers/drag-drop-handler.js';

// Import commands
import { registerCommands } from './commands/registry.js';

// Import utilities
import { loadJSZip, loadJsPDF } from './utils/external-libs.js';
import { initPenMappings, getPenMappings } from './utils/pen-mapping-helpers.js';

declare global {
    interface Window {
        JSZip: any;
        jspdf: any;
    }
}

// ============================================================================
// MAIN PLUGIN CLASS
// ============================================================================

export default class ViwoodsImporterPlugin extends Plugin {
    settings: ViwoodsSettings;
    importInProgress: boolean = false;
    penMappings: PenMappings = {};

    // Services
    private importerService: ImporterService | null = null;
    private pageProcessor: PageProcessor | null = null;
    private viewerService: ViewerService | null = null;
    private importWorkflow: ImportWorkflow | null = null;

    // Handlers
    private dragDropHandler: DragDropHandler | null = null;

    async onload() {
        await this.loadSettings();
        await loadJSZip();
        await loadJsPDF();
        await this.loadPenMappings();

        // Initialize services
        this.importerService = new ImporterService(this.app, this.settings, this.penMappings);
        this.pageProcessor = new PageProcessor(this.app, this.settings, ProgressModal);
        this.viewerService = new ViewerService(this.app, this.settings);
        this.importWorkflow = new ImportWorkflow(this.app, this.settings, this.importerService, this.pageProcessor);

        // Initialize handlers
        this.dragDropHandler = new DragDropHandler((file: File) => this.importWorkflow!.processNoteFile(file));

        // Register all commands and processors via registry
        registerCommands(this, {
            app: this.app,
            settings: this.settings,
            penMappings: this.penMappings,
            importerService: this.importerService,
            pageProcessor: this.pageProcessor,
            viewerService: this.viewerService,
            importWorkflow: this.importWorkflow,
            dragDropHandler: this.dragDropHandler,
            plugin: this
        });
    }

    async onunload() {
        // Cleanup is handled by Obsidian's plugin system
    }

    // ========================================================================
    // INITIALIZATION
    // ========================================================================

    async loadPenMappings() {
        this.penMappings = await initPenMappings(this.app);
    }

    getKnownPenMappings(): PenMappings {
        return getPenMappings();
    }

    // ========================================================================
    // IMPORT WORKFLOW (delegates to ImportWorkflow service)
    // ========================================================================

    async processNoteFile(file: File): Promise<void> {
        if (!this.importWorkflow) {
            new Notice('Import workflow not initialized');
            return;
        }
        await this.importWorkflow.processNoteFile(file);
    }

    // ========================================================================
    // SETTINGS
    // ========================================================================

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}
