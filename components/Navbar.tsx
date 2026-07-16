"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  Clock,
  Layers,
  Wind,
  Quote,
  Home,
  Menu,
  X,
  Gamepad2,
  ScrollText,
} from "lucide-react";

const menuItems = [
  { name: "Home",   icon: <Home size={20} />,      href: "/" },
  { name: "Doa",    icon: <BookOpen size={20} />,   href: "/doa" },
  { name: "Kiblat", icon: <Compass size={20} />,    href: "https://qiblafinder.withgoogle.com/", external: true },
  { name: "Jadwal", icon: <Clock size={20} />,      href: "/jadwal" },
  { name: "Juz",    icon: <Layers size={20} />,     href: "/juz" },
  { name: "Dzikir", icon: <Wind size={20} />,       href: "/dzikir" },
  { name: "Hadits", icon: <Quote size={20} />,      href: "/hadits" },
  { name: "Tahlil", icon: <ScrollText size={20} />,   href: "/tahlil" },
  { name: "Kuis",   icon: <Gamepad2 size={20} />,   href: "/game" },
];

// Bottom nav items (5 items max for mobile) — menu utama yang selalu terlihat
const bottomNavItems = [
  { name: "Home",   icon: <Home size={22} />,   href: "/" },
  { name: "Juz",    icon: <Layers size={22} />, href: "/juz" },
  { name: "Jadwal", icon: <Clock size={22} />,  href: "/jadwal" },
  { name: "Dzikir", icon: <Wind size={22} />,   href: "/dzikir" },
  { name: "Lainnya", icon: <Menu size={22} />,  href: null }, // opens bottom sheet
];

// Menu yang TIDAK tampil di bottom nav, akan muncul di bottom sheet
const extraMenuItems = [
  { name: "Doa",    icon: <BookOpen size={22} />,  href: "/doa",    accent: "from-blue-500/20 to-blue-600/5 border-blue-500/20",       iconColor: "text-blue-400" },
  { name: "Kiblat", icon: <Compass size={22} />,   href: "https://qiblafinder.withgoogle.com/", external: true, accent: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20", iconColor: "text-emerald-400" },
  { name: "Hadits", icon: <Quote size={22} />,     href: "/hadits", accent: "from-rose-500/20 to-rose-600/5 border-rose-500/20",       iconColor: "text-rose-400" },
  { name: "Tahlil", icon: <ScrollText size={22} />, href: "/tahlil", accent: "from-pink-500/20 to-pink-600/5 border-pink-500/20",       iconColor: "text-pink-400" },
  { name: "Kuis",   icon: <Gamepad2 size={22} />,  href: "/game",   accent: "from-violet-500/20 to-violet-600/5 border-violet-500/20", iconColor: "text-violet-400" },
];

interface NavbarProps {
  activeItem?: string;
  hideSidebar?: boolean; // sembunyikan sidebar desktop (untuk halaman dengan sidebar custom)
}

export default function Navbar({ activeItem, hideSidebar }: NavbarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      {!hideSidebar && (
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72
            bg-gradient-to-b from-bg-primary-2 to-bg-primary
            border-r border-white/5 text-white
            transition-transform duration-300
            lg:translate-x-0
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="flex flex-col h-full p-6">
            {/* Sidebar header */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
                  <BookOpen size={18} className="text-primary-2" />
                </div>
                <span className="text-lg font-black">Al-Qur'an Ku</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 bg-white/5 hover:bg-white/10 rounded-xl transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto scrollbar-hide -mx-1 px-1">
              {menuItems.map((item) => {
                const active = item.href !== null && !item.external && isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-4 px-4 py-3 rounded-2xl
                      transition-all duration-200 border group
                      ${active
                        ? "bg-primary/15 border-primary/20 text-white"
                        : "border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                      }
                    `}
                  >
                    <div
                      className={`
                        p-2 rounded-xl transition-all
                        ${active
                          ? "bg-primary/20 text-primary-2"
                          : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white"
                        }
                      `}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold">{item.name}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-5 bg-primary-2 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
      )}

      {/* ─── MOBILE OVERLAY ─── */}
      {isSidebarOpen && !hideSidebar && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ─── MOBILE BOTTOM NAVIGATION ─── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 pb-2">
        <div className="bg-bg-primary/80 backdrop-blur-2xl border border-white/10 rounded-3xl px-2 py-2 shadow-2xl">
          <div className="flex items-center justify-around">
            {bottomNavItems.map((item) => {
              if (item.href === null) {
                // "Lainnya" button — opens bottom sheet
                return (
                  <button
                    key={item.name}
                    onClick={() => setIsBottomSheetOpen(true)}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-gray-400 transition-all"
                  >
                    <div className="p-1">{item.icon}</div>
                    <span className="text-[10px] font-bold">{item.name}</span>
                  </button>
                );
              }

              const active = isActive(item.href!);
              return (
                <Link
                  key={item.name}
                  href={item.href!}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                    ${active ? "text-white" : "text-gray-500"}
                  `}
                >
                  <div
                    className={`
                      p-1.5 rounded-xl transition-all
                      ${active ? "bg-primary/20 text-primary-2" : ""}
                    `}
                  >
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ─── BOTTOM SHEET "LAINNYA" ─── */}
      {/* Overlay */}
      {isBottomSheetOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setIsBottomSheetOpen(false)}
        />
      )}
      {/* Sheet panel */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 lg:hidden
          transition-transform duration-300 ease-out
          ${isBottomSheetOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="bg-bg-primary-2 border border-white/10 rounded-t-3xl px-6 pt-5 pb-10 shadow-2xl">
          {/* Handle bar */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Menu Lainnya</h3>
            <button
              onClick={() => setIsBottomSheetOpen(false)}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {extraMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsBottomSheetOpen(false)}
                className={`
                  flex flex-col items-center gap-2.5 p-4 rounded-3xl
                  bg-gradient-to-b ${item.accent} border
                  hover:brightness-125 active:scale-95
                  transition-all duration-200 group text-center
                `}
              >
                <div className={`${item.iconColor} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-white/80 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Re-export hook biar pages bisa pakai tanpa import tambahan
export { menuItems };
