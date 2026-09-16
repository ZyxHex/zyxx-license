let licenses = global.licenses || [];
global.licenses = licenses;

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { key } = req.query;
    if (!key) return res.status(400).json({ valid: false, msg: 'Key kosong' });

    const found = licenses.find(l => l.key === key);
    if (!found) return res.status(200).json({ valid: false, msg: 'Key tidak ditemukan' });

    if (new Date(found.expired) < new Date()) {
        return res.status(200).json({ valid: false, msg: 'Key expired' });
    }

    if (found.status === 'inactive') {
        return res.status(200).json({ valid: false, msg: 'Key nonaktif' });
    }

    return res.status(200).json({
        valid: true,
        msg: 'Key valid',
        expired_at: found.expired,
        key: found.key
    });
}
