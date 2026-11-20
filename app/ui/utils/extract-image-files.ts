export interface ExtractedImageFile {
    name: string;
    url: string;
    file: File;
}

export function extractImageFiles(dataTransfer: DataTransfer | null): ExtractedImageFile[] {
    if (!dataTransfer) return [];
    const images: ExtractedImageFile[] = [];
    for (const file of Array.from(dataTransfer.files ?? [])) {
        if (!file.type.startsWith("image/")) continue;
        images.push({
            name: file.name || "pasted-image",
            url: URL.createObjectURL(file),
            file,
        });
    }
    return images;
}
