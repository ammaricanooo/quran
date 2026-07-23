import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kebijakan Privasi — Al-Qur'an Ku",
    description: "Kebijakan privasi aplikasi Al-Qur'an Ku tentang bagaimana kami mengumpulkan, menggunakan, dan melindungi data pengguna.",
};

const sections = [
    {
        title: "1. Informasi yang Kami Kumpulkan",
        content: [
            {
                subtitle: "1.1 Data yang Anda Berikan Secara Langsung",
                body: "Ketika Anda login menggunakan akun Google, kami menerima informasi dasar profil Anda yang mencakup nama tampilan, alamat email, dan foto profil. Informasi ini digunakan semata-mata untuk mengidentifikasi akun Anda di dalam aplikasi.",
            },
            {
                subtitle: "1.2 Data yang Dikumpulkan Secara Otomatis",
                body: "Kami menyimpan data progres bacaan Anda (surah dan ayat terakhir yang dibaca) di layanan Firebase Firestore agar dapat diakses kembali di sesi berikutnya. Kami juga menggunakan data lokasi perangkat Anda secara sementara untuk menentukan jadwal sholat yang sesuai dengan wilayah Anda. Data lokasi tidak disimpan di server kami.",
            },
            {
                subtitle: "1.3 Data yang Tidak Kami Kumpulkan",
                body: "Kami tidak mengumpulkan data sensitif seperti nomor telepon, alamat fisik, nomor kartu kredit, atau informasi keuangan apa pun. Kami tidak melacak aktivitas penelusuran Anda di luar aplikasi ini.",
            },
        ],
    },
    {
        title: "2. Cara Kami Menggunakan Informasi Anda",
        content: [
            {
                subtitle: "2.1 Personalisasi Pengalaman",
                body: "Data progres bacaan digunakan untuk menampilkan fitur 'Terakhir Dibaca' sehingga Anda dapat melanjutkan membaca dari tempat Anda berhenti.",
            },
            {
                subtitle: "2.2 Layanan Jadwal Sholat",
                body: "Data lokasi digunakan secara real-time hanya untuk menentukan jadwal sholat dan tidak pernah dikirim ke pihak ketiga selain layanan penentuan jadwal yang bersifat publik.",
            },
            {
                subtitle: "2.3 Peningkatan Aplikasi",
                body: "Kami dapat menggunakan data agregat dan anonim untuk memahami bagaimana fitur-fitur aplikasi digunakan dan melakukan perbaikan.",
            },
        ],
    },
    {
        title: "3. Berbagi Data dengan Pihak Ketiga",
        content: [
            {
                subtitle: "3.1 Layanan yang Kami Gunakan",
                body: "Aplikasi ini menggunakan layanan pihak ketiga berikut: Firebase (Google LLC) untuk autentikasi dan penyimpanan data, serta API publik equran.id, aladhan.com, dan bigdatacloud.net untuk data konten Al-Qur'an, kalender Hijriah, dan informasi lokasi. Setiap layanan tunduk pada kebijakan privasi masing-masing.",
            },
            {
                subtitle: "3.2 Tidak Ada Penjualan Data",
                body: "Kami tidak menjual, menyewakan, atau memperdagangkan informasi pribadi Anda kepada pihak ketiga manapun untuk tujuan pemasaran atau komersial.",
            },
            {
                subtitle: "3.3 Pengungkapan Berdasarkan Hukum",
                body: "Kami dapat mengungkapkan informasi Anda jika diwajibkan oleh hukum yang berlaku, proses hukum, atau permintaan yang sah dari otoritas pemerintah.",
            },
        ],
    },
    {
        title: "4. Keamanan Data",
        content: [
            {
                subtitle: "4.1 Langkah Perlindungan",
                body: "Kami menggunakan Firebase Security Rules untuk memastikan setiap pengguna hanya dapat membaca dan menulis data miliknya sendiri. Seluruh komunikasi data menggunakan protokol HTTPS yang terenkripsi.",
            },
            {
                subtitle: "4.2 Batasan Keamanan",
                body: "Meskipun kami berupaya keras melindungi data Anda, tidak ada metode transmisi atau penyimpanan elektronik yang 100% aman. Kami tidak dapat menjamin keamanan mutlak atas informasi yang Anda kirimkan.",
            },
        ],
    },
    {
        title: "5. Hak-Hak Anda",
        content: [
            {
                subtitle: "5.1 Akses dan Koreksi",
                body: "Anda berhak mengakses informasi pribadi yang kami simpan tentang Anda. Jika ada informasi yang tidak akurat, Anda dapat memperbarui profil melalui pengaturan akun Google Anda.",
            },
            {
                subtitle: "5.2 Penghapusan Data",
                body: "Anda dapat meminta penghapusan seluruh data Anda dengan menghubungi kami melalui informasi kontak di bawah. Kami akan memproses permintaan tersebut dalam waktu 30 hari kerja.",
            },
            {
                subtitle: "5.3 Penarikan Izin",
                body: "Anda dapat mencabut izin akses lokasi kapan saja melalui pengaturan browser atau perangkat Anda. Mencabut izin ini akan menonaktifkan fitur jadwal sholat berbasis lokasi.",
            },
        ],
    },
    {
        title: "6. Cookie dan Penyimpanan Lokal",
        content: [
            {
                subtitle: "",
                body: "Aplikasi ini menggunakan local storage dan session storage browser untuk menyimpan preferensi pengguna seperti qari yang dipilih. Data ini tersimpan sepenuhnya di perangkat Anda dan tidak dikirim ke server kami. Anda dapat menghapusnya kapan saja melalui pengaturan browser.",
            },
        ],
    },
    {
        title: "7. Privasi Anak-anak",
        content: [
            {
                subtitle: "",
                body: "Layanan ini tidak ditujukan kepada anak-anak di bawah usia 13 tahun. Kami tidak secara sengaja mengumpulkan informasi pribadi dari anak-anak di bawah usia tersebut. Jika Anda adalah orang tua atau wali dan mengetahui bahwa anak Anda telah memberikan informasi pribadi kepada kami, harap hubungi kami segera.",
            },
        ],
    },
    {
        title: "8. Perubahan Kebijakan Privasi",
        content: [
            {
                subtitle: "",
                body: "Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberitahukan perubahan signifikan dengan memperbarui tanggal \"Terakhir Diperbarui\" di bagian atas halaman ini. Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.",
            },
        ],
    },
    {
        title: "9. Hubungi Kami",
        content: [
            {
                subtitle: "",
                body: "Jika Anda memiliki pertanyaan, kekhawatiran, atau permintaan terkait kebijakan privasi ini atau penanganan data pribadi Anda, silakan hubungi kami melalui: GitHub: github.com/ammaricanooo atau Instagram: @ammaricano",
            },
        ],
    },
];

