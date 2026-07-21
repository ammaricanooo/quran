/**
 * Shared game utilities: fetch random ayat, build questions, score calc
 */

export interface AyatRaw {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: { [key: string]: string };
    surahName: string;
    surahNo: number;
    surahArti: string;
    jumlahAyat: number;
}

export type GameMode = "tebak-ayat" | "sambung-ayat" | "tebak-surah";

export interface Question {
    id: string;
    mode: GameMode;
    ayat: AyatRaw;
    choices: string[];       // 4 display strings
    correctIndex: number;
    prompt?: string;         // untuk sambung-ayat / tebak-surah
    promptLatin?: string;
}

const QARI = "05";

/** Raw shape returned by equran.id API (before mapping to AyatRaw) */
interface RawAyatResponse {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: { [key: string]: string };
}

interface RawSurahResponse {
    nomor: number;
    namaLatin: string;
    arti: string;
    jumlahAyat: number;
    ayat: RawAyatResponse[];
}

/** Fetch semua ayat dari 1 surah acak */
export async function fetchSurahAyats(surahNo?: number): Promise<AyatRaw[]> {
    const no = surahNo ?? (Math.floor(Math.random() * 114) + 1);
    const res = await fetch(`https://equran.id/api/v2/surat/${no}`);
    const json = await res.json();
    const d = json.data as RawSurahResponse;
    return d.ayat.map((a) => ({
        nomorAyat: a.nomorAyat,
        teksArab: a.teksArab,
        teksLatin: a.teksLatin,
        teksIndonesia: a.teksIndonesia,
        audio: a.audio,
        surahName: d.namaLatin,
        surahNo: d.nomor,
        surahArti: d.arti,
        jumlahAyat: d.jumlahAyat,
    }));
}

/** Fetch 1 ayat acak dari surah acak */
export async function fetchRandomAyat(): Promise<AyatRaw> {
    const ayats = await fetchSurahAyats();
    return ayats[Math.floor(Math.random() * ayats.length)];
}

/** Buat pool ayat dari beberapa surah berbeda */
export async function buildPool(count: number): Promise<AyatRaw[]> {
    const pool: AyatRaw[] = [];
    const usedSurahs = new Set<number>();
    let attempts = 0;
    while (pool.length < count && attempts < count * 3) {
        const no = Math.floor(Math.random() * 114) + 1;
        if (usedSurahs.has(no)) { attempts++; continue; }
        usedSurahs.add(no);
        const ayats = await fetchSurahAyats(no);
        const longEnough = ayats.filter(a => a.teksArab.split(" ").length >= 5);
        if (longEnough.length === 0) { attempts++; continue; }
        const pick = longEnough[Math.floor(Math.random() * longEnough.length)];
        pool.push(pick);
        attempts++;
    }
    return pool;
}

interface JuzInfoResponse {
    surah_id_start: string;
    surah_id_end: string;
    verse_start: string;
    verse_end: string;
}

/** Fetch semua ayat dari juz tertentu */
export async function fetchJuzAyats(juzNo: number): Promise<AyatRaw[]> {
    const res = await fetch(`/api/proxy-juz/${juzNo}`);
    const juzInfo = await res.json();
    const dataJuz = juzInfo.data as JuzInfoResponse;

    const startSurah = parseInt(dataJuz.surah_id_start);
    const endSurah = parseInt(dataJuz.surah_id_end);

    const surahNumbers = Array.from({ length: endSurah - startSurah + 1 }, (_, i) => startSurah + i);
    const surahPromises = surahNumbers.map(num =>
        fetch(`https://equran.id/api/v2/surat/${num}`).then(r => r.json())
    );

    const surahResponses = await Promise.all(surahPromises);

    let combinedVerses: AyatRaw[] = [];

    surahResponses.forEach((surahRes: { data: RawSurahResponse }, idx) => {
        const sData = surahRes.data;
        const sNum = surahNumbers[idx];

        let filtered: RawAyatResponse[] = sData.ayat;
        if (sNum === startSurah) filtered = filtered.filter(a => a.nomorAyat >= parseInt(dataJuz.verse_start));
        if (sNum === endSurah) filtered = filtered.filter(a => a.nomorAyat <= parseInt(dataJuz.verse_end));

        const mapped: AyatRaw[] = filtered.map(a => ({
            nomorAyat: a.nomorAyat,
            teksArab: a.teksArab,
            teksLatin: a.teksLatin,
            teksIndonesia: a.teksIndonesia,
            audio: a.audio,
            surahName: sData.namaLatin,
            surahNo: sData.nomor,
            surahArti: sData.arti,
            jumlahAyat: sData.jumlahAyat,
        }));

        combinedVerses = [...combinedVerses, ...mapped];
    });

    return combinedVerses;
}

