// Initial Default State
const DEFAULT_STATE = {
    profile: {
        name: '',
        avatar: '🌸',
        isDarkMode: false,
        theme: 'blue',
        level: 1,
        xp: 35
    },
    tracker: {
        waterLogged: 500,
        waterTarget: 2000,
        sleepToday: { duration: 7, quality: 4 }
    },
    habits: [
        { id: 'h1', name: 'Meditasi 5 Menit', completed: false },
        { id: 'h2', name: 'Minum 2L Air', completed: false },
        { id: 'h3', name: 'Jurnal Refleksi', completed: false }
    ],
    moodHistory: [
        { id: 'm1', mood: 'bahagia', emoji: '😊', intensity: 7, note: 'Memulai hari dengan segar', date: 'Kemarin' },
        { id: 'm2', mood: 'biasa', emoji: '😐', intensity: 5, note: 'Beban kerja biasa', date: 'Hari ini' }
    ],
    journals: [
        { id: 'j1', title: 'Belajar mindfulness', text: 'Hari ini saya mencoba berhenti sejenak dari media sosial dan memfokuskan diri pada napas. Ternyata, hal kecil ini membuat perasaan saya jauh lebih tenang dan fokus.', mood: 'mindfulness', date: '21 Juli 2026' }
    ],
    mhChecks: []
};

// Global App State
let appState = {};

