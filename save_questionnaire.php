<?php
/**
 * TemanJiwa - Endpoint Penyimpanan Hasil Kuesioner ke rekap_kuesioner.json
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method Not Allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$responseData = json_decode($rawInput, true);

if (!$responseData || !isset($responseData['id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON input']);
    exit;
}

$filePath = __DIR__ . '/rekap_kuesioner.json';

$rekap = [
    'project' => 'TemanJiwa - Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking',
    'researcher' => 'Risma Elfaryani',
    'institution' => 'STMIK IKMI Cirebon',
    'program' => 'Program Studi Sistem Informasi',
    'targetGroup' => 'Generasi Z',
    'totalQuestions' => 61,
    'totalResponses' => 0,
    'lastUpdated' => null,
    'responses' => []
];

if (file_exists($filePath)) {
    $existing = json_decode(file_get_contents($filePath), true);
    if (is_array($existing)) {
        $rekap = $existing;
    }
}

if (!isset($rekap['responses']) || !is_array($rekap['responses'])) {
    $rekap['responses'] = [];
}

$rekap['totalQuestions'] = 61;
if (isset($responseData['answers']) && is_array($responseData['answers'])) {
    $answers = [];
    for ($i = 1; $i <= 61; $i++) {
        $key = 'q' . $i;
        if (array_key_exists($key, $responseData['answers'])) {
            $answers[$key] = $responseData['answers'][$key];
        }
    }
    for ($i = 57; $i <= 61; $i++) {
        $oldKey = 'q' . (63 + $i - 57);
        if (array_key_exists($oldKey, $responseData['answers'])) {
            $answers['q' . $i] = $responseData['answers'][$oldKey];
        }
    }
    $responseData['answers'] = $answers;
}

// Cari apakah id sudah ada (update atau append)
$foundIndex = -1;
foreach ($rekap['responses'] as $idx => $r) {
    if (isset($r['id']) && $r['id'] === $responseData['id']) {
        $foundIndex = $idx;
        break;
    }
}

if ($foundIndex >= 0) {
    $rekap['responses'][$foundIndex] = $responseData;
} else {
    $rekap['responses'][] = $responseData;
}

$rekap['totalResponses'] = count($rekap['responses']);
$rekap['lastUpdated'] = date('c');

$saved = file_put_contents($filePath, json_encode($rekap, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($saved !== false) {
    echo json_encode([
        'success' => true,
        'message' => 'Berhasil disimpan ke rekap_kuesioner.json',
        'totalResponses' => $rekap['totalResponses']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Gagal menulis ke rekap_kuesioner.json']);
}
