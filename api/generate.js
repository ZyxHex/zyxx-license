import { kv } from '@vercel/kv';
import crypto from 'crypto';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { prefix = 'ZYXX', days = 30, count = 1 } = req.query;
    const keys = [];

    for (let i = 0; i < parseInt(count); i++) {
        const key = `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const expired = new Date(Date.now() + parseInt(days) * 86400000).toISOString();
        await kv.set(`license:${key}`, { key, expired, status: 'active' });
        keys.push(key);
    }

    return res.status(200).json({ success: true, keys });
}
