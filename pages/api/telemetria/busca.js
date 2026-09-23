import { registrarLogConsulta } from "../../../src/lib/supabaseAdmin";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { termo } = req.body || {};
    if (!termo || typeof termo !== "string" || termo.trim().length < 3) {
        return res.status(400).json({ error: "Termo muito curto ou inválido" });
    }

    try {
        await registrarLogConsulta({
            termo: termo.trim(),
            origem: "busca",
            encontrouManual: false,
        });
        return res.status(200).json({ ok: true });
    } catch (err) {
        return res.status(200).json({ ok: false });
    }
}
