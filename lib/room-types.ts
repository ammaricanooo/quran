/**
 * Firestore room document types untuk multiplayer kuis
 */

export type RoomStatus = "waiting" | "countdown" | "question" | "leaderboard" | "finished";
export type QuizMode = "tebak-ayat" | "sambung-ayat" | "tebak-surah";

export interface Player {
    name: string;
    score: number;
    answeredAt: number | null;   // timestamp ms saat menjawab soal ini
    lastAnswer: number | null;   // index pilihan terakhir
    correct: boolean | null;
    joinedAt: number;
    isHost: boolean;
}

export interface SerializedQuestion {
    id: string;
    mode: QuizMode;
    arabText: string;
    latinText: string;
    indonesiaText: string;
    audioUrl: string;
    surahName: string;
    surahNo: number;
    ayatNo: number;
    choices: string[];
    correctIndex: number;
    prompt?: string | null;
    promptLatin?: string | null;
}

export interface RoomDoc {
    code: string;
    hostId: string;
    hostPlaying: boolean;        // apakah host ikut bermain sebagai peserta
    status: RoomStatus;
    mode: QuizMode;
    createdAt: number;
    currentQuestion: number;     // index soal saat ini (0-based)
    questionStartedAt: number;   // timestamp ms saat soal mulai
    timePerQuestion: number;     // detik
    totalQuestions: number;
    questions: SerializedQuestion[];
    players: { [playerId: string]: Player };
    countdownStartedAt?: number;
}
