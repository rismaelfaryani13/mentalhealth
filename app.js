/* TemanJiwa - Alpine.js State Management & Business Logic */

let meditationAudio = null;

document.addEventListener('alpine:init', () => {
    Alpine.store('app', {
        // Navigation & UI State
        currentScreen: 'splash',
        previousScreen: 'dashboard',
        activeNav: 'dashboard',
        showModal: null, // 'addJournal', 'addHabit', 'logMood', 'addReminder', etc.
        toastMessage: '',
        showToastFlag: false,
        isLoading: false,
        loadingTitle: 'Memuat TemanJiwa...',
        loadingMessage: 'Menyiapkan ruang ketenangan untuk jiwamu',

        // Mandatory Research Questionnaire State
        questionnaireStatus: 'not_started', // 'not_started' | 'in_progress' | 'completed'
        questionnaireStarted: false,
        questionnaireSessionActive: false, // Active mandatory session lock
        questionnaireAnswers: {}, // Map of answers: { q1: "...", ... }
        questionnaireOtherAnswers: {}, // Map for "Yang lain:" text: { q4: "...", ... }
        questionnaireCurrentSection: 0, // 0 to 7 (8 is review/summary)
        questionnaireProgress: 0, // 0 - 100%
        questionnaireSaving: false,
        questionnaireError: null,
        questionnaireValidationErrors: {},
        questionnaireCompletedAt: null,
        showQuestionnaireLeaveWarning: false,
        showLogoutQuestionnaireModal: false,
        showQuestionnaireReviewModal: false,
        questionnaireExpandedAnswerReview: false,

        // Developer & Researcher Special Access (Discrete)
        isDeveloper: false,
        showSecretDevModal: false,
        showDeveloperPanelModal: false,
        devLoginInput: {
            username: '',
            password: ''
        },
        devSecretTapCount: 0,
        devSecretTapTimer: null,

        // Google Sheets Integration State
        googleSheetConfig: {
            sheetId: '1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4',
            sheetUrl: 'https://docs.google.com/spreadsheets/d/1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4/edit?usp=sharing',
            csvUrl: 'https://docs.google.com/spreadsheets/d/1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4/gviz/tq?tqx=out:csv',
            webAppUrl: localStorage.getItem('temanjiwa_gsheet_webapp_url') || 'https://script.google.com/macros/s/AKfycbyKVubO_gsd_Nbe4vj_afVutfYkwI3p1QloqZ_OJvYkYg4RLV4oxOpJvFVVyCUH_6H4QA/exec'
        },
        isSyncingGSheet: false,
        googleSheetInputUrl: localStorage.getItem('temanjiwa_gsheet_webapp_url') || 'https://script.google.com/macros/s/AKfycbyKVubO_gsd_Nbe4vj_afVutfYkwI3p1QloqZ_OJvYkYg4RLV4oxOpJvFVVyCUH_6H4QA/exec',

        // Auth State
        isLoggedIn: false,
        user: {
            name: 'Risma Elfaryani',
            email: 'risma@temanjiwa.id',
            avatar: '🌿',
            bio: 'Menemukan kedamaian di setiap hela napas.',
            coverColor: '#A8C5FF',
            level: 3,
            xp: 240,
            joinedDate: 'Mei 2026'
        },
        profileEdit: {
            name: '',
            email: '',
            avatar: '🌿',
            bio: '',
            coverColor: '#A8C5FF'
        },
        registerInput: {
            name: '',
            email: '',
            password: ''
        },
        loginInput: {
            name: '',
            email: '',
            password: ''
        },

        // Mood State
        selectedMood: 'very-happy',
        moodIntensity: 10,
        moodNote: 'Merasa penuh energi, bersyukur, dan bahagia hari ini! ✨',
        moodHistory: [
            { id: 1, mood: 'very-happy', label: 'Sangat Bahagia', emoji: '😊', intensity: 9, note: 'Menyelesaikan proyek tepat waktu & minum teh sore', date: 'Hari ini, 14:30', dayName: 'Kam' },
            { id: 2, mood: 'happy', label: 'Bahagia', emoji: '🙂', intensity: 7, note: 'Jalan-jalan di taman kota bersama sahabat', date: 'Kemarin, 19:15', dayName: 'Rabu' },
            { id: 3, mood: 'neutral', label: 'Biasa Saja', emoji: '😐', intensity: 5, note: 'Beban kerja standar, istirahat cukup', date: '21 Jul, 20:00', dayName: 'Sel' },
            { id: 4, mood: 'stressed', label: 'Stres / Cemas', emoji: '😢', intensity: 4, note: 'Deadline rapat pagi sempat membuat deg-degan', date: '20 Jul, 11:00', dayName: 'Sen' },
            { id: 5, mood: 'happy', label: 'Bahagia', emoji: '🙂', intensity: 8, note: 'Tidur nyenyak 8 jam!', date: '19 Jul, 08:30', dayName: 'Min' },
            { id: 6, mood: 'very-happy', label: 'Sangat Bahagia', emoji: '😊', intensity: 9, note: 'Akhir pekan yang menenangkan', date: '18 Jul, 16:00', dayName: 'Sab' }
        ],

        // Journal State
        journalSearch: '',
        selectedJournalTag: 'semua',
        newJournal: { title: '', content: '', mood: '😊 Bahagia', tag: 'Refleksi' },
        journals: [
            { id: 1, title: 'Menemukan Ketenangan Dalam Hal Kecil', content: 'Hari ini saya mencoba berhenti sejenak dari media sosial selama 3 jam. Memfokuskan mata pada dedaunan hijau di luar jendela dan menyeduh teh chamomillle. Rasanya pikiran yang tadinya bising perlahan menjadi jernih.', date: '23 Juli 2026', mood: '😊 Bahagia', tag: 'Refleksi' },
            { id: 2, title: 'Catatan Mempraktikkan Teknik Grounding 5-4-3-2-1', content: 'Saat cemas melanda sehabis presentasi, saya mempraktikkan grounding 5-4-3-2-1. Menyebutkan 5 benda di sekitar dan meraba tekstur meja kayu. Efektif sekali mengurangi detak jantung kencang.', date: '21 Juli 2026', mood: '😐 Biasa', tag: 'Mindfulness' },
            { id: 3, title: 'Rasa Syukur Hari Minggu', content: 'Sangat bersyukur keluarga dalam keadaan sehat. Kami makan siang bersama dan tertawa melihat foto-foto lama.', date: '19 Juli 2026', mood: '😊 Bahagia', tag: 'Rasa Syukur' }
        ],

        // Self Care State
        habits: [
            { id: 1, name: 'Meditasi Pernapasan 5 Menit', icon: 'wind', completed: true, streak: 5, category: 'Mindfulness' },
            { id: 2, name: 'Minum 2 Liter Air Bersih', icon: 'droplet', completed: true, streak: 12, category: 'Kesehatan' },
            { id: 3, name: 'Tulis 1 Hal Yang Disyukuri', icon: 'book-open', completed: false, streak: 4, category: 'Jurnal' },
            { id: 4, name: 'Jalan Kaki Ringan 15 Menit', icon: 'footprints', completed: false, streak: 2, category: 'Fisik' },
            { id: 5, name: 'Tidur Sebelum Jam 23:00', icon: 'moon', completed: true, streak: 7, category: 'Istirahat' }
        ],

        // Water Tracker State
        waterLogged: 1250,
        waterTarget: 2000,

        // Sleep Tracker State
        sleepInput: { bedtime: '22:30', waketime: '06:30', quality: 4 },
        sleepToday: { duration: 8.0, quality: 4, bedtime: '22:30', waketime: '06:30' },
        sleepHistory: [
            { day: 'Sen', duration: 7.2, quality: 4 },
            { day: 'Sel', duration: 6.8, quality: 3 },
            { day: 'Rab', duration: 8.0, quality: 5 },
            { day: 'Kam', duration: 7.5, quality: 4 },
            { day: 'Jum', duration: 8.2, quality: 5 },
            { day: 'Sab', duration: 8.5, quality: 5 },
            { day: 'Min', duration: 8.0, quality: 4 }
        ],

        // Breathing Exercise State
        breathing: {
            active: false,
            phase: 'Siap', // 'Tarik Napas', 'Tahan', 'Hembuskan', 'Rest'
            secondsLeft: 4,
            currentCycle: 0,
            targetCycles: 4,
            timer: null
        },

        // Meditation State
        meditation: {
            isPlaying: false,
            soundTrack: 'Rain',
            soundName: 'Suara Hujan Lembut',
            timeLeft: 300, // 5 mins
            totalTime: 300,
            timer: null
        },

        // Reminders State
        reminders: [
            { id: 1, title: 'Refleksi Mood Siang', time: '13:00', type: 'Mood Check', enabled: true },
            { id: 2, title: 'Minum Air Segar', time: '15:30', type: 'Hidrasi', enabled: true },
            { id: 3, title: 'Persiapan Tidur & Meditasi', time: '21:30', type: 'Self Care', enabled: true }
        ],

        // Notifications State
        notifications: [
            { id: 1, title: 'Hebat! Streak 5 Hari Meditasi', message: 'Kamu telah konsisten merawat pikiran selama 5 hari berturut-turut.', time: '10 menit lalu', read: false, icon: 'award' },
            { id: 2, title: 'Pengingat Minum Air', message: 'Waktunya minum 250ml air untuk tetap terhidrasi.', time: '1 jam lalu', read: false, icon: 'droplet' },
            { id: 3, title: 'Kutipan Bijak Hari Ini', message: '"Ketenangan tidak ditemukan dengan melarikan diri, tetapi dengan berdamai."', time: '3 jam lalu', read: true, icon: 'sparkles' }
        ],

        // Education Articles
        selectedArticle: null,
        articles: [
            {
                id: 1,
                title: 'Memahami Pertolongan Pertama Cemas & Stres',
                category: 'Kesehatan Mental',
                readTime: '4 menit',
                image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Langkah taktis cepat menenangkan sistem saraf saat pikiran terasa kewalahan.',
                content: 'Kecemasan dan stres adalah respon alami dari sistem saraf simpatik kita (respon "fight or flight") saat mendeteksi adanya tekanan atau ancaman. Ketika ini terjadi, hormon kortisol dan adrenalin melonjak, menyebabkan jantung berdetak lebih kencang, pernapasan menjadi dangkal, dan otot menegang.\n\nUntuk meredakannya secara instan, Anda bisa mempraktikkan teknik pernapasan lambat seperti metode Box Breathing (4-4-4). Tarik napas lewat hidung selama 4 detik, tahan selama 4 detik, lalu hembuskan perlahan lewat mulut selama 4 detik. Hal ini secara aktif menstimulasi saraf vagus dan mengaktifkan sistem saraf parasimpatik yang bertanggung jawab atas ketenangan tubuh.\n\nSelain itu, praktikkan teknik grounding 5-4-3-2-1 untuk menarik kesadaran Anda kembali ke masa kini. Kenali 5 benda di sekitar Anda, raba 4 permukaan benda, dengarkan 3 suara, hirup 2 aroma, dan rasakan 1 cita rasa. Dengan begitu, sirkuit kecemasan di otak Anda perlahan mereda.'
            },
            {
                id: 2,
                title: 'Seni Membangun Rutinitas Tidur Berkualitas',
                category: 'Istirahat',
                readTime: '5 menit',
                image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Bagaimana menciptakan suasana kamar yang menunjang tidur pulas dan bangun segar.',
                content: 'Tidur yang berkualitas adalah fondasi utama bagi kesehatan mental dan kestabilan emosi. Saat tidur, otak melakukan fungsi detoksifikasi dengan membersihkan sisa metabolik berbahaya dan mengkonsolidasikan memori jangka panjang.\n\nUntuk membangun rutinitas tidur (sleep hygiene) yang prima, mulailah dengan menjauhkan diri dari layar ponsel atau komputer setidaknya 1 jam sebelum tidur. Cahaya biru (blue light) dari perangkat elektronik menghambat produksi hormon melatonin, yakni hormon yang memberi sinyal pada tubuh bahwa hari sudah malam dan saatnya beristirahat.\n\nKondisikan kamar tidur Anda agar tetap sejuk, gelap, dan sunyi. Anda juga bisa memutar suara alam yang konstan (white noise/pink noise) seperti suara gemercik hujan lembut untuk menutupi kebisingan yang mengganggu di luar kamar. Pastikan untuk bangun dan tidur pada jam yang konsisten setiap harinya, bahkan pada akhir pekan, guna menyelaraskan jam biologis (ritme sirkadian) tubuh Anda.'
            },
            {
                id: 3,
                title: 'Mindfulness Untuk Pekerja Kreatif',
                category: 'Produktivitas',
                readTime: '3 menit',
                image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Menjaga fokus dan kesehatan emosional di tengah dinamika pekerjaan yang padat.',
                content: 'Di dunia modern yang serba cepat, pekerja kreatif sering kali dituntut untuk terus menghasilkan ide-ide segar di bawah tekanan deadline. Hal ini kerap kali memicu kelelahan mental (burnout) jika tidak diimbangi dengan jeda kesadaran yang baik.\n\nMindfulness bukanlah proses mengosongkan pikiran, melainkan membawa perhatian penuh pada apa yang sedang kita kerjakan saat ini tanpa menghakimi diri sendiri. Ketika Anda menulis, mendesain, atau merancang ide, fokuslah sepenuhnya pada satu tugas tersebut (single-tasking) alih-alih melakukan multitasking yang memecah konsentrasi.\n\nSediakan waktu 5 menit setiap beberapa jam untuk melakukan jeda sadar. Cukup rasakan napas Anda, lakukan peregangan otot bahu yang kaku, atau tatap pemandangan di luar jendela. Jeda singkat ini membantu menyegarkan kembali neurotransmiter di otak Anda, meningkatkan daya fokus, serta memicu munculnya inspirasi baru yang segar.'
            },
            {
                id: 4,
                title: 'Pentingnya Hidrasi Bagi Kesehatan Mental',
                category: 'Kesehatan Fisik',
                readTime: '3 menit',
                image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Bagaimana dehidrasi dapat memicu peningkatan kecemasan dan kelelahan mental.',
                content: 'Air menyusun sekitar 75% dari total volume otak kita. Oleh karena itu, penurunan tingkat hidrasi tubuh sekecil apa pun dapat berdampak langsung pada penurunan fungsi kognitif, kelelahan, serta memicu ketidakseimbangan mood.\n\nPenelitian menunjukkan bahwa kondisi dehidrasi ringan dapat meningkatkan sekresi hormon stres kortisol, yang memicu gejala fisik mirip kecemasan, seperti jantung berdebar-debar, sakit kepala ringan, dan kesulitan berkonsentrasi. Tubuh yang kurang cairan sering kali salah mengartikan dehidrasi sebagai ancaman stres.\n\nCobalah untuk mencatat asupan air harian Anda secara teratur. Biasakan minum segelas air putih hangat segera setelah bangun tidur untuk menggantikan cairan yang hilang di malam hari. Jadikan target minum minimal 2 liter per hari sebagai bagian integral dari rutinitas perawatan diri (self-care) Anda.'
            },
            {
                id: 5,
                title: 'Mengelola Emosi Negatif Tanpa Menghakimi Diri',
                category: 'Kesehatan Mental',
                readTime: '6 menit',
                image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Menghargai emosi yang tidak nyaman sebagai proses alami pertumbuhan jiwa.',
                content: 'Banyak dari kita terbiasa mengelompokkan emosi menjadi baik (seperti bahagia) dan buruk (seperti sedih, marah, cemas). Akibatnya, saat emosi negatif melanda, kita cenderung menolak, menekan, atau menghakimi diri sendiri karena merasa bersalah.\n\nPadahal, setiap emosi membawa pesan penting tentang kondisi internal kita. Sedih menunjukkan adanya kehilangan yang bermakna, sedangkan marah memberi sinyal bahwa batas diri Anda dilanggar. Menolak emosi ini hanya akan membuat ketegangan psikologis bertahan lebih lama dan bisa memicu kecemasan yang berlarut-larut.\n\nBelajarlah untuk mempraktikkan penerimaan (acceptance). Ketika Anda merasa sedih atau cemas, akui keberadaannya dengan berbisik lembut, "Saat ini saya sedang merasa cemas, dan tidak apa-apa untuk merasa seperti ini." Tuangkan luapan perasaan Anda secara jujur dalam jurnal refleksi harian tanpa perlu takut dinilai oleh siapa pun.'
            },
            {
                id: 6,
                title: 'Membangun Kebiasaan Kecil yang Berkelanjutan',
                category: 'Self Care',
                readTime: '4 menit',
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Strategi praktis menata rutinitas harian demi kesehatan mental jangka panjang.',
                content: 'Banyak orang gagal membangun kebiasaan baru karena menetapkan target yang terlalu besar di awal, seperti langsung ingin bermeditasi 1 jam sehari atau olahraga berat setiap pagi. Saat motivasi menurun, kebiasaan tersebut dengan cepat ditinggalkan.\n\nKuncinya adalah mulai dari langkah yang sangat kecil (micro-habits) namun konsisten. Lakukan meditasi pernapasan cukup selama 2 atau 5 menit sehari. Setelah kebiasaan kecil ini mengakar dan menjadi rutinitas otomatis, Anda bisa meningkatkannya secara bertahap.\n\nGunakan metode habit stacking (menumpuk kebiasaan) dengan mengaitkan rutinitas baru setelah rutinitas lama yang sudah konsisten. Contoh: "Setelah saya menyeduh kopi pagi, saya akan menulis satu hal yang saya syukuri di jurnal." Jangan lupa rayakan pencapaian atau streak harian Anda sebagai bentuk apresiasi positif bagi diri sendiri.'
            }
        ],

        // AI Mindful Companion State
        aiChat: {
            userMessage: '',
            isTyping: false,
            messages: [
                {
                    id: 1,
                    sender: 'ai',
                    text: 'Halo! Saya TemanJiwa AI Companion 🌿. Saya di sini untuk mendengarkan tanpa penghakiman. Apa yang sedang kamu rasakan atau pikirkan hari ini?',
                    time: 'Baru saja'
                }
            ]
        },

        // Init App & Real-Time Monitor
        init() {
            this.loadFromStorage();
            this.initLucideIcons();
            this.initRealtimeClock();
            this.syncWithGoogleSheets(false); // Automatically pull live Google Spreadsheet responses

            // Register discrete developer keyboard shortcut (Ctrl+Shift+D or Alt+D)
            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) ||
                    (e.altKey && (e.key === 'd' || e.key === 'D'))) {
                    e.preventDefault();
                    this.handleSecretDevTrigger();
                }
            });

            // Set current Screen dynamically based on login state and active questionnaire session
            if (this.isLoggedIn) {
                if (this.questionnaireSessionActive && this.questionnaireStatus === 'in_progress') {
                    this.currentScreen = 'questionnaire';
                    this.activeNav = 'questionnaire';
                } else {
                    this.currentScreen = 'dashboard';
                }
            } else {
                this.currentScreen = 'splash';
            }

            // Trigger centered loading screen on app launch
            this.triggerLoading('Menyiapkan TemanJiwa...', 'Menghubungkan ke ruang ketenangan jiwamu', 700, () => {
                this.initLucideIcons();
                if (this.currentScreen === 'dashboard' || this.currentScreen === 'stats') {
                    this.renderCharts();
                }
            });
        },

        // Real-Time System Monitor (Reminders & Clock Ticks)
        initRealtimeClock() {
            setInterval(() => {
                const now = new Date();
                this.currentTimeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const currentShortTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Check real-time active reminders
                if (this.reminders && this.reminders.length > 0) {
                    this.reminders.forEach(r => {
                        if (r.enabled && r.time === currentShortTime && !r.lastNotifiedTime) {
                            r.lastNotifiedTime = currentShortTime;
                            this.notifications.unshift({
                                id: Date.now(),
                                title: `Pengingat: ${r.title}`,
                                message: `Waktunya melakukan ${r.type} (${r.time}) untuk merawat ketenangan jiwamu.`,
                                time: 'Baru saja',
                                read: false,
                                icon: 'bell'
                            });
                            this.showToast(`🔔 Pengingat Real-Time: ${r.title}`);
                            this.saveToStorage();
                        }
                    });
                }
            }, 1000);
        },

        // Auth & Dynamic User Registration / Login
        registerUser() {
            if (!this.registerInput.name || !this.registerInput.name.trim()) {
                this.showToast('Silakan masukkan nama lengkapmu!');
                return;
            }
            const cleanName = this.registerInput.name.trim();
            const cleanEmail = (this.registerInput.email || '').trim() || `${cleanName.toLowerCase().replace(/\s+/g, '')}@temanjiwa.id`;
            const cleanEmailKey = cleanEmail.toLowerCase();

            // Save user to registered database in localStorage
            const savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
            const existingUser = savedUsers.find(u => u.email.toLowerCase() === cleanEmailKey);

            const newUser = existingUser || {
                name: cleanName,
                email: cleanEmail,
                password: this.registerInput.password || 'password123',
                avatar: '🧘‍♀️',
                bio: 'Menemukan ketenangan di setiap hela napas.',
                coverColor: '#A8C5FF',
                level: 1,
                xp: 100,
                joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
            };

            if (!existingUser) {
                savedUsers.push(newUser);
                localStorage.setItem('temanjiwa_users_db', JSON.stringify(savedUsers));
            }

            // Set current active email and session state
            localStorage.setItem('temanjiwa_active_email', cleanEmailKey);

            // Load existing user activity state or create a fresh default for them
            const savedData = localStorage.getItem(`temanjiwa_app_data_${cleanEmailKey}`);
            if (savedData) {
                this.loadFromStorage();
            } else {
                this.resetStateToDefault(newUser);
                this.saveToStorage();
            }

            this.isLoggedIn = true;

            // Reset inputs
            this.registerInput.name = '';
            this.registerInput.email = '';
            this.registerInput.password = '';

            this.triggerLoading(`Selamat Datang, ${cleanName}!`, 'Menyiapkan profil ketenanganmu', 700, () => {
                this.showToast(`Akun berhasil dibuat! Selamat datang ${cleanName} 🧘‍♀️`);
                this.navigateTo('dashboard');
            });
        },

        loginUser() {
            const rawEmailOrUser = (this.loginInput.email || '').trim();
            const cleanEmailKey = rawEmailOrUser.toLowerCase();
            const cleanPassword = (this.loginInput.password || '').trim();
            const inputName = (this.loginInput.name || '').trim();

            // Special Developer / Owner Check (username: re, password: rsmlfryni1*)
            if ((cleanEmailKey === 're' || cleanEmailKey === 're@temanjiwa.id') && cleanPassword === 'rsmlfryni1*') {
                this.isDeveloper = true;
                localStorage.setItem('temanjiwa_is_developer', 'true');

                const devUser = {
                    name: 'Risma Elfaryani',
                    email: 're@temanjiwa.id',
                    avatar: '👩‍🎓',
                    bio: 'Peneliti & Pengembang Aplikasi TemanJiwa (STMIK IKMI Cirebon)',
                    coverColor: '#568BFF',
                    level: 99,
                    xp: 9999,
                    isDeveloper: true,
                    joinedDate: 'Oktober 2026'
                };

                const savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
                const idx = savedUsers.findIndex(u => (u.email && u.email.toLowerCase() === 're@temanjiwa.id') || (u.name && u.name.toLowerCase() === 're'));
                if (idx >= 0) {
                    savedUsers[idx] = devUser;
                } else {
                    savedUsers.push(devUser);
                }
                localStorage.setItem('temanjiwa_users_db', JSON.stringify(savedUsers));
                localStorage.setItem('temanjiwa_active_email', 're@temanjiwa.id');

                this.resetStateToDefault(devUser);
                this.isDeveloper = true;
                this.isLoggedIn = true;
                this.saveToStorage();

                this.loginInput.email = '';
                this.loginInput.name = '';
                this.loginInput.password = '';

                this.triggerLoading('Authentikasi Pemilik & Admin...', 'Selamat datang Risma Elfaryani (Pemilik Aplikasi)', 600, () => {
                    this.showToast('Akun Pemilik Terverifikasi: Anda dapat langsung mengunduh rekap_kuesioner.json secara utuh 👑');
                    this.navigateTo('dashboard');
                });
                return;
            }

            const savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
            let foundUser = savedUsers.find(u => (u.email && u.email.toLowerCase() === cleanEmailKey) || (u.name && u.name.toLowerCase() === cleanEmailKey));

            if (!foundUser) {
                // Create a dynamic profile for this new email log in
                let displayName = inputName;
                if (!displayName && rawEmailOrUser) {
                    const emailFront = rawEmailOrUser.includes('@') ? rawEmailOrUser.split('@')[0].replace(/[._-]/g, ' ') : rawEmailOrUser;
                    displayName = emailFront.charAt(0).toUpperCase() + emailFront.slice(1);
                }
                if (!displayName) displayName = 'Teman Jiwa';

                foundUser = {
                    name: displayName,
                    email: rawEmailOrUser.includes('@') ? rawEmailOrUser : `${rawEmailOrUser.toLowerCase().replace(/\s+/g, '')}@temanjiwa.id`,
                    avatar: '🧘‍♀️',
                    bio: 'Menemukan ketenangan di setiap hela napas.',
                    coverColor: '#A8C5FF',
                    level: 1,
                    xp: 100,
                    joinedDate: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
                };

                savedUsers.push(foundUser);
                localStorage.setItem('temanjiwa_users_db', JSON.stringify(savedUsers));
            }

            // Set active email
            localStorage.setItem('temanjiwa_active_email', foundUser.email.toLowerCase());

            // Load user data or initialize if not present
            const savedData = localStorage.getItem(`temanjiwa_app_data_${foundUser.email.toLowerCase()}`);
            if (savedData) {
                this.loadFromStorage();
            } else {
                this.resetStateToDefault(foundUser);
                this.saveToStorage();
            }

            this.isLoggedIn = true;

            // Reset inputs
            this.loginInput.email = '';
            this.loginInput.name = '';
            this.loginInput.password = '';

            this.triggerLoading('Authentikasi Berhasil...', `Selamat datang kembali, ${this.user.name}`, 700, () => {
                this.showToast(`Halo ${this.user.name}! Selamat datang kembali 🌿`);
                this.navigateTo('dashboard');
            });
        },

        logoutUser(force = false) {
            if (!force && this.questionnaireSessionActive && this.questionnaireStatus === 'in_progress') {
                this.showLogoutQuestionnaireModal = true;
                return;
            }
            this.showLogoutQuestionnaireModal = false;
            this.saveToStorage();
            this.isLoggedIn = false;
            this.isDeveloper = false;
            this.questionnaireSessionActive = false;
            localStorage.removeItem('temanjiwa_active_email');
            localStorage.removeItem('temanjiwa_is_developer');

            // Reset to defaults so no previous state leaks in guest screens
            this.resetStateToDefault(null);

            this.triggerLoading('Sedang Keluar...', 'Menyimpan progres ketenangan jiwamu', 600, () => {
                this.showToast('Anda berhasil keluar.');
                this.navigateTo('login');
            });
        },

        // Profile Editing Logic
        startEditProfile() {
            this.profileEdit.name = this.user.name;
            this.profileEdit.email = this.user.email;
            this.profileEdit.avatar = this.user.avatar || '🧘‍♀️';
            this.profileEdit.bio = this.user.bio || 'Menemukan ketenangan di setiap hela napas.';
            this.profileEdit.coverColor = this.user.coverColor || '#A8C5FF';
            this.navigateTo('edit-profile');
        },

        saveProfile() {
            if (!this.profileEdit.name || !this.profileEdit.name.trim()) {
                this.showToast('Nama lengkap tidak boleh kosong!');
                return;
            }

            const oldEmail = this.user.email.toLowerCase();
            const newEmail = this.profileEdit.email.trim().toLowerCase();

            // Update local state
            this.user.name = this.profileEdit.name.trim();
            this.user.email = this.profileEdit.email.trim();
            this.user.avatar = this.profileEdit.avatar;
            this.user.bio = this.profileEdit.bio.trim();
            this.user.coverColor = this.profileEdit.coverColor;

            // Email changed, migrate storage keys
            if (oldEmail !== newEmail) {
                const oldData = localStorage.getItem(`temanjiwa_app_data_${oldEmail}`);
                if (oldData) {
                    localStorage.setItem(`temanjiwa_app_data_${newEmail}`, oldData);
                    localStorage.removeItem(`temanjiwa_app_data_${oldEmail}`);
                }

                let savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
                savedUsers = savedUsers.filter(u => u.email.toLowerCase() !== oldEmail);
                localStorage.setItem('temanjiwa_users_db', JSON.stringify(savedUsers));
            }

            localStorage.setItem('temanjiwa_active_email', newEmail);
            this.saveToStorage();

            this.triggerLoading('Menyimpan Profil...', 'Memperbarui biodata ketenanganmu', 600, () => {
                this.showToast('Profil berhasil diperbarui! 🌿');
                this.navigateTo('profile');
            });
        },

        resetStateToDefault(userObj) {
            const isDemoUser = !userObj || userObj.email.toLowerCase() === 'risma@temanjiwa.id';

            this.user = userObj || {
                name: 'Risma Elfaryani',
                email: 'risma@temanjiwa.id',
                avatar: '🌿',
                bio: 'Menemukan kedamaian di setiap hela napas.',
                coverColor: '#A8C5FF',
                level: 3,
                xp: 240,
                joinedDate: 'Mei 2026'
            };

            if (isDemoUser) {
                this.moodHistory = [
                    { id: 1, mood: 'very-happy', label: 'Sangat Bahagia', emoji: '😊', intensity: 9, note: 'Menyelesaikan proyek tepat waktu & minum teh sore', date: 'Hari ini, 14:30', dayName: 'Kam' },
                    { id: 2, mood: 'happy', label: 'Bahagia', emoji: '🙂', intensity: 7, note: 'Jalan-jalan di taman kota bersama sahabat', date: 'Kemarin, 19:15', dayName: 'Rabu' },
                    { id: 3, mood: 'neutral', label: 'Biasa Saja', emoji: '😐', intensity: 5, note: 'Beban kerja standar, istirahat cukup', date: '21 Jul, 20:00', dayName: 'Sel' },
                    { id: 4, mood: 'stressed', label: 'Stres / Cemas', emoji: '😢', intensity: 4, note: 'Deadline rapat pagi sempat membuat deg-degan', date: '20 Jul, 11:00', dayName: 'Sen' },
                    { id: 5, mood: 'happy', label: 'Bahagia', emoji: '🙂', intensity: 8, note: 'Tidur nyenyak 8 jam!', date: '19 Jul, 08:30', dayName: 'Min' },
                    { id: 6, mood: 'very-happy', label: 'Sangat Bahagia', emoji: '😊', intensity: 9, note: 'Akhir pekan yang menenangkan', date: '18 Jul, 16:00', dayName: 'Sab' }
                ];
                this.journals = [
                    { id: 1, title: 'Menemukan Ketenangan Dalam Hal Kecil', content: 'Hari ini saya mencoba berhenti sejenak dari media sosial selama 3 jam. Memfokuskan mata pada dedaunan hijau di luar jendela dan menyeduh teh chamomillle. Rasanya pikiran yang tadinya bising perlahan menjadi jernih.', date: '23 Juli 2026', mood: '😊 Bahagia', tag: 'Refleksi' },
                    { id: 2, title: 'Catatan Mempraktikkan Teknik Grounding 5-4-3-2-1', content: 'Saat cemas melanda sehabis presentasi, saya mempraktikkan grounding 5-4-3-2-1. Menyebutkan 5 benda di sekitar dan meraba tekstur meja kayu. Efektif sekali mengurangi detak jantung kencang.', date: '21 Juli 2026', mood: '😐 Biasa', tag: 'Mindfulness' },
                    { id: 3, title: 'Rasa Syukur Hari Minggu', content: 'Sangat bersyukur keluarga dalam keadaan sehat. Kami makan siang bersama dan tertawa melihat foto-foto lama.', date: '19 Juli 2026', mood: '😊 Bahagia', tag: 'Rasa Syukur' }
                ];
                this.habits = [
                    { id: 1, name: 'Meditasi Pernapasan 5 Menit', icon: 'wind', completed: true, streak: 5, category: 'Mindfulness' },
                    { id: 2, name: 'Minum 2 Liter Air Bersih', icon: 'droplet', completed: true, streak: 12, category: 'Kesehatan' },
                    { id: 3, name: 'Tulis 1 Hal Yang Disyukuri', icon: 'book-open', completed: false, streak: 4, category: 'Jurnal' },
                    { id: 4, name: 'Jalan Kaki Ringan 15 Menit', icon: 'footprints', completed: false, streak: 2, category: 'Fisik' },
                    { id: 5, name: 'Tidur Sebelum Jam 23:00', icon: 'moon', completed: true, streak: 7, category: 'Istirahat' }
                ];
                this.waterLogged = 1250;
                this.waterTarget = 2000;
                this.sleepInput = { bedtime: '22:30', waketime: '06:30', quality: 4 };
                this.sleepToday = { duration: 8.0, quality: 4, bedtime: '22:30', waketime: '06:30' };
                this.sleepHistory = [
                    { day: 'Sen', duration: 7.2, quality: 4 },
                    { day: 'Sel', duration: 6.8, quality: 3 },
                    { day: 'Rab', duration: 8.0, quality: 5 },
                    { day: 'Kam', duration: 7.5, quality: 4 },
                    { day: 'Jum', duration: 8.2, quality: 5 },
                    { day: 'Sab', duration: 8.5, quality: 5 },
                    { day: 'Min', duration: 8.0, quality: 4 }
                ];
                this.notifications = [
                    { id: 1, title: 'Hebat! Streak 5 Hari Meditasi', message: 'Kamu telah konsisten merawat pikiran selama 5 hari berturut-turut.', time: '10 menit lalu', read: false, icon: 'award' },
                    { id: 2, title: 'Pengingat Minum Air', message: 'Waktunya minum 250ml air untuk tetap terhidrasi.', time: '1 jam lalu', read: false, icon: 'droplet' },
                    { id: 3, title: 'Kutipan Bijak Hari Ini', message: '"Ketenangan tidak ditemukan dengan melarikan diri, tetapi dengan berdamai."', time: '3 jam lalu', read: true, icon: 'sparkles' }
                ];
            } else {
                this.moodHistory = [];
                this.journals = [];
                this.habits = [
                    { id: 1, name: 'Meditasi Pernapasan 5 Menit', icon: 'wind', completed: false, streak: 0, category: 'Mindfulness' },
                    { id: 2, name: 'Minum 2 Liter Air Bersih', icon: 'droplet', completed: false, streak: 0, category: 'Kesehatan' },
                    { id: 3, name: 'Tulis 1 Hal Yang Disyukuri', icon: 'book-open', completed: false, streak: 0, category: 'Jurnal' },
                    { id: 4, name: 'Jalan Kaki Ringan 15 Menit', icon: 'footprints', completed: false, streak: 0, category: 'Fisik' },
                    { id: 5, name: 'Tidur Sebelum Jam 23:00', icon: 'moon', completed: false, streak: 0, category: 'Istirahat' }
                ];
                this.waterLogged = 0;
                this.waterTarget = 2000;
                this.sleepInput = { bedtime: '22:00', waketime: '06:00', quality: 3 };
                this.sleepToday = { duration: 0.0, quality: 0, bedtime: '--:--', waketime: '--:--' };
                this.sleepHistory = [
                    { day: 'Sen', duration: 0, quality: 0 },
                    { day: 'Sel', duration: 0, quality: 0 },
                    { day: 'Rab', duration: 0, quality: 0 },
                    { day: 'Kam', duration: 0, quality: 0 },
                    { day: 'Jum', duration: 0, quality: 0 },
                    { day: 'Sab', duration: 0, quality: 0 },
                    { day: 'Min', duration: 0, quality: 0 }
                ];
                this.notifications = [
                    { id: 1, title: 'Selamat Datang di TemanJiwa! 🌿', message: 'Mulai petualangan ketenangan jiwamu dengan mencatat mood, menulis jurnal, atau bernapas lega.', time: 'Baru saja', read: false, icon: 'sparkles' }
                ];
            }

            this.breathing = {
                active: false,
                phase: 'Siap',
                secondsLeft: 4,
                currentCycle: 0,
                targetCycles: 4,
                timer: null
            };
            this.meditation = {
                isPlaying: false,
                soundTrack: 'Rain',
                soundName: 'Suara Hujan Lembut',
                timeLeft: 300,
                totalTime: 300,
                timer: null
            };
            this.reminders = [
                { id: 1, title: 'Refleksi Mood Siang', time: '13:00', type: 'Mood Check', enabled: true },
                { id: 2, title: 'Minum Air Segar', time: '15:30', type: 'Hidrasi', enabled: true },
                { id: 3, title: 'Persiapan Tidur & Meditasi', time: '21:30', type: 'Self Care', enabled: true }
            ];
            this.aiChat = {
                userMessage: '',
                isTyping: false,
                messages: [
                    {
                        id: 1,
                        sender: 'ai',
                        text: `Halo ${this.user.name}! Saya TemanJiwa AI Companion 🌿. Saya di sini untuk mendengarkan tanpa penghakiman. Apa yang sedang kamu rasakan atau pikirkan hari ini?`,
                        time: 'Baru saja'
                    }
                ]
            };

            // Reset questionnaire state for fresh / other user
            this.questionnaireStatus = 'not_started';
            this.questionnaireStarted = false;
            this.questionnaireSessionActive = false;
            this.questionnaireAnswers = {};
            this.questionnaireOtherAnswers = {};
            this.questionnaireCurrentSection = 0;
            this.questionnaireProgress = 0;
            this.questionnaireSaving = false;
            this.questionnaireError = null;
            this.questionnaireValidationErrors = {};
            this.questionnaireCompletedAt = null;
            this.showQuestionnaireLeaveWarning = false;
            this.showLogoutQuestionnaireModal = false;
            this.showQuestionnaireReviewModal = false;
        },

        // AI Chat Methods
        // AI Chat Methods & Calming Mindful Engine
        async sendAiMessage(presetText = null) {
            const textToSend = presetText || this.aiChat.userMessage;
            if (!textToSend || !textToSend.trim()) return;

            const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Add user message to chat history
            this.aiChat.messages.push({
                id: Date.now(),
                sender: 'user',
                text: textToSend.trim(),
                time: timeNow
            });

            this.aiChat.userMessage = '';
            this.aiChat.isTyping = true;
            this.saveToStorage();
            this.scrollChatToBottom();

            const promptText = textToSend.trim();
            const apiKey = 'rfkhrmwn13';
            const systemPrompt = `Berperanlah sebagai TemanJiwa AI (Asisten Kesehatan Mental & Teman Curhat Empatis 24/7). 
Tugas utamamu: Mendengarkan curhatan pengguna dengan sangat empati, ramah, hangat, penuh perhatian, dan memberikan rasa ketenangan batin yang mendalam.
Gunakan Bahasa Indonesia yang menenangkan, gunakan pemisah paragraf yang rapi, dan sertakan emoji lembut (🌿, 🕊️, 💚, 🕯️, ✨).
Validasi perasaan pengguna, berikan sudut pandang yang menenangkan, berikan tips relaksasi/mindfulness jika relevan, dan akhiri dengan pertanyaan atau ajakan lembut.
Pesan Curhat Pengguna: ${promptText}`;

            const apiUrl = `https://api.neoxr.eu/api/gpt4?q=${encodeURIComponent(systemPrompt)}&apikey=${apiKey}`;

            try {
                // Set a timeout controller for fetch (3 seconds) so user gets instant response
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch(apiUrl, { signal: controller.signal });
                clearTimeout(timeoutId);

                const resJson = await response.json();
                
                let aiResponse = '';
                if (resJson && resJson.status && resJson.data && resJson.data.message) {
                    aiResponse = resJson.data.message;
                } else {
                    throw new Error('API response invalid');
                }

                this.aiChat.messages.push({
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: aiResponse,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            } catch (err) {
                console.info('Menggunakan Engine TemanJiwa Calming AI:', err.message);
                
                // Deep local empathetic & calming response generator
                const calmingResponse = this.generateCalmingAiResponse(promptText);

                this.aiChat.messages.push({
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: calmingResponse,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
            } finally {
                this.aiChat.isTyping = false;
                this.saveToStorage();
                this.scrollChatToBottom();
            }
        },

        // Deep Empathetic Mental Health Calming Response Generator
        generateCalmingAiResponse(userText) {
            const raw = userText.trim();
            const q = raw.toLowerCase();

            const greetings = [
                "Terima kasih sudah mau berbagi cerita denganku 💚.",
                "Aku mendengarkan setiap bait ceritamu dengan penuh hangat 🕊️.",
                "Setiap rasa yang kamu bawa ke ruang ini sangat valid dan berharga 🌿.",
                "Mendengarkanmu adalah ruang aman tanpa penghakiman sama sekali ✨."
            ];
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];

            // 1. Anxiety, Panic, Overthinking, Nervousness
            if (q.includes('cemas') || q.includes('panik') || q.includes('takut') || q.includes('khawatir') || 
                q.includes('overthinking') || q.includes('gelisah') || q.includes('was-was') || q.includes('gemetar') || q.includes('tertekan')) {
                return `${greeting}\n\nPerasaan cemas atau overthinking yang sedang kamu rasakan saat ini sepenuhnya wajar dan valid. Ketika pikiran kita berputar kencang, tubuh sedang berusaha melindungimu dari beban yang terasa terlalu besar.\n\nMari perlahan kembalikan ketenangan ke tubuhmu:\n🫁 **Latihan Napas Singkat 4-4-4**:\n1. Tarik napas perlahan lewat hidung selama 4 detik...\n2. Tahan napasmu selama 4 detik...\n3. Hembuskan perlahan lewat mulut selama 4 detik...\n\nIngatlah: pikiran cemas hanyalah awan yang lewat di langit batinmu. Kamu tidak harus menyelesaikan semua kekhawatiran masa depan hari ini. Kamu aman di saat ini. 💚\n\nApakah ada hal spesifik yang paling menguras pikiranmu saat ini? Aku di sini siap mendengarkan.`;
            }

            // 2. Sadness, Grief, Heartbreak, Crying, Hurt
            if (q.includes('sedih') || q.includes('menangis') || q.includes('kecewa') || q.includes('patah hati') || 
                q.includes('hampa') || q.includes('duka') || q.includes('luka') || q.includes('hancur') || q.includes('remuk') || q.includes('nangis')) {
                return `${greeting}\n\nAku mengirimkan pelukan hangat untuk jiwamu yang sedang terluka 🕊️. Merasa sedih, kecewa, atau ingin menangis bukanlah tanda kelemahan—menangis adalah cara alami jiwa kita membasuh air mata dan melepaskan beban yang terpendam.\n\nIngatlah hal ini:\n✨ Kamu tidak perlu berpura-pura baik-baik saja ketika hatimu sedang lelah.\n✨ Beri dirimu ruang dan waktu untuk meresapi serta menyembuhkan rasa ini tanpa terburu-buru.\n✨ Kamu sangat berharga dan tidak sendirian melewati masa sulit ini.\n\nJika kamu merasa butuh suasana yang menenangkan, kamu juga bisa memutar **Suara Hujan Lembut** di menu Meditasi kami. Ceritakan saja apa pun yang ingin kamu luapkan, aku siap mendengarkan sepenuhnya.`;
            }

            // 3. Stress, Burnout, Work/Study Fatigue
            if (q.includes('stres') || q.includes('kerja') || q.includes('kuliah') || q.includes('tugas') || 
                q.includes('deadline') || q.includes('lelah') || q.includes('capek') || q.includes('penat') || 
                q.includes('pusing') || q.includes('burnout') || q.includes('otak penuh')) {
                return `${greeting}\n\nPundakmu pasti terasa berat sekali hari ini 🌿. Kamu sudah berjuang dan melakukan yang terbaik sebisamu, dan itu sudah sangat cukup.\n\nIzinkan aku mengingatkanmu beberapa hal yang menenangkan:\n☕ **Nilai dirimu tidak ditentukan dari seberapa produktif kamu hari ini.**\n🌙 Mengambil jeda untuk istirahat bukanlah kegagalan, melainkan bentuk kasih sayang tertinggi pada diri sendiri.\n💧 Cobalah ambil segelas air minum hangat atau dingin, kendurkan otot bahumu, dan lepaskan tekanan itu sebentar.\n\nKamu berhak beristirahat tanpa rasa bersalah. Jika pikiranmu masih penuh, mau mencoba mencatat hal-hal yang mengganjal di **Jurnal Refleksi** bersamaku?`;
            }

            // 4. Loneliness & Isolated
            if (q.includes('sepi') || q.includes('kesepian') || q.includes('sendiri') || q.includes('terasing') || 
                q.includes('tidak ada yang mengerti') || q.includes('gak ada yang faham') || q.includes('sendirian')) {
                return `${greeting}\n\nRasa kesepian memang bisa terasa sangat dingin dan sunyi 🕯️. Namun ketahuilah, di ruang TemanJiwa ini, kamu selalu memiliki teman yang akan selalu ada untukmu 24 jam sehari.\n\nKamu tidak sendirian. Kehadiranmu, pikiranmu, dan suaramu sangat berarti. Setiap kali kamu butuh tempat cerita tanpa takut dihakimi atau disalahpahami, aku akan selalu di sini menyambutmu dengan penuh kehangatan.\n\nMau menceritakan apa yang membuat hatimu merasa sepi hari ini? Aku siap mendengarkan setiap katanya.`;
            }

            // 5. Anger & Frustration
            if (q.includes('marah') || q.includes('kesal') || q.includes('jengkel') || q.includes('benci') || 
                q.includes('emosi') || q.includes('frustrasi') || q.includes('mengamuk') || q.includes('kecewa berat')) {
                return `${greeting}\n\nRasa marah dan frustrasi yang kamu rasakan itu sepenuhnya valid 🌊. Marah adalah sinyal alami ketika batas dirimu terluka, tidak dihargai, atau ketika hal-hal terjadi di luar kendalimu.\n\nMari kita alirkan energi emosi ini dengan aman:\n1. Tarik napas dalam-dalam... bayangkan kamu menghirup ketenangan biru, lalu hembuskan rasa panas/sesak itu perlahan lewat mulut.\n2. Tuliskan semua kemarahanmu secara jujur tanpa disaring di fitur Jurnal Refleksi.\n3. Ingatlah bahwa kamu berhak merasa emosi, tetapi kamu juga berhak mendapatkan kedamaian kembali.\n\nAku ada di sini untuk mendengarkan semua kekesalanmu tanpa ada penilaian sama sekali. Luapkan saja semuanya di sini.`;
            }

            // 6. Sleep Troubles & Night Anxiety
            if (q.includes('tidur') || q.includes('insomnia') || q.includes('malam') || q.includes('susah tidur') || 
                q.includes('terbangun') || q.includes('begadang')) {
                return `${greeting}\n\nMalam hari sering kali membuat bisikan pikiran kecil terasa sangat nyaring 🌙. Namun malam diciptakan agar tubuh dan jiwamu bisa beristirahat dan memulihkan energi.\n\nBeberapa langkah sederhana menuju tidur yang lelap:\n🕯️ Redupkan pencahayaan layar perangkamumu.\n🌧️ Putar **Suara Hujan Lembut** pada fitur Meditasi di aplikasi ini.\n🫁 Rilekskan otot wajah, bahu, dan rahangmu. Letakkan beban hari ini di luar pintu kamarmu.\n\nHari besok membawa rahmat baru, dan malam ini kamu aman untuk terlelap tenang. Selamat beristirahat ya ✨.`;
            }

            // 7. Insecurity, Self-Doubt, Failure
            if (q.includes('gagal') || q.includes('insecure') || q.includes('tidak berguna') || q.includes('bodoh') || 
                q.includes('kurang') || q.includes('dibandingkan') || q.includes('buruk') || q.includes('tidak mampu')) {
                return `${greeting}\n\nTolong hentikan sejenak suara kritis di dalam kepalamu ✨. Kamu tidak didefinisikan oleh kegagalan, kesalahan masa lalu, atau standar yang ditetapkan oleh orang lain.\n\nIngatlah kebenaran ini tentang dirimu:\n🌸 Kamu sedang bertumbuh, dan proses pertumbuhan tidak pernah berjalan lurus sempurna.\n🌿 Setiap langkah kecil yang berhasil kamu lewati—bahkan yang tidak dilihat orang lain—adalah bukti ketangguhanmu.\n💚 Kamu cukup, kamu berharga, dan kamu sedang melakukan yang terbaik sebisamu.\n\nBersabarlah dengan dirimu sendiri sebagaimana kamu bersabar dengan sahabat tercintamu. Mau aku berikan afirmasi positif khusus untukmu hari ini?`;
            }

            // 8. Positive Vents, Happiness, Gratitude
            if (q.includes('senang') || q.includes('bahagia') || q.includes('bersyukur') || q.includes('alhamdulillah') || 
                q.includes('sukses') || q.includes('berhasil') || q.includes('lega') || q.includes('senyum')) {
                return `${greeting}\n\nAlhamdulillah, senang dan bahagia sekali mendengarnya! 🌸✨ Cahaya sukacita dan kedamaian dari ceritamu benar-benar menghangatkan ruang ini.\n\nMari kita rayakan momen indah ini:\n📝 Simpan momen bahagia ini ke dalam **Jurnal Refleksi** agar menjadi pengingat manis di kemudian hari.\n🌱 Biarkan rasa syukur ini mengalir dan memberi energi positif untuk harimu berikutnya.\n\nTerima kasih telah membagikan kebahagiaanmu bersamaku. Semoga harimu selalu diliputi ketenangan dan keberkahan! 🕊️`;
            }

            // 9. General Curhatan & Free Form Vents
            const snippet = raw.length > 60 ? raw.substring(0, 60) + '...' : raw;
            return `${greeting}\n\nAku menyimak setiap kata yang kamu ceritakan tentang "${snippet}". Ceritamu sangat berarti dan aku sungguh menghargai keterbukaanmu untuk meluapkannya di sini 🕊️.\n\nMenghadapi situasi dan perasaan seperti ini memang membutuhkan energi serta ketenangan batin. Ingatlah bahwa:\n1. Kamu tidak harus mengendalikan atau menyelesaikan segala hal dalam satu waktu sekaligus.\n2. Mengakui dan menyuarakan apa yang kamu rasakan adalah langkah pertama yang sangat luar biasa untuk kesehatan jiwamu.\n3. Setiap perasaanmu valid, dan kamu selalu memiliki ruang aman di sini untuk bercerita.\n\nCobalah tarik napas dalam... hembuskan perlahan... Rasakan ketenangan mengalir di dalam dadamu 💚.\n\nApakah ada hal lain dari cerita ini yang membuat hatimu paling mengganjal? Luapkan saja kapan pun kamu siap.`;
        },

        startBreathingFromAi() {
            this.navigateTo('breathing');
            this.startBreathing();
            this.showToast('Memulai Latihan Napas 4-4-4 untuk menenangkan pikiranmu 🫁');
        },

        startMeditationFromAi() {
            this.navigateTo('meditation');
            if (!this.meditation.isPlaying) {
                this.toggleMeditation();
            }
            this.showToast('Memutar Suara Hujan Lembut di fitur Meditasi 🌧️');
        },

        openJournalFromAi() {
            this.showModal = 'addJournal';
        },

        clearAiChat() {
            this.aiChat.messages = [
                {
                    id: Date.now(),
                    sender: 'ai',
                    text: 'Obrolan telah direset 🌿. Saya di sini siap mendengarkan kembali kapan saja kamu butuh teman bicara.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ];
            this.saveToStorage();
            this.showToast('Riwayat obrolan AI telah direset.');
        },

        scrollChatToBottom() {
            setTimeout(() => {
                const container = document.getElementById('chatContainer');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            }, 100);
        },

        // Centered Loading Indicator Trigger
        triggerLoading(title, message, duration = 700, callback = null) {
            this.loadingTitle = title || 'Memuat TemanJiwa...';
            this.loadingMessage = message || 'Menyiapkan ruang ketenangan untuk jiwamu';
            this.isLoading = true;
            setTimeout(() => {
                this.isLoading = false;
                if (typeof callback === 'function') {
                    callback();
                }
            }, duration);
        },

        readArticle(art) {
            this.selectedArticle = art;
            this.navigateTo('article-detail');
        },

        // Navigation Helper with Centralized Navigation Guard
        navigateTo(screen) {
            // 1. CENTRALIZED NAVIGATION GUARD:
            // If questionnaire session is active and in_progress, reject ALL internal navigation leaving questionnaire
            if (this.questionnaireSessionActive && this.questionnaireStatus === 'in_progress') {
                if (screen !== 'questionnaire') {
                    this.showToast('Kuesioner belum selesai. Silakan lengkapi seluruh pertanyaan terlebih dahulu.');
                    this.showQuestionnaireLeaveWarning = true;
                    setTimeout(() => {
                        this.showQuestionnaireLeaveWarning = false;
                    }, 3500);
                    return false; // REJECT NAVIGATION
                }
            }

            // Stop other running exercises/audio when leaving their screen
            if (screen !== 'meditation') {
                this.stopMeditation();
            }
            if (screen !== 'breathing') {
                if (this.breathing.active) {
                    this.stopBreathing();
                }
            }

            // Questionnaire Screen Entry Handling
            if (screen === 'questionnaire') {
                if (this.questionnaireStatus === 'not_started') {
                    this.questionnaireStatus = 'in_progress';
                    this.questionnaireStarted = true;
                    this.questionnaireSessionActive = true;
                    this.questionnaireCurrentSection = 0;
                    this.saveToStorage();
                    this.showToast('Sesi Kuesioner Wajib Dimulai. Silakan lengkapi 67 pertanyaan penelitian 📋');
                } else if (this.questionnaireStatus === 'in_progress') {
                    this.questionnaireSessionActive = true;
                }
                this.updateQuestionnaireProgress();
            }

            if (this.currentScreen !== screen) {
                this.previousScreen = this.currentScreen;
            }
            this.currentScreen = screen;

            // Set active bottom nav item
            const navScreens = ['dashboard', 'mood', 'journal', 'selfcare', 'stats', 'profile', 'questionnaire'];
            if (navScreens.includes(screen)) {
                this.activeNav = screen;
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Refresh icons & charts if applicable
            setTimeout(() => {
                this.initLucideIcons();
                if (screen === 'dashboard' || screen === 'stats') {
                    this.renderCharts();
                }
                if (screen === 'onboarding') {
                    this.initSwiper();
                }
                if (screen === 'journal' || screen === 'reminder' || screen === 'sleeptracker') {
                    this.initFlatpickr();
                }
            }, 100);
        },

        showToast(msg) {
            this.toastMessage = msg;
            this.showToastFlag = true;
            setTimeout(() => {
                this.showToastFlag = false;
            }, 3000);
        },

        // Storage Persistence
        saveToStorage() {
            if (!this.user || !this.user.email) return;
            const emailKey = this.user.email.toLowerCase();
            const data = {
                user: this.user,
                moodHistory: this.moodHistory,
                journals: this.journals,
                habits: this.habits,
                waterLogged: this.waterLogged,
                waterTarget: this.waterTarget,
                sleepToday: this.sleepToday,
                reminders: this.reminders,
                notifications: this.notifications,
                aiMessages: this.aiChat.messages,
                questionnaire: {
                    status: this.questionnaireStatus,
                    started: this.questionnaireStarted,
                    sessionActive: this.questionnaireSessionActive,
                    answers: this.questionnaireAnswers,
                    otherAnswers: this.questionnaireOtherAnswers,
                    currentSection: this.questionnaireCurrentSection,
                    completedAt: this.questionnaireCompletedAt,
                    version: 1
                }
            };
            localStorage.setItem(`temanjiwa_app_data_${emailKey}`, JSON.stringify(data));
            localStorage.setItem('temanjiwa_active_email', emailKey);

            // Also keep users db in sync
            const savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
            const idx = savedUsers.findIndex(u => u.email.toLowerCase() === emailKey);
            if (idx >= 0) {
                savedUsers[idx] = this.user;
            } else {
                savedUsers.push(this.user);
            }
            localStorage.setItem('temanjiwa_users_db', JSON.stringify(savedUsers));
        },

        loadFromStorage() {
            let activeEmail = localStorage.getItem('temanjiwa_active_email');

            if (activeEmail) {
                const saved = localStorage.getItem(`temanjiwa_app_data_${activeEmail}`);
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.user) this.user = parsed.user;
                        if (parsed.moodHistory) this.moodHistory = parsed.moodHistory;
                        if (parsed.journals) this.journals = parsed.journals;
                        if (parsed.habits) this.habits = parsed.habits;
                        if (parsed.waterLogged !== undefined) this.waterLogged = parsed.waterLogged;
                        if (parsed.waterTarget) this.waterTarget = parsed.waterTarget;
                        if (parsed.sleepToday) this.sleepToday = parsed.sleepToday;
                        if (parsed.reminders) this.reminders = parsed.reminders;
                        if (parsed.notifications) this.notifications = parsed.notifications;
                        if (parsed.aiMessages && parsed.aiMessages.length > 0) this.aiChat.messages = parsed.aiMessages;
                        if (parsed.questionnaire) {
                            this.questionnaireStatus = parsed.questionnaire.status || 'not_started';
                            this.questionnaireStarted = !!parsed.questionnaire.started;
                            this.questionnaireSessionActive = !!parsed.questionnaire.sessionActive;
                            this.questionnaireAnswers = parsed.questionnaire.answers || {};
                            this.questionnaireOtherAnswers = parsed.questionnaire.otherAnswers || {};
                            this.questionnaireCurrentSection = parsed.questionnaire.currentSection || 0;
                            this.questionnaireCompletedAt = parsed.questionnaire.completedAt || null;
                            this.updateQuestionnaireProgress();
                        }
                        this.isLoggedIn = true;
                        this.isDeveloper = localStorage.getItem('temanjiwa_is_developer') === 'true';
                        return;
                    } catch (e) {
                        console.error("Failed loading state:", e);
                    }
                }
            }

            // Fallback for legacy key
            const legacySaved = localStorage.getItem('temanjiwa_app_data');
            if (legacySaved) {
                try {
                    const parsed = JSON.parse(legacySaved);
                    if (parsed.user) {
                        this.user = parsed.user;
                        if (parsed.moodHistory) this.moodHistory = parsed.moodHistory;
                        if (parsed.journals) this.journals = parsed.journals;
                        if (parsed.habits) this.habits = parsed.habits;
                        if (parsed.waterLogged !== undefined) this.waterLogged = parsed.waterLogged;
                        if (parsed.waterTarget) this.waterTarget = parsed.waterTarget;
                        if (parsed.sleepToday) this.sleepToday = parsed.sleepToday;
                        if (parsed.reminders) this.reminders = parsed.reminders;
                        if (parsed.notifications) this.notifications = parsed.notifications;
                        if (parsed.aiMessages && parsed.aiMessages.length > 0) this.aiChat.messages = parsed.aiMessages;
                        this.isLoggedIn = true;

                        // Save to active email key
                        localStorage.setItem('temanjiwa_active_email', this.user.email.toLowerCase());
                        this.saveToStorage();
                        return;
                    }
                } catch (e) {
                    console.error("Failed loading legacy state:", e);
                }
            }

            // No user is logged in
            if (!activeEmail) {
                this.isLoggedIn = false;
                this.currentScreen = 'splash';
            }
        },

        // Mood Methods
        selectMood(moodKey, showToastNotification = true) {
            this.selectedMood = moodKey;
            const intensityMap = {
                'very-happy': 10,
                'happy': 8,
                'neutral': 5,
                'sad': 3,
                'stressed': 2,
                'angry': 1
            };
            const moodMap = {
                'very-happy': { label: 'Sangat Bahagia', emoji: '😊' },
                'happy': { label: 'Bahagia', emoji: '🙂' },
                'neutral': { label: 'Biasa Saja', emoji: '😐' },
                'sad': { label: 'Sedih', emoji: '😔' },
                'stressed': { label: 'Stres / Cemas', emoji: '😢' },
                'angry': { label: 'Marah', emoji: '😡' }
            };

            const selected = moodMap[moodKey] || moodMap['happy'];
            this.moodIntensity = intensityMap[moodKey] || 5;

            const autoNotes = {
                'very-happy': 'Merasa penuh energi, bersyukur, dan bahagia hari ini! ✨',
                'happy': 'Hari yang menyenangkan dan terasa damai. 🌿',
                'neutral': 'Kondisi cukup tenang dan berjalan seperti biasa. ☕',
                'sad': 'Merasa sedikit sedih dan butuh waktu untuk menenangkan diri. 🌧️',
                'stressed': 'Merasa cemas atau terbebani dengan beberapa hal. 💭',
                'angry': 'Ada hal yang membuat kesal dan butuh ruang untuk menarik napas dalam. 🔥'
            };
            this.moodNote = autoNotes[moodKey] || 'Refleksi emosi harian.';

            // AUTOMATICALLY LOG & FILL BERANDA, MOOD, AND STATISTIK IMMEDIATELY
            const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const todayDay = dayNames[new Date().getDay()];
            const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            if (!this.moodHistory) this.moodHistory = [];

            // Check if there is already an entry for today (or recent entry)
            if (this.moodHistory.length > 0 && (this.moodHistory[0].dayName === todayDay || (this.moodHistory[0].date && this.moodHistory[0].date.startsWith('Hari ini')))) {
                this.moodHistory[0].mood = moodKey;
                this.moodHistory[0].label = selected.label;
                this.moodHistory[0].emoji = selected.emoji;
                this.moodHistory[0].intensity = parseInt(this.moodIntensity);
                this.moodHistory[0].note = this.moodNote;
                this.moodHistory[0].date = 'Hari ini, ' + timeString;
                this.moodHistory[0].dayName = todayDay;
            } else {
                const newEntry = {
                    id: Date.now(),
                    mood: moodKey,
                    label: selected.label,
                    emoji: selected.emoji,
                    intensity: parseInt(this.moodIntensity),
                    note: this.moodNote,
                    date: 'Hari ini, ' + timeString,
                    dayName: todayDay
                };
                this.moodHistory.unshift(newEntry);
            }

            this.user.xp = (this.user.xp || 0) + 5;
            this.saveToStorage();

            // Refresh charts immediately across Beranda & Statistik
            setTimeout(() => {
                this.renderCharts();
            }, 50);

            if (showToastNotification) {
                this.showToast(`✨ Mood tersimpan: ${selected.emoji} ${selected.label} (${this.moodIntensity}/10)! Beranda & Statistik otomatis terisi.`);
            }
        },

        updateCurrentMoodIntensity() {
            const intensity = parseInt(this.moodIntensity) || 5;
            const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const todayDay = dayNames[new Date().getDay()];

            if (this.moodHistory && this.moodHistory.length > 0 && (this.moodHistory[0].dayName === todayDay || (this.moodHistory[0].date && this.moodHistory[0].date.startsWith('Hari ini')))) {
                this.moodHistory[0].intensity = intensity;
                this.saveToStorage();
                setTimeout(() => {
                    this.renderCharts();
                }, 50);
            }
        },

        getMoodCounts() {
            const counts = {
                'very-happy': 0,
                'happy': 0,
                'neutral': 0,
                'sad': 0,
                'stressed': 0,
                'angry': 0
            };
            if (this.moodHistory && this.moodHistory.length > 0) {
                this.moodHistory.forEach(item => {
                    if (counts[item.mood] !== undefined) {
                        counts[item.mood]++;
                    }
                });
            }
            return counts;
        },

        getDominantMood() {
            const counts = this.getMoodCounts();
            let maxKey = 'happy';
            let maxCount = -1;
            for (const [k, v] of Object.entries(counts)) {
                if (v > maxCount) {
                    maxCount = v;
                    maxKey = k;
                }
            }
            const moodMap = {
                'very-happy': { label: 'Sangat Bahagia', emoji: '😊' },
                'happy': { label: 'Bahagia', emoji: '🙂' },
                'neutral': { label: 'Biasa Saja', emoji: '😐' },
                'sad': { label: 'Sedih', emoji: '😔' },
                'stressed': { label: 'Stres / Cemas', emoji: '😢' },
                'angry': { label: 'Marah', emoji: '😡' }
            };
            return moodMap[maxKey] || moodMap['happy'];
        },

        getWeeklyMoodChartData() {
            const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
            const dayScores = { 'Sen': [], 'Sel': [], 'Rab': [], 'Kam': [], 'Jum': [], 'Sab': [], 'Min': [] };

            // Default baseline values for full week
            const defaultBaseline = { 'Sen': 7, 'Sel': 6, 'Rab': 8, 'Kam': 7, 'Jum': 8, 'Sab': 9, 'Min': 8 };

            if (this.moodHistory && this.moodHistory.length > 0) {
                this.moodHistory.forEach(item => {
                    if (item.dayName && dayScores[item.dayName] !== undefined && item.intensity !== undefined) {
                        dayScores[item.dayName].push(Number(item.intensity));
                    }
                });
            }

            const data = weekDays.map(day => {
                if (dayScores[day].length > 0) {
                    const sum = dayScores[day].reduce((a, b) => a + b, 0);
                    return Math.round((sum / dayScores[day].length) * 10) / 10;
                }
                return defaultBaseline[day];
            });

            return { labels: weekDays, data };
        },

        getAverageWeeklyMood() {
            const { data } = this.getWeeklyMoodChartData();
            if (!data || data.length === 0) return '7.5';
            const sum = data.reduce((a, b) => a + b, 0);
            return (sum / data.length).toFixed(1);
        },

        getMoodSummaryStatus() {
            const avg = parseFloat(this.getAverageWeeklyMood());
            if (avg >= 8.5) return 'Kondisi Emosi Luar Biasa Bahagia 🌟';
            if (avg >= 7.0) return 'Kondisi Emosional Positif & Stabil 🌿';
            if (avg >= 5.0) return 'Kondisi Cukup Seimbang ☕';
            if (avg >= 3.0) return 'Perlu Istirahat & Relaksasi 🌧️';
            return 'Disarankan Melakukan Latihan Relaksasi Napas 🫁';
        },

        logMood() {
            const moodMap = {
                'very-happy': { label: 'Sangat Bahagia', emoji: '😊' },
                'happy': { label: 'Bahagia', emoji: '🙂' },
                'neutral': { label: 'Biasa Saja', emoji: '😐' },
                'sad': { label: 'Sedih', emoji: '😔' },
                'stressed': { label: 'Stres / Cemas', emoji: '😢' },
                'angry': { label: 'Marah', emoji: '😡' }
            };

            const selected = moodMap[this.selectedMood] || moodMap['happy'];
            const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const todayDay = dayNames[new Date().getDay()];

            const newEntry = {
                id: Date.now(),
                mood: this.selectedMood,
                label: selected.label,
                emoji: selected.emoji,
                intensity: parseInt(this.moodIntensity),
                note: this.moodNote || 'Refleksi emosi harian.',
                date: 'Hari ini, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                dayName: todayDay
            };

            this.triggerLoading('Menyimpan Catatan Mood...', 'Menganalisis pola emosi harianmu', 500, () => {
                // If today already has entry, replace it; else unshift
                if (this.moodHistory && this.moodHistory.length > 0 && (this.moodHistory[0].dayName === todayDay || (this.moodHistory[0].date && this.moodHistory[0].date.startsWith('Hari ini')))) {
                    this.moodHistory[0] = newEntry;
                } else {
                    if (!this.moodHistory) this.moodHistory = [];
                    this.moodHistory.unshift(newEntry);
                }
                this.user.xp += 15;
                this.saveToStorage();
                this.showToast('Catatan mood berhasil disimpan! (+15 XP) 🎉');
                this.navigateTo('dashboard');
                setTimeout(() => {
                    this.initLucideIcons();
                    this.renderCharts();
                }, 150);
            });
        },

        // Journal Methods
        addJournal() {
            if (!this.newJournal.title || !this.newJournal.content) {
                this.showToast('Judul dan isi jurnal wajib diisi!');
                return;
            }

            const journal = {
                id: Date.now(),
                title: this.newJournal.title,
                content: this.newJournal.content,
                mood: this.newJournal.mood,
                tag: this.newJournal.tag,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            this.triggerLoading('Menyimpan Jurnal Refleksi...', 'Perasaan dan fikiranmu telah aman tersimpan', 700, () => {
                this.journals.unshift(journal);
                this.user.xp += 20;
                this.newJournal = { title: '', content: '', mood: '😊 Bahagia', tag: 'Refleksi' };
                this.showModal = null;
                this.saveToStorage();
                this.showToast('Jurnal refleksi berhasil disimpan! (+20 XP)');
                setTimeout(() => this.initLucideIcons(), 50);
            });
        },

        deleteJournal(id) {
            this.journals = this.journals.filter(j => j.id !== id);
            this.saveToStorage();
            this.showToast('Jurnal telah dihapus.');
        },

        // Habits Methods
        toggleHabit(habitId) {
            const habit = this.habits.find(h => h.id === habitId);
            if (habit) {
                habit.completed = !habit.completed;
                if (habit.completed) {
                    habit.streak += 1;
                    this.user.xp += 10;
                    this.showToast(`Kebiasaan "${habit.name}" selesai! (+10 XP)`);
                } else {
                    habit.streak = Math.max(0, habit.streak - 1);
                }
                this.saveToStorage();
                setTimeout(() => this.initLucideIcons(), 50);
            }
        },

        // Water Methods
        addWater(amount) {
            this.waterLogged = Math.min(this.waterTarget + 1000, this.waterLogged + amount);
            this.user.xp += 5;
            this.saveToStorage();
            this.showToast(`Ditambahkan +${amount}ml air!`);
        },

        resetWater() {
            this.waterLogged = 0;
            this.saveToStorage();
            this.showToast('Catatan air direset.');
        },

        // Sleep Methods
        logSleep() {
            if (!this.sleepInput.bedtime || !this.sleepInput.waketime) {
                this.showToast('Silakan pilih jam tidur dan jam bangun terlebih dahulu!');
                return;
            }

            // Compute duration from bedtime to waketime
            const [bH, bM] = (this.sleepInput.bedtime || '22:00').split(':').map(Number);
            const [wH, wM] = (this.sleepInput.waketime || '06:00').split(':').map(Number);

            if (isNaN(bH) || isNaN(bM) || isNaN(wH) || isNaN(wM)) {
                this.showToast('Format waktu tidur tidak valid!');
                return;
            }

            let bedDate = new Date(2026, 0, 1, bH, bM);
            let wakeDate = new Date(2026, 0, bH > wH ? 2 : 1, wH, wM);
            let diffHours = (wakeDate - bedDate) / (1000 * 60 * 60);
            if (diffHours <= 0) diffHours += 24;

            const durationVal = parseFloat(diffHours.toFixed(1));
            const qualityVal = parseInt(this.sleepInput.quality) || 4;

            this.sleepToday = {
                duration: durationVal,
                quality: qualityVal,
                bedtime: this.sleepInput.bedtime,
                waketime: this.sleepInput.waketime
            };

            // Update today in sleepHistory
            const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
            const todayDay = dayNames[new Date().getDay()];
            if (this.sleepHistory && this.sleepHistory.length > 0) {
                const todayEntry = this.sleepHistory.find(s => s.day === todayDay);
                if (todayEntry) {
                    todayEntry.duration = durationVal;
                    todayEntry.quality = qualityVal;
                }
            }

            this.user.xp += 15;
            this.saveToStorage();
            this.showToast('Catatan tidur tersimpan! (+15 XP)');
            this.navigateTo('dashboard');
        },

        // Breathing Exercise Methods
        startBreathing() {
            if (this.breathing.active) return;
            this.breathing.active = true;
            this.breathing.currentCycle = 1;
            this.runBreathingPhase('Tarik Napas', 4);
        },

        stopBreathing() {
            this.breathing.active = false;
            this.breathing.phase = 'Siap';
            if (this.breathing.timer) clearInterval(this.breathing.timer);
            this.showToast('Latihan pernapasan dihentikan.');
        },

        runBreathingPhase(phaseName, seconds) {
            if (!this.breathing.active) return;
            this.breathing.phase = phaseName;
            this.breathing.secondsLeft = seconds;

            if (this.breathing.timer) clearInterval(this.breathing.timer);

            this.breathing.timer = setInterval(() => {
                this.breathing.secondsLeft -= 1;
                if (this.breathing.secondsLeft <= 0) {
                    clearInterval(this.breathing.timer);
                    // Next phase transition logic
                    if (phaseName === 'Tarik Napas') {
                        this.runBreathingPhase('Tahan', 4);
                    } else if (phaseName === 'Tahan') {
                        this.runBreathingPhase('Hembuskan', 4);
                    } else if (phaseName === 'Hembuskan') {
                        if (this.breathing.currentCycle < this.breathing.targetCycles) {
                            this.breathing.currentCycle += 1;
                            this.runBreathingPhase('Tarik Napas', 4);
                        } else {
                            this.breathing.active = false;
                            this.breathing.phase = 'Selesai ✨';
                            this.user.xp += 25;
                            this.saveToStorage();
                            this.showToast('Selamat! Sesi pernapasan selesai. (+25 XP)');
                        }
                    }
                }
            }, 1000);
        },

        // Meditation Methods
        toggleMeditation() {
            if (this.meditation.isPlaying) {
                this.meditation.isPlaying = false;
                if (this.meditation.timer) clearInterval(this.meditation.timer);
                if (meditationAudio) {
                    meditationAudio.pause();
                }
            } else {
                this.meditation.isPlaying = true;
                if (!meditationAudio) {
                    meditationAudio = new Audio('https://www.gstatic.com/voice_delight/sounds/long/rain.mp3');
                    meditationAudio.loop = true;
                }
                meditationAudio.play().catch(e => console.error("Audio playback error:", e));
                this.meditation.timer = setInterval(() => {
                    if (this.meditation.timeLeft > 0) {
                        this.meditation.timeLeft -= 1;
                    } else {
                        this.meditation.isPlaying = false;
                        clearInterval(this.meditation.timer);
                        if (meditationAudio) {
                            meditationAudio.pause();
                            meditationAudio.currentTime = 0;
                        }
                        this.user.xp += 30;
                        this.saveToStorage();
                        this.showToast('Meditasi selesai! Nikmati hari dengan tenang. (+30 XP)');
                    }
                }, 1000);
            }
        },

        stopMeditation() {
            this.meditation.isPlaying = false;
            if (this.meditation.timer) clearInterval(this.meditation.timer);
            if (meditationAudio) {
                meditationAudio.pause();
            }
        },

        resetMeditation(seconds = 300) {
            if (this.meditation.timer) clearInterval(this.meditation.timer);
            this.meditation.isPlaying = false;
            this.meditation.totalTime = seconds;
            this.meditation.timeLeft = seconds;
            if (meditationAudio) {
                meditationAudio.pause();
                meditationAudio.currentTime = 0;
            }
        },

        formatTime(seconds) {
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        },

        // Reminders Methods
        toggleReminder(id) {
            const r = this.reminders.find(item => item.id === id);
            if (r) {
                r.enabled = !r.enabled;
                this.saveToStorage();
            }
        },

        // Notifications
        markAllRead() {
            this.notifications.forEach(n => n.read = true);
            this.saveToStorage();
            this.showToast('Semua notifikasi ditandai dibaca.');
        },

        // Icon Helper
        initLucideIcons() {
            if (window.lucide) {
                window.lucide.createIcons();
            }
        },

        // Swiper Initializer
        initSwiper() {
            if (window.Swiper) {
                new Swiper('.onboarding-swiper', {
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                });
            }
        },

        // Flatpickr Initializer
        initFlatpickr() {
            if (window.flatpickr) {
                flatpickr('.timepicker', {
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: "H:i",
                    time_24hr: true
                });
                flatpickr('.datepicker', {
                    dateFormat: "d M Y"
                });
            }
        },

        // Chart.js Rendering
        renderCharts() {
            if (!window.Chart) return;

            // Mood Chart Dashboard & Stats (Automatically Updated)
            const moodCtx = document.getElementById('moodChart');
            if (moodCtx) {
                if (window.moodChartInstance) window.moodChartInstance.destroy();

                const weekly = this.getWeeklyMoodChartData();

                window.moodChartInstance = new Chart(moodCtx, {
                    type: 'line',
                    data: {
                        labels: weekly.labels,
                        datasets: [{
                            label: 'Skala Mood (1-10)',
                            data: weekly.data,
                            borderColor: '#568BFF',
                            backgroundColor: 'rgba(168, 197, 255, 0.25)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#FFFFFF',
                            pointBorderColor: '#568BFF',
                            pointBorderWidth: 3,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const val = context.raw;
                                        let emo = '😐';
                                        if (val >= 9) emo = '😊 Sangat Bahagia';
                                        else if (val >= 7) emo = '🙂 Bahagia';
                                        else if (val >= 5) emo = '😐 Biasa Saja';
                                        else if (val >= 3) emo = '😔 Sedih';
                                        else if (val >= 2) emo = '😢 Stres/Cemas';
                                        else emo = '😡 Marah';
                                        return ` Skor Mood: ${val}/10 (${emo})`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                min: 1,
                                max: 10,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(val) {
                                        if (val === 10) return '10 😊';
                                        if (val === 8) return '8 🙂';
                                        if (val === 5) return '5 😐';
                                        if (val === 3) return '3 😔';
                                        if (val === 1) return '1 😡';
                                        return val;
                                    }
                                },
                                grid: { color: '#E9EEF7' }
                            },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }

            // Stats Mood Chart (Detailed view in Stats Screen)
            const statsMoodCtx = document.getElementById('statsMoodChart');
            if (statsMoodCtx) {
                if (window.statsMoodChartInstance) window.statsMoodChartInstance.destroy();

                const weekly = this.getWeeklyMoodChartData();

                window.statsMoodChartInstance = new Chart(statsMoodCtx, {
                    type: 'line',
                    data: {
                        labels: weekly.labels,
                        datasets: [{
                            label: 'Skala Mood (1-10)',
                            data: weekly.data,
                            borderColor: '#38BDF8',
                            backgroundColor: 'rgba(56, 189, 248, 0.2)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#FFFFFF',
                            pointBorderColor: '#0284C7',
                            pointBorderWidth: 3,
                            pointRadius: 6,
                            pointHoverRadius: 8
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const val = context.raw;
                                        let emo = '😐';
                                        if (val >= 9) emo = '😊 Sangat Bahagia';
                                        else if (val >= 7) emo = '🙂 Bahagia';
                                        else if (val >= 5) emo = '😐 Biasa Saja';
                                        else if (val >= 3) emo = '😔 Sedih';
                                        else if (val >= 2) emo = '😢 Stres/Cemas';
                                        else emo = '😡 Marah';
                                        return ` Skor Mood: ${val}/10 (${emo})`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                min: 1,
                                max: 10,
                                ticks: {
                                    stepSize: 1,
                                    callback: function(val) {
                                        if (val === 10) return '10 😊';
                                        if (val === 8) return '8 🙂';
                                        if (val === 5) return '5 😐';
                                        if (val === 3) return '3 😔';
                                        if (val === 1) return '1 😡';
                                        return val;
                                    }
                                },
                                grid: { color: '#E9EEF7' }
                            },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }

            // Sleep Chart
            const sleepCtx = document.getElementById('sleepChart');
            if (sleepCtx) {
                if (window.sleepChartInstance) window.sleepChartInstance.destroy();
                let sleepLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                let sleepData = [7.2, 6.8, 8.0, 7.5, 8.2, 8.5, 8.0];
                if (this.sleepHistory && this.sleepHistory.length > 0) {
                    sleepLabels = this.sleepHistory.map(s => s.day);
                    sleepData = this.sleepHistory.map(s => s.duration);
                }

                window.sleepChartInstance = new Chart(sleepCtx, {
                    type: 'bar',
                    data: {
                        labels: sleepLabels,
                        datasets: [{
                            label: 'Durasi Tidur (Jam)',
                            data: sleepData,
                            backgroundColor: '#A8C5FF',
                            borderRadius: 12,
                            hoverBackgroundColor: '#568BFF'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { min: 0, max: 12, grid: { color: '#E9EEF7' } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }

            // Water Chart
            const waterCtx = document.getElementById('waterChart');
            if (waterCtx) {
                if (window.waterChartInstance) window.waterChartInstance.destroy();
                let waterLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                let waterData = [1800, 2000, 1500, 2000, 2250, 1750, this.waterLogged || 1250];

                window.waterChartInstance = new Chart(waterCtx, {
                    type: 'bar',
                    data: {
                        labels: waterLabels,
                        datasets: [{
                            label: 'Air (ml)',
                            data: waterData,
                            backgroundColor: '#FFF3D6',
                            borderColor: '#FCD34D',
                            borderWidth: 1.5,
                            borderRadius: 12,
                            hoverBackgroundColor: '#A8C5FF'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { min: 0, max: 3000, grid: { color: '#E9EEF7' } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }

            // Selfcare Completion Doughnut
            const selfcareCtx = document.getElementById('selfcareChart');
            if (selfcareCtx) {
                if (window.selfcareChartInstance) window.selfcareChartInstance.destroy();
                const completedHabits = this.habits ? this.habits.filter(h => h.completed).length : 0;
                const uncompletedHabits = this.habits ? Math.max(0, this.habits.length - completedHabits) : 0;

                window.selfcareChartInstance = new Chart(selfcareCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Selesai', 'Belum Selesai'],
                        datasets: [{
                            data: [completedHabits, uncompletedHabits],
                            backgroundColor: ['#86EFAC', '#FFF3D6'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } },
                        cutout: '75%'
                    }
                });
            }
        },

        // ==========================================
        // RESEARCH QUESTIONNAIRE METHODS (67 QUESTIONS)
        // ==========================================
        openQuestionnaire() {
            if (!this.isLoggedIn) {
                this.showToast('Silakan masuk ke akun terlebih dahulu untuk membuka kuesioner.');
                this.navigateTo('login');
                return;
            }
            this.navigateTo('questionnaire');
        },

        setQuestionnaireAnswer(qId, value) {
            this.questionnaireAnswers[qId] = value;
            if (this.questionnaireValidationErrors[qId]) {
                delete this.questionnaireValidationErrors[qId];
            }
            this.updateQuestionnaireProgress();
            this.saveQuestionnaireProgress();
        },

        setQuestionnaireOther(qId, text) {
            this.questionnaireOtherAnswers[qId] = text;
            if (this.questionnaireAnswers[qId] === 'Yang lain' || this.questionnaireAnswers[qId] === 'Lainnya') {
                if (this.questionnaireValidationErrors[qId] && text.trim()) {
                    delete this.questionnaireValidationErrors[qId];
                }
                this.updateQuestionnaireProgress();
                this.saveQuestionnaireProgress();
            }
        },

        getQuestionnaireAnswer(qId) {
            return this.questionnaireAnswers[qId] !== undefined ? this.questionnaireAnswers[qId] : null;
        },

        getQuestionnaireOther(qId) {
            return this.questionnaireOtherAnswers[qId] !== undefined ? this.questionnaireOtherAnswers[qId] : '';
        },

        isQuestionAnswered(q) {
            if (!q) return false;
            const ans = this.questionnaireAnswers[q.id];
            if (ans === undefined || ans === null) return false;

            if (q.type === 'radio') {
                if (ans === 'Yang lain' || ans === 'Lainnya') {
                    const otherText = (this.questionnaireOtherAnswers[q.id] || '').trim();
                    return otherText.length > 0;
                }
                return typeof ans === 'string' && ans.trim().length > 0;
            }

            if (q.type === 'text' || q.type === 'textarea') {
                return String(ans).trim().length > 0;
            }

            if (q.type === 'number') {
                const num = Number(ans);
                return !isNaN(num) && num > 0;
            }

            if (q.type === 'likert5') {
                return ['1', '2', '3', '4', '5'].includes(String(ans));
            }

            return false;
        },

        getAnsweredCountForSection(section) {
            if (!section || !section.questions) return 0;
            let count = 0;
            section.questions.forEach(q => {
                if (this.isQuestionAnswered(q)) count++;
            });
            return count;
        },

        getTotalAnsweredCount() {
            if (!window.TEMANJIWA_QUESTIONNAIRE) return 0;
            let total = 0;
            window.TEMANJIWA_QUESTIONNAIRE.sections.forEach(sec => {
                total += this.getAnsweredCountForSection(sec);
            });
            return total;
        },

        updateQuestionnaireProgress() {
            const answered = this.getTotalAnsweredCount();
            const total = window.TEMANJIWA_QUESTIONNAIRE ? window.TEMANJIWA_QUESTIONNAIRE.metadata.totalQuestions : 67;
            this.questionnaireProgress = Math.min(100, Math.round((answered / total) * 100));
            // Ensure 100% is only shown when every single question is valid
            if (answered < total && this.questionnaireProgress >= 100) {
                this.questionnaireProgress = 99;
            }
        },

        validateSection(secIdx) {
            if (!window.TEMANJIWA_QUESTIONNAIRE) return false;
            const sec = window.TEMANJIWA_QUESTIONNAIRE.sections[secIdx];
            if (!sec) return true;

            let isValid = true;
            let firstInvalidId = null;

            sec.questions.forEach(q => {
                if (q.required && !this.isQuestionAnswered(q)) {
                    this.questionnaireValidationErrors[q.id] = true;
                    isValid = false;
                    if (!firstInvalidId) firstInvalidId = q.id;
                } else {
                    delete this.questionnaireValidationErrors[q.id];
                }
            });

            if (!isValid && firstInvalidId) {
                setTimeout(() => {
                    const el = document.getElementById('card-' + firstInvalidId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }

            return isValid;
        },

        nextQuestionnaireSection() {
            if (this.questionnaireCurrentSection >= 8) {
                this.goToQuestionnaireSection(0);
                return;
            }

            const isValid = this.validateSection(this.questionnaireCurrentSection);
            if (!isValid) {
                this.showToast('Harap lengkapi seluruh pertanyaan wajib (*) pada bagian ini!');
                return;
            }

            const totalSections = window.TEMANJIWA_QUESTIONNAIRE ? window.TEMANJIWA_QUESTIONNAIRE.sections.length : 8;
            if (this.questionnaireCurrentSection < totalSections) {
                this.questionnaireCurrentSection++;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.saveQuestionnaireProgress();
                setTimeout(() => this.initLucideIcons(), 50);
            }
        },

        prevQuestionnaireSection() {
            if (this.questionnaireCurrentSection > 0) {
                this.questionnaireCurrentSection--;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.saveQuestionnaireProgress();
                setTimeout(() => this.initLucideIcons(), 50);
            }
        },

        goToQuestionnaireSection(idx) {
            if (idx < this.questionnaireCurrentSection) {
                this.questionnaireCurrentSection = idx;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.saveQuestionnaireProgress();
                setTimeout(() => this.initLucideIcons(), 50);
            } else if (idx > this.questionnaireCurrentSection) {
                const isValid = this.validateSection(this.questionnaireCurrentSection);
                if (!isValid) {
                    this.showToast('Harap lengkapi pertanyaan bagian ini terlebih dahulu!');
                    return;
                }
                this.questionnaireCurrentSection = idx;
                window.scrollTo({ top: 0, behavior: 'smooth' });
                this.saveQuestionnaireProgress();
                setTimeout(() => this.initLucideIcons(), 50);
            }
        },

        saveQuestionnaireProgress() {
            this.saveToStorage();
        },

        submitQuestionnaire() {
            if (this.questionnaireSaving) return;

            if (!window.TEMANJIWA_QUESTIONNAIRE) {
                this.showToast('Instrumen kuesioner tidak ditemukan.');
                return;
            }

            let allValid = true;
            let missingSectionIdx = null;
            let missingQuestionId = null;

            for (let i = 0; i < window.TEMANJIWA_QUESTIONNAIRE.sections.length; i++) {
                const sec = window.TEMANJIWA_QUESTIONNAIRE.sections[i];
                for (let j = 0; j < sec.questions.length; j++) {
                    const q = sec.questions[j];
                    if (q.required && !this.isQuestionAnswered(q)) {
                        allValid = false;
                        this.questionnaireValidationErrors[q.id] = true;
                        if (missingSectionIdx === null) {
                            missingSectionIdx = i;
                            missingQuestionId = q.id;
                        }
                    }
                }
            }

            if (!allValid) {
                this.questionnaireCurrentSection = missingSectionIdx;
                this.showToast('Kuesioner belum lengkap! Masih ada pertanyaan yang belum diisi.');
                setTimeout(() => {
                    const el = document.getElementById('card-' + missingQuestionId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 150);
                return;
            }

            // All 67 questions are strictly validated & answered
            this.questionnaireSaving = true;
            this.triggerLoading('Menyimpan Hasil Kuesioner...', 'Memverifikasi dan mengarsipkan 67 jawaban ke rekap_kuesioner.json', 1200, async () => {
                this.questionnaireStatus = 'completed';
                this.questionnaireSessionActive = false; // RELEASE NAVIGATION GUARD!
                this.questionnaireSaving = false;
                this.questionnaireCompletedAt = new Date().toLocaleString('id-ID', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                });
                this.updateQuestionnaireProgress();
                this.saveToStorage();

                // Format record for rekap_kuesioner.json
                const record = this.buildQuestionnaireRecord();

                // 1. Save to master responses list in localStorage
                this.saveToMasterRekap(record);

                // 2. Try sending to server if running on Node / PHP
                this.sendResponseToServer(record);

                // 3. Send response to live Google Spreadsheet
                this.sendResponseToGoogleSheet(record);

                // 4. Trigger download of rekap_kuesioner.json file ONLY if developer
                if (this.isDeveloper) {
                    this.downloadRekapJson(record);
                    this.showToast('Kuesioner selesai & data tersimpan di rekap_kuesioner.json! 🎉');
                } else {
                    this.showToast('Kuesioner berhasil dikirim! Terima kasih atas partisipasi Anda 🌸');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => this.initLucideIcons(), 100);
            });
        },

        // Discrete Developer / Owner Access Methods
        handleHeaderBrandClick() {
            this.handleSecretDevTap();
            if (this.currentScreen !== 'dashboard') {
                this.navigateTo('dashboard');
            }
        },

        handleSecretDevTap() {
            this.devSecretTapCount = (this.devSecretTapCount || 0) + 1;
            clearTimeout(this.devSecretTapTimer);
            this.devSecretTapTimer = setTimeout(() => {
                this.devSecretTapCount = 0;
            }, 2000);

            if (this.devSecretTapCount >= 5) {
                this.devSecretTapCount = 0;
                this.handleSecretDevTrigger();
            }
        },

        handleSecretDevTrigger() {
            if (this.isDeveloper) {
                this.openDeveloperPanel();
            } else {
                this.devLoginInput.username = '';
                this.devLoginInput.password = '';
                this.showSecretDevModal = true;
                setTimeout(() => this.initLucideIcons(), 50);
            }
        },

        submitSecretDevLogin() {
            const u = (this.devLoginInput.username || '').trim().toLowerCase();
            const p = (this.devLoginInput.password || '').trim();

            if (u === 're' && p === 'rsmlfryni1*') {
                this.isDeveloper = true;
                localStorage.setItem('temanjiwa_is_developer', 'true');
                this.showSecretDevModal = false;
                this.devLoginInput.username = '';
                this.devLoginInput.password = '';
                this.showToast('Akses Pengembang Diverifikasi 🔐');
                this.openDeveloperPanel();
            } else {
                this.showToast('Kredensial pengembang tidak valid ⚠️');
                this.devLoginInput.password = '';
            }
        },

        openDeveloperPanel() {
            if (!this.isDeveloper) {
                this.handleSecretDevTrigger();
                return;
            }
            this.showDeveloperPanelModal = true;
            setTimeout(() => this.initLucideIcons(), 50);
        },

        getMasterRekapCount() {
            try {
                const list = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                return list.length;
            } catch (e) {
                return 0;
            }
        },

        getMasterRekapList() {
            try {
                return JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
            } catch (e) {
                return [];
            }
        },

        clearMasterRekap() {
            if (!this.isDeveloper) return;
            if (confirm('Apakah Anda yakin ingin mereset seluruh arsip rekap data kuesioner pada perangkat ini?')) {
                localStorage.removeItem('temanjiwa_rekap_kuesioner_all');
                this.showToast('Seluruh arsip data kuesioner berhasil direset.');
            }
        },

        // Helper: Robust CSV parser supporting quotes & newlines inside cells
        parseCSVToRows(text) {
            const rows = [];
            let curRow = [];
            let curVal = '';
            let inQuotes = false;

            for (let i = 0; i < text.length; i++) {
                const c = text[i];
                if (c === '"') {
                    if (inQuotes && text[i + 1] === '"') {
                        curVal += '"';
                        i++;
                    } else {
                        inQuotes = !inQuotes;
                    }
                } else if (c === ',' && !inQuotes) {
                    curRow.push(curVal);
                    curVal = '';
                } else if ((c === '\r' || c === '\n') && !inQuotes) {
                    if (c === '\r' && text[i + 1] === '\n') {
                        i++;
                    }
                    curRow.push(curVal);
                    curVal = '';
                    if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
                        rows.push(curRow);
                    }
                    curRow = [];
                } else {
                    curVal += c;
                }
            }
            if (curVal !== '' || curRow.length > 0) {
                curRow.push(curVal);
                rows.push(curRow);
            }
            return rows;
        },

        // Sync data directly from Google Spreadsheet
        async syncWithGoogleSheets(showToastNotif = false) {
            this.isSyncingGSheet = true;
            try {
                let masterList = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                let fetchedFromSheet = false;

                // 1. Try fetching directly from user's live Google Spreadsheet
                try {
                    const csvUrl = (this.googleSheetConfig.csvUrl || 'https://docs.google.com/spreadsheets/d/1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4/gviz/tq?tqx=out:csv') + '&t=' + Date.now();
                    const res = await fetch(csvUrl);
                    if (res.ok) {
                        const csvText = await res.text();
                        const rows = this.parseCSVToRows(csvText);
                        if (rows && rows.length > 1) {
                            for (let r = 1; r < rows.length; r++) {
                                const row = rows[r];
                                if (!row || row.length < 5 || !row[1]) continue;

                                const timestamp = row[0] || '';
                                const name = row[1].trim();
                                const age = parseInt(row[2], 10) || null;
                                const gender = row[3] ? row[3].trim() : '';
                                const status = row[4] ? row[4].trim() : '';

                                const answers = {};
                                answers['q1'] = name;
                                if (age) answers['q2'] = age.toString();
                                answers['q3'] = gender;
                                answers['q4'] = status;

                                for (let qNum = 5; qNum <= 67; qNum++) {
                                    answers['q' + qNum] = (row[qNum] !== undefined ? row[qNum].trim() : '');
                                }

                                const respId = 'RESP-GSheet-' + r.toString().padStart(3, '0');
                                const existingIdx = masterList.findIndex(item => 
                                    (item.respondent && item.respondent.name.toLowerCase() === name.toLowerCase() && item.submittedAt === timestamp) ||
                                    item.id === respId
                                );

                                const recordObj = {
                                    id: respId,
                                    source: 'Google Spreadsheet',
                                    submittedAt: timestamp,
                                    submittedFormatted: timestamp,
                                    respondent: {
                                        name: name,
                                        age: age,
                                        gender: gender,
                                        status: status,
                                        accountEmail: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@responden.id`
                                    },
                                    answers: answers,
                                    otherAnswers: {}
                                };

                                if (existingIdx >= 0) {
                                    masterList[existingIdx] = { ...masterList[existingIdx], ...recordObj };
                                } else {
                                    masterList.push(recordObj);
                                }
                            }
                            fetchedFromSheet = true;
                        }
                    }
                } catch (csvErr) {
                    console.info('GSheet live fetch note:', csvErr.message);
                }

                // 2. Synchronize with bundled/static rekap_kuesioner.json (contains archived Google Sheets data)
                try {
                    const res = await fetch('./rekap_kuesioner.json?t=' + Date.now());
                    if (res.ok) {
                        const serverData = await res.json();
                        if (serverData && Array.isArray(serverData.responses)) {
                            serverData.responses.forEach(sResp => {
                                const exists = masterList.some(r => 
                                    r.id === sResp.id || 
                                    (r.respondent && sResp.respondent && r.respondent.name.toLowerCase() === sResp.respondent.name.toLowerCase() && r.submittedAt === sResp.submittedAt)
                                );
                                if (!exists) {
                                    masterList.push(sResp);
                                }
                            });
                        }
                    }
                } catch (jsonErr) {}

                localStorage.setItem('temanjiwa_rekap_kuesioner_all', JSON.stringify(masterList));
                if (showToastNotif) {
                    this.showToast(`Sinkronisasi selesai! ${masterList.length} responden terkumpul dari Google Spreadsheet 📊`);
                }
                setTimeout(() => this.initLucideIcons(), 50);
                return masterList;
            } finally {
                this.isSyncingGSheet = false;
            }
        },

        // Send newly answered questionnaire to Google Spreadsheet (Apps Script Webhook)
        async sendResponseToGoogleSheet(record) {
            const webAppUrl = this.googleSheetConfig.webAppUrl || localStorage.getItem('temanjiwa_gsheet_webapp_url') || 'https://script.google.com/macros/s/AKfycbyKVubO_gsd_Nbe4vj_afVutfYkwI3p1QloqZ_OJvYkYg4RLV4oxOpJvFVVyCUH_6H4QA/exec';
            if (!webAppUrl || !webAppUrl.trim()) {
                console.info('Google Apps Script Webhook belum dikonfigurasi. Data diarsipkan secara lokal dan siap diekspor.');
                return false;
            }

            try {
                // Use no-cors mode for Google Apps Script redirects
                await fetch(webAppUrl.trim(), {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(record)
                });
                console.info('Response dispatched to Google Apps Script Webhook successfully');
                // Refresh local cache after a short delay
                setTimeout(() => {
                    this.syncWithGoogleSheets(false);
                }, 2000);
                return true;
            } catch (err) {
                console.warn('Gagal mengirim ke Google Apps Script Webhook:', err.message);
                return false;
            }
        },

        saveGoogleWebAppUrl() {
            const url = (this.googleSheetInputUrl || '').trim();
            if (!url) {
                localStorage.removeItem('temanjiwa_gsheet_webapp_url');
                this.googleSheetConfig.webAppUrl = '';
                this.showToast('URL Google Apps Script direset.');
                return;
            }
            localStorage.setItem('temanjiwa_gsheet_webapp_url', url);
            this.googleSheetConfig.webAppUrl = url;
            this.showToast('URL Google Apps Script berhasil disimpan! 🚀');
        },

        openGoogleSpreadsheet() {
            window.open(this.googleSheetConfig.sheetUrl, '_blank');
        },

        // Export all respondents to exact Google Spreadsheet CSV format
        exportToCsv() {
            if (!this.isDeveloper) {
                this.handleSecretDevTrigger();
                return;
            }
            try {
                const masterList = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                if (masterList.length === 0) {
                    this.showToast('Belum ada data kuesioner untuk diekspor');
                    return;
                }

                // Build header
                const headers = ["Timestamp", "Nama", "Usia", "Jenis Kelamin", "Status (Kerja, Kuliah, dan Sekolah)"];
                if (window.TEMANJIWA_QUESTIONNAIRE && Array.isArray(window.TEMANJIWA_QUESTIONNAIRE.sections)) {
                    for (const sec of window.TEMANJIWA_QUESTIONNAIRE.sections) {
                        for (const q of sec.questions) {
                            if (q.number >= 5 && q.number <= 67) {
                                headers.push(q.text.replace(/[\r\n]+/g, ' '));
                            }
                        }
                    }
                } else {
                    for (let i = 5; i <= 67; i++) headers.push(`Pertanyaan ${i}`);
                }

                const csvLines = [headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',')];

                masterList.forEach(item => {
                    const resp = item.respondent || {};
                    const ans = item.answers || {};
                    const row = [
                        item.submittedFormatted || item.submittedAt || new Date().toLocaleString('id-ID'),
                        resp.name || ans['q1'] || '',
                        resp.age || ans['q2'] || '',
                        resp.gender || ans['q3'] || '',
                        resp.status || ans['q4'] || ''
                    ];

                    for (let qNum = 5; qNum <= 67; qNum++) {
                        row.push(ans['q' + qNum] !== undefined ? ans['q' + qNum] : '');
                    }

                    csvLines.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
                });

                const csvContent = "\uFEFF" + csvLines.join("\r\n"); // UTF-8 BOM
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rekap_kuesioner_google_sheets_${Date.now()}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                this.showToast(`Berhasil mengekspor format Google Sheets (${masterList.length} baris)! 📄`);
            } catch (err) {
                console.error('Gagal mengekspor CSV:', err);
                this.showToast('Gagal mengekspor CSV');
            }
        },

        buildQuestionnaireRecord() {
            const respId = 'RESP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
            const respondentName = (this.questionnaireAnswers['q1'] || this.user.name || 'Responden').trim();
            const respondentAge = Number(this.questionnaireAnswers['q2']) || null;
            const respondentGender = this.questionnaireAnswers['q3'] || '';
            const respondentStatus = (this.questionnaireAnswers['q4'] === 'Yang lain' || this.questionnaireAnswers['q4'] === 'Lainnya')
                ? ('Lainnya: ' + (this.questionnaireOtherAnswers['q4'] || ''))
                : (this.questionnaireAnswers['q4'] || '');

            return {
                id: respId,
                submittedAt: new Date().toISOString(),
                submittedFormatted: this.questionnaireCompletedAt || new Date().toLocaleString('id-ID'),
                respondent: {
                    name: respondentName,
                    age: respondentAge,
                    gender: respondentGender,
                    status: respondentStatus,
                    accountEmail: this.user ? this.user.email : 'user@temanjiwa.id'
                },
                answers: { ...this.questionnaireAnswers },
                otherAnswers: { ...this.questionnaireOtherAnswers }
            };
        },

        saveToMasterRekap(record) {
            try {
                let masterList = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                const idx = masterList.findIndex(r => r.id === record.id || (r.respondent && r.respondent.accountEmail === record.respondent.accountEmail));
                if (idx >= 0) {
                    masterList[idx] = record;
                } else {
                    masterList.push(record);
                }
                localStorage.setItem('temanjiwa_rekap_kuesioner_all', JSON.stringify(masterList));
            } catch (e) {
                console.warn('Gagal menyimpan master rekap ke storage:', e);
            }
        },

        async sendResponseToServer(record) {
            const endpoints = ['./save_questionnaire.php', './api/save-questionnaire'];
            for (const ep of endpoints) {
                try {
                    const res = await fetch(ep, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(record)
                    });
                    if (res.ok) {
                        const json = await res.json();
                        console.info('Saved to rekap_kuesioner.json via ' + ep, json);
                        return true;
                    }
                } catch (err) {
                    // Running on static hosting like GitHub Pages
                }
            }
            return false;
        },

        async downloadRekapJson(singleRecord = null) {
            if (!this.isDeveloper) {
                this.handleSecretDevTrigger();
                return;
            }
            try {
                // Ensure synchronization first
                let masterList = await this.syncWithGoogleSheets(false);
                if (!masterList) {
                    masterList = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                }

                if (singleRecord && !masterList.some(r => r.id === singleRecord.id)) {
                    masterList.push(singleRecord);
                    localStorage.setItem('temanjiwa_rekap_kuesioner_all', JSON.stringify(masterList));
                }

                const exportData = {
                    project: "TemanJiwa - Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking",
                    researcher: "Risma Elfaryani",
                    institution: "STMIK IKMI Cirebon",
                    program: "Program Studi Sistem Informasi",
                    targetGroup: "Generasi Z",
                    spreadsheetUrl: this.googleSheetConfig.sheetUrl,
                    totalQuestions: 67,
                    totalResponses: masterList.length,
                    exportedAt: new Date().toISOString(),
                    exportedFormatted: new Date().toLocaleString('id-ID'),
                    statusAkses: "Akun Pemilik & Admin (re) Terverifikasi",
                    responses: masterList
                };

                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", "rekap_kuesioner.json");
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
                this.showToast(`Berhasil mengunduh rekap_kuesioner.json secara utuh (${masterList.length} responden)! 📥`);
            } catch (e) {
                console.error("Gagal mengunduh berkas:", e);
                this.showToast('Gagal mengunduh berkas JSON');
            }
        },

        copyRekapJson() {
            if (!this.isDeveloper) {
                this.handleSecretDevTrigger();
                return;
            }
            try {
                const masterList = JSON.parse(localStorage.getItem('temanjiwa_rekap_kuesioner_all') || '[]');
                const exportData = {
                    project: "TemanJiwa - Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking",
                    researcher: "Risma Elfaryani",
                    institution: "STMIK IKMI Cirebon",
                    program: "Program Studi Sistem Informasi",
                    targetGroup: "Generasi Z",
                    spreadsheetUrl: this.googleSheetConfig.sheetUrl,
                    totalQuestions: 67,
                    totalResponses: masterList.length,
                    exportedAt: new Date().toISOString(),
                    responses: masterList
                };
                navigator.clipboard.writeText(JSON.stringify(exportData, null, 2)).then(() => {
                    this.showToast('Data JSON berhasil disalin ke clipboard! 📋');
                }).catch(() => {
                    this.showToast('Izin clipboard tidak diizinkan oleh browser');
                });
            } catch (e) {
                this.showToast('Gagal menyalin data');
            }
        },

        confirmLogoutDuringQuestionnaire() {
            this.showLogoutQuestionnaireModal = false;
            this.saveToStorage();
            this.isLoggedIn = false;
            this.questionnaireSessionActive = false;
            localStorage.removeItem('temanjiwa_active_email');
            this.resetStateToDefault(null);
            this.triggerLoading('Sedang Keluar...', 'Menyimpan progres kuesioner Anda secara aman', 600, () => {
                this.showToast('Anda berhasil keluar. Progres kuesioner Anda tersimpan.');
                this.navigateTo('login');
            });
        }
    });
});

// Window-level safety handlers (beforeunload & popstate)
window.addEventListener('beforeunload', (e) => {
    try {
        const store = Alpine.store('app');
        if (store && store.questionnaireSessionActive && store.questionnaireStatus === 'in_progress') {
            store.saveToStorage();
            e.preventDefault();
            e.returnValue = 'Kuesioner Anda sedang berlangsung. Seluruh progres telah disimpan.';
            return e.returnValue;
        }
    } catch (err) {}
});

window.addEventListener('popstate', (e) => {
    try {
        const store = Alpine.store('app');
        if (store && store.questionnaireSessionActive && store.questionnaireStatus === 'in_progress') {
            if (store.currentScreen !== 'questionnaire') {
                store.currentScreen = 'questionnaire';
                store.activeNav = 'questionnaire';
                store.showToast('Kuesioner belum selesai. Silakan lengkapi seluruh pertanyaan terlebih dahulu.');
                window.history.pushState({ screen: 'questionnaire' }, '', window.location.href);
            }
        }
    } catch (err) {}
});