// Load State from LocalStorage
function loadState() {
    const saved = localStorage.getItem('innercalm_state');
    if (saved) {
        try {
            appState = JSON.parse(saved);
            // Ensure compatibility if saved state misses new fields
            appState = { ...DEFAULT_STATE, ...appState };
        } catch (e) {
            appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
}

// Save State to LocalStorage
function saveState() {
    localStorage.setItem('innercalm_state', JSON.stringify(appState));
}

// Show Toast Alert
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';

    let emoji = '✨';
    if (type === 'level') emoji = '🌟';
    if (type === 'danger') {
        emoji = '⚠️';
        toast.style.backgroundColor = 'var(--accent)';
    }

    toast.innerHTML = `<span>${emoji}</span> <span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Cleanup
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Trigger Level Up Celebration
function addXP(amount) {
    appState.profile.xp += amount;
    showToast(`+${amount} XP diperoleh!`);

    if (appState.profile.xp >= 100) {
        appState.profile.level += 1;
        appState.profile.xp -= 100;
        setTimeout(() => {
            showToast(`SELAMAT! Kamu naik ke Level ${appState.profile.level}! 🎉`, 'level');
            playLevelUpSound();
        }, 800);
    }
    saveState();
    updateGUI();
}

function playLevelUpSound() {
    // Web Audio Synthesizer for retro level up fan-fare!
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function playTone(freq, type, duration, startTime) {
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

            gainNode.gain.setValueAtTime(0.1, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
        }

        const now = audioCtx.currentTime;
        playTone(523.25, 'sine', 0.15, now);       // C5
        playTone(659.25, 'sine', 0.15, now + 0.15);  // E5
        playTone(783.99, 'sine', 0.15, now + 0.3);   // G5
        playTone(1046.50, 'sine', 0.4, now + 0.45);  // C6
    } catch (e) { }
}

// Navigation & Screen Router
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    // Show selected screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
    }

    // Manage Sidebar visibility
    const navBar = document.getElementById('app-navigation');
    const noNavScreens = ['screen-splash', 'screen-onboarding', 'screen-login', 'screen-register', 'screen-breath', 'screen-mhcheck', 'screen-mhcheck-result', 'screen-article-reader', 'screen-emergency', 'screen-water-log', 'screen-sleep-log'];
    if (noNavScreens.includes(screenId)) {
        navBar.style.display = 'none';
    } else {
        navBar.style.display = 'flex';
        // Set active nav button matching route
        updateActiveNav(screenId);
    }

    // Refresh sub-views on navigation
    if (screenId === 'screen-home') {
        renderDashboardHabits();
    }
    if (screenId === 'screen-stats') {
        renderMoodChart();
    }
    if (screenId === 'screen-journal') {
        renderJournalHistory();
    }
    if (screenId === 'screen-profile') {
        renderProfileTab();
    }
}

function updateActiveNav(screenId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('onclick').includes(screenId)) {
            item.classList.add('active');
        }
    });
}

// Dynamic UI Renderers
function updateGUI() {
    // Splash/Onboarding routing logic
    if (appState.profile.name === '') {
        // user hasn't set up profile
        // we show splash, then they proceed
    }

    // Apply Theme Color changes by dynamically mutating CSS variables
    const root = document.documentElement;
    if (appState.profile.theme === 'lavender') {
        root.style.setProperty('--hue', '262');
        root.style.setProperty('--sat', '80%');
        root.style.setProperty('--lightness', '60%');
    } else {
        // Default theme: blue (#A8C5FF)
        root.style.setProperty('--hue', '220');
        root.style.setProperty('--sat', '100%');
        root.style.setProperty('--lightness', '83%');
    }

    // Header updates
    const nameLabel = document.getElementById('gui-welcome-name');
    if (nameLabel) {
        const name = appState.profile.name || 'User';
        nameLabel.textContent = `${name.split(' ')[0]} 👋`;
    }

    const avatarBadge = document.getElementById('gui-avatar-badge');
    if (avatarBadge) {
        avatarBadge.textContent = appState.profile.name ? appState.profile.name[0].toUpperCase() : 'U';
    }

    // GAMIFICATION progress UI
    const lvlLabel = document.getElementById('gui-lvl-label');
    if (lvlLabel) lvlLabel.textContent = `Level ${appState.profile.level}`;

    const xpText = document.getElementById('gui-xp-text');
    if (xpText) xpText.textContent = `${appState.profile.xp} / 100 XP`;

    const progressBar = document.getElementById('gui-xp-bar');
    if (progressBar) progressBar.style.width = `${appState.profile.xp}%`;

    // STATS widgets values
    const statSleep = document.getElementById('gui-stat-sleep');
    if (statSleep) statSleep.textContent = `${appState.state_sleep_duration || appState.tracker.sleepToday.duration} jam`;

    const statSleepQuality = document.getElementById('gui-stat-sleep-quality');
    if (statSleepQuality) statSleepQuality.textContent = `Kualitas: ${appState.state_sleep_quality || appState.tracker.sleepToday.quality}★`;

    const statWater = document.getElementById('gui-stat-water');
    if (statWater) statWater.textContent = `${appState.tracker.waterLogged} / ${appState.tracker.waterTarget}ml`;

    // Mood Today Widgets
    const currentMoodEmoji = document.getElementById('gui-current-mood-emoji');
    const currentMoodLabel = document.getElementById('gui-current-mood-label');
    if (appState.moodHistory && appState.moodHistory.length > 0) {
        const latest = appState.moodHistory[0];
        const moodDef = MOODS_DICTIONARY[latest.mood] || { label: latest.mood, emoji: latest.emoji };
        if (currentMoodEmoji) currentMoodEmoji.textContent = latest.emoji;
        if (currentMoodLabel) currentMoodLabel.textContent = moodDef.label;
    }

    // Water cups statistics checklist update
    const waterBadgeLabel = document.getElementById('gui-water-badge-label');
    if (waterBadgeLabel) {
        const glasses = Math.round(appState.tracker.waterLogged / 250);
        waterBadgeLabel.textContent = `${glasses}/8 gelas`;
    }

    renderDashboardHabits();
}

// Daily Affirmation cycles
const AFFIRMATIONS = [
    "Setiap langkah kecil yang kamu ambil hari ini adalah kemajuan menuju diri yang lebih sehat.",
    "Tarik napas sedalam-dalamnya. Lepaskan segala ketegangan. Kamu memiliki kendali atas dirimu sendiri.",
    "Kesehatan mentalmu adalah prioritas utama. Tidak apa-apa untuk beristirahat sebentar hari ini.",
    "Apapun kekhawatiranmu hari ini, percayalah bahwa kekuatan di dalam dirimu jauh lebih besar.",
    "Jadilah lembut pada pikiranmu hari ini. Kamu sedang berproses, lakukan yang terbaik.",
    "Bersyukurlah untuk napas yang berembus saat ini. Kamu dikelilingi oleh peluang baru."
];
let currentAffIndex = 0;

function cycleAffirmations() {
    currentAffIndex = (currentAffIndex + 1) % AFFIRMATIONS.length;
    const txt = document.getElementById('gui-affirmation-text');
    if (txt) {
        txt.style.opacity = 0;
        setTimeout(() => {
            txt.textContent = `"${AFFIRMATIONS[currentAffIndex]}"`;
            txt.style.opacity = 1;
        }, 150);
    }
}

// Mood logs
const MOODS_DICTIONARY = {
    'sangat-bahagia': { emoji: '😄', label: 'Sangat Bahagia' },
    'bahagia': { emoji: '😊', label: 'Bahagia' },
    'biasa': { emoji: '😐', label: 'Biasa' },
    'sedih': { emoji: '😔', label: 'Sedih' },
    'cemas': { emoji: '😣', label: 'Cemas' },
    'lelah': { emoji: '😴', label: 'Lelah' }
};

function logQuickMood(moodKey) {
    const moodDef = MOODS_DICTIONARY[moodKey];
    if (!moodDef) return;

    const newEntry = {
        id: 'mood-' + Date.now(),
        mood: moodKey,
        emoji: moodDef.emoji,
        intensity: 6,
        note: 'Dicatat via Dashboard Quick-log',
        date: 'Hari ini (' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ')'
    };

    appState.moodHistory.unshift(newEntry);
    showToast(`Mood ${moodDef.emoji} berhasil dicatat! ✨`);
    addXP(15); // +15 XP for logging mood
    saveState();
    updateGUI();
}

// Mood Form tracker helpers
let selectedFormMoodKey = 'bahagia';
let selectedFormMoodEmoji = '😊';

function selectFormMood(moodKey, emoji, element) {
    selectedFormMoodKey = moodKey;
    selectedFormMoodEmoji = emoji;

    const options = document.querySelectorAll('#mood-form-emoji-grid .quiz-opt-btn');
    options.forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

function submitMoodForm() {
    const noteText = document.getElementById('mood-form-note-input').value.trim();
    const newEntry = {
        id: 'mood-' + Date.now(),
        mood: selectedFormMoodKey,
        emoji: selectedFormMoodEmoji,
        intensity: 7,
        note: noteText || 'Tercatat via Mood Tracker',
        date: 'Hari ini (' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ')'
    };

    appState.moodHistory.unshift(newEntry);
    addXP(20);
    saveState();

    document.getElementById('mood-form-note-input').value = '';
    showToast(`Mood ${selectedFormMoodEmoji} berhasil disimpan! 🌸`);

    updateGUI();
    navigateTo('screen-home');
}

// Habits Checklist Logic
function toggleHabit(habitId) {
    const habit = appState.habits.find(h => h.id === habitId);
    if (habit) {
        habit.completed = !habit.completed;
        if (habit.completed) {
            addXP(20); // +20 XP for checking off habit!
            showToast(`Kebiasaan "${habit.name}" diselesaikan!`);
        } else {
            showToast(`Kebiasaan "${habit.name}" ditandai belum selesai.`);
            saveState();
        }
        renderDashboardHabits();
    }
}

function renderDashboardHabits() {
    const listContainer = document.getElementById('gui-dashboard-habits');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (appState.habits.length === 0) {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-sub); font-size: 11px; padding: 12px 0;">Belum ada kebiasaan. Tambah baru di tab Kebiasaan.</div>`;
        return;
    }

    // limit 3 on dashboard
    appState.habits.slice(0, 3).forEach(habit => {
        const item = document.createElement('div');
        item.className = `habit-item ${habit.completed ? 'completed' : ''}`;
        item.innerHTML = `
            <div class="habit-checkbox" onclick="toggleHabit('${habit.id}')">
                ${habit.completed ? '✓' : ''}
            </div>
            <span class="habit-text">${habit.name}</span>
        `;
        listContainer.appendChild(item);
    });
}

