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

    // 2. GET: Lista manuais pendentes de aprovação
    if (req.method === "GET") {
        try {
            // Tenta buscar com a coluna aprovado
            let { data, error } = await adminClient
                .from("manuais")
                .select("id, nome, descricao, gerado_por_ia, aprovado, criado_em, categorias(nome), passos(passo, titulo, descricao, imagem)")
                .order("id", { ascending: false });

            // Se a coluna aprovado ainda não foi criada no Supabase, busca sem ela
            let precisaCriarColuna = false;
            if (error && error.message?.includes("aprovado")) {
                precisaCriarColuna = true;
                const fallback = await adminClient
                    .from("manuais")
                    .select("id, nome, descricao, gerado_por_ia, criado_em, categorias(nome), passos(passo, titulo, descricao, imagem)")
                    .order("id", { ascending: false });
                data = (fallback.data || []).map((m) => ({ ...m, aprovado: !m.gerado_por_ia }));
                error = fallback.error;
            }

            if (error) return res.status(500).json({ error: error.message });

            const pendentes = (data || []).filter((m) => m.aprovado === false);
            const aprovados = (data || []).filter((m) => m.aprovado !== false);

            return res.status(200).json({
                pendentes,
                aprovados,
                total: data.length,
                precisaCriarColuna,
            });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }


    // 3. PUT: Aprova ou edita um manual
    if (req.method === "PUT") {
        const { id, aprovado = true, nome, descricao } = req.body;

        if (!id) {
            return res.status(400).json({ error: "ID do manual é obrigatório" });
        }

        try {
            const updates = { aprovado: Boolean(aprovado) };
            if (nome) updates.nome = nome;
            if (descricao !== undefined) updates.descricao = descricao;

            const { data, error } = await adminClient
                .from("manuais")
                .update(updates)
                .eq("id", Number(id))
                .select()
                .single();

            if (error) {
                if (error.message?.includes("aprovado")) {
                    return res.status(400).json({
                        error: "A coluna 'aprovado' ainda não foi criada no Supabase. Execute o comando no SQL Editor: ALTER TABLE manuais ADD COLUMN IF NOT EXISTS aprovado BOOLEAN NOT NULL DEFAULT TRUE;"
                    });
                }
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ success: true, manual: data });

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
