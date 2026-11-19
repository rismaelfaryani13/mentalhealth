/**
 * TemanJiwa - Google Apps Script Webhook untuk Google Spreadsheet Penelitian Skripsi
 * Target Spreadsheet: https://docs.google.com/spreadsheets/d/1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4/edit
 * Peneliti: Risma Elfaryani (STMIK IKMI Cirebon)
 * 
 * PANDUAN PEMASANGAN (Hanya 1 Menit):
 * 1. Buka spreadsheet kuesioner Anda:
 *    https://docs.google.com/spreadsheets/d/1vjYnoduryaryCUgbzxB93yzRwzezAIHC0DqhahKUkM4/edit
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus kode default (myFunction), lalu salin & tempel SELURUH KODE di bawah ini.
 * 4. Klik ikon Disket (Simpan).
 * 5. Klik tombol biru "Deploy" (Terapkan) di kanan atas > pilih "Penerapan baru" (New deployment).
 * 6. Klik ikon roda gigi di sebelah kiri "Pilih jenis" > pilih "Aplikasi web" (Web app).
 * 7. Konfigurasi:
 *    - Deskripsi: TemanJiwa Kuesioner Webhook
 *    - Jalankan sebagai: Saya (email Google Anda)
 *    - Yang memiliki akses: Siapa saja (Anyone)   <-- WAJIB PILIH "SIAPA SAJA" agar responden web bisa kirim
 * 8. Klik "Terapkan" (Deploy) > Jika diminta izin, klik "Beri Akses" (Authorize access) > "Lanjutan" (Advanced) > "Buka TemanJiwa (tidak aman)".
 * 9. Salin URL Aplikasi Web (format: https://script.google.com/macros/s/.../exec).
 * 10. Masukkan URL tersebut pada pengaturan Akun Pemilik di web TemanJiwa.
 */

var QUESTION_HEADERS = [
  "Nama","Usia","Jenis Kelamin","Status (Kerja/Kuliah/Sekolah)",
  "Bagaimana Anda menilai kondisi kesehatan mental Anda saat ini?",
  "Seberapa sering Anda merasa stres dalam kehidupan sehari-hari?",
  "Ketika mengalami masalah, bagaimana Anda biasanya mengelola emosi?",
  "Seberapa sering Anda mencatat atau memantau suasana hati (mood) Anda?",
  "Berapa lama rata-rata waktu tidur Anda setiap malam?",
  "Seberapa sering Anda melakukan aktivitas untuk menjaga kesehatan mental?",
  "Apakah Anda pernah menggunakan aplikasi kesehatan mental sebelumnya?",
  "Apa tujuan utama Anda menggunakan aplikasi Mental Health Tracker?",
  "Fitur apa yang paling Anda harapkan tersedia dalam aplikasi Mental Health Tracker?",
  "Menurut Anda, seberapa penting aplikasi Mental Health Tracker bagi Generasi Z?",
  "Saya rasa saya akan sering menggunakan aplikasi Mental Health Tracker ini.",
  "Saya merasa alur dan fitur pada aplikasi ini terlalu rumit tanpa alasan yang jelas.",
  "Saya rasa aplikasi Mental Health Tracker ini mudah digunakan.",
  "Saya merasa membutuhkan bantuan orang lain atau panduan teknis.",
  "Berbagai fitur pada aplikasi ini terintegrasi dengan baik.",
  "Saya rasa terlalu banyak ketidakkonsistenan pada tampilan dan tata letak.",
  "Pengguna Generasi Z akan belajar menggunakan aplikasi ini dengan sangat cepat.",
  "Proses pengisian data dan penggunaan aplikasi ini membingungkan atau merepotkan.",
  "Saya merasa percaya diri dan nyaman saat menggunakan fitur-fitur aplikasi ini.",
  "Saya perlu mempelajari banyak hal sebelum dapat menggunakan aplikasi dengan lancar.",
  "UEQ - Menyebalkan sampai Menyenangkan",
  "UEQ - Buruk sampai Baik",
  "UEQ - Tidak disukai sampai Disukai",
  "UEQ - Tidak nyaman sampai Nyaman",
  "UEQ - Tidak menarik sampai Menarik",
  "UEQ - Tidak ramah pengguna sampai Ramah pengguna",
  "UEQ - Tidak dapat dipahami sampai Dapat dipahami",
  "UEQ - Sulit dipelajari sampai Mudah dipelajari",
  "UEQ - Rumit sampai Sederhana",
  "UEQ - Tidak jelas sampai Jelas",
  "UEQ - Lambat sampai Cepat",
  "UEQ - Tidak efisien sampai Efisien",
  "UEQ - Tidak praktis sampai Praktis",
  "UEQ - Berantakan sampai Terorganisasi",
  "UEQ - Tidak dapat diprediksi sampai Dapat diprediksi",
  "UEQ - Menghalangi sampai Mendukung",
  "UEQ - Tidak layak / Tidak aman sampai Layak / Dapat diandalkan",
  "UEQ - Tidak memenuhi ekspektasi sampai Memenuhi ekspektasi",
  "UEQ - Tidak bermanfaat sampai Bermanfaat",
  "UEQ - Membosankan sampai Mengasyikkan",
  "UEQ - Tidak menarik minat sampai Menarik minat",
  "UEQ - Tidak memotivasi sampai Memotivasi",
  "UEQ - Kreatif sampai Tidak kreatif (reverse)",
  "UEQ - Berdaya cipta / Inovatif sampai Konvensional (reverse)",
  "UEQ - Lazim / Biasa saja sampai Terdepan / Modern",
  "UEQ - Konservatif / Kaku sampai Inovatif",
  "Fitur Mood Tracker mudah digunakan dan efektif.",
  "Fitur Journal memudahkan menulis catatan dan mengekspresikan perasaan.",
  "Fitur Sleep Tracker memudahkan mencatat pola tidur harian.",
  "Fitur Water Tracker memudahkan mencatat konsumsi air.",
  "Fitur Reminder mengingatkan dan membangun kebiasaan sehat.",
  "Fitur Artikel Edukasi mudah dipahami dan relevan.",
  "Fitur apa yang paling Anda sukai pada aplikasi Mental Health Tracker?",
  "Fitur apa yang menurut Anda masih perlu diperbaiki?",
  "Bagian desain antarmuka mana yang perlu ditingkatkan?",
  "Apakah ada fitur tambahan yang ingin Anda hadirkan?",
  "Berikan kritik, masukan, atau saran untuk pengembangan aplikasi."
];

