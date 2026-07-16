import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Syarat & Ketentuan — Al-Qur'an Ku",
    description: "Syarat dan ketentuan penggunaan aplikasi Al-Qur'an Ku yang mengatur hak dan kewajiban pengguna.",
};

const sections = [
    {
        title: "1. Penerimaan Syarat dan Ketentuan",
        content: [
            {
                subtitle: "",
                body: "Dengan mengakses atau menggunakan aplikasi Al-Qur'an Ku, Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat dan Ketentuan ini beserta seluruh kebijakan yang berlaku. Jika Anda tidak menyetujui syarat ini, Anda tidak diizinkan untuk menggunakan layanan kami.",
            },
        ],
    },
    {
        title: "2. Deskripsi Layanan",
        content: [
            {
                subtitle: "2.1 Tentang Aplikasi",
                body: "Al-Qur'an Ku adalah aplikasi web yang menyediakan akses digital terhadap Al-Qur'an beserta terjemahan, tafsir, murottal, jadwal sholat, doa harian, dzikir, hadits Arbain, dan fitur-fitur pendukung ibadah lainnya.",
            },
            {
                subtitle: "2.2 Ketersediaan Layanan",
                body: "Kami berupaya menjaga ketersediaan layanan selama 24 jam sehari, 7 hari seminggu. Namun kami tidak menjamin bahwa layanan akan selalu tersedia tanpa gangguan, terutama karena ketergantungan pada layanan API pihak ketiga yang berada di luar kendali kami.",
            },
            {
                subtitle: "2.3 Perubahan Layanan",
                body: "Kami berhak untuk mengubah, menangguhkan, atau menghentikan fitur tertentu kapan saja tanpa pemberitahuan sebelumnya, termasuk menambah atau menghapus konten dan fungsi aplikasi.",
            },
        ],
    },
    {
        title: "3. Akun Pengguna",
        content: [
            {
                subtitle: "3.1 Registrasi Akun",
                body: "Beberapa fitur aplikasi, seperti menyimpan progres bacaan, memerlukan login menggunakan akun Google. Anda bertanggung jawab untuk menjaga kerahasiaan akses akun Anda.",
            },
            {
                subtitle: "3.2 Tanggung Jawab Akun",
                body: "Anda sepenuhnya bertanggung jawab atas semua aktivitas yang terjadi di bawah akun Anda. Harap segera memberitahu kami jika Anda mengetahui adanya penggunaan akun Anda yang tidak sah.",
            },
            {
                subtitle: "3.3 Penghentian Akun",
                body: "Kami berhak menangguhkan atau menghentikan akun Anda jika kami memiliki alasan yang cukup untuk meyakini bahwa Anda telah melanggar Syarat dan Ketentuan ini.",
            },
        ],
    },
    {
        title: "4. Penggunaan yang Diizinkan",
        content: [
            {
                subtitle: "4.1 Lisensi Penggunaan",
                body: "Kami memberikan Anda lisensi terbatas, non-eksklusif, tidak dapat dipindahtangankan, dan dapat dicabut untuk mengakses dan menggunakan aplikasi ini untuk keperluan pribadi dan non-komersial.",
            },
            {
                subtitle: "4.2 Konten Al-Qur'an",
                body: "Seluruh teks, terjemahan, dan tafsir Al-Qur'an yang tersedia di aplikasi ini bersumber dari API publik yang terpercaya. Anda diizinkan untuk membaca, berbagi ayat, dan menggunakan konten untuk keperluan pendidikan dan ibadah dengan tetap menjaga adab dan kesopanan.",
            },
        ],
    },
    {
        title: "5. Penggunaan yang Dilarang",
        content: [
            {
                subtitle: "",
                body: "Anda dilarang keras menggunakan aplikasi ini untuk: (a) tujuan ilegal atau melanggar peraturan yang berlaku; (b) mendistribusikan konten berbahaya, menyinggung, atau tidak pantas; (c) melakukan rekayasa balik, dekompilasi, atau pembongkaran kode aplikasi; (d) menggunakan bot, scraper, atau alat otomatis lainnya untuk mengakses layanan tanpa izin tertulis dari kami; (e) mengganggu atau merusak integritas atau kinerja layanan; (f) menampilkan atau menggunakan konten Al-Qur'an dengan cara yang tidak menghormati kesuciannya.",
            },
        ],
    },
    {
        title: "6. Kekayaan Intelektual",
        content: [
            {
                subtitle: "6.1 Hak Cipta Aplikasi",
                body: "Desain antarmuka, kode sumber, logo, dan elemen visual aplikasi ini merupakan karya orisinal yang dilindungi oleh hak cipta. Anda tidak diizinkan untuk menyalin, mendistribusikan, atau membuat karya turunan tanpa izin tertulis dari kami.",
            },
            {
                subtitle: "6.2 Konten Pihak Ketiga",
                body: "Konten yang bersumber dari pihak ketiga (teks Al-Qur'an, tafsir, hadits, murottal) tunduk pada lisensi dan hak cipta masing-masing penyedia. Al-Qur'an Ku tidak mengklaim kepemilikan atas konten tersebut.",
            },
        ],
    },
    {
        title: "7. Penafian dan Batasan Tanggung Jawab",
        content: [
            {
                subtitle: "7.1 Penafian Layanan",
                body: "Layanan ini disediakan \"sebagaimana adanya\" (as-is) tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa layanan akan bebas dari kesalahan, gangguan, atau virus.",
            },
            {
                subtitle: "7.2 Akurasi Konten",
                body: "Meskipun kami berupaya menyajikan konten yang akurat, kami tidak menjamin keakuratan, kelengkapan, atau kekinian dari seluruh informasi. Untuk keperluan keagamaan yang bersifat formal, kami menyarankan Anda merujuk pada sumber-sumber resmi dan otoritatif.",
            },
            {
                subtitle: "7.3 Batasan Kerugian",
                body: "Sejauh diizinkan oleh hukum yang berlaku, kami tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.",
            },
        ],
    },
    {
        title: "8. Tautan ke Situs Pihak Ketiga",
        content: [
            {
                subtitle: "",
                body: "Aplikasi ini dapat memuat tautan ke situs web pihak ketiga, seperti layanan penentuan arah kiblat. Kami tidak memiliki kendali atas konten atau praktik privasi situs-situs tersebut dan tidak bertanggung jawab atas kontennya. Penggunaan situs pihak ketiga sepenuhnya merupakan risiko Anda sendiri.",
            },
        ],
    },
    {
        title: "9. Hukum yang Berlaku",
        content: [
            {
                subtitle: "",
                body: "Syarat dan Ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia. Setiap sengketa yang timbul dari atau terkait dengan syarat ini akan diselesaikan melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui jalur hukum yang berlaku di Indonesia.",
            },
        ],
    },
    {
        title: "10. Perubahan Syarat dan Ketentuan",
        content: [
            {
                subtitle: "",
                body: "Kami berhak untuk mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini dengan memperbarui tanggal \"Terakhir Diperbarui\". Penggunaan Anda yang berkelanjutan atas layanan setelah perubahan tersebut merupakan penerimaan Anda atas syarat yang telah diperbarui.",
            },
        ],
    },
    {
        title: "11. Hubungi Kami",
        content: [
            {
                subtitle: "",
                body: "Jika Anda memiliki pertanyaan atau keberatan mengenai Syarat dan Ketentuan ini, silakan hubungi kami melalui: GitHub: github.com/ammaricanooo atau Instagram: @ammaricano",
            },
        ],
    },
];