// Breathing Space Exercise controller
let breathTimer = null;
let breathState = 'idle'; // idle, running
let breathPhase = 'inhale'; // inhale, hold, exhale
let secondsLeft = 4;

function startBreathing() {
    const btn = document.getElementById('breath-start-btn');
    const circleOuter = document.querySelector('.breath-circle-outer');
    const circleInner = document.querySelector('.breath-circle-inner');
    const textLabel = document.getElementById('breath-text-inst');
    const countdown = document.getElementById('breath-seconds');

    if (breathState === 'running') {
        // Stop exercise
        clearInterval(breathTimer);
        breathState = 'idle';
        btn.textContent = 'Mulai Sesi Bernapas';
        btn.className = 'btn btn-primary';
        textLabel.textContent = 'Siap mencari ketenangan? Tekan Mulai.';
        countdown.textContent = 'Ready';
        circleOuter.className = 'breath-circle-outer';
        circleInner.className = 'breath-circle-inner';
        return;
    }

    // Start exercise
    breathState = 'running';
    btn.textContent = 'Hentikan Sesi';
    btn.className = 'btn btn-outline';

    // Loop cycle function
    breathPhase = 'inhale';
    secondsLeft = 4;

    executeBreathingPhase(circleOuter, circleInner, textLabel, countdown);

    breathTimer = setInterval(() => {
        secondsLeft--;
        countdown.textContent = `${secondsLeft}s`;

        if (secondsLeft <= 0) {
            // cycle to next phase
            if (breathPhase === 'inhale') {
                breathPhase = 'hold';
                secondsLeft = 4;
            } else if (breathPhase === 'hold') {
                breathPhase = 'exhale';
                secondsLeft = 4;
            } else {
                breathPhase = 'inhale';
                secondsLeft = 4;
                addXP(5); // +5 XP per complete breath cycle!
            }
            executeBreathingPhase(circleOuter, circleInner, textLabel, countdown);
        }
    }, 1000);
}

function executeBreathingPhase(circleOuter, circleInner, textLabel, countdown) {
    countdown.textContent = `${secondsLeft}s`;

    circleOuter.className = 'breath-circle-outer';
    circleInner.className = 'breath-circle-inner';

    if (breathPhase === 'inhale') {
        textLabel.textContent = 'Tarik Napas Perlahan...';
        circleOuter.classList.add('inhale');
        circleInner.classList.add('inhale');
    } else if (breathPhase === 'hold') {
        textLabel.textContent = 'Tahan Napas Anda...';
        circleOuter.classList.add('hold');
    } else {
        textLabel.textContent = 'Hembuskan Napas Sembari Melepas Stres...';
        circleOuter.classList.add('exhale');
        circleInner.classList.add('exhale');
    }
}

// Mental Health Check Questionnaire Wizard
const MH_QUESTIONS = [
    { id: 1, text: "Saya merasa sulit untuk tidur nyenyak atau beristirahat." },
    { id: 2, text: "Saya merasa cemas, gelisah, atau khawatir berlebihan." },
    { id: 3, text: "Saya kehilangan semangat atau ketertarikan pada aktivitas sehari-hari." },
    { id: 4, text: "Saya menjadi mudah marah, kesal, atau frustrasi terhadap hal-hal sepele." },
    { id: 5, text: "Saya merasa kesepian atau terisolasi dari orang-orang terdekat." }
];
let currentQIdx = 0;
let qAnswers = {};

function startMHCheck() {
    currentQIdx = 0;
    qAnswers = {};
    renderMHQuestion();
    navigateTo('screen-mhcheck');
}

function renderMHQuestion() {
    const qProgress = document.getElementById('mh-q-progress');
    const qProgressText = document.getElementById('mh-q-progress-text');
    const qProgressBar = document.getElementById('mh-q-bar');
    const qText = document.getElementById('mh-q-text');

    qProgress.textContent = `Pertanyaan ${currentQIdx + 1} dari ${MH_QUESTIONS.length}`;
    const pct = Math.round(((currentQIdx + 1) / MH_QUESTIONS.length) * 100);
    qProgressText.textContent = `${pct}%`;
    qProgressBar.style.width = `${pct}%`;

    const question = MH_QUESTIONS[currentQIdx];
    qText.textContent = question.text;

    // Set active option if answered
    const valSelected = qAnswers[question.id];
    const options = document.querySelectorAll('.quiz-opt-btn');
    options.forEach(opt => {
        opt.classList.remove('active');
        const optVal = parseInt(opt.getAttribute('data-value'));
        if (optVal === valSelected) {
            opt.classList.add('active');
        }
    });

    // Control navigation buttons
    const prevBtn = document.getElementById('mh-prev-btn');
    if (currentQIdx === 0) {
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
    } else {
        prevBtn.style.opacity = '1';
        prevBtn.style.pointerEvents = 'auto';
    }

    const nextBtn = document.getElementById('mh-next-btn');
    if (currentQIdx === MH_QUESTIONS.length - 1) {
        nextBtn.textContent = 'Lihat Hasil';
    } else {
        nextBtn.textContent = 'Lanjut';
    }
}

