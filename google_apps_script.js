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

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    var answers = data.answers || {};
    var respondent = data.respondent || {};
    
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
    
    // Masukkan jawaban pertanyaan q5 sampai q67
    for (var i = 5; i <= 67; i++) {
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
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "active", 
      project: "TemanJiwa Kuesioner Webhook",
      spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName() 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
