/**
 * TemanJiwa - Master Instrument Kuesioner Penelitian
 * Skripsi: " Analisis dan Evaluasi UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Design Thinking"
 * Peneliti: Risma Elfaryani (Program Studi Sistem Informasi STMIK IKMI Cirebon)
 *
 * Struktur:
 * - Identitas & Kebiasaan Awal (Q1-Q14)
 * - Bagian A: SUS Usability (Q15-Q24)
 * - Bagian B: UEQ (Q25-Q50)
 * - Bagian C: Evaluasi Per Fitur (Q51-Q56)
 * - Bagian D: Pertanyaan Terbuka (Q57-Q61)
 */

window.TEMANJIWA_QUESTIONNAIRE = {
    metadata: {
        title: " Analisis dan Evaluasi UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Design Thinking",
        researcher: "Risma Elfaryani",
        institution: "STMIK IKMI Cirebon",
        program: "Program Studi Sistem Informasi",
        targetGroup: "Generasi Z",
        estimatedTime: "8-12 menit",
        introduction: "Penelitian ini bertujuan untuk mengetahui pengalaman pengguna serta mengevaluasi kemudahan penggunaan dan manfaat fitur-fitur pada aplikasi Mental Health Tracker dengan instrumen SUS dan UEQ.",
        privacyNote: "Seluruh jawaban akan dijaga kerahasiaannya dan hanya digunakan untuk kepentingan akademik.",
        totalQuestions: 61
    },
    likertScale: [
        { value: "1", label: "Sangat Tidak Setuju", short: "STS", color: "#FCA5A5", border: "#F87171" },
        { value: "2", label: "Tidak Setuju", short: "TS", color: "#FED7AA", border: "#FB923C" },
        { value: "3", label: "Netral", short: "N", color: "#FEF08A", border: "#FACC15" },
        { value: "4", label: "Setuju", short: "S", color: "#BBF7D0", border: "#4ADE80" },
        { value: "5", label: "Sangat Setuju", short: "SS", color: "#A8C5FF", border: "#60A5FA" }
    ],
    ueqScale: [
        { value: "1", short: "1", label: "Sangat condong ke kata sifat kiri" },
        { value: "2", short: "2", label: "Condong ke kata sifat kiri" },
        { value: "3", short: "3", label: "Agak condong ke kata sifat kiri" },
        { value: "4", short: "4", label: "Netral" },
        { value: "5", short: "5", label: "Agak condong ke kata sifat kanan" },
        { value: "6", short: "6", label: "Condong ke kata sifat kanan" },
        { value: "7", short: "7", label: "Sangat condong ke kata sifat kanan" }
    ],
    sections: [
        {
            id: "identitas",
            badge: "Identitas",
            title: "Identitas Responden",
            description: "Informasi dasar responden untuk keperluan demografi penelitian.",
            questions: [
                { id: "q1", number: 1, text: "Nama", type: "text", required: true, placeholder: "Masukkan nama lengkap Anda" },
                { id: "q2", number: 2, text: "Usia", type: "number", required: true, placeholder: "Contoh: 21", min: 10, max: 100 },
                { id: "q3", number: 3, text: "Jenis Kelamin", type: "radio", required: true, options: ["Laki-laki", "Perempuan"] },
                { id: "q4", number: 4, text: "Status (Kerja/Kuliah/Sekolah)", type: "radio", required: true, options: ["Kerja", "Kuliah", "Sekolah"], hasOther: true, otherPlaceholder: "Tuliskan status Anda lainnya..." }
            ]
        },
        {
            id: "kebiasaan",
            badge: "Identitas & Kebiasaan",
            title: "Identitas & Kebiasaan Awal",
            description: "Pertanyaan mengenai kondisi dan kebutuhan kesehatan mental sebelum menggunakan aplikasi.",
            questions: [
                { id: "q5", number: 5, text: "Bagaimana Anda menilai kondisi kesehatan mental Anda saat ini?", type: "radio", required: true, options: ["Sangat Baik", "Baik", "Cukup", "Kurang Baik", "Sangat Kurang Baik"] },
                { id: "q6", number: 6, text: "Seberapa sering Anda merasa stres dalam kehidupan sehari-hari?", type: "radio", required: true, options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Sangat Sering"] },
                { id: "q7", number: 7, text: "Ketika mengalami masalah, bagaimana Anda biasanya mengelola emosi?", type: "radio", required: true, options: ["Sangat Mudah", "Mudah", "Cukup Mudah", "Sulit", "Sangat Sulit"] },
                { id: "q8", number: 8, text: "Seberapa sering Anda mencatat atau memantau suasana hati (mood) Anda?", type: "radio", required: true, options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Selalu"] },
                { id: "q9", number: 9, text: "Berapa lama rata-rata waktu tidur Anda setiap malam?", type: "radio", required: true, options: ["Kurang dari 5 jam", "5-6 jam", "7-8 jam", "Lebih dari 8 jam"] },
                { id: "q10", number: 10, text: "Seberapa sering Anda melakukan aktivitas untuk menjaga kesehatan mental (misalnya meditasi, olahraga, journaling, atau relaksasi)?", type: "radio", required: true, options: ["Tidak Pernah", "Jarang", "Kadang-kadang", "Sering", "Sangat sering"] },
                { id: "q11", number: 11, text: "Apakah Anda pernah menggunakan aplikasi kesehatan mental sebelumnya?", type: "radio", required: true, options: ["Belum pernah", "Pernah, tetapi jarang", "Pernah dan digunakan sekali", "Sering menggunakan", "Masih aktif menggunakan"] },
                { id: "q12", number: 12, text: "Apa tujuan utama Anda menggunakan aplikasi Mental Health Tracker?", type: "radio", required: true, options: ["Memantau suasana hati (Mood Tracker)", "Mengurangi stres", "Menjaga kesehatan mental", "Membangun kebiasaan hidup sehat", "Ingin mencoba aplikasi baru"], hasOther: true, otherPlaceholder: "Jawaban lainnya..." },
                { id: "q13", number: 13, text: "Fitur apa yang paling Anda harapkan tersedia dalam aplikasi Mental Health Tracker?", type: "radio", required: true, options: ["Mood Tracker", "Journal Harian", "Sleep Tracker", "Meditasi dan Relaksasi", "Reminder Aktivitas Sehat", "Water Tracker", "Artikel Edukasi"], hasOther: true, otherPlaceholder: "Jawaban lainnya..." },
                { id: "q14", number: 14, text: "Menurut Anda, seberapa penting aplikasi Mental Health Tracker bagi Generasi Z?", type: "radio", required: true, options: ["Sangat Tidak Penting", "Tidak Penting", "Cukup Penting", "Penting", "Sangat Penting"] }
            ]
        },
        {
            id: "sus",
            badge: "Bagian A",
            title: "Evaluasi Usability (SUS)",
            description: "System Usability Scale: 1 = Sangat Tidak Setuju sampai 5 = Sangat Setuju.",
            isLikert: true,
            questions: [
                { id: "q15", number: 15, text: "Saya rasa saya akan sering menggunakan aplikasi Mental Health Tracker ini untuk memantau kondisi mental saya.", type: "likert5", required: true, polarity: "positive" },
                { id: "q16", number: 16, text: "Saya merasa alur dan fitur pada aplikasi Mental Health Tracker ini terlalu rumit tanpa alasan yang jelas.", type: "likert5", required: true, polarity: "negative" },
                { id: "q17", number: 17, text: "Saya rasa aplikasi Mental Health Tracker ini (seperti Mood, Sleep, dan Water Tracker) mudah digunakan.", type: "likert5", required: true, polarity: "positive" },
                { id: "q18", number: 18, text: "Saya rasa saya membutuhkan bantuan orang lain atau panduan teknis untuk dapat menggunakan seluruh fitur aplikasi ini.", type: "likert5", required: true, polarity: "negative" },
                { id: "q19", number: 19, text: "Saya menemukan bahwa berbagai fitur pada aplikasi ini (Mood Tracker, Journal, Sleep Tracker, Water Tracker, Reminder, dan Artikel Edukasi) terintegrasi dengan baik.", type: "likert5", required: true, polarity: "positive" },
                { id: "q20", number: 20, text: "Saya rasa terlalu banyak ketidakkonsistenan pada tampilan dan tata letak antar halaman aplikasi ini.", type: "likert5", required: true, polarity: "negative" },
                { id: "q21", number: 21, text: "Saya membayangkan bahwa kebanyakan pengguna (khususnya Generasi Z) akan belajar menggunakan aplikasi ini dengan sangat cepat.", type: "likert5", required: true, polarity: "positive" },
                { id: "q22", number: 22, text: "Saya menemukan bahwa proses pengisian data dan penggunaan aplikasi ini sangat membingungkan atau merepotkan.", type: "likert5", required: true, polarity: "negative" },
                { id: "q23", number: 23, text: "Saya merasa sangat percaya diri dan nyaman saat menggunakan fitur-fitur di dalam aplikasi ini.", type: "likert5", required: true, polarity: "positive" },
                { id: "q24", number: 24, text: "Saya perlu mempelajari banyak hal terlebih dahulu sebelum saya bisa mulai menggunakan aplikasi Mental Health Tracker ini dengan lancar.", type: "likert5", required: true, polarity: "negative" }
            ]
        },
        {
            id: "ueq",
            badge: "Bagian B",
            title: "Evaluasi Pengalaman Pengguna (UEQ)",
            description: "Berikan penilaian Anda terhadap pengalaman menggunakan keseluruhan fitur pada aplikasi Mental Health Tracker (meliputi tampilan antarmuka, Mood Tracker, Journal, Sleep Tracker, Water Tracker, Reminder, dan Artikel Edukasi) dengan memilih angka 1 hingga 7 di antara dua kata sifat berikut:",
            isUEQ: true,
            questions: [
                { id:"q25", number:25, type:"ueq7", required:true, dimension:"Attractiveness", left:"Menyebalkan", right:"Menyenangkan", ueqItem:1 },
                { id:"q26", number:26, type:"ueq7", required:true, dimension:"Attractiveness", left:"Buruk", right:"Baik", ueqItem:2 },
                { id:"q27", number:27, type:"ueq7", required:true, dimension:"Attractiveness", left:"Tidak disukai", right:"Disukai", ueqItem:3 },
                { id:"q28", number:28, type:"ueq7", required:true, dimension:"Attractiveness", left:"Tidak nyaman", right:"Nyaman", ueqItem:4 },
                { id:"q29", number:29, type:"ueq7", required:true, dimension:"Attractiveness", left:"Tidak menarik", right:"Menarik", ueqItem:5 },
                { id:"q30", number:30, type:"ueq7", required:true, dimension:"Attractiveness", left:"Tidak ramah pengguna", right:"Ramah pengguna", ueqItem:6 },
                { id:"q31", number:31, type:"ueq7", required:true, dimension:"Perspicuity", left:"Tidak dapat dipahami", right:"Dapat dipahami", ueqItem:7 },
                { id:"q32", number:32, type:"ueq7", required:true, dimension:"Perspicuity", left:"Sulit dipelajari", right:"Mudah dipelajari", ueqItem:8 },
                { id:"q33", number:33, type:"ueq7", required:true, dimension:"Perspicuity", left:"Rumit", right:"Sederhana", ueqItem:9 },
                { id:"q34", number:34, type:"ueq7", required:true, dimension:"Perspicuity", left:"Tidak jelas", right:"Jelas", ueqItem:10 },
                { id:"q35", number:35, type:"ueq7", required:true, dimension:"Efficiency", left:"Lambat", right:"Cepat", ueqItem:11 },
                { id:"q36", number:36, type:"ueq7", required:true, dimension:"Efficiency", left:"Tidak efisien", right:"Efisien", ueqItem:12 },
                { id:"q37", number:37, type:"ueq7", required:true, dimension:"Efficiency", left:"Tidak praktis", right:"Praktis", ueqItem:13 },
                { id:"q38", number:38, type:"ueq7", required:true, dimension:"Efficiency", left:"Berantakan", right:"Terorganisasi", ueqItem:14 },
                { id:"q39", number:39, type:"ueq7", required:true, dimension:"Dependability", left:"Tidak dapat diprediksi", right:"Dapat diprediksi", ueqItem:15 },
                { id:"q40", number:40, type:"ueq7", required:true, dimension:"Dependability", left:"Menghalangi", right:"Mendukung", ueqItem:16 },
                { id:"q41", number:41, type:"ueq7", required:true, dimension:"Dependability", left:"Tidak layak / Tidak aman", right:"Layak / Dapat diandalkan", ueqItem:17 },
                { id:"q42", number:42, type:"ueq7", required:true, dimension:"Dependability", left:"Tidak memenuhi ekspektasi", right:"Memenuhi ekspektasi", ueqItem:18 },
                { id:"q43", number:43, type:"ueq7", required:true, dimension:"Stimulation", left:"Tidak bermanfaat", right:"Bermanfaat", ueqItem:19 },
                { id:"q44", number:44, type:"ueq7", required:true, dimension:"Stimulation", left:"Membosankan", right:"Mengasyikkan", ueqItem:20 },
                { id:"q45", number:45, type:"ueq7", required:true, dimension:"Stimulation", left:"Tidak menarik minat", right:"Menarik minat", ueqItem:21 },
                { id:"q46", number:46, type:"ueq7", required:true, dimension:"Stimulation", left:"Tidak memotivasi", right:"Memotivasi", ueqItem:22 },
                { id:"q47", number:47, type:"ueq7", required:true, dimension:"Novelty", left:"Kreatif", right:"Tidak kreatif", ueqItem:23, reverse:true },
                { id:"q48", number:48, type:"ueq7", required:true, dimension:"Novelty", left:"Berdaya cipta / Inovatif", right:"Konvensional", ueqItem:24, reverse:true },
                { id:"q49", number:49, type:"ueq7", required:true, dimension:"Novelty", left:"Lazim / Biasa saja", right:"Terdepan / Modern", ueqItem:25 },
                { id:"q50", number:50, type:"ueq7", required:true, dimension:"Novelty", left:"Konservatif / Kaku", right:"Inovatif", ueqItem:26 }
            ]
        },
        {
            id:"fitur",
            badge:"Bagian C",
            title:"Evaluasi Spesifik Fitur",
            description:"Evaluasi Per Fitur: 1 = Sangat Tidak Setuju sampai 5 = Sangat Setuju.",
            isLikert:true,
            questions:[
                {id:"q51",number:51,text:"Fitur Mood Tracker mudah digunakan dan membantu saya memantau suasana hati secara efektif.",type:"likert5",required:true},
                {id:"q52",number:52,text:"Fitur Journal memudahkan saya menulis catatan dan mengekspresikan perasaan.",type:"likert5",required:true},
                {id:"q53",number:53,text:"Fitur Sleep Tracker memudahkan saya mencatat dan memantau pola tidur harian.",type:"likert5",required:true},
                {id:"q54",number:54,text:"Fitur Water Tracker memudahkan saya mencatat konsumsi air dan memenuhi target minum.",type:"likert5",required:true},
                {id:"q55",number:55,text:"Fitur Reminder bekerja dengan baik dalam mengingatkan dan membangun kebiasaan sehat.",type:"likert5",required:true},
                {id:"q56",number:56,text:"Fitur Artikel Edukasi mudah dipahami dan memberikan informasi kesehatan mental yang relevan.",type:"likert5",required:true}
            ]
        },
        {
            id:"open",
            badge:"Bagian D",
            title:"Pertanyaan Terbuka",
            description:"Masukan iterasi Design Thinking.",
            questions:[
                {id:"q57",number:57,text:"Fitur apa yang paling Anda sukai pada aplikasi Mental Health Tracker?",type:"textarea",required:true,placeholder:"Tuliskan fitur favorit Anda beserta alasannya..."},
                {id:"q58",number:58,text:"Fitur apa yang menurut Anda masih perlu diperbaiki?",type:"textarea",required:true,placeholder:"Tuliskan fitur yang perlu disempurnakan beserta alasannya..."},
                {id:"q59",number:59,text:"Bagian desain antarmuka (warna, ikon, tata letak, tipografi) mana yang perlu ditingkatkan?",type:"textarea",required:true,placeholder:"Tuliskan evaluasi desain antarmuka Anda..."},
                {id:"q60",number:60,text:"Apakah ada fitur tambahan yang ingin Anda hadirkan pada aplikasi ini?",type:"textarea",required:true,placeholder:"Tuliskan ide atau usulan fitur baru..."},
                {id:"q61",number:61,text:"Berikan kritik, masukan, atau saran untuk pengembangan aplikasi Mental Health Tracker agar menjadi lebih baik.",type:"textarea",required:true,placeholder:"Tuliskan kritik, masukan, atau saran Anda..."}
            ]
        }
    ]
};
