"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Info, CloudSun, Sunset, MoonStar, Sun } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SkeletonJadwal } from "@/components/Skeleton";

interface ThemeConfig {
    sky: string;
    sunMoon: { color: string; shadow: string };
    dunes: string[];
}

interface DuneShapeProps {
    className?: string;
    d: string;
    speed: string;
}

const DuneShape = ({ className = "", d, speed }: DuneShapeProps) => (
    <svg
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        className={`absolute bottom-0 left-0 w-[200%] h-full ${speed} ${className}`}
    >
        <path d={d} />
    </svg>
);

const DynamicDesertBg = ({ timeOfDay }: { timeOfDay: string }) => {
    // Definisi warna berdasarkan waktu
    const themes: Record<string, ThemeConfig> = {
        subuh: {
            sky: "from-[#1a2c5b] via-[#3a5a9c] to-[#f9dcc4]", // Twilight ke oranye fajar
            sunMoon: { color: "text-[#f9dcc4]/50", shadow: "shadow-[#f9dcc4]/20" },
            dunes: ["fill-[#2a4a8c]", "fill-[#203a73]", "fill-[#15254d]"],
        },
        pagi: {
            sky: "from-[#69cbf5] via-[#a8e6cf] to-[#ffd3b6]", // Biru cerah fajar
            sunMoon: { color: "text-[#ffeb3b]", shadow: "shadow-[#ffeb3b]/50" },
            dunes: ["fill-[#e0b080]", "fill-[#c09060]", "fill-[#a07040]"],
        },
        siang: {
            sky: "from-[#2196f3] to-[#81d4fa]", // Biru langit terik
            sunMoon: { color: "text-[#fff59d]", shadow: "shadow-[#fff59d]/80" },
            dunes: ["fill-[#f4d0a0]", "fill-[#d4b080]", "fill-[#b49060]"],
        },
        sore: {
            sky: "from-[#e65100] via-[#ff9800] to-[#ffcc80]", // Oranye keemasan sunset
            sunMoon: { color: "text-[#ffee58]", shadow: "shadow-[#ffee58]/60" },
            dunes: ["fill-[#b07040]", "fill-[#905020]", "fill-[#703010]"],
        },
        malam: {
            sky: "from-[#080e1a] to-[#1a2c5b]", // Biru gelap pekat
            sunMoon: { color: "text-white", shadow: "shadow-white/20" },
            dunes: ["fill-[#101a33]", "fill-[#0a1021]", "fill-[#050812]"],
        },
    };

    const theme = themes[timeOfDay] || themes.siang;

    return (
        <div className={`absolute inset-0 bg-linear-to-b ${theme.sky} transition-all duration-1000 overflow-hidden`}>
            {/* Matahari atau Bulan */}
            <div className="absolute top-10 left-10 flex items-center gap-6 z-0">
                <div className={`w-14 h-14 rounded-full bg-current ${theme.sunMoon.color} ${theme.sunMoon.shadow} shadow-2xl transition-all duration-1000`}></div>
                {timeOfDay === 'malam' && (
                    <div className="text-xs font-black text-white/50 tracking-widest uppercase">Malam</div>
                )}
                {timeOfDay === 'subuh' && (
                    <div className="text-xs font-black text-white/50 tracking-widest uppercase">Fajar</div>
                )}
            </div>

            {/* Awan Vektor (Hanya Pagi/Siang) */}
            {(timeOfDay === 'pagi' || timeOfDay === 'siang') && (
                <div className="absolute top-20 right-20 opacity-30">
                    <svg width="120" height="60" viewBox="0 0 120 60" fill="white">
                        <circle cx="30" cy="30" r="30" />
                        <circle cx="60" cy="30" r="30" />
                        <circle cx="90" cy="30" r="30" />
                        <circle cx="60" cy="15" r="30" />
                    </svg>
                </div>
            )}

            {/* Layer Bukit Pasir Beranimasi */}
            <div className="absolute bottom-[-10px] left-0 w-full h-1/2 z-0 opacity-80">
                <DuneShape
                    speed="animate-drift-slow"
                    className={theme.dunes[0]}
                    d="M0,150 C150,50 350,250 500,150 C650,50 850,250 1000,150 L1000,300 L0,300 Z"
                />
                <DuneShape
                    speed="animate-drift"
                    className={`${theme.dunes[1]} opacity-90`}
                    d="M0,200 C200,100 400,300 600,200 C800,100 1000,300 1200,200 L1200,300 L0,300 Z"
                />
                <DuneShape
                    speed="animate-drift-slow"
                    className={theme.dunes[2]}
                    d="M0,250 C250,150 500,350 750,250 C1000,150 1250,350 1500,250 L1500,300 L0,300 Z"
                />
            </div>
        </div>
    );
};

