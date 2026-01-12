// handlers/drag-drop-handler.ts - Drag and drop file handling for Viwoods Obsidian

export type NoteFileProcessor = (file: File) => Promise<void>;

export class DragDropHandler {
    private processNoteFile: NoteFileProcessor;

    constructor(processNoteFile: NoteFileProcessor) {
        this.processNoteFile = processNoteFile;
    }

    handleDragOver(evt: DragEvent) {
        if (evt.dataTransfer && this.hasNoteFile(evt.dataTransfer)) {
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy';
        }
    }

    async handleDrop(evt: DragEvent) {
        if (!evt.dataTransfer || !this.hasNoteFile(evt.dataTransfer)) return;
        evt.preventDefault();
        const files = Array.from(evt.dataTransfer.files);
        const noteFiles = files.filter(f => f.name.endsWith('.note') || f.name.endsWith('.zip'));
        if (noteFiles.length > 0) {
            for (const file of noteFiles) await this.processNoteFile(file);
        }
    }

    hasNoteFile(dataTransfer: DataTransfer | null): boolean {
        if (!dataTransfer) return false;
        for (const item of Array.from(dataTransfer.items)) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file && (file.name.endsWith('.note') || file.name.endsWith('.zip'))) return true;
            }
        }
        return false;
    }
}
