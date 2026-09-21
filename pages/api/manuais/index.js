import { supabase } from "../../../src/lib/supabase";
import instalacoesLocal from "../../../src/data/instalacao.json";

export default async function handler(req, res) {
    if (req.method === "GET") {
        // Lista todos os manuais (id, nome, descricao)
        if (supabase) {
            const { data, error } = await supabase
                .from("manuais")
                .select("id, nome, descricao, categorias(nome)")
                .order("id");

            if (!error && data && data.length > 0) {
                return res.status(200).json(data);
            }
        }

        // Fallback local
        const todos = Object.values(instalacoesLocal).flat();
        return res.status(200).json(todos.map(({ id, nome, descricao }) => ({ id, nome, descricao })));
    }

    if (req.method === "POST") {
        // Cria um novo manual (gerado pela IA)
        const { nome, descricao, categoria, passos } = req.body;

        if (!nome || !passos?.length) {
            return res.status(400).json({ error: "nome e passos são obrigatórios" });
        }

        if (!supabase) {
            return res.status(503).json({ error: "Banco de dados não configurado" });
        }

        // Encontra ou cria categoria
        let categoriaId = null;
        const nomeCategoria = categoria || "Gerados por IA";
        const { data: catData } = await supabase
            .from("categorias")
            .upsert({ nome: nomeCategoria }, { onConflict: "nome" })
            .select()
            .single();

        if (catData) categoriaId = catData.id;

        // Calcula o próximo ID seguro (evita colisão com os manuais migrados)
        const { data: ultimoManual } = await supabase
            .from("manuais")
            .select("id")
            .order("id", { ascending: false })
            .limit(1)
            .single();

        const proximoId = (ultimoManual?.id || 52) + 1;

        // Insere o manual com o próximo ID seguro e status pendente de aprovação
        let { data: manual, error: errManual } = await supabase
            .from("manuais")
            .insert({
                id: proximoId,
                nome,
                descricao: descricao || "",
                categoria_id: categoriaId,
                gerado_por_ia: true,
                aprovado: false, // Requer aprovação do SirReinato
            })
            .select()
            .single();

        // Fallback se a coluna aprovado ainda não tiver sido criada no Supabase
        if (errManual && errManual.message?.includes("aprovado")) {
            const fallbackInsert = await supabase
                .from("manuais")
                .insert({
                    id: proximoId,
                    nome,
                    descricao: descricao || "",
                    categoria_id: categoriaId,
                    gerado_por_ia: true,
                })
                .select()
                .single();
            manual = fallbackInsert.data;
            errManual = fallbackInsert.error;
        }

        if (errManual) return res.status(500).json({ error: errManual.message });


        // Insere os passos
        const passosParaInserir = passos.map((p, i) => ({
            manual_id: manual.id,
            passo: i + 1,
            titulo: p.titulo,
            descricao: p.descricao,
            imagem: p.imagem || null,
        }));

        const { error: errPassos } = await supabase.from("passos").insert(passosParaInserir);
        if (errPassos) return res.status(500).json({ error: errPassos.message });

        return res.status(201).json({ id: manual.id, nome: manual.nome });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: `Método ${req.method} não permitido` });
}
