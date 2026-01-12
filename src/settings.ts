// settings.ts - Simplified settings management for Viwoods Obsidian Plugin

import { App, PluginSettingTab, Setting, Notice } from 'obsidian';
import type { ViwoodsSettings } from './types.js';
import { DEFAULT_SETTINGS } from './utils/constants.js';
import { setDebugMode } from './utils/logger.js';
import ViwoodsImporterPlugin from './main.js';

export type { ViwoodsSettings };
export { DEFAULT_SETTINGS };

export class ViwoodsSettingTab extends PluginSettingTab {
    plugin: ViwoodsImporterPlugin;

    constructor(app: App, plugin: ViwoodsImporterPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Viwoods Obsidian Settings' });

        // ========================================================================
        // Basic Settings
        // ========================================================================

        new Setting(containerEl)
            .setName('Source folder (remote location)')
            .setDesc('Path to folder containing your Viwoods .note files (outside the vault)')
            .addText(text => text
                .setPlaceholder('/Users/username/Documents/Viwoods')
                .setValue(this.plugin.settings.sourceFolderPath)
                .onChange(async (value) => {
                    this.plugin.settings.sourceFolderPath = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Destination folder (in Obsidian)')
            .setDesc('Root folder for imported notes in your vault')
            .addText(text => text
                .setPlaceholder('Viwoods Notes')
                .setValue(this.plugin.settings.notesFolder)
                .onChange(async (value) => {
                    this.plugin.settings.notesFolder = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Include metadata')
            .setDesc('Add frontmatter metadata to notes')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeMetadata)
                .onChange(async (value) => {
                    this.plugin.settings.includeMetadata = value;
                    await this.plugin.saveSettings();
                }));

        // ========================================================================
        // Auto-Sync Settings
        // ========================================================================

        new Setting(containerEl)
            .setName('Enable auto-sync')
            .setDesc('Automatically watch the source folder for changes')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.enableAutoSync)
                .onChange(async (value) => {
                    this.plugin.settings.enableAutoSync = value;
                    if (value && !this.plugin.settings.sourceFolderPath) {
                        new Notice('Please set a source folder first');
                    }
                    if (value) {
                        await this.plugin.startAutoSync();
                    } else {
                        this.plugin.stopAutoSync();
                    }
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Polling interval')
            .setDesc('How often to check for changes (minutes)')
            .addSlider(slider => slider
                .setLimits(1, 60, 1)
                .setValue(this.plugin.settings.pollingIntervalMinutes)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.pollingIntervalMinutes = value;
                    await this.plugin.saveSettings();
                    if (this.plugin.settings.enableAutoSync) {
                        await this.plugin.restartAutoSync();
                    }
                }));

        new Setting(containerEl)
            .setName('Sync on startup')
            .setDesc('Check for changes when Obsidian starts')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.syncOnStartup)
                .onChange(async (value) => {
                    this.plugin.settings.syncOnStartup = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show notifications')
            .setDesc('Show notifications when changes are detected')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showSyncNotifications)
                .onChange(async (value) => {
                    this.plugin.settings.showSyncNotifications = value;
                    await this.plugin.saveSettings();
                }));

        // ========================================================================
        // Debug Settings
        // ========================================================================

        new Setting(containerEl)
            .setName('Enable debug logging to console')
            .setDesc('Enable debug logging (for troubleshooting)')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.debugMode)
                .onChange(async (value) => {
                    this.plugin.settings.debugMode = value;
                    setDebugMode(value);
                    await this.plugin.saveSettings();
                    if (value) {
                        new Notice('Debug mode enabled. Check console for detailed logs.');
                    }
                }));
    }
}
