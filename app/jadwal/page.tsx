"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Info } from "lucide-react";

export default function JadwalSholatPage() {
    const [dataSholat, setDataSholat] = useState<any>(null);
    const [locationName, setLocationName] = useState({ kota: "", provinsi: "" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentTime, setCurrentTime] = useState(new Date());

    // 1. Update Jam Real-time
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const getLocation = () => {
            if (!navigator.geolocation) {
                setError("GPS tidak didukung oleh browser Anda.");
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

                    setLocationName({ kota, provinsi });

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

                    const json = await res.json();
                    if (json.code === 200) {
                        setDataSholat(json.data);
                    } else {
                        setError("Jadwal tidak tersedia untuk lokasi ini.");
                    }
                } catch (err) {
                    setError("Gagal menyambungkan ke server.");
                } finally {
                    setLoading(false);
                }
            }, () => {
                setError("Akses lokasi ditolak.");
                setLoading(false);
            });
        };

        getLocation();
    }, []);

    // --- LOGIKA HITUNG WAKTU ---
    const listJadwal = dataSholat?.jadwal || [];
    const tglHariIni = new Date().getDate();
    const hariIni = listJadwal.find((item: any) => item.tanggal === tglHariIni);

    const daftarWaktu = [
        { name: "Imsak", time: hariIni?.imsak },
        { name: "Subuh", time: hariIni?.subuh },
        { name: "Terbit", time: hariIni?.terbit },
        { name: "Dzuhur", time: hariIni?.dzuhur },
        { name: "Ashar", time: hariIni?.ashar },
        { name: "Maghrib", time: hariIni?.maghrib },
        { name: "Isya", time: hariIni?.isya },
    ];

    // Logika mencari shalat berikutnya
    const getNextSholat = () => {
        if (!hariIni) return null;

        const now = currentTime.getHours() * 60 + currentTime.getMinutes();

        for (const sholat of daftarWaktu) {
            if (!sholat.time) continue;
            const [h, m] = sholat.time.split(":").map(Number);
            const sholatTime = h * 60 + m;

            if (sholatTime > now) {
                const diff = sholatTime - now;
                const hours = Math.floor(diff / 60);
                const minutes = diff % 60;
                return { name: sholat.name, hours, minutes };
            }
        }
        return null; // Jika sudah lewat Isya
    };

    const nextSholat = getNextSholat();

    if (loading) return (
        <div className="h-screen bg-bg-primary flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-4 border-primary-2 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm opacity-70 italic">Mendeteksi lokasi...</p>
        </div>
    );

    return (
        <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex justify-center p-6">
            <div className="w-full h-full max-w-4xl flex flex-col overflow-hidden">

                {/* Header & Jam: Layout Stacked agar seimbang */}
                <header className="pb-6 flex flex-col">
                    <div className="flex flex-col gap-4 mb-4">
                        <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl transition">
                            <ArrowLeft size={20} />
                        </Link>
                    </div>

                    <div className="text-right flex items-center justify-between">
                        <h1 className="text-4xl font-black tracking-tighter leading-none flex flex-col items-start">
                            Jadwal<span className="text-primary-2">Sholat</span>
                        </h1>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                            <p className="text-[10px] font-black text-primary-2 uppercase tracking-[0.2em] mb-1">Sekarang</p>
                            <p className="text-3xl font-mono font-black tracking-tighter">
                                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto scrollbar-hide pb-20">
                    {error ? (
                        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] text-center text-red-400">
                            <Info className="mx-auto mb-3" size={32} />
                            <p className="text-sm font-bold">{error}</p>
                        </div>
                    ) : (
                        <div className="space-y-6">

                            {/* Location & Badge: Menggantung di atas list */}
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2 group">
                                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition">
                                        <MapPin size={14} className="text-primary-2 group-hover:text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wilayah</span>
                                        <span className="text-sm font-black tracking-tight">{dataSholat?.kabkota} dan Sekitarnya</span>
                                    </div>
                                </div>

                                {nextSholat && (
                                    <div className="text-right">
                                        <span className="text-[9px] font-black text-primary-2 uppercase tracking-tighter block mb-1">Mendekati {nextSholat.name}</span>
                                        <div className="bg-primary-2 text-bg-primary px-3 py-1 rounded-full text-xs font-black animate-pulse inline-block">
                                            {nextSholat.hours > 0 ? `${nextSholat.hours}j ` : ""}{nextSholat.minutes}m lagi
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* List Waktu Sholat */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {daftarWaktu.map((s) => {
                                    const isNext = nextSholat?.name === s.name;
                                    return (
                                        <div
                                            key={s.name}
                                            className={`flex justify-between items-center p-6 rounded-4xl border transition-all duration-500 ${isNext
                                                ? "bg-linear-to-br from-primary to-primary-2 border-transparent shadow-2xl shadow-primary/30"
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {isNext && <div className="w-1.5 h-8 bg-white rounded-full animate-grow" />}
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-black uppercase tracking-widest ${isNext ? "text-white/80" : "text-gray-500"}`}>
                                                        {s.name}
                                                    </span>
                                                    {isNext && <span className="text-[10px] font-black text-white italic">Sedang Dinantikan</span>}
                                                </div>
                                            </div>
                                            <span className={`text-3xl font-mono font-black tracking-tighter ${isNext ? "text-white" : "text-primary-2"}`}>
                                                {s.time || "--:--"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer Data */}
                            <footer className="mt-8 text-center pb-10">
                                <div className="inline-block px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                                        {tglHariIni} {dataSholat?.bulan_nama} {dataSholat?.tahun} • AL-QUR'AN KU
                                    </p>
                                </div>
                            </footer>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}