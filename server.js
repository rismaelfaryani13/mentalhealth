const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const MAX_REQUEST_BYTES = 2 * 1024 * 1024;
const developerSessions = new Map();

function safeCompare(left, right) {
    const leftBuffer = Buffer.from(String(left));
    const rightBuffer = Buffer.from(String(right));
    if (leftBuffer.length !== rightBuffer.length) return false;
    return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function getCookie(req, name) {
    const header = req.headers.cookie || '';
    const match = header.split(';').map(value => value.trim()).find(value => value.startsWith(name + '='));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function sendJson(res, status, payload, extraHeaders = {}) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...extraHeaders
    });
    res.end(JSON.stringify(payload));
}

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
    const parsedUrl = (req.url || '/').split('?')[0];

    if (parsedUrl === '/api/developer/session' && req.method === 'GET') {
        const token = getCookie(req, 'temanjiwa_admin');
        const expiresAt = token ? developerSessions.get(token) : null;
        if (expiresAt && expiresAt < Date.now()) {
            developerSessions.delete(token);
        }
        sendJson(res, 200, { authenticated: Boolean(expiresAt && expiresAt >= Date.now()) });
        return;
    }

    if (parsedUrl === '/api/developer/login' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
            if (body.length > 4096) {
                sendJson(res, 413, { success: false, error: 'Payload too large' });
                req.destroy();
            }
        });
        req.on('end', () => {
            if (res.writableEnded) return;
            try {
                const data = JSON.parse(body);
                const username = process.env.DEV_USERNAME;
                const password = process.env.DEV_PASSWORD;
                if (!username || !password) {
                    sendJson(res, 503, { success: false, error: 'Developer access is not configured on this server' });
                    return;
                }
                if (!safeCompare(data.username, username) || !safeCompare(data.password, password)) {
                    sendJson(res, 401, { success: false, error: 'Invalid developer credentials' });
                    return;
                }
                const token = crypto.randomBytes(32).toString('hex');
                developerSessions.set(token, Date.now() + 60 * 60 * 1000);
                const cookie = `temanjiwa_admin=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600`;
                sendJson(res, 200, { success: true }, { 'Set-Cookie': cookie });
            } catch (error) {
                sendJson(res, 400, { success: false, error: 'Invalid JSON input' });
            }
        });
        return;
    }

    if (parsedUrl === '/api/developer/logout' && req.method === 'POST') {
        const token = getCookie(req, 'temanjiwa_admin');
        if (token) developerSessions.delete(token);
        sendJson(res, 200, { success: true }, {
            'Set-Cookie': 'temanjiwa_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'
        });
        return;
    }

    // API: Save Questionnaire Response to rekap_kuesioner.json
    if (req.method === 'POST' && (parsedUrl === '/api/save-questionnaire' || parsedUrl === '/save_questionnaire.php')) {
        let body = '';
        let receivedBytes = 0;
        req.on('data', chunk => {
            receivedBytes += chunk.length;
            if (receivedBytes > MAX_REQUEST_BYTES) {
                res.writeHead(413, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: 'Payload too large' }));
                req.destroy();
                return;
            }
            body += chunk;
        });
        req.on('end', () => {
            if (res.writableEnded) return;
            try {
                const responseData = JSON.parse(body);
                if (!responseData || typeof responseData !== 'object' || !responseData.id) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid questionnaire payload' }));
                    return;
                }
                const filePath = path.join(ROOT_DIR, 'rekap_kuesioner.json');

                let rekap = {
                    project: "TemanJiwa - Analisis UI/UX Mental Health Tracker untuk Generasi Z Menggunakan Metode Design Thinking",
                    researcher: "Risma Elfaryani",
                    institution: "STMIK IKMI Cirebon",
                    program: "Program Studi Sistem Informasi",
                    targetGroup: "Generasi Z",
                    totalQuestions: 61,
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

                rekap.totalQuestions = 61;
                if (responseData.answers && typeof responseData.answers === 'object') {
                    const answers = {};
                    for (let i = 1; i <= 61; i++) {
                        const key = 'q' + i;
                        if (responseData.answers[key] !== undefined) answers[key] = responseData.answers[key];
                    }
                    for (let i = 57; i <= 61; i++) {
                        const oldKey = 'q' + (63 + i - 57);
                        if (responseData.answers[oldKey] !== undefined) answers['q' + i] = responseData.answers[oldKey];
                    }
                    responseData.answers = answers;
                }

                if (!responseData.answers || Object.keys(responseData.answers).length !== 61) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'All 61 questionnaire answers are required' }));
                    return;
                }

                if (responseData.respondent && typeof responseData.respondent === 'object') {
                    for (const key of Object.keys(responseData.respondent)) {
                        if (typeof responseData.respondent[key] === 'string') {
                            responseData.respondent[key] = responseData.respondent[key].slice(0, 500);
                        }
                    }
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

                const tempPath = filePath + '.tmp';
                fs.writeFileSync(tempPath, JSON.stringify(rekap, null, 2), 'utf8');
                fs.renameSync(tempPath, filePath);
                console.log(`[API] Saved questionnaire response. Total responses: ${rekap.totalResponses}`);

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
    const relativePath = parsedUrl === '/' ? 'index.html' : parsedUrl.replace(/^\/+/, '');
    const filePath = path.resolve(ROOT_DIR, relativePath);
    if (!filePath.startsWith(ROOT_DIR + path.sep) && filePath !== path.join(ROOT_DIR, 'index.html')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found: ' + parsedUrl);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        const isImmutableAsset = /\.(?:png|jpg|jpeg|svg|ico|woff2?)$/i.test(filePath);
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': isImmutableAsset ? 'public, max-age=86400' : 'no-cache'
        });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
});
