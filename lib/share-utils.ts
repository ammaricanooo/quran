export interface ShareContentOptions {
    title: string;
    arab?: string;
    latin?: string;
    translation?: string;
    extra?: string;
    url?: string;
}

/**
 * Format share text uniformly across the application without emojis.
 */
export function formatShareText(options: ShareContentOptions): string {
    const parts: string[] = [];

    // Judul
    if (options.title?.trim()) {
        parts.push(`*${options.title.trim()}*`);
    }

    // Teks Arab
    if (options.arab?.trim()) {
        parts.push(options.arab.trim());
    }

    // Teks Latin
    if (options.latin?.trim()) {
        parts.push(options.latin.trim());
    }

    // Arti / Terjemahan
    if (options.translation?.trim()) {
        parts.push(`"${options.translation.trim()}"`);
    }

    // Info Tambahan (misal: hitungan dzikir, nomor hadits, dsb)
    if (options.extra?.trim()) {
        parts.push(options.extra.trim());
    }

    // Sumber
    if (options.url?.trim()) {
        parts.push(`Sumber: Al-Qur'an Ku (${options.url.trim()})`);
    } else {
        parts.push("Sumber: Al-Qur'an Ku");
    }

    return parts.join("\n\n");
}

/**
 * Trigger native navigator.share or fallback to clipboard.writeText.
 */
export async function shareOrCopy(
    options: ShareContentOptions,
    fallbackSuccessMessage = "Berhasil disalin!"
): Promise<boolean> {
    const text = formatShareText(options);

    if (typeof window !== "undefined" && navigator.share) {
        try {
            await navigator.share({
                title: options.title,
                text,
            });
            return true;
        } catch (err: any) {
            // User cancelled share or aborted
            if (err?.name === "AbortError") {
                return false;
            }
            console.error("Error sharing via navigator.share:", err);
        }
    }

    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            if (fallbackSuccessMessage) {
                alert(fallbackSuccessMessage);
            }
            return true;
        } catch (err) {
            console.error("Failed to copy text:", err);
            return false;
        }
    }

    return false;
}
