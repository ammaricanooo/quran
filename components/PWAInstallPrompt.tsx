"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string; }>; 
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const dismissed = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", dismissed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", dismissed);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setIsVisible(false);
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-4 z-[100] md:left-auto md:right-6 md:w-[360px]">
      <div className="rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 ring-1 ring-blue-400/30">
            <img
              src="/app/web-app-manifest-192x192.png"
              alt="Al-Qur'an Ku"
              className="h-9 w-9 rounded-xl object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Install App</p>
            <h3 className="mt-1 text-base font-bold text-white">Pasang Al-Qur&apos;an Ku</h3>
            <p className="mt-1 text-xs text-slate-300">Akses lebih cepat seperti aplikasi dan tetap aman di layar utama.</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="rounded-full px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Nanti
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