interface ShalatJadwal {
    tanggal: number;
    imsak: string;
    subuh: string;
    terbit: string;
    dhuha: string;
    dzuhur: string;
    ashar: string;
    maghrib: string;
    isya: string;
}

interface ShalatData {
    kabkota: string;
    provinsi: string;
    bulan: number;
    bulan_nama: string;
    tahun: number;
    jadwal: ShalatJadwal[];
}

interface HijriMonth {
    number: number;
    en: string;
    ar: string;
}

interface HijriDesignation {
    abbreviated: string;
    expanded: string;
}

interface HijriDate {
    date: string;
    format: string;
    day: string;
    weekday: { en: string; ar: string };
    month: HijriMonth;
    year: string;
    designation: HijriDesignation;
    holidays: string[];
}

interface GregorianMonth {
    number: number;
    en: string;
}

interface GregorianDate {
    date: string;
    format: string;
    day: string;
    weekday: { en: string };
    month: GregorianMonth;
    year: string;
}

interface CalendarDay {
    hijri: HijriDate;
    gregorian: GregorianDate;
}

export default function JadwalSholatPage() {
    const [dataSholat, setDataSholat] = useState<ShalatData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [errorType, setErrorType] = useState<"denied" | "unavailable" | "">("");
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hijriDate, setHijriDate] = useState("");
    const [hijriCalendar, setHijriCalendar] = useState<CalendarDay[]>([]);

    // 1. Update Jam Real-time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchLocation = () => {
        setLoading(true);
        setError("");
        setErrorType("");

        if (!navigator.geolocation) {
            setError("GPS tidak didukung oleh browser Anda.");
            setErrorType("unavailable");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const geoRes = await fetch(
                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
                );
                const geoData = await geoRes.json();

                const kota = geoData.localityInfo.administrative[3]?.name || geoData.city || "Kota Bogor";
                const provinsi = geoData.localityInfo.administrative[2]?.name || "Jawa Barat";

                const res = await fetch("https://equran.id/api/v2/shalat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        provinsi: provinsi,
                        kabkota: kota.includes("Kota") || kota.includes("Kabupaten") ? kota : `Kota ${kota}`,
                        bulan: new Date().getMonth() + 1,
                        tahun: new Date().getFullYear(),
                    }),
                });

                const today = new Date();
                const day = today.getDate();
                const month = today.getMonth() + 1;
                const year = today.getFullYear();

                const hijriRes = await fetch(
                    `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}`
                );
                const hijriJson = await hijriRes.json();

                if (hijriJson.code === 200) {
                    const hijri = hijriJson.data.hijri;
                    setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} H`);
                }

                const calRes = await fetch(
                    `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
                );
                const calJson = await calRes.json();

                if (calJson.code === 200) {
                    setHijriCalendar(calJson.data);
                }

                const json = await res.json();
                if (json.code === 200) {
                    setDataSholat(json.data);
                } else {
                    setError("Jadwal tidak tersedia untuk lokasi ini.");
                    setErrorType("unavailable");
                }
            } catch (err) {
                setError("Gagal menyambungkan ke server.");
                setErrorType("unavailable");
            } finally {
                setLoading(false);
            }
        }, (err) => {
            // err.code 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
            if (err.code === 1) {
                setError("Akses lokasi ditolak. Izinkan akses lokasi di pengaturan browser, lalu coba lagi.");
                setErrorType("denied");
            } else {
                setError("Gagal mendapatkan lokasi. Pastikan GPS aktif dan coba lagi.");
                setErrorType("unavailable");
            }
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    // --- LOGIKA HITUNG WAKTU ---
    const listJadwal = dataSholat?.jadwal || [];
    const tglHariIni = new Date().getDate();
    const hariIni = listJadwal.find((item: ShalatJadwal) => item.tanggal === tglHariIni);
    const firstDay = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
    ).getDay();

    const getMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(":").map(Number);
        return h * 60 + m;
    };

    const getNightTimes = () => {
        if (!hariIni) return null;

        const maghrib = getMinutes(hariIni.maghrib);
        let subuh = getMinutes(hariIni.subuh);

        // Handle kalau subuh di hari berikutnya
        if (subuh < maghrib) {
            subuh += 24 * 60;
        }

        const nightDuration = subuh - maghrib;

        const middleNight = maghrib + nightDuration / 2;
        const lastThird = subuh - nightDuration / 3;

        const formatTime = (minutes: number) => {
            const m = Math.floor(minutes % (24 * 60));
            const h = Math.floor(m / 60);
            const min = Math.floor(m % 60);
            return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
        };

        return {
            middleNight: formatTime(middleNight),
            lastThird: formatTime(lastThird),
        };
    };
    const nightTimes = getNightTimes();
    const paddedCalendar = [
        ...Array(firstDay).fill(null),
        ...hijriCalendar
    ];

    const daftarWaktu = [
        { name: "Imsak", time: hariIni?.imsak },
        { name: "Subuh", time: hariIni?.subuh, icon: <CloudSun size={16} /> },
        { name: "Terbit", time: hariIni?.terbit },
        { name: "Dzuhur", time: hariIni?.dzuhur, icon: <Sun size={16} /> },
        { name: "Ashar", time: hariIni?.ashar },
        { name: "Maghrib", time: hariIni?.maghrib, icon: <Sunset size={16} /> },
        { name: "Isya", time: hariIni?.isya, icon: <MoonStar size={16} /> },
        { name: "Tengah Malam", time: "00:00" },
        { name: "Sepertiga Malam", time: nightTimes?.lastThird },
    ];

    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // --- LOGIKA MENENTUKAN TEMA WAKTU (timeOfDay) ---
    const timeOfDay = useMemo(() => {
        if (!hariIni) return 'siang'; // Default

        const waktu = {
            subuh: getMinutes(hariIni.subuh),
            terbit: getMinutes(hariIni.terbit),
            dzuhur: getMinutes(hariIni.dzuhur),
            ashar: getMinutes(hariIni.ashar),
            maghrib: getMinutes(hariIni.maghrib),
            isya: getMinutes(hariIni.isya),
        };

        // Logika pembagian waktu (bisa disesuaikan)
        if (currentMinutes >= waktu.isya || currentMinutes < waktu.subuh) return 'malam';
        if (currentMinutes >= waktu.subuh && currentMinutes < waktu.terbit) return 'subuh';
        if (currentMinutes >= waktu.terbit && currentMinutes < waktu.dzuhur) return 'pagi';
        if (currentMinutes >= waktu.dzuhur && currentMinutes < waktu.ashar) return 'siang';
        if (currentMinutes >= waktu.ashar && currentMinutes < waktu.maghrib) return 'siang'; // Ashar masih siang cerah
        if (currentMinutes >= waktu.maghrib && currentMinutes < waktu.isya) return 'sore'; // Sunset
        return 'siang';
    }, [hariIni, currentMinutes]);

    // Logika mencari shalat berikutnya
    const getNextSholat = () => {
        if (!hariIni) return null;

        const nowRaw = currentTime.getHours() * 60 + currentTime.getMinutes();

        const maghrib = getMinutes(hariIni.maghrib);

        // 🔥 semua waktu setelah maghrib dianggap hari berikutnya
        let now = nowRaw;
        if (now < maghrib) {
            now += 24 * 60;
        }

        let candidates: any[] = [];

        for (const sholat of daftarWaktu) {
            if (!sholat.time) continue;

            let [h, m] = sholat.time.split(":").map(Number);
            let time = h * 60 + m;

            // 🔥 normalisasi waktu malam
            if (time < maghrib) {
                time += 24 * 60;
            }

            candidates.push({
                name: sholat.name,
                time,
            });
        }

        // 🔥 urutkan biar benar-benar kronologis
        candidates.sort((a, b) => a.time - b.time);

        // 🔥 cari yang paling dekat ke depan
        const next = candidates.find(c => c.time > now);

        if (!next) return null;

        const diff = next.time - now;
        return {
            name: next.name,
            hours: Math.floor(diff / 60),
            minutes: diff % 60,
        };
    };
    const nextSholat = getNextSholat();

    // Logika mencari shalat yang sedang aktif (30 menit pertama sejak masuk waktu)
    const getActiveSholat = () => {
        if (!hariIni) return null;

        const nowRaw = currentTime.getHours() * 60 + currentTime.getMinutes();
        const maghrib = getMinutes(hariIni.maghrib);

        let now = nowRaw;
        if (now < maghrib) {
            now += 24 * 60;
        }

        let candidates: any[] = [];

        for (const sholat of daftarWaktu) {
            if (!sholat.time) continue;

            let [h, m] = sholat.time.split(":").map(Number);
            let time = h * 60 + m;

            if (time < maghrib) {
                time += 24 * 60;
            }

            candidates.push({
                name: sholat.name,
                time,
            });
        }

        candidates.sort((a, b) => a.time - b.time);

        const active = [...candidates].reverse().find(c => now >= c.time && now < c.time + 30);
        return active ? { name: active.name } : null;
    };
    const activeSholat = getActiveSholat();

    if (loading) return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white/8 rounded-xl animate-pulse" />
                            <div className="h-6 w-40 bg-white/8 rounded-xl animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <SkeletonJadwal />
                </div>
            </main>
        </>
    );

    return (
        <>
            <Navbar />

            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">
                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition">
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl md:text-2xl font-black">
                                Jadwal <span className="text-primary">Sholat</span>
                            </h1>
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto flex flex-col gap-6">

                        {/* Desert Background Section with Fade Edges */}
                        <div
                            className="h-36 md:h-44 relative rounded-3xl overflow-hidden shadow-lg z-10"
                        >
                            <DynamicDesertBg timeOfDay={timeOfDay} />
                            <div className="absolute bottom-3 right-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-right">
                                <p className="text-2xl font-mono font-black ">
                                    {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs font-mono font-semibold ">
                                    {tglHariIni} {dataSholat?.bulan_nama} {dataSholat?.tahun}
                                </p>
                                <p className="text-xs font-mono opacity-70">
                                    {hijriDate}
                                </p>
                            </div>
                        </div>

                        {/* Location Info */}
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2 group">
                                <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition">
                                    <MapPin size={14} className="text-primary-2 group-hover:text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wilayah</span>
                                    <span className="text-sm font-black ">{dataSholat?.kabkota} dan Sekitarnya</span>
                                </div>
                            </div>

                            {nextSholat && (
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-primary-2 uppercase  block mb-1">Mendekati {nextSholat.name}</span>
                                    <div className="bg-primary-2 text-bg-primary px-3 py-1 rounded-full text-xs font-black animate-pulse inline-block">
                                        {nextSholat.hours > 0 ? `${nextSholat.hours}j ` : ""}{nextSholat.minutes}m lagi
                                    </div>
                                </div>
                            )}
                        </div>

                        {error ? (
                            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-4xl text-center text-red-400 space-y-4">
                                <Info className="mx-auto" size={36} />
                                <p className="text-sm font-bold leading-relaxed">{error}</p>

                                {errorType === "denied" && (
                                    <div className="space-y-3">
                                        <p className="text-xs text-red-400/70 leading-relaxed">
                                            Untuk mengaktifkan kembali: klik ikon kunci 🔒 di address bar browser → izinkan Lokasi → refresh halaman.
                                        </p>
                                        <button
                                            onClick={fetchLocation}
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl text-sm font-black text-red-400 transition-all active:scale-95"
                                        >
                                            <MapPin size={16} /> Coba Minta Akses Lagi
                                        </button>
                                    </div>
                                )}

                                {errorType === "unavailable" && (
                                    <button
                                        onClick={fetchLocation}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl text-sm font-black text-red-400 transition-all active:scale-95"
                                    >
                                        <MapPin size={16} /> Coba Lagi
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-12">

                                {/* List Waktu Sholat */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {daftarWaktu.map((s) => {
                                        const isActive = activeSholat?.name === s.name;
                                        const isNext = !activeSholat && nextSholat?.name === s.name;
                                        const highlight = isActive || isNext;
                                        return (
                                            <div
                                                key={s.name}
                                                className={`flex justify-between items-center p-6 rounded-4xl border transition-all duration-500 ${highlight
                                                    ? "bg-linear-to-br from-primary to-primary-2 border-transparent shadow-2xl shadow-primary/30"
                                                    : "bg-white/5 border-white/5 hover:border-white/10"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {highlight && <div className="w-1.5 h-8 bg-white rounded-full animate-grow" />}
                                                    <div className="flex flex-col">
                                                        <span className={`text-xs font-black uppercase tracking-widest ${highlight ? "text-white/80" : "text-gray-500"}`}>
                                                            {s.name}
                                                        </span>
                                                        {isActive && <span className="text-[10px] font-black text-white italic">Sudah Memasuki Waktu</span>}
                                                        {isNext && <span className="text-[10px] font-black text-white italic">Sedang Dinantikan</span>}
                                                    </div>
                                                </div>
                                                <span className="text-3xl font-mono font-black text-white">
                                                    {s.time || "--:--"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="overflow-x-auto custom-scroll">
                                    <div className="min-w-220">
                                        <p className="text-[10px] font-black mb-3 tracking-widest uppercase text-gray-400">Kalender Hijriah Bulan Ini</p>
                                        {/* Header hari */}
                                        <div className="grid grid-cols-7 text-[10px] text-white/50 font-bold text-center py-2 border-b border-b-white/10">
                                            <div>Ahad</div>
                                            <div>Senin</div>
                                            <div>Selasa</div>
                                            <div>Rabu</div>
                                            <div>Kamis</div>
                                            <div>Jum'at</div>
                                            <div>Sabtu</div>
                                        </div>

                                        {/* Grid tanggal */}
                                        <div className="grid grid-cols-7">
                                            {paddedCalendar.map((item, idx) => {
                                                if (!item) return <div key={idx} />;

                                                const hijriDay = item.hijri?.day;
                                                const gregDay = item.gregorian?.day;
                                                const gregMonth = item.gregorian?.month?.en;

                                                const isToday =
                                                    Number(item.gregorian?.day) === new Date().getDate();

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`p-3 text-center text-[10px] font-bold rounded-xl transition
            ${isToday
                                                                ? "bg-linear-to-br from-primary to-primary-2 border-transparent shadow-2xl shadow-primary/30 text-white"
                                                                : "text-white/70"
                                                            }`}
                                                    >
                                                        <div className="text-lg font-black leading-none">
                                                            {hijriDay}
                                                        </div>

                                                        <div className="text-sm font-bold leading-none">
                                                            {item.hijri?.month?.en}
                                                        </div>

                                                        <div className="text-[8px] opacity-60 mt-1">
                                                            {gregDay} {gregMonth}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}