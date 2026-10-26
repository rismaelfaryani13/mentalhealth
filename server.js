const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = req.url.split('?')[0];

    // API: Save Questionnaire Response to rekap_kuesioner.json
    if (req.method === 'POST' && (parsedUrl === '/api/save-questionnaire' || parsedUrl === '/save_questionnaire.php')) {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const responseData = JSON.parse(body);
                const filePath = path.join(__dirname, 'rekap_kuesioner.json');

                let rekap = {
                    project: "TemanJiwa - Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking",
                    researcher: "Risma Elfaryani",
                    institution: "STMIK IKMI Cirebon",
                    program: "Program Studi Sistem Informasi",
                    targetGroup: "Generasi Z",
                    totalQuestions: 67,
                    totalResponses: 0,
                    lastUpdated: null,
                    responses: []
                };

                if (fs.existsSync(filePath)) {
                    try {
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        rekap = JSON.parse(fileContent);
                    } catch (e) {
                        console.warn('Could not parse existing rekap_kuesioner.json, creating new.');
                    }
                }

                if (!Array.isArray(rekap.responses)) {
                    rekap.responses = [];
                }

                // Check if response already exists by id, update or append
                const existingIndex = rekap.responses.findIndex(r => r.id === responseData.id);
                if (existingIndex >= 0) {
                    rekap.responses[existingIndex] = responseData;
                } else {
                    rekap.responses.push(responseData);
                }

                rekap.totalResponses = rekap.responses.length;
                rekap.lastUpdated = new Date().toISOString();

                fs.writeFileSync(filePath, JSON.stringify(rekap, null, 2), 'utf8');
                console.log(`[API] Saved questionnaire response for: ${responseData.respondent ? responseData.respondent.name : 'Unknown'}. Total responses: ${rekap.totalResponses}`);

                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ success: true, totalResponses: rekap.totalResponses }));
            } catch (err) {
                console.error('[API] Error saving response:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    // Static Files Handler
    let filePath = path.join(__dirname, parsedUrl === '/' ? 'index.html' : parsedUrl);
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found: ' + parsedUrl);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
    });
});

server.listen(3000, () => {
    console.log('Server listening on http://localhost:3000/');
});
