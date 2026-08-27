export type BookmarkCategory =
    | "surah"
    | "doa"
    | "hadits"
    | "maulid"
    | "dzikir"
    | "tahlil"
    | "asmaul-husna";

export interface BookmarkItem {
    id?: string;
    category?: BookmarkCategory;
    title: string;
    subtitle?: string;
    teksArab: string;
    teksLatin?: string;
    teksIndonesia: string;
    url: string;
    savedAt: string;

    // Legacy fields for backward compatibility with existing Surah bookmarks in Firestore
    surahNo?: number;
    surahName?: string;
    ayatNo?: number;
}

export const CATEGORY_CONFIG: Record<
    BookmarkCategory,
    { label: string; bg: string; text: string; border: string }
> = {
    surah: {
        label: "Surah",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    doa: {
        label: "Doa",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    hadits: {
        label: "Hadits",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    maulid: {
        label: "Maulid",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    dzikir: {
        label: "Dzikir",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    tahlil: {
        label: "Tahlil",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
    "asmaul-husna": {
        label: "Asmaul Husna",
        bg: "bg-primary/20",
        text: "text-primary-2",
        border: "border-primary/30",
    },
};

/**
 * Get a unique identifier key for any bookmark item (supports legacy format too).
 */
export function getBookmarkKey(item: BookmarkItem): string {
    if (item.id) return item.id;
    if (item.category && item.category !== "surah") {
        return `${item.category}-${item.title}`;
    }
    if (item.surahNo && item.ayatNo) {
        return `surah-${item.surahNo}-${item.ayatNo}`;
    }
    return item.title || item.url || "unknown";
}

/**
 * Normalize bookmark category (legacy bookmark data defaults to 'surah').
 */
export function getBookmarkCategory(item: BookmarkItem): BookmarkCategory {
    if (item.category) return item.category;
    if (item.surahNo !== undefined) return "surah";
    return "surah";
}
