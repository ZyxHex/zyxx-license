import crypto from 'crypto';

let licenses = global.licenses || [];
global.licenses = licenses;

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { prefix = 'ZYXX', days = 30, count = 1 } = req.query;
    const keys = [];

    for (let i = 0; i < parseInt(count); i++) {
        const key = `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const expired = new Date(Date.now() + parseInt(days) * 86400000).toISOString();
        licenses.push({ key, expired, status: 'active', created: new Date().toISOString() });
        keys.push(key);
    }

    return res.status(200).json({ success: true, total: keys.length, keys });
}