function selectMHOption(val) {
    const q = MH_QUESTIONS[currentQIdx];
    qAnswers[q.id] = val;

    // Set visual active state
    const options = document.querySelectorAll('.quiz-opt-btn');
    options.forEach(opt => {
        opt.classList.remove('active');
        if (parseInt(opt.getAttribute('data-value')) === val) {
            opt.classList.add('active');
        }
    });
}

function nextMHQuestion() {
    const question = MH_QUESTIONS[currentQIdx];
    if (qAnswers[question.id] === undefined) {
        showToast('Pilihlah salah satu opsi jawaban dahulu!', 'danger');
        return;
    }

    if (currentQIdx < MH_QUESTIONS.length - 1) {
        currentQIdx++;
        renderMHQuestion();
    } else {
        // Compute Results
        let totalScore = 0;
        for (let q of MH_QUESTIONS) {
            totalScore += qAnswers[q.id];
        }

        displayMHResult(totalScore);
    }
}

function prevMHQuestion() {
    if (currentQIdx > 0) {
        currentQIdx--;
        renderMHQuestion();
    }
}

function displayMHResult(score) {
    let result = {};
    if (score <= 4) {
        result = {
            emoji: '😊',
            title: 'Kondisi Baik',
            styleClass: 'healthy',
            desc: 'Kamu menjaga kesehatan mentalmu dengan sangat baik. Pertahankan pola self-care harianmu!',
            suggestions: [
                'Lakukan mindfulness breathing 3 menit',
                'Tulis jurnal bersyukur malam ini',
                'Tetap terhidrasi dengan minum air teratur'
            ]
        };
    } else if (score <= 9) {
        result = {
            emoji: '😐',
            title: 'Perlu Self Care',
            styleClass: 'need_self_care',
            desc: 'Kamu mungkin mengalami stres ringan atau kelelahan emosional. Tubuhmu butuh sedikit relaksasi.',
            suggestions: [
                'Lakukan meditasi pernapasan 5 menit',
                'Jalan santai sore hari tanpa smartphone',
                'Membaca buku kesukaan sebelum tidur'
            ]
        };
    } else if (score <= 12) {
        result = {
            emoji: '😔',
            title: 'Butuh Perhatian',
            styleClass: 'need_attention',
            desc: 'Tingkat stres atau kecemasanmu cukup tinggi akhir-akhir ini. Luangkan waktu khusus untuk beristirahat.',
            suggestions: [
                'Lakukan jurnalisme reflektif untuk melepas emosi',
                'Bicarakan beban pikiranmu dengan sahabat karib',
                'Batasi konsumsi media sosial selama 24 jam'
            ]
        };
    } else {
        result = {
            emoji: '😣',
            title: 'Saran Bantuan Profesional',
            styleClass: 'professional_help',
            desc: 'Kondisi psikologismu sedang mengalami tekanan yang berat. Sangat disarankan berkonsultasi dengan profesional.',
            suggestions: [
                'Gunakan fitur SOS Emergency di menu utama',
                'Jadwalkan konseling gratis Kemenkes di Layanan Sejiwa (119 Ext 8)',
                'Hubungi psikolog atau psikiater terdekat untuk konsultasi medis'
            ]
        };
    }

    // Save checking history
    appState.mhChecks.unshift({ score, date: new Date().toLocaleDateString('id-ID'), title: result.title });

    // Populate Results Screen
    document.getElementById('mh-res-emoji').textContent = result.emoji;
    document.getElementById('mh-res-title').textContent = result.title;
    document.getElementById('mh-res-score').textContent = `Skor Evaluasi: ${score} / 15`;
    document.getElementById('mh-res-desc').textContent = result.desc;

    const sugContainer = document.getElementById('mh-res-suggestions');
    sugContainer.innerHTML = '';
    result.suggestions.forEach(s => {
        const item = document.createElement('div');
        item.className = 'suggestion-pill';
        item.textContent = s;
        sugContainer.appendChild(item);
    });

    addXP(30); // Earn +30 XP on completing assessment!
    navigateTo('screen-mhcheck-result');
}

