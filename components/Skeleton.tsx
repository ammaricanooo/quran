/**
 * Skeleton components — consistent shimmer animation across all pages.
 * Uses the same bg-white/5 + animate-pulse pattern as the rest of the app.
 */

// ─── Base pulse block ───────────────────────────────────────────────────────
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/8 rounded-2xl ${className}`} />;
}

// ─── Page wrapper (Navbar + main layout shell) ───────────────────────────────
export function SkeletonPageHeader({ title }: { title: string }) {
  return (
    <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <div className="w-9 h-9 bg-white/8 rounded-xl animate-pulse" />
          <div className="h-6 w-40 bg-white/8 rounded-xl animate-pulse" />
        </div>
        <div className="h-6 w-16 bg-white/8 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// ─── Card list (Doa / Hadits) ────────────────────────────────────────────────
export function SkeletonCardList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex md:justify-end">
        <div className="w-full md:w-1/2 h-11 bg-white/8 rounded-xl animate-pulse" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/5 rounded-4xl p-6 space-y-4"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Badge + share icon */}
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-white/8 rounded-lg animate-pulse" />
            <div className="w-8 h-8 bg-white/8 rounded-xl animate-pulse" />
          </div>
          {/* Title */}
          <div className="h-6 w-3/4 bg-white/8 rounded-xl animate-pulse" />
          {/* Arabic text */}
          <div className="space-y-2">
            <div className="h-8 w-full bg-white/8 rounded-xl animate-pulse" />
            <div className="h-8 w-4/5 bg-white/8 rounded-xl animate-pulse ml-auto" />
          </div>
          {/* Translation */}
          <div className="space-y-2 pl-4 border-l-2 border-white/5">
            <div className="h-4 w-full bg-white/8 rounded-lg animate-pulse" />
            <div className="h-4 w-5/6 bg-white/8 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Juz list grid ───────────────────────────────────────────────────────────
export function SkeletonJuzList({ count = 8 }: { count?: number }) {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Search */}
      <div className="flex md:justify-end mb-6">
        <div className="w-full md:w-64 h-11 bg-white/8 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/5 p-5 rounded-3xl space-y-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 bg-white/8 rounded-xl animate-pulse" />
              <div className="space-y-1 text-right">
                <div className="h-3 w-16 bg-white/8 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/8 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-2/3 bg-white/8 rounded-xl animate-pulse" />
            <div className="h-3 w-1/2 bg-white/8 rounded animate-pulse" />
            <div className="h-12 bg-white/8 rounded-2xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dzikir list ─────────────────────────────────────────────────────────────
export function SkeletonDzikirList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/5 rounded-4xl p-6 space-y-4"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Header row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/8 rounded-xl animate-pulse" />
              <div className="h-4 w-24 bg-white/8 rounded animate-pulse" />
            </div>
            <div className="w-7 h-7 bg-white/8 rounded-lg animate-pulse" />
          </div>
          {/* Arabic */}
          <div className="space-y-2">
            <div className="h-7 w-full bg-white/8 rounded-xl animate-pulse" />
            <div className="h-7 w-4/5 bg-white/8 rounded-xl animate-pulse ml-auto" />
          </div>
          {/* Translation */}
          <div className="h-4 w-3/4 bg-white/8 rounded animate-pulse pl-3 border-l border-white/5" />
          {/* Progress bar */}
          <div className="h-1 w-full bg-white/5 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// ─── Jadwal Sholat ───────────────────────────────────────────────────────────
export function SkeletonJadwal() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      {/* Desert BG area */}
      <div className="h-36 md:h-44 bg-white/8 rounded-3xl animate-pulse" />

      {/* Location row */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/8 rounded-lg animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-14 bg-white/8 rounded animate-pulse" />
            <div className="h-5 w-40 bg-white/8 rounded-lg animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-28 bg-white/8 rounded-full animate-pulse" />
      </div>

      {/* Prayer time cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center p-6 rounded-4xl border border-white/5 bg-white/5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="h-4 w-24 bg-white/8 rounded animate-pulse" />
            <div className="h-9 w-20 bg-white/8 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Calendar header placeholder */}
      <div className="space-y-3">
        <div className="h-5 w-48 bg-white/8 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

// ─── Surah / Juz detail (ayat list) ─────────────────────────────────────────
export function SkeletonAyatList({ count = 5 }: { count?: number }) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Surah info card */}
      <div className="h-44 bg-white/8 rounded-4xl animate-pulse mb-4" />

      {/* Qari selection */}
      <div className="mb-10">
        <div className="h-3 w-28 bg-white/8 rounded animate-pulse mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-[9rem] h-28 bg-white/8 rounded-3xl animate-pulse shrink-0" />
          ))}
        </div>
      </div>

      {/* Ayat cards */}
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white/5 border border-white/5 p-6 rounded-4xl space-y-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {/* Number + Arabic */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-white/8 rounded-2xl animate-pulse shrink-0" />
              <div className="w-8 h-8 bg-white/8 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="h-8 w-full bg-white/8 rounded-xl animate-pulse" />
              <div className="h-8 w-5/6 bg-white/8 rounded-xl animate-pulse ml-auto" />
            </div>
          </div>
          {/* Latin + Terjemahan */}
          <div className="space-y-2 pl-4 border-l-2 border-white/5">
            <div className="h-4 w-full bg-white/8 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-white/8 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-white/8 rounded animate-pulse" />
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/5">
            <div className="h-8 w-24 bg-white/8 rounded-xl animate-pulse" />
            <div className="h-8 w-16 bg-white/8 rounded-xl animate-pulse" />
            <div className="h-8 w-32 bg-white/8 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
