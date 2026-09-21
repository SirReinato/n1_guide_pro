import { generateAdminToken } from "../../../src/lib/adminAuth";

export default function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "SirReinatoAdmin2026!";

    if (!password || password !== adminPassword) {
        return res.status(401).json({ error: "Senha de administrador incorreta" });
    }

    const token = generateAdminToken();
    return res.status(200).json({ success: true, token });
}
