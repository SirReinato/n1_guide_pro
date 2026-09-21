import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken } from "../../../src/lib/adminAuth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Usa a chave de serviço para ter privilégios totais de moderação
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminClient = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

export default async function handler(req, res) {
    // 1. Validação do Token do Admin
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!verifyAdminToken(token)) {
        return res.status(401).json({ error: "Acesso não autorizado. Faça login novamente." });
    }

    if (!adminClient) {
        return res.status(503).json({ error: "Banco de dados não configurado." });
    }

    // 2. GET: Lista manuais pendentes de aprovação e métricas
    if (req.method === "GET") {
        try {
            // Tenta buscar com a coluna aprovado e métricas
            let { data, error } = await adminClient
                .from("manuais")
                .select("id, nome, descricao, gerado_por_ia, aprovado, criado_em, visualizacoes, votos_positivos, votos_negativos, categorias(nome), passos(passo, titulo, descricao, imagem)")
                .order("id", { ascending: false });

            // Se a coluna aprovado ou métricas ainda não foram criadas no Supabase, busca formato básico
            let precisaCriarColuna = false;
            if (error) {
                precisaCriarColuna = true;
                const fallback = await adminClient
                    .from("manuais")
                    .select("id, nome, descricao, gerado_por_ia, criado_em, categorias(nome), passos(passo, titulo, descricao, imagem)")
                    .order("id", { ascending: false });
                data = (fallback.data || []).map((m) => ({ ...m, aprovado: !m.gerado_por_ia }));
            }

            // Busca logs de telemetria para o Dashboard N1
            let logsConsultas = [];
            try {
                const { data: logs } = await adminClient
                    .from("logs_consultas")
                    .select("*")
                    .order("id", { ascending: false })
                    .limit(100);
                logsConsultas = logs || [];
            } catch (_) {}

            const pendentes = (data || []).filter((m) => m.aprovado === false);
            const aprovados = (data || []).filter((m) => m.aprovado !== false);

            return res.status(200).json({
                pendentes,
                aprovados,
                total: data?.length || 0,
                logsConsultas,
                precisaCriarColuna,
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }


    // 3. PUT: Aprova ou edita um manual e seus passos
    if (req.method === "PUT") {
        const { id, aprovado, nome, descricao, passos } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID do manual é obrigatório" });
        }

        try {
            const updates = {};
            if (aprovado !== undefined) updates.aprovado = Boolean(aprovado);
            if (nome) updates.nome = nome;
            if (descricao !== undefined) updates.descricao = descricao;

            if (Object.keys(updates).length > 0) {
                const { error } = await adminClient
                    .from("manuais")
                    .update(updates)
                    .eq("id", Number(id));

                if (error && error.message?.includes("aprovado")) {
                    return res.status(400).json({
                        error: "A coluna 'aprovado' ainda não foi criada no Supabase."
                    });
                }
            }

            // Se passos foram fornecidos para edição
            if (Array.isArray(passos)) {
                // Remove passos anteriores do manual
                await adminClient
                    .from("passos")
                    .delete()
                    .eq("manual_id", Number(id));

                // Insere os passos atualizados com ordenação
                if (passos.length > 0) {
                    const passosParaInserir = passos.map((p, idx) => ({
                        manual_id: Number(id),
                        passo: idx + 1,
                        titulo: p.titulo || `Passo ${idx + 1}`,
                        descricao: p.descricao || "",
                        imagem: p.imagem || null,
                    }));

                    await adminClient.from("passos").insert(passosParaInserir);
                }
            }

            return res.status(200).json({ success: true });

        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // 4. DELETE: Exclui um manual
    if (req.method === "DELETE") {
        const id = req.query.id || req.body?.id;

        if (!id) {
            return res.status(400).json({ error: "ID do manual é obrigatório" });
        }

        try {
            const { error } = await adminClient
                .from("manuais")
                .delete()
                .eq("id", Number(id));

            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ success: true });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
