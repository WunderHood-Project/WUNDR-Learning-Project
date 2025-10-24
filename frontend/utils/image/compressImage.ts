export type CompressOpts = {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    type?: 'image/webp' | 'image/jpeg';
};

const defaults: Required<CompressOpts> = {
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.8,
    type: 'image/webp',
};

export async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = reject;
        r.readAsDataURL(file);
    });
}

// Load the image into <img> as a fallback, return HTMLImageElement
async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    const url = URL.createObjectURL(file);
    try {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = url;
        });
        return img;
    } finally {
        URL.revokeObjectURL(url);
    }
}

export async function compressImage(file: File, opts: CompressOpts = {}): Promise<string> {
    const { maxWidth, maxHeight, quality, type } = { ...defaults, ...opts };

    if (!file.type.startsWith('image/')) return fileToDataUrl(file);
    if (/image\/hei(c|f)/i.test(file.type)) return fileToDataUrl(file);

    // Source for drawImage: either ImageBitmap or HTMLImageElement
    let source: CanvasImageSource;
    try {
        // fast way
        source = await createImageBitmap(file);
    } catch {
        // fallback
        source = await loadImageFromFile(file);
    }

    // Source dimensions
    const srcW = (source as any).width as number;
    const srcH = (source as any).height as number;

    //Maintain proportions and don't upscale
    const ratio = Math.min(maxWidth / srcW, maxHeight / srcH, 1);
    const tw = Math.round(srcW * ratio);
    const th = Math.round(srcH * ratio);

    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');
    if (!ctx) return fileToDataUrl(file);

    ctx.drawImage(source, 0, 0, tw, th);

    try {
        return canvas.toDataURL(type, quality);
    } catch {
        return fileToDataUrl(file);
    }
}