// Articles List and Reader Viewers
const ARTICLES_DATABASE = {
    'art-overthinking': {
        category: 'Mindfulness',
        title: 'Cara Mengelola Overthinking untuk Gen Z',
        readTime: '5 min',
        emoji: '🧠',
        contentHTML: `
            <p>Overthinking atau berpikir berlebihan seringkali menjadi masalah utama yang dialami Gen Z, terutama yang berkaitan dengan masa depan (future anxiety) dan tekanan media sosial.</p>
            <h4>Mengapa Gen Z Rentan?</h4>
            <p>Arus informasi yang sangat cepat serta kebiasaan membandingkan pencapaian pribadi dengan orang lain di media sosial mempercepat kelelahan emosional (burnout). Hal ini diperparah oleh kurangnya waktu istirahat secara sadar.</p>
            <h4>3 Langkah Mengatasinya:</h4>
            <p>1. <strong>Grounding Technique (5-4-3-2-1):</strong> Sadari 5 benda sekitar yang bisa dilihat, 4 yang bisa disentuh, 3 suara yang didengar, 2 bau yang dicium, dan 1 rasa di lidah untuk menarik pikiranmu kembali ke masa kini.</p>
            <p>2. <strong>Batasi Screen Time:</strong> Kurangi screen time 1 jam sebelum tidur untuk membiarkan gelombang otak masuk ke fase relaksasi secara alami.</p>
            <p>3. <strong>Tulis Jurnal Reflektif:</strong> Menuangkan kecemasan ke dalam kertas dapat melegakan beban emosional otak secara signifikan.</p>
        `
    },
    'art-burnout': {
        category: 'Stress',
        title: 'Burnout Akademik: Kenali Ciri & Solusinya',
        readTime: '4 min',
        emoji: '🔥',
        contentHTML: `
            <p>Sebagai mahasiswa atau pekerja muda Gen Z, kamu mungkin sering merasa lelah berkepanjangan akibat tuntutan akademik/kerja yang tiada habisnya. Ini bisa mengarah pada burnout.</p>
            <h4>Ciri-ciri Burnout:</h4>
            <p>Kehilangan motivasi secara total, merasa tidak berdaya, lelah fisik kronis, serta sering menunda-nunda pekerjaan meskipun tenggat waktu sudah dekat.</p>
            <h4>Bagaimana Mengatasinya?</h4>
            <p>Belajarlah menetapkan batasan (boundary) yang sehat. Ingatlah bahwa istirahat bukanlah tanda malas, melainkan investasi energi penting untuk langkah berikutnya.</p>
        `
    },
    'art-selflove': {
        category: 'Self Love',
        title: 'Latihan Afirmasi Positif & Self Love',
        readTime: '3 min',
        emoji: '💖',
        contentHTML: `
            <p>Self Love bukan berarti bersikap egois, melainkan sebuah apresiasi mendalam terhadap diri sendiri yang tumbuh dari tindakan nyata yang mendukung pertumbuhan fisik, psikologis, dan spiritual kita.</p>
            <h4>Latihan Harian:</h4>
            <p>Mulailah setiap pagi dengan menatap cermin dan mengucapkan satu hal positif yang kamu syukuri dari dirimu, tidak peduli seberapa kecil hal tersebut.</p>
        `
    },
    'art-anxiety': {
        category: 'Anxiety',
        title: 'Mengatasi Kecemasan Menghadapi Masa Depan',
        readTime: '6 min',
        emoji: '🧘',
        contentHTML: `
            <p>Kecemasan akan masa depan (future anxiety) sangat umum di kalangan anak muda berumur 17-27 tahun. Hal ini sering dipicu oleh ekspektasi karir dan tuntutan finansial.</p>
            <h4>Langkah Menenangkan Pikiran:</h4>
            <p>Fokuslah pada apa yang bisa kamu kendalikan hari ini. Rencanakan langkah-langkah kecil mingguan daripada mengkhawatirkan hasil besar lima tahun ke depan.</p>
        `
    }
};

let selectedCategory = 'Semua';

function renderArticlesList() {
    const listContainer = document.getElementById('articles-list-container');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const query = document.getElementById('art-search-input').value.toLowerCase();

    Object.keys(ARTICLES_DATABASE).forEach(artId => {
        const art = ARTICLES_DATABASE[artId];

        const catMatch = selectedCategory === 'Semua' || art.category === selectedCategory;
        const searchMatch = art.title.toLowerCase().includes(query);

        if (catMatch && searchMatch) {
            const card = document.createElement('div');
            card.className = 'card card-glass';
            card.style.cursor = 'pointer';
            card.onclick = () => viewArticle(artId);
            card.innerHTML = `
                <div class="article-row-item">
                    <div class="article-icon-box">${art.emoji}</div>
                    <div style="flex: 1;">
                        <span class="article-meta-badge">${art.category}</span>
                        <h4 style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 2px;">${art.title}</h4>
                        <span style="font-size: 10px; color: var(--text-sub);">${art.readTime} membaca</span>
                    </div>
                    <i data-lucide="chevron-right" style="width: 16px; color: var(--text-sub);"></i>
                </div>
            `;
            listContainer.appendChild(card);
        }
    });

    if (listContainer.innerHTML === '') {
        listContainer.innerHTML = `<div style="text-align: center; color: var(--text-sub); font-size: 12px; margin-top: 30px;">Artikel tidak ditemukan. 🔍</div>`;
    }

    lucide.createIcons();
}

function filterArticlesCategory(cat) {
    selectedCategory = cat;
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(p => {
        p.classList.remove('active');
        if (p.textContent.trim() === cat) {
            p.classList.add('active');
        }
    });
    renderArticlesList();
}

function viewArticle(artId) {
    const art = ARTICLES_DATABASE[artId] || ARTICLES_DATABASE['art-overthinking'];

    document.getElementById('art-read-category').textContent = art.category.toUpperCase();
    document.getElementById('art-read-title').textContent = art.title;
    document.getElementById('art-read-meta').textContent = `${art.readTime} membaca • Diperiksa Psikolog`;
    document.getElementById('art-read-emoji').textContent = art.emoji;
    document.getElementById('art-read-body').innerHTML = art.contentHTML;

    navigateTo('screen-article-reader');
}

// Emergency Hotlines Calls
function openEmergencyDialog(name, contact) {
    const dialog = document.getElementById('emergency-dialog');
    document.getElementById('em-dialog-name').textContent = name;
    document.getElementById('em-dialog-num').textContent = contact;
    dialog.classList.add('show');
}

function closeEmergencyDialog() {
    document.getElementById('emergency-dialog').classList.remove('show');
}

function makeEmergencyCall() {
    closeEmergencyDialog();
    const contact = document.getElementById('em-dialog-num').textContent;
    showToast(`Memanggil layanan ${contact}...`, 'danger');
}

