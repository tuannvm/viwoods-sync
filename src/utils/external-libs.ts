// external-libs.ts - External library loading utilities

declare global {
    interface Window {
        JSZip: any;
        jspdf: any;
    }
}

export async function loadJSZip(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
    script.async = true;
    document.head.appendChild(script);
    return new Promise<void>((resolve) => {
        script.onload = () => resolve();
    });
}

export async function loadJsPDF(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    document.head.appendChild(script);
    return new Promise<void>((resolve) => {
        script.onload = () => resolve();
    });
}

export function hasJSZip(): boolean {
    return typeof window.JSZip !== 'undefined';
}

export function hasJsPDF(): boolean {
    return typeof window.jspdf !== 'undefined';
}