export default function PrivacyPolicyPage() {
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
                            <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center shrink-0">
                                <Shield size={16} className="text-primary-2" />
                            </div>
                            <h1 className="text-xl md:text-2xl font-black">
                                Kebijakan <span className="text-primary-2">Privasi</span>
                            </h1>
                        </div>
                    </header>
                </div>

                {/* ── CONTENT ── */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-8 py-6 pb-24 lg:pb-6">
                    <div className="max-w-5xl mx-auto space-y-6">

                        {/* Intro card */}
                        <div className="bg-primary/10 border border-primary/20 rounded-4xl p-6">
                            <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest mb-2">
                                Terakhir Diperbarui: 16 Juli 2026
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Selamat datang di <strong className="text-white">Al-Qur'an Ku</strong>. Kami berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi informasi Anda ketika menggunakan aplikasi kami.
                            </p>
                            <p className="text-gray-300 text-sm leading-relaxed mt-3">
                                Dengan menggunakan aplikasi ini, Anda menyatakan telah membaca dan menyetujui Kebijakan Privasi ini. Jika Anda tidak setuju dengan kebijakan ini, harap hentikan penggunaan aplikasi.
                            </p>
                        </div>

                        {/* Sections */}
                        {sections.map((section, i) => (
                            <div key={i} className="space-y-3">
                                <h2 className="text-base font-black text-white border-l-4 border-primary-2 pl-4">
                                    {section.title}
                                </h2>
                                <div className="space-y-3 pl-4">
                                    {section.content.map((item, j) => (
                                        <div key={j} className="bg-white/5 border border-white/5 rounded-4xl p-6">
                                            {item.subtitle && (
                                                <p className="text-[10px] font-black text-primary-2 uppercase tracking-widest mb-2">
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