// Sleep and Water Trackers Logger UI
function openWaterTracker() {
    document.getElementById('water-logged-stat').textContent = `${appState.tracker.waterLogged} ml`;
    const pct = Math.min(100, (appState.tracker.waterLogged / appState.tracker.waterTarget) * 100);
    document.getElementById('gui-water-glass-fill').style.height = `${pct}%`;
    navigateTo('screen-water-log');
}

function logWaterDrink(amount) {
    appState.tracker.waterLogged = Math.min(3000, appState.tracker.waterLogged + amount);
    saveState();

    document.getElementById('water-logged-stat').textContent = `${appState.tracker.waterLogged} ml`;
    const pct = Math.min(100, (appState.tracker.waterLogged / appState.tracker.waterTarget) * 100);
    document.getElementById('gui-water-glass-fill').style.height = `${pct}%`;

    addXP(10); // +10 XP per drink
    showToast(`Berhasil minum ${amount}ml air! 💧`);
    updateGUI();
}

function openSleepTracker() {
    document.getElementById('sleep-duration-input').value = appState.state_sleep_duration || appState.tracker.sleepToday.duration;

    // stars selection
    const quality = appState.state_sleep_quality || appState.tracker.sleepToday.quality;
    selectSleepQuality(quality);

    navigateTo('screen-sleep-log');
}

function selectSleepQuality(stars) {
    qAnswers['sleep-quality'] = stars;
    const items = document.querySelectorAll('.sleep-star-btn');
    items.forEach((item, idx) => {
        item.style.color = (idx < stars) ? 'var(--primary)' : 'var(--text-sub)';
    });
}

function saveSleepLog() {
    const durInput = parseFloat(document.getElementById('sleep-duration-input').value) || 7;
    const stars = qAnswers['sleep-quality'] || 4;

    appState.state_sleep_duration = durInput;
    appState.state_sleep_quality = stars;

    appState.tracker.sleepToday.duration = durInput;
    appState.tracker.sleepToday.quality = stars;

    saveState();
    addXP(15); // +15 XP for logging sleep
    showToast('Kualitas tidur berhasil diperbarui!');
    navigateTo('screen-home');
    updateGUI();
}

// Journal Compose Actions
function renderJournalHistory() {
    const list = document.getElementById('journals-list');
    if (!list) return;

    list.innerHTML = '';

    if (appState.journals.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-sub); font-size: 12px; margin-top: 30px;">Belum ada sejarah tulisan jurnal harianmu. ✏️</div>`;
        return;
    }

    appState.journals.forEach(j => {
        const dateStr = j.date || 'Hari ini';
        const card = document.createElement('div');
        card.className = 'card card-glass journal-item';
        card.innerHTML = `
            <div class="journal-header">
                <div>
                    <h4 class="journal-title">${j.title}</h4>
                    <span class="journal-date">${dateStr}</span>
                </div>
                <div>
                    <span class="journal-mood-tag">${j.mood === 'happy' ? '😊' : j.mood === 'sad' ? '😔' : j.mood === 'tired' ? '😴' : '🧘'}</span>
                </div>
            </div>
            <p style="font-size: 12px; color: var(--text-sub); line-height: 1.5; margin-bottom: 8px;">${j.text}</p>
        `;
        list.appendChild(card);
    });
}

