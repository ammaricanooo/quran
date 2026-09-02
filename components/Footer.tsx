import Link from "next/link";
import { Compass, Clock, BookOpen, Layers, Wind, Quote, Github, Instagram, Linkedin, Gamepad2, Shield, ScrollText, AtSign, BookHeart, Newspaper, Sparkles, User, Info, Heart } from "lucide-react";

export default function Footer() {
    const menuItems = [
        { name: "Doa", icon: <BookOpen size={18} />, href: "/doa" },
        { name: "Kiblat", icon: <Compass size={18} />, href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={18} />, href: "/jadwal" },
        { name: "Juz", icon: <Layers size={18} />, href: "/juz" },
        { name: "Dzikir", icon: <Wind size={18} />, href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={18} />, href: "/hadits" },
        { name: "Asmaul Husna", icon: <Sparkles size={18} />, href: "/asmaul-husna" },
        { name: "Tahlil", icon: <ScrollText size={18} />, href: "/tahlil" },
        { name: "Maulid", icon: <BookHeart size={18} />, href: "/maulid" },
        { name: "Artikel", icon: <Newspaper size={18} />, href: "/articles" },
        { name: "Kuis", icon: <Gamepad2 size={18} />, href: "/game" },
        { name: "Profil", icon: <User size={18} />, href: "/profil" },
        { name: "Tentang", icon: <Info size={18} />, href: "/tentang" },
    ];

    const socialLinks = [
        { href: "https://linkedin.com/in/ammaricano", icon: <Linkedin size={18} />, label: "LinkedIn Ammar Abdul Malik" },
        { href: "https://github.com/ammaricanooo", icon: <Github size={18} />, label: "GitHub Ammar Abdul Malik" },
        { href: "https://instagram.com/ammaricano", icon: <Instagram size={18} />, label: "Instagram Ammar Abdul Malik" },
        { href: "https://threads.com/@ammaricano", icon: <AtSign size={18} />, label: "Threads Ammar Abdul Malik" },
    ];

    return (
        <footer className="py-8 border-t border-white/10" itemScope itemType="https://schema.org/WPFooter">
            <div className="mx-auto w-full py-6 lg:py-8">
                <div className="md:flex md:justify-between gap-8">
                    <div className="mb-6 md:mb-0 md:max-w-sm">
                        <Link href="/" className="flex items-center">
                            <span className="text-white self-center text-2xl font-black whitespace-nowrap">Al-Qur&apos;an Ku</span>
                        </Link>
                        <p className="text-gray-400 mt-4 text-sm leading-relaxed text-justify">
                            Aplikasi Al-Qur&apos;an digital Indonesia terlengkap karya <strong>Ammar Abdul Malik</strong>. Menyediakan bacaan 114 Surah, 30 Juz, terjemahan resmi, audio murottal, jadwal sholat, doa harian, hadits shahih, asmaul husna, dan dzikir secara gratis untuk seluruh umat muslim.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-4 text-xs font-black text-white uppercase tracking-widest">Fitur Utama</h2>
                            <ul className="text-gray-400 font-medium text-sm space-y-3">
                                {menuItems.slice(0, 6).map((item) => (
                                    <li key={item.name}>
                                        {item.href.startsWith("http") ? (
                                            <a
                                                href={item.href}
                                                className="hover:text-white transition-colors flex items-center gap-2"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </a>
                                        ) : (
                                            <Link href={item.href} className="hover:text-white transition-colors flex items-center gap-2">
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-xs font-black text-white uppercase tracking-widest">Lainnya</h2>
                            <ul className="text-gray-400 font-medium text-sm space-y-3">
                                {menuItems.slice(6).map((item) => (
                                    <li key={item.name}>
                                        <Link href={item.href} className="hover:text-white transition-colors flex items-center gap-2">
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Kontak Pengembang</span>
                                    <div className="flex items-center gap-3">
                                        {socialLinks.map((s) => (
                                            <a key={s.label} href={s.href} aria-label={s.label} title={s.label} className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg bg-white/5 hover:bg-white/10" target="_blank" rel="noopener noreferrer">
                                                {s.icon}
                                            </a>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-4 text-xs font-black text-white uppercase tracking-widest">Tentang &amp; Legal</h2>
                            <ul className="text-gray-400 font-medium text-sm space-y-3">
                                <li>
                                    <Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-2">
                                        <Shield size={18} />
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms-and-conditions" className="hover:text-white transition-colors flex items-center gap-2">
                                        <ScrollText size={18} />
                                        Syarat &amp; Ketentuan
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white/10 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between text-xs text-gray-500">
                    <span>Dibuat dengan <Heart size={12} className="inline text-red-500 fill-red-500 mx-0.5" /> oleh <a href="https://linkedin.com/in/ammaricano" target="_blank" rel="noopener noreferrer" className="text-gray-300 font-semibold hover:underline">Ammar Abdul Malik</a> (Ammaricano). Hak Cipta Dilindungi.</span>
                    <span className="mt-2 sm:mt-0 text-gray-500">Al-Qur&apos;an Ku &bull; Digital Quran Platform</span>
                </div>
            </div>
        </footer>
    );
}