function ensureHeaders(sheet) {
  var headers = ["Timestamp"].concat(QUESTION_HEADERS);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function normalizeAnswers(answers) {
  answers = answers || {};
  var normalized = {};

  for (var i = 1; i <= 61; i++) {
    var key = "q" + i;
    if (answers[key] !== undefined) normalized[key] = answers[key];
  }

  for (var sus = 15; sus <= 24; sus++) {
    var susKey = "q" + sus;
    var susValue = Number(normalized[susKey]);
    if (!susValue) continue;
    susValue = Math.max(1, Math.min(5, susValue));
    normalized[susKey] = String(sus % 2 === 0 ? 6 - susValue : susValue);
  }

  for (var ueq = 25; ueq <= 50; ueq++) {
    var ueqKey = "q" + ueq;
    var ueqValue = Number(normalized[ueqKey]);
    if (!ueqValue) continue;
    if (ueqValue >= 1 && ueqValue <= 5) {
      ueqValue = [1, 2, 4, 6, 7][ueqValue - 1];
    }
    ueqValue = Math.max(1, Math.min(7, Math.round(ueqValue)));
    if (ueq === 47 || ueq === 48) ueqValue = 8 - ueqValue;
    normalized[ueqKey] = String(ueqValue);
  }

  for (var feature = 51; feature <= 56; feature++) {
    var featureKey = "q" + feature;
    var featureValue = Number(normalized[featureKey]);
    if (featureValue) normalized[featureKey] = String(Math.max(1, Math.min(5, featureValue)));
  }

  for (var open = 57; open <= 61; open++) {
    var oldKey = "q" + (63 + open - 57);
    if (answers[oldKey] !== undefined) normalized["q" + open] = answers[oldKey];
  }
  return normalized;
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var answers = normalizeAnswers(data.answers || {});
    var respondent = data.respondent || {};
    ensureHeaders(sheet);
    
    // Format Waktu Indonesia (Asia/Jakarta)
    var now = new Date();
    var timestampStr = Utilities.formatDate(now, "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    
    var row = [
      timestampStr,
      answers['q1'] || respondent.name || '',
      answers['q2'] || respondent.age || '',
      answers['q3'] || respondent.gender || '',
      answers['q4'] || respondent.status || ''
    ];
    
    // Masukkan jawaban pertanyaan q5 sampai q61
    for (var i = 5; i <= 61; i++) {
      var key = 'q' + i;
      row.push(answers[key] !== undefined ? answers[key] : '');
    }
    
    sheet.appendRow(row);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: "Data kuesioner berhasil ditambahkan ke Google Spreadsheet!",
        respondent: answers['q1'] || respondent.name || '',
        totalRows: sheet.getLastRow() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  ensureHeaders(sheet);
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "active", 
      project: "TemanJiwa Kuesioner Webhook",
      spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
