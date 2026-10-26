/**
 * TemanJiwa - Master Instrument Kuesioner Penelitian
 * Skripsi: "Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking"
 * Peneliti: Risma Elfaryani (Program Studi Sistem Informasi STMIK IKMI Cirebon)
 * 
 * Total Pertanyaan: 67 Pertanyaan (Semua Wajib Diisi)
 * Struktur:
 * - Identitas Responden (Q1 - Q4)
 * - Bagian A: Kondisi Responden Sebelum Menggunakan Aplikasi (Q5 - Q14)
 * - Bagian B: Penilaian Desain Antarmuka (User Interface Design) (Q15 - Q24) [Likert 1-5]
 * - Bagian C: Kemudahan Penggunaan (Usability) (Q25 - Q34) [Likert 1-5]
 * - Bagian D: Penilaian Fitur Aplikasi (Q35 - Q49) [Likert 1-5]
 * - Bagian E: Pengalaman Pengguna (User Experience) (Q50 - Q57) [Likert 1-5]
 * - Bagian F: Kepuasan Pengguna (Q58 - Q62) [Likert 1-5]
 * - Bagian G: Kritik dan Saran (Q63 - Q67) [Kualitatif / Refleksi]
 */

window.TEMANJIWA_QUESTIONNAIRE = {
    metadata: {
        title: "Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking",
        researcher: "Risma Elfaryani",
        institution: "STMIK IKMI Cirebon",
        program: "Program Studi Sistem Informasi",
        targetGroup: "Generasi Z",
        estimatedTime: "5–10 menit",
        introduction: "Penelitian ini bertujuan untuk mengetahui pengalaman pengguna (User Experience) serta mengevaluasi kemudahan penggunaan, tampilan antarmuka, dan manfaat fitur-fitur yang terdapat pada aplikasi Mental Health Tracker. Hasil dari penelitian ini akan digunakan sebagai dasar dalam memberikan rekomendasi perbaikan desain antarmuka dan pengalaman pengguna agar aplikasi lebih sesuai dengan kebutuhan Generasi Z.",
        privacyNote: "Partisipasi Anda dalam mengisi kuesioner ini sangat berarti bagi keberhasilan penelitian. Seluruh jawaban yang diberikan akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan akademik. Tidak ada jawaban yang benar maupun salah; oleh karena itu, diharapkan Anda dapat memberikan jawaban yang jujur sesuai dengan pengalaman selama menggunakan aplikasi.",
        totalQuestions: 67
    },
    likertScale: [
        { value: "1", label: "Sangat Tidak Setuju", short: "STS", color: "#FCA5A5", border: "#F87171" },
        { value: "2", label: "Tidak Setuju", short: "TS", color: "#FED7AA", border: "#FB923C" },
        { value: "3", label: "Netral", short: "N", color: "#FEF08A", border: "#FACC15" },
        { value: "4", label: "Setuju", short: "S", color: "#BBF7D0", border: "#4ADE80" },
        { value: "5", label: "Sangat Setuju", short: "SS", color: "#A8C5FF", border: "#60A5FA" }
    ],
    sections: [
        {
            id: "identitas",
            badge: "Identitas",
            title: "Identitas Responden",
            description: "Informasi dasar responden untuk keperluan demografi penelitian skripsi.",
            questions: [
                {
                    id: "q1",
                    number: 1,
                    text: "Nama",
                    type: "text",
                    required: true,
                    placeholder: "Masukkan nama lengkap Anda"
                },
                {
                    id: "q2",
                    number: 2,
                    text: "Usia",
                    type: "number",
                    required: true,
                    placeholder: "Contoh: 21",
                    min: 10,
                    max: 100
                },
                {
                    id: "q3",
                    number: 3,
                    text: "Jenis Kelamin",
                    type: "radio",
                    required: true,
                    options: ["Laki-laki", "Perempuan"]
                },
                {
                    id: "q4",
                    number: 4,
                    text: "Status (Kerja, Kuliah, dan Sekolah)",
                    type: "radio",
                    required: true,
                    options: ["Sekolah", "Kuliah", "Kerja"],
                    hasOther: true,
                    otherPlaceholder: "Tuliskan status Anda lainnya..."
                }
            ]
        },
        {
            id: "section_a",
            badge: "Bagian A",
            title: "Kondisi Responden Sebelum Menggunakan Aplikasi",
            description: "Evaluasi awal mengenai pola istirahat, manajemen stres, dan kebiasaan kesehatan mental harian Anda.",
            questions: [
                {
                    id: "q5",
                    number: 5,
                    text: "Bagaimana Anda menilai kondisi kesehatan mental Anda saat ini?",
                    type: "radio",
                    required: true,
                    options: ["Sangat Baik", "Baik", "Cukup", "Kurang Baik", "Sangat Kurang Baik"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q6",
                    number: 6,
                    text: "Seberapa sering Anda merasa stres dalam kehidupan sehari-hari?",
                    type: "radio",
                    required: true,
                    options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Sangat Sering"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q7",
                    number: 7,
                    text: "Ketika mengalami masalah, bagaimana Anda biasanya mengelola emosi?",
                    type: "radio",
                    required: true,
                    options: ["Sangat Mudah", "Mudah", "Cukup Mudah", "Sulit", "Sangat Sulit"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q8",
                    number: 8,
                    text: "Seberapa sering Anda mencatat atau memantau suasana hati (mood) Anda?",
                    type: "radio",
                    required: true,
                    options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q9",
                    number: 9,
                    text: "Berapa lama rata-rata waktu tidur Anda setiap malam?",
                    type: "radio",
                    required: true,
                    options: ["Kurang dari 5 jam", "5-6 jam", "7-8 jam", "Lebih dari 8 jam"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q10",
                    number: 10,
                    text: "Seberapa sering Anda melakukan aktivitas untuk menjaga kesehatan mental (misalnya meditasi, olahraga, journaling, atau relaksasi)?",
                    type: "radio",
                    required: true,
                    options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Sangat sering"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q11",
                    number: 11,
                    text: "Apakah Anda pernah menggunakan aplikasi kesehatan mental sebelumnya?",
                    type: "radio",
                    required: true,
                    options: ["Belum pernah", "Pernah, tetapi jarang", "Pernah dan digunakan sekali", "Sering menggunakan", "Masih aktif menggunakan"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q12",
                    number: 12,
                    text: "Apa tujuan utama Anda menggunakan aplikasi Mental Health Tracker?",
                    type: "radio",
                    required: true,
                    options: ["Memantau suasana hati (Mood Tracker)", "Mengurangi stress", "Menjaga kesehatan mental", "Membangun kebiasaan hidup sehat", "Ingin Mencoba aplikasi baru"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q13",
                    number: 13,
                    text: "Fitur apa yang paling Anda harapkan tersedia dalam aplikasi Mental Health Tracker?",
                    type: "radio",
                    required: true,
                    options: ["Mood Tracker", "Journal Harian", "Sleep Tracker", "Meditasi dan Relaksasi", "Reminder Aktivitas Sehat"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                },
                {
                    id: "q14",
                    number: 14,
                    text: "Menurut Anda, seberapa penting aplikasi Mental Health Tracker bagi Generasi Z?",
                    type: "radio",
                    required: true,
                    options: ["Sangat Tidak Penting", "Tidak Penting", "Cukup Penting", "Penting", "Sangat Penting"],
                    hasOther: true,
                    otherPlaceholder: "Jawaban lainnya..."
                }
            ]
        },
        {
            id: "section_b",
            badge: "Bagian B",
            title: "Penilaian Desain Antarmuka (User Interface Design)",
            description: "Keterangan Skala: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju",
            isLikert: true,
            questions: [
                { id: "q15", number: 15, text: "Tampilan halaman utama (Home) aplikasi terlihat menarik.", type: "likert5", required: true },
                { id: "q16", number: 16, text: "Kombinasi warna yang digunakan pada aplikasi memberikan kesan nyaman dan menenangkan.", type: "likert5", required: true },
                { id: "q17", number: 17, text: "Ukuran dan jenis huruf (font) pada aplikasi mudah dibaca.", type: "likert5", required: true },
                { id: "q18", number: 18, text: "Tata letak menu dan informasi pada setiap halaman terlihat rapi dan terorganisir.", type: "likert5", required: true },
                { id: "q19", number: 19, text: "Ikon-ikon yang digunakan mudah dikenali dan dipahami fungsinya.", type: "likert5", required: true },
                { id: "q20", number: 20, text: "Desain tombol (button) mudah dikenali dan digunakan.", type: "likert5", required: true },
                { id: "q21", number: 21, text: "Jarak antar elemen pada setiap halaman sudah proporsional sehingga nyaman dilihat.", type: "likert5", required: true },
                { id: "q22", number: 22, text: "Tampilan aplikasi terlihat konsisten pada setiap halaman.", type: "likert5", required: true },
                { id: "q23", number: 23, text: "Animasi atau efek transisi pada aplikasi membuat pengalaman penggunaan menjadi lebih baik.", type: "likert5", required: true },
                { id: "q24", number: 24, text: "Secara keseluruhan, desain antarmuka aplikasi memberikan pengalaman visual yang menyenangkan.", type: "likert5", required: true }
            ]
        },
        {
            id: "section_c",
            badge: "Bagian C",
            title: "Kemudahan Penggunaan (Usability)",
            description: "Keterangan Skala: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju",
            isLikert: true,
            questions: [
                { id: "q25", number: 25, text: "Saya dapat memahami cara menggunakan aplikasi dengan mudah sejak pertama kali menggunakannya.", type: "likert5", required: true },
                { id: "q26", number: 26, text: "Menu dan fitur pada aplikasi mudah ditemukan.", type: "likert5", required: true },
                { id: "q27", number: 27, text: "Navigasi antar halaman aplikasi mudah dipahami.", type: "likert5", required: true },
                { id: "q28", number: 28, text: "Saya dapat menggunakan seluruh fitur aplikasi tanpa mengalami kesulitan.", type: "likert5", required: true },
                { id: "q29", number: 29, text: "Informasi yang ditampilkan pada aplikasi mudah dipahami.", type: "likert5", required: true },
                { id: "q30", number: 30, text: "Proses pengisian data, seperti Mood Tracker atau Journal, berjalan dengan mudah.", type: "likert5", required: true },
                { id: "q31", number: 31, text: "Waktu yang dibutuhkan untuk menyelesaikan aktivitas pada aplikasi tergolong singkat.", type: "likert5", required: true },
                { id: "q32", number: 32, text: "Aplikasi merespons setiap tindakan saya dengan cepat.", type: "likert5", required: true },
                { id: "q33", number: 33, text: "Saya jarang mengalami kebingungan saat menggunakan aplikasi.", type: "likert5", required: true },
                { id: "q34", number: 34, text: "Secara keseluruhan, aplikasi mudah digunakan.", type: "likert5", required: true }
            ]
        },
        {
            id: "section_d",
            badge: "Bagian D",
            title: "Penilaian Fitur Aplikasi",
            description: "Keterangan Skala: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju",
            isLikert: true,
            questions: [
                { id: "q35", number: 35, text: "Fitur Mood Tracker mudah digunakan.", type: "likert5", required: true },
                { id: "q36", number: 36, text: "Mood Tracker membantu saya mencatat suasana hati setiap hari.", type: "likert5", required: true },
                { id: "q37", number: 37, text: "Riwayat Mood Tracker mudah dipahami.", type: "likert5", required: true },
                { id: "q38", number: 38, text: "Fitur Journal mudah digunakan untuk menulis catatan harian.", type: "likert5", required: true },
                { id: "q39", number: 39, text: "Journal membantu saya mengekspresikan perasaan.", type: "likert5", required: true },
                { id: "q40", number: 40, text: "Sleep Tracker mudah digunakan untuk mencatat waktu tidur.", type: "likert5", required: true },
                { id: "q41", number: 41, text: "Sleep Tracker membantu saya memantau pola tidur.", type: "likert5", required: true },
                { id: "q42", number: 42, text: "Water Tracker mudah digunakan untuk mencatat konsumsi air minum.", type: "likert5", required: true },
                { id: "q43", number: 43, text: "Water Tracker membantu saya memenuhi target minum harian.", type: "likert5", required: true },
                { id: "q44", number: 44, text: "Reminder bekerja dengan baik sebagai pengingat aktivitas sehat.", type: "likert5", required: true },
                { id: "q45", number: 45, text: "Reminder membantu saya membangun kebiasaan hidup sehat.", type: "likert5", required: true },
                { id: "q46", number: 46, text: "Artikel edukasi mudah dipahami.", type: "likert5", required: true },
                { id: "q47", number: 47, text: "Informasi pada artikel edukasi bermanfaat bagi saya.", type: "likert5", required: true },
                { id: "q48", number: 48, text: "Semua fitur berjalan sesuai dengan fungsinya.", type: "likert5", required: true },
                { id: "q49", number: 49, text: "Secara keseluruhan fitur-fitur pada aplikasi membantu menjaga kesehatan mental saya.", type: "likert5", required: true }
            ]
        },
        {
            id: "section_e",
            badge: "Bagian E",
            title: "Pengalaman Pengguna (User Experience)",
            description: "Keterangan Skala: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju",
            isLikert: true,
            questions: [
                { id: "q50", number: 50, text: "Saya merasa senang menggunakan aplikasi ini.", type: "likert5", required: true },
                { id: "q51", number: 51, text: "Aplikasi ini membuat saya lebih termotivasi menjaga kesehatan mental.", type: "likert5", required: true },
                { id: "q52", number: 52, text: "Saya merasa aplikasi ini bermanfaat bagi kehidupan sehari-hari.", type: "likert5", required: true },
                { id: "q53", number: 53, text: "Saya ingin menggunakan aplikasi ini kembali di masa mendatang.", type: "likert5", required: true },
                { id: "q54", number: 54, text: "Saya bersedia merekomendasikan aplikasi ini kepada orang lain.", type: "likert5", required: true },
                { id: "q55", number: 55, text: "Menggunakan aplikasi ini memberikan pengalaman yang menyenangkan.", type: "likert5", required: true },
                { id: "q56", number: 56, text: "Saya merasa nyaman menggunakan aplikasi ini dalam waktu yang lama.", type: "likert5", required: true },
                { id: "q57", number: 57, text: "Secara keseluruhan saya memiliki pengalaman yang positif selama menggunakan aplikasi ini.", type: "likert5", required: true }
            ]
        },
        {
            id: "section_f",
            badge: "Bagian F",
            title: "Kepuasan Pengguna",
            description: "Keterangan Skala: 1 = Sangat Tidak Setuju, 2 = Tidak Setuju, 3 = Netral, 4 = Setuju, 5 = Sangat Setuju",
            isLikert: true,
            questions: [
                { id: "q58", number: 58, text: "Aplikasi ini memenuhi harapan saya.", type: "likert5", required: true },
                { id: "q59", number: 59, text: "Saya puas terhadap kualitas aplikasi secara keseluruhan.", type: "likert5", required: true },
                { id: "q60", number: 60, text: "Saya puas terhadap desain antarmuka aplikasi.", type: "likert5", required: true },
                { id: "q61", number: 61, text: "Saya puas terhadap fitur-fitur yang tersedia pada aplikasi.", type: "likert5", required: true },
                { id: "q62", number: 62, text: "Saya merasa aplikasi ini layak digunakan sebagai media pendukung kesehatan mental sehari-hari.", type: "likert5", required: true }
            ]
        },
        {
            id: "section_g",
            badge: "Bagian G",
            title: "Kritik dan Saran",
            description: "Silakan berikan masukan, opini, dan evaluasi bebas Anda untuk pengembangan TemanJiwa lebih lanjut.",
            questions: [
                {
                    id: "q63",
                    number: 63,
                    text: "Fitur apa yang paling Anda sukai pada aplikasi Mental Health Tracker? Mengapa?",
                    type: "textarea",
                    required: true,
                    placeholder: "Tuliskan fitur favorit Anda beserta alasannya di sini..."
                },
                {
                    id: "q64",
                    number: 64,
                    text: "Fitur apa yang menurut Anda masih perlu diperbaiki? Jelaskan alasannya.",
                    type: "textarea",
                    required: true,
                    placeholder: "Tuliskan fitur yang membutuhkan penyempurnaan beserta alasannya..."
                },
                {
                    id: "q65",
                    number: 65,
                    text: "Bagian desain antarmuka (warna, ikon, tata letak, tipografi, atau navigasi) apa yang menurut Anda masih kurang menarik atau kurang nyaman?",
                    type: "textarea",
                    required: true,
                    placeholder: "Tuliskan evaluasi desain UI Anda di sini..."
                },
                {
                    id: "q66",
                    number: 66,
                    text: "Apakah ada fitur tambahan yang ingin Anda hadirkan pada aplikasi ini? Jelaskan secara singkat.",
                    type: "textarea",
                    required: true,
                    placeholder: "Tuliskan ide atau usulan fitur baru yang bermanfaat..."
                },
                {
                    id: "q67",
                    number: 67,
                    text: "Berikan kritik, masukan, atau saran untuk pengembangan aplikasi Mental Health Tracker agar menjadi lebih baik di masa mendatang.",
                    type: "textarea",
                    required: true,
                    placeholder: "Tuliskan pesan, kesan, kritik membangun, atau saran pengembangan di sini..."
                }
            ]
        }
    ]
};
