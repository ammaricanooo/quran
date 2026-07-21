import Link from "next/link";
import { Compass, Clock, BookOpen, Layers, Wind, Quote, Github, Instagram, Facebook, Linkedin, SquareArrowOutUpRight, Gamepad2, Shield, ScrollText } from "lucide-react";

export default function Footer() {
    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, href: "/jadwal" },
        { name: "Juz", icon: <Layers size={20} />, href: "/juz" },
        { name: "Dzikir", icon: <Wind size={20} />, href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={20} />, href: "/hadits" },
        { name: "Kuis", icon: <Gamepad2 size={20} />, href: "/game" },
    ];

    const socialLinks = [
        { href: "https://linkedin.com/in/ammaricano", icon: <Linkedin />, label: "LinkedIn" },
        { href: "https://github.com/ammaricanooo", icon: <Github />, label: "Github" },
        { href: "https://instagram.com/ammaricano", icon: <Instagram />, label: "Instagram" },
        { href: "https://threads.com/@ammaricano", icon: <SquareArrowOutUpRight />, label: "Threads" },
    ];

    return (
        <footer className="py-8 border-t border-white/10">
            <div className="mx-auto w-full py-6 lg:py-8">
                <div className="md:flex md:justify-between gap-8">
                    <div className="mb-6 md:mb-0 md:max-w-sm">
                        <Link href="/" className="flex items-center">
                            <span className="text-heading self-center text-2xl font-semibold whitespace-nowrap">Al-Qur&apos;an Ku</span>
                        </Link>
                        <p className="text-white/50 mt-4 text-sm text-justify">
                            Aplikasi Al-Qur&apos;an digital yang menyediakan berbagai fitur untuk memudahkan pengguna dalam membaca, memahami, dan menghafal Al-Qur&apos;an. Dengan antarmuka yang user-friendly dan fitur-fitur seperti pencarian ayat, jadwal sholat, dan doa harian, aplikasi ini bertujuan untuk membantu pengguna dalam meningkatkan pemahaman dan kecintaan mereka terhadap Al-Qur&apos;an.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-0 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Links</h2>
                            <ul className="text-body font-medium">
                                {menuItems.map((item, i) => (
                                    <li key={i} className="mb-4">
                                        {item.href.startsWith("http") ? (
                                            <a
                                                href={item.href}
                                                className="hover:underline flex items-center gap-2"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {item.icon}
                                                {item.name}
                                            </a>
                                        ) : (
                                            <Link href={item.href} className="hover:underline flex items-center gap-2">
                                                {item.icon}
                                                {item.name}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Follow us</h2>
                            <ul className="flex flex-col gap-4 text-body font-medium">
                                {socialLinks.map((s) => (
                                    <li key={s.label}>
                                        <a href={s.href} className="hover:underline flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                                            {s.icon} {s.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4">
                                    <Link href="/privacy-policy" className="hover:underline flex items-center gap-2">
                                        <Shield />
                                        Kebijakan Privasi
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms-and-conditions" className="hover:underline flex items-center gap-2">
                                        <ScrollText />
                                        Syarat &amp; Ketentuan
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white/10 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-body sm:text-center">Made by Ammar Abdul Malik. All Rights Reserved.</span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <a href="https://github.com/ammaricanooo" className="text-body hover:text-heading" target="_blank" rel="noopener noreferrer">
                            <Github />
                        </a>
                        <a href="https://instagram.com/ammaricano" className="text-body hover:text-heading ms-5" target="_blank" rel="noopener noreferrer">
                            <Instagram />
                        </a>
                        <a href="https://facebook.com/ammaricano.27" className="text-body hover:text-heading ms-5" target="_blank" rel="noopener noreferrer">
                            <Facebook />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}