/** Buat pool ayat dari juz tertentu */
export async function buildPoolFromJuz(juzNo: number, count: number): Promise<AyatRaw[]> {
    const allAyats = await fetchJuzAyats(juzNo);
    const longEnough = allAyats.filter(a => a.teksArab.split(" ").length >= 5);

    const shuffled = longEnough.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// ─── Question builders ────────────────────────────────────────────────────────

export function buildTebakAyatQ(correct: AyatRaw, pool: AyatRaw[], idx: number): Question {
    const distractors = pool
        .filter(a => a.teksIndonesia !== correct.teksIndonesia)
        .map(a => a.teksIndonesia);
    const uniq = [...new Set(distractors)].slice(0, 3);
    while (uniq.length < 3) uniq.push(`(Pilihan ${uniq.length + 1})`);
    const ci = Math.floor(Math.random() * 4);
    const choices = [...uniq];
    choices.splice(ci, 0, correct.teksIndonesia);
    return {
        id: `tebak-${idx}`,
        mode: "tebak-ayat",
        ayat: correct,
        choices,
        correctIndex: ci,
    };
}

export function buildSambungAyatQ(correct: AyatRaw, pool: AyatRaw[], idx: number): Question {
    const words = correct.teksArab.trim().split(/\s+/);
    const splitAt = Math.max(3, Math.floor(words.length * (0.3 + Math.random() * 0.2)));
    const prompt = words.slice(0, splitAt).join(" ");
    const continuation = words.slice(splitAt).join(" ");
    const promptLatin = correct.teksLatin.split(" ").slice(0, splitAt).join(" ") + "...";

    const distractors: string[] = [];
    const used = new Set<string>([continuation]);
    for (const d of pool) {
        if (d.surahNo === correct.surahNo) continue;
        const dw = d.teksArab.trim().split(/\s+/);
        if (dw.length <= splitAt) continue;
        const dc = dw.slice(splitAt).join(" ");
        if (used.has(dc)) continue;
        used.add(dc);
        distractors.push(dc);
        if (distractors.length === 3) break;
    }
    while (distractors.length < 3) distractors.push(`(Pilihan ${distractors.length + 1})`);
    const ci = Math.floor(Math.random() * 4);
    const choices = [...distractors];
    choices.splice(ci, 0, continuation);

    return {
        id: `sambung-${idx}`,
        mode: "sambung-ayat",
        ayat: correct,
        choices,
        correctIndex: ci,
        prompt,
        promptLatin,
    };
}

export function buildTebakSurahQ(correct: AyatRaw, pool: AyatRaw[], idx: number): Question {
    // Tampilkan teks Arab + terjemahan, tebak nama surah + nomor ayat
    const label = `${correct.surahName} : ${correct.nomorAyat}`;
    const distractors = pool
        .filter(a => !(a.surahName === correct.surahName && a.nomorAyat === correct.nomorAyat))
        .map(a => `${a.surahName} : ${a.nomorAyat}`);
    const uniq = [...new Set(distractors)].slice(0, 3);
    while (uniq.length < 3) uniq.push(`(Pilihan ${uniq.length + 1})`);
    const ci = Math.floor(Math.random() * 4);
    const choices = [...uniq];
    choices.splice(ci, 0, label);
    return {
        id: `surah-${idx}`,
        mode: "tebak-surah",
        ayat: correct,
        choices,
        correctIndex: ci,
    };
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

/** Hitung skor satu soal. Max 1000 per soal.
 *  Benar: 500 (base) + 500 * (sisa waktu / total waktu)
 *  Salah / timeout: 0
 */
export function calcScore(correct: boolean, timeLeft: number, totalTime: number): number {
    if (!correct) return 0;
    const speedBonus = Math.round(500 * (timeLeft / totalTime));
    return 500 + speedBonus;
}

/** Audio URL untuk ayat */
export function audioUrl(ayat: AyatRaw): string {
    return ayat.audio?.[QARI] ?? "";
}