function saveJournal() {
    const titleVal = document.getElementById('journal-title-input').value.trim();
    const contentVal = document.getElementById('journal-content-input').value.trim();
    const moodVal = document.getElementById('journal-mood-select').value;

    if (titleVal === '' || contentVal === '') {
        showToast('Judul dan isi jurnal tidak boleh kosong!', 'danger');
        return;
    }

    const newJournal = {
        id: 'journal-' + Date.now(),
        title: titleVal,
        text: contentVal,
        mood: moodVal,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    appState.journals.unshift(newJournal);
    saveState();

    // clear input forms
    document.getElementById('journal-title-input').value = '';
    document.getElementById('journal-content-input').value = '';
    document.getElementById('journal-mood-select').value = 'happy';

    addXP(25); // +25 XP on writing journal!
    showToast('Jurnal barumu berhasil disimpan!');
    navigateTo('screen-journal');
}

// Habits Tab Screen
function renderHabitsListTab() {
    const list = document.getElementById('habits-list-tab');
    if (!list) return;

    list.innerHTML = '';

    appState.habits.forEach(h => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '12px 14px';
        item.style.backgroundColor = 'var(--bg-card)';
        item.style.border = '1px solid var(--border-color)';
        item.style.borderRadius = 'var(--radius-sm)';
        item.style.marginBottom = '10px';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; cursor:pointer;" onclick="toggleHabit('${h.id}'); renderHabitsListTab();">
                <div class="habit-checkbox ${h.completed ? 'completed' : ''}" style="background-color: ${h.completed ? 'var(--primary)' : 'transparent'}; border-color: ${h.completed ? 'var(--primary)' : 'var(--text-sub)'}">
                    ${h.completed ? '✓' : ''}
                </div>
                <span style="font-size: 13px; text-decoration: ${h.completed ? 'line-through' : 'none'}; color: ${h.completed ? 'var(--text-sub)' : 'var(--text-main)'}">${h.name}</span>
            </div>
            <i data-lucide="trash-2" onclick="deleteCustomHabit('${h.id}')" style="width: 16px; color: var(--accent); cursor: pointer;"></i>
        `;
        list.appendChild(item);
    });

    lucide.createIcons();
}

function addCustomHabit() {
    const input = document.getElementById('habits-new-input');
    const name = input.value.trim();
    if (name === '') return;

    const newHabit = {
        id: 'habit-' + Date.now(),
        name: name,
        completed: false
    };

    appState.habits.push(newHabit);
    saveState();
    input.value = '';

    renderHabitsListTab();
    showToast(`Kebiasaan "${name}" ditambahkan!`);
}

function deleteCustomHabit(id) {
    appState.habits = appState.habits.filter(h => h.id !== id);
    saveState();
    renderHabitsListTab();
    showToast('Kebiasaan berhasil dihapus.');
}

// Mood statistics and chart generator
function renderMoodChart() {
    renderMoodHistoryList();

    // Count frequencies of each mood in history
    const counts = {
        'sangat-bahagia': 0,
        'bahagia': 0,
        'biasa': 0,
        'sedih': 0,
        'cemas': 0,
        'lelah': 0
    };

    appState.moodHistory.forEach(entry => {
        if (counts[entry.mood] !== undefined) {
            counts[entry.mood]++;
        }
    });

    // Find Max Count to calculate scale
    const values = Object.values(counts);
    const maxVal = Math.max(...values, 1);

    // Update chart columns
    const moodKeys = ['sangat-bahagia', 'bahagia', 'biasa', 'sedih', 'cemas', 'lelah'];
    moodKeys.forEach(k => {
        const heightPct = Math.round((counts[k] / maxVal) * 100);
        const fillBar = document.getElementById(`chart-fill-${k}`);
        if (fillBar) {
            fillBar.style.height = `${heightPct}%`;
        }
        const freqLabel = document.getElementById(`chart-count-${k}`);
        if (freqLabel) {
            freqLabel.textContent = counts[k] > 0 ? `${counts[k]}x` : '';
        }
    });

    // Update highlights
    let dominantMood = 'bahagia';
    let dominantMax = -1;
    for (let k in counts) {
        if (counts[k] > dominantMax) {
            dominantMax = counts[k];
            dominantMood = k;
        }
    }

    const domMoodText = document.getElementById('gui-dominant-mood');
    if (domMoodText) {
        const moodDef = MOODS_DICTIONARY[dominantMood];
        domMoodText.textContent = `${moodDef.emoji} ${moodDef.label}`;
    }
}

function renderMoodHistoryList() {
    const list = document.getElementById('mood-history-list');
    if (!list) return;

    list.innerHTML = '';

    if (appState.moodHistory.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-sub); font-size: 12px; margin-top: 10px;">Belum ada sejarah mood harian.</div>`;
        return;
    }

    appState.moodHistory.forEach(j => {
        const moodLabel = MOODS_DICTIONARY[j.mood] ? MOODS_DICTIONARY[j.mood].label : j.mood;
        const entry = document.createElement('div');
        entry.style.display = 'flex';
        entry.style.alignItems = 'center';
        entry.style.justifyContent = 'space-between';
        entry.style.padding = '10px 0';
        entry.style.borderBottom = '1px solid var(--border-color)';

        entry.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${j.emoji}</span>
                <div>
                    <h5 style="font-size: 12.5px; font-weight: 700; color: var(--text-main);">${moodLabel}</h5>
                    <span style="font-size: 9.5px; color: var(--text-sub);">${j.date}</span>
                </div>
            </div>
            <span style="font-size: 11px; color: var(--text-sub); font-style: italic;">"${j.note}"</span>
        `;
        list.appendChild(entry);
    });
}

// Profile Tab Settings controller
function renderProfileTab() {
    document.getElementById('profile-name-input').value = appState.profile.name || '';

    // Set theme picker
    const themeLav = document.getElementById('btn-col-lavender');
    const themeBlu = document.getElementById('btn-col-blue');

    themeLav.classList.remove('active');
    themeBlu.classList.remove('active');

    if (appState.profile.theme === 'lavender') {
        themeLav.classList.add('active');
    } else {
        themeBlu.classList.add('active');
    }

    // Set toggle switch
    document.getElementById('toggle-dark-mode').checked = appState.profile.isDarkMode;
}

function saveProfileName() {
    const input = document.getElementById('profile-name-input');
    const name = input.value.trim();
    if (name === '') return;

    appState.profile.name = name;
    saveState();
    showToast('Nama profil disimpan!');
    updateGUI();
}

function changeThemeSelection(themeName) {
    appState.profile.theme = themeName;
    saveState();
    updateGUI();
    renderProfileTab();
}

function toggleDarkModeSwitch() {
    const checked = document.getElementById('toggle-dark-mode').checked;
    appState.profile.isDarkMode = checked;
    saveState();
    updateGUI();
}

function triggerUserDataReset() {
    if (confirm('Apakah kamu yakin ingin menghapus semua data? Penyetelan profil dan XP level akan dikembalikan ke awal.')) {
        localStorage.removeItem('innercalm_state');
        loadState();
        updateGUI();
        navigateTo('screen-splash');
        showToast('Semua data berhasil dibersihkan.', 'danger');
    }
}

// Auth credentials verification
function verifyUserLogin() {
    const emInput = document.getElementById('login-email').value.trim();
    const pwInput = document.getElementById('login-pass').value;

    if (emInput === '' || pwInput === '') {
        showToast('Isilah semua field kredensial masuk!', 'danger');
        return;
    }

    // standard validation matching login_screen.dart defaults
    if (emInput === 'risma@example.com' && pwInput === 'password123') {
        appState.profile.name = 'Risma Adinda';
        saveState();
        updateGUI();
        showToast('Berhasil masuk! Selamat datang ke InnerCalm. ✨');
        navigateTo('screen-home');
    } else {
        showToast('Kredensial salah! Gunakan: risma@example.com / password123', 'danger');
    }
}

function verifyUserRegister() {
    const nameVal = document.getElementById('reg-name').value.trim();
    const emVal = document.getElementById('reg-email').value.trim();
    const pwVal = document.getElementById('reg-pass').value;

    if (nameVal === '' || emVal === '' || pwVal === '') {
        showToast('Isilah seluruh field registrasi!', 'danger');
        return;
    }

    appState.profile.name = nameVal;
    saveState();
    updateGUI();
    showToast(`Akun berhasil dibuat! Halo ${nameVal}. ✨`);
    navigateTo('screen-home');
}

// Onboarding sliders page cycles
let currentOnboardIdx = 0;
const ONBOARDING_SLIDES = [
    { title: "Welcome!", desc: "A small step today for a better tomorrow.", emoji: "❤️" },
    { title: "Monitor Kesehatan Harian", desc: "Catat dan kendalikan tingkat suasana hati (mood), waktu tidur, hingga hidrasi harianmu secara interaktif.", emoji: "📊" },
    { title: "Fitur Gamifikasi Seru", desc: "Meningkatkan status mentalmu sembari menaikkan Level 'Inner Hero' dengan menyelesaikan kebiasaan baik harian.", emoji: "🌟" }
];

function nextOnboardSlide() {
    if (currentOnboardIdx < ONBOARDING_SLIDES.length - 1) {
        currentOnboardIdx++;
        updateOnboardSlide();
    } else {
        // Go to Login
        navigateTo('screen-login');
    }
}

function updateOnboardSlide() {
    const slide = ONBOARDING_SLIDES[currentOnboardIdx];
    const visual = document.getElementById('onboard-visual-emoji');
    if (currentOnboardIdx === 0) {
        // Welcome illustration: Girl hugging heart
        visual.innerHTML = `
            <svg viewBox="0 0 200 200" width="160" height="160" style="display:block; margin:auto;">
                <circle cx="100" cy="100" r="80" fill="var(--primary-light)" opacity="0.6"/>
                <path d="M100 135 C60 110 40 80 40 55 C40 35 55 20 75 20 C87 20 95 27 100 35 C105 27 113 20 125 20 C145 20 160 35 160 55 C160 80 140 110 100 135 Z" fill="#A8C5FF"/>
                <circle cx="100" cy="65" r="22" fill="#FFE2D1"/>
                <path d="M100 87 C80 87 68 100 68 120 L132 120 C132 100 120 87 100 87 Z" fill="#FFF3D6"/>
                <path d="M78 65 C78 50 122 50 122 65 C122 75 115 80 100 80 C85 80 78 75 78 65 Z" fill="#2E2C2C"/>
                <circle cx="100" cy="55" r="5" fill="#2E2C2C"/>
                <path d="M75 105 C85 100 95 100 105 105" stroke="#FFE2D1" stroke-width="8" stroke-linecap="round" fill="none"/>
            </svg>
        `;
    } else if (currentOnboardIdx === 1) {
        // Stats illustration
        visual.innerHTML = `
            <svg viewBox="0 0 200 200" width="160" height="160" style="display:block; margin:auto;">
                <circle cx="100" cy="100" r="80" fill="var(--bg-highlight)" opacity="0.6"/>
                <rect x="60" y="60" width="80" height="90" rx="12" fill="#FFFFFF" stroke="var(--border-color)" stroke-width="3"/>
                <line x1="75" y1="130" x2="125" y2="130" stroke="var(--text-sub)" stroke-width="2"/>
                <path d="M75 110 L90 90 L105 105 L125 80 L125 130 L75 130 Z" fill="#A8C5FF" opacity="0.5"/>
                <path d="M75 110 L90 90 L105 105 L125 80" stroke="var(--primary-dark)" stroke-width="3" fill="none" stroke-linecap="round"/>
                <circle cx="80" cy="75" r="6" fill="#7DD3A7"/>
                <circle cx="100" cy="75" r="6" fill="#F7C873"/>
                <circle cx="120" cy="75" r="6" fill="#8ECAE6"/>
            </svg>
        `;
    } else {
        // Meditasi/SOS Lungs illustration
        visual.innerHTML = `
            <svg viewBox="0 0 200 200" width="160" height="160" style="display:block; margin:auto;">
                <circle cx="100" cy="100" r="80" fill="var(--primary-light)" opacity="0.6"/>
                <path d="M85 70 C60 70 50 90 50 115 C50 135 65 145 78 145 C88 145 92 135 95 125 L95 80 Z" fill="#A8C5FF" opacity="0.8"/>
                <path d="M115 70 C140 70 150 90 150 115 C150 135 135 145 122 145 C112 145 108 135 105 125 L105 80 Z" fill="#A8C5FF" opacity="0.8"/>
                <line x1="100" y1="60" x2="100" y2="120" stroke="var(--primary-dark)" stroke-width="4" stroke-linecap="round"/>
                <path d="M100 80 Q95 85 90 85" stroke="var(--primary-dark)" stroke-width="3" fill="none"/>
                <path d="M100 95 Q105 100 110 100" stroke="var(--primary-dark)" stroke-width="3" fill="none"/>
            </svg>
        `;
    }
    document.getElementById('onboard-slide-title').textContent = slide.title;
    document.getElementById('onboard-slide-desc').textContent = slide.desc;

    // dot lights
    const dots = document.querySelectorAll('.onboarding-dots .dot');
    dots.forEach((dot, idx) => {
        dot.className = (idx === currentOnboardIdx) ? 'dot active' : 'dot';
    });
}

// Initialize Application on Page Load
window.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateGUI();

    // Start with splash screen
    navigateTo('screen-splash');

    // Auto transition splash to onboarding / home
    setTimeout(() => {
        if (appState.profile.name) {
            navigateTo('screen-home');
        } else {
            currentOnboardIdx = 0;
            updateOnboardSlide();
            navigateTo('screen-onboarding');
        }
    }, 2200);
});
