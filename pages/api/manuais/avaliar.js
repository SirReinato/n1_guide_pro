import { supabase } from "../../../src/lib/supabase";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { id, voto } = req.body;

    if (!id || !voto) {
        return res.status(400).json({ error: "id e voto são obrigatórios" });
    }

    if (!supabase) {
        return res.status(200).json({ success: true, offline: true });
    }

    try {
        const manualId = Number(id);

        const { data: manual, error: errBusca } = await supabase
            .from("manuais")
            .select("id, votos_positivos, votos_negativos, visualizacoes")
            .eq("id", manualId)
            .single();

        if (errBusca) {
            return res.status(200).json({ success: true, colunaPendente: true });
        }

        const updates = {};
        if (voto === "positivo") {
            updates.votos_positivos = (manual.votos_positivos || 0) + 1;
        } else if (voto === "negativo") {
            updates.votos_negativos = (manual.votos_negativos || 0) + 1;
        } else if (voto === "visualizacao") {
            updates.visualizacoes = (manual.visualizacoes || 0) + 1;
        }

        const { error: errUpdate } = await supabase
            .from("manuais")
            .update(updates)
            .eq("id", manualId);

        if (errUpdate) {
            return res.status(200).json({ success: true, colunaPendente: true });
        }

        return res.status(200).json({
            success: true,
            votosPositivos: updates.votos_positivos ?? manual.votos_positivos,
            votosNegativos: updates.votos_negativos ?? manual.votos_negativos,
            visualizacoes: updates.visualizacoes ?? manual.visualizacoes,
        });
    } catch (err) {
        return res.status(200).json({ success: true, erroSilenciado: err.message });
    }
}
