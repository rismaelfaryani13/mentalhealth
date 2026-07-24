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
        moodIntensity: 8,
        moodNote: '',
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
                image: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=600&q=80',
                excerpt: 'Menjaga fokus dan kesehatan emosional di tengah dinamika pekerjaan yang padat.',
                content: 'Di dunia modern yang serba cepat, pekerja kreatif sering kali dituntut untuk terus menghasilkan ide-ide segar di bawah tekanan deadline. Hal ini kerap kali memicu kelelahan mental (burnout) jika tidak diimbangi dengan jeda kesadaran yang baik.\n\nMindfulness bukanlah proses mengosongkan pikiran, melainkan membawa perhatian penuh pada apa yang sedang kita kerjakan saat ini tanpa menghakimi diri sendiri. Ketika Anda menulis, mendesain, atau merancang ide, fokuslah sepenuhnya pada satu tugas tersebut (single-tasking) alih-alih melakukan multitasking yang memecah konsentrasi.\n\nSediakan waktu 5 menit setiap beberapa jam untuk melakukan jeda sadar. Cukup rasakan napas Anda, lakukan peregangan otot bahu yang kaku, atau tatap pemandangan di luar jendela. Jeda singkat ini membantu menyegarkan kembali neurotransmiter di otak Anda, meningkatkan daya fokus, serta memicu munculnya inspirasi baru yang segar.'
            },
            {
                id: 4,
                title: 'Pentingnya Hidrasi Bagi Kesehatan Mental',
                category: 'Kesehatan Fisik',
                readTime: '3 menit',
                image: 'https://images.unsplash.com/photo-1548839133-9aa067466a9a?auto=format&fit=crop&w=600&q=80',
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

            // Set current Screen dynamically based on login state
            if (this.isLoggedIn) {
                this.currentScreen = 'dashboard';
            } else {
                this.currentScreen = 'splash';
            }

            // Trigger centered loading screen on app launch
            this.triggerLoading('Menyiapkan TemanJiwa...', 'Menghubungkan ke ruang ketenangan jiwamu', 700);
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
            const cleanEmail = (this.loginInput.email || '').trim();
            const cleanEmailKey = cleanEmail.toLowerCase();
            const inputName = (this.loginInput.name || '').trim();

            const savedUsers = JSON.parse(localStorage.getItem('temanjiwa_users_db') || '[]');
            let foundUser = savedUsers.find(u => u.email.toLowerCase() === cleanEmailKey);

            if (!foundUser) {
                // Create a dynamic profile for this new email log in
                let displayName = inputName;
                if (!displayName && cleanEmail) {
                    const emailFront = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
                    displayName = emailFront.charAt(0).toUpperCase() + emailFront.slice(1);
                }
                if (!displayName) displayName = 'Teman Jiwa';

                foundUser = {
                    name: displayName,
                    email: cleanEmail || 'user@temanjiwa.id',
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

        logoutUser() {
            this.saveToStorage();
            this.isLoggedIn = false;
            localStorage.removeItem('temanjiwa_active_email');

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

        // Navigation Helper
        navigateTo(screen) {
            // Stop other running exercises/audio when leaving their screen
            if (screen !== 'meditation') {
                this.stopMeditation();
            }
            if (screen !== 'breathing') {
                if (this.breathing.active) {
                    this.stopBreathing();
                }
            }

            this.previousScreen = this.currentScreen;
            this.currentScreen = screen;

            // Set active bottom nav item
            const navScreens = ['dashboard', 'mood', 'journal', 'selfcare', 'stats', 'profile'];
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
                aiMessages: this.aiChat.messages
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
                        this.isLoggedIn = true;
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
            const newEntry = {
                id: Date.now(),
                mood: this.selectedMood,
                label: selected.label,
                emoji: selected.emoji,
                intensity: parseInt(this.moodIntensity),
                note: this.moodNote || 'Tidak ada catatan tambahan.',
                date: 'Hari ini, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][new Date().getDay()]
            };

            this.triggerLoading('Menyimpan Catatan Mood...', 'Menganalisis pola emosi harianmu', 700, () => {
                this.moodHistory.unshift(newEntry);
                this.user.xp += 15;
                this.moodNote = '';
                this.saveToStorage();
                this.showToast('Mood berhasil dicatat! (+15 XP)');
                this.navigateTo('dashboard');
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
            // Compute duration from bedtime to waketime
            const [bH, bM] = this.sleepInput.bedtime.split(':').map(Number);
            const [wH, wM] = this.sleepInput.waketime.split(':').map(Number);

            let bedDate = new Date(2026, 0, 1, bH, bM);
            let wakeDate = new Date(2026, 0, bH > wH ? 2 : 1, wH, wM);
            let diffHours = (wakeDate - bedDate) / (1000 * 60 * 60);
            if (diffHours <= 0) diffHours += 24;

            this.sleepToday = {
                duration: parseFloat(diffHours.toFixed(1)),
                quality: parseInt(this.sleepInput.quality),
                bedtime: this.sleepInput.bedtime,
                waketime: this.sleepInput.waketime
            };

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

            // Mood Chart Dashboard & Stats
            const moodCtx = document.getElementById('moodChart');
            if (moodCtx) {
                if (window.moodChartInstance) window.moodChartInstance.destroy();

                let labels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
                let data = [6, 5, 8, 7, 9, 9, 8];

                if (this.moodHistory && this.moodHistory.length > 0) {
                    const recentMoods = this.moodHistory.slice(0, 7).reverse();
                    labels = recentMoods.map(m => m.dayName || 'Hari ini');
                    data = recentMoods.map(m => m.intensity);
                }

                window.moodChartInstance = new Chart(moodCtx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Skala Mood (1-10)',
                            data: data,
                            borderColor: '#568BFF',
                            backgroundColor: 'rgba(168, 197, 255, 0.25)',
                            borderWidth: 3,
                            fill: true,
                            tension: 0.4,
                            pointBackgroundColor: '#FFFFFF',
                            pointBorderColor: '#568BFF',
                            pointBorderWidth: 3,
                            pointRadius: 6
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { min: 1, max: 10, grid: { color: '#E9EEF7' } },
                            x: { grid: { display: false } }
                        }
                    }
                });
            }

            // Sleep Chart
            const sleepCtx = document.getElementById('sleepChart');
            if (sleepCtx) {
                if (window.sleepChartInstance) window.sleepChartInstance.destroy();
                window.sleepChartInstance = new Chart(sleepCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                        datasets: [{
                            label: 'Durasi Tidur (Jam)',
                            data: [7.2, 6.8, 8.0, 7.5, 8.2, 8.5, 8.0],
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
                window.waterChartInstance = new Chart(waterCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
                        datasets: [{
                            label: 'Air (ml)',
                            data: [1800, 2000, 1500, 2000, 2250, 1750, 1250],
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
                window.selfcareChartInstance = new Chart(selfcareCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Selesai', 'Belum Selesai'],
                        datasets: [{
                            data: [3, 2],
                            backgroundColor: ['#A8C5FF', '#FFF3D6'],
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
        }
    });
});
