import crypto from "crypto";

const SECRET = process.env.ADMIN_PASSWORD;

export function generateAdminToken() {
    const timestamp = Date.now();
    const data = `admin-${timestamp}`;
    const hash = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    return `${data}.${hash}`;
}

export function verifyAdminToken(token) {
    if (!token) return false;
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [data, hash] = parts;
    const expected = crypto.createHmac("sha256", SECRET).update(data).digest("hex");
    return hash === expected;
}