export default function TermsAndConditionsPage() {
    return (
        <>
            <Navbar />
            <main className="h-screen bg-linear-to-t from-bg-primary to-bg-primary-2 text-white flex flex-col overflow-hidden lg:ml-72 transition-all">

                {/* ── HEADER ── */}
                <div className="flex-none px-4 md:px-8 py-4 border-b border-white/5">
                    <header className="max-w-5xl mx-auto w-full flex items-center gap-3">
                        <Link href="/" className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-secondarys/20 border border-secondarys/30 rounded-xl flex items-center justify-center shrink-0">
                                <ScrollText size={16} className="text-secondarys-2" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-black">
                                Syarat &amp; <span className="text-secondarys-2">Ketentuan</span>
                            </h1>
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Intro card */}
                        <div className="bg-secondarys/10 border border-secondarys/20 rounded-4xl p-6">
                            <p className="text-[10px] font-black text-secondarys-2 uppercase tracking-widest mb-2">
                                Terakhir Diperbarui: 16 Juli 2026
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Syarat dan Ketentuan ini merupakan perjanjian yang sah antara Anda sebagai pengguna dan <strong className="text-white">Al-Qur'an Ku</strong> selaku penyedia layanan. Harap baca dokumen ini dengan saksama sebelum menggunakan aplikasi kami.
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed mt-3">
                                Dengan mengakses atau menggunakan layanan Al-Qur'an Ku, Anda dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan yang tertuang di sini.
                            </p>
                        </div>

                        {/* Sections */}
                        {sections.map((section, i) => (
                            <div key={i} className="space-y-3">
                                <h2 className="text-base font-black text-white border-l-4 border-secondarys-2 pl-4">
                                    {section.title}
                                </h2>
                                <div className="space-y-3 pl-4">
                                    {section.content.map((item, j) => (
                                        <div key={j} className="bg-white/5 border border-white/5 rounded-3xl p-5">
                                            {item.subtitle && (
                                                <p className="text-[10px] font-black text-secondarys-2 uppercase tracking-widest mb-2">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {item.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <Footer />
                    </div>
                </div>
            </main>
        </>
    );
}
