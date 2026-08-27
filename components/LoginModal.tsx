"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export default function LoginModal({
    isOpen,
    onClose,
    title = "Login Diperlukan",
    description = "Silakan login dengan akun Google untuk menyimpan bookmark dan progres Anda.",
}: LoginModalProps) {
    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            onClose();
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-bg-primary border border-white/20 backdrop-blur-2xl rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <h3 className="text-xl font-black text-white mb-2">{title}</h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                        {description}
                    </p>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-bg-primary hover:bg-gray-100 font-black py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Login dengan Google
                    </button>
                    <button
                        onClick={onClose}
                        className="mt-4 text-gray-400 hover:text-white text-sm font-medium transition"
                    >
                        Nanti saja
                    </button>
                </div>
            </div>
        </div>
    );
}
