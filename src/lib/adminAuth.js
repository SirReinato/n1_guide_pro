import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD || "SirReinatoAdmin2026!";
const MAX_TOKEN_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

export function generateAdminToken() {
    const timestamp = Date.now();
    const data = `admin-${timestamp}`;
    const hash = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    return `${data}.${hash}`;
}

export function verifyAdminToken(token) {
    if (!token || typeof token !== "string") return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [data, hash] = parts;
    const timestamp = Number(data.replace("admin-", ""));
    if (!timestamp || Date.now() - timestamp > MAX_TOKEN_AGE_MS) {
        return false;
    }

    const expected = crypto
        .createHmac("sha256", SECRET)
        .update(data)
        .digest("hex");

    try {
        const hashBuf = Buffer.from(hash, "hex");
        const expectedBuf = Buffer.from(expected, "hex");
        if (hashBuf.length !== expectedBuf.length) return false;
        return crypto.timingSafeEqual(hashBuf, expectedBuf);
    } catch {
        return false;
    }
}
