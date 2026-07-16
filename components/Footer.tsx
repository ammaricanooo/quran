import { Compass, Clock, BookOpen, Layers, Wind, Quote, Github, Instagram, Facebook, Linkedin, SquareArrowOutUpRight, Gamepad2, Shield, ScrollText } from "lucide-react";

export default function Footer() {
    const menuItems = [
        { name: "Doa", icon: <BookOpen size={20} />, color: "bg-white/5", href: "/doa" },
        { name: "Kiblat", icon: <Compass size={20} />, color: "bg-white/5", href: "https://qiblafinder.withgoogle.com/" },
        { name: "Jadwal", icon: <Clock size={20} />, color: "bg-white/5", href: "/jadwal" },
        { name: "Juz", icon: <Layers size={20} />, color: "bg-white/5", href: "/juz" },
        { name: "Dzikir", icon: <Wind size={20} />, color: "bg-white/5", href: "/dzikir" },
        { name: "Hadits", icon: <Quote size={20} />, color: "bg-white/5", href: "/hadits" },
        { name: "Kuis", icon: <Gamepad2 size={20} />, color: "bg-white/5", href: "/game" },
    ];
    return (
        <footer className="py-8 border-t border-white/10">
            <div className="mx-auto w-full py-6 lg:py-8">
                <div className="md:flex md:justify-between gap-8">
                    <div className="mb-6 md:mb-0 md:max-w-sm">
                        <a href="/" className="flex items-center">
                            <span className="text-heading self-center text-2xl font-semibold whitespace-nowrap">Al-Qur'an Ku</span>
                        </a>
                        <p className="text-white/50 mt-4 text-sm text-justify">
                            Aplikasi Al-Qur'an digital yang menyediakan berbagai fitur untuk memudahkan pengguna dalam membaca, memahami, dan menghafal Al-Qur'an. Dengan antarmuka yang user-friendly dan fitur-fitur seperti pencarian ayat, jadwal sholat, dan doa harian, aplikasi ini bertujuan untuk membantu pengguna dalam meningkatkan pemahaman dan kecintaan mereka terhadap Al-Qur'an.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-0 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Links</h2>
                            <ul className="text-body font-medium">
                                {menuItems.map((item, i) => (
                                    <li key={i} className="mb-4">
                                        <a
                                            href={item.href}
                                            className="hover:underline flex items-center gap-2"
                                            target={item.href.startsWith("http") ? "_blank" : "_self"}
                                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                        >
                                            {item.icon}
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Follow us</h2>
                            <ul className="flex flex-col gap-4 text-body font-medium">
                                <li>
                                    <a href="https://linkedin.com/in/ammaricano" className="hover:underline flex items-center gap-2"><Linkedin /> LinkedIn</a>
                                </li>
                                <li>
                                    <a href="https://github.com/ammaricanooo" className="hover:underline flex items-center gap-2"><Github /> Github</a>
                                </li>
                                <li>
                                    <a href="https://instagram.com/ammaricano" className="hover:underline flex items-center gap-2"><Instagram /> Instagram</a>
                                </li>
                                <li>
                                    <a href="https://threads.com/@ammaricano" className="hover:underline flex items-center gap-2"><SquareArrowOutUpRight /> Threads</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-heading uppercase">Legal</h2>
                            <ul className="text-body font-medium">
                                <li className="mb-4">
                                    <a href="/privacy-policy" className="hover:underline flex items-center gap-2">
                                        <Shield />
                                        Kebijakan Privasi
                                    </a>
                                </li>
                                <li>
                                    <a href="/terms-and-conditions" className="hover:underline flex items-center gap-2">
                                        <ScrollText />
                                        Syarat &amp; Ketentuan
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-white/10 sm:mx-auto lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-body sm:text-center">Made by Ammar Abdul Malik. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <a href="https://github.com/ammaricanooo" className="text-body hover:text-heading">
                            <Github />
                        </a>
                        <a href="https://instagram.com/ammaricano" className="text-body hover:text-heading ms-5">
                            <Instagram />
                        </a>
                        <a href="https://facebook.com/ammaricano.27" className="text-body hover:text-heading ms-5">
                            <Facebook />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}