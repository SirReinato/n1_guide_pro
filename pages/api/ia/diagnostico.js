/**
 * POST /api/ia/diagnostico
 * 
 * Body: { problema: string }
 * 
 * Resposta:
 * - tipo "manuais_encontrados": { tipo, manuais: [{ id, nome, descricao }] }
 * - tipo "passo_a_passo": { tipo, passos: [{ titulo, descricao }], sugestaoNome, sugestaoDescricao }
 */

import instalacoesLocal from "../../../src/data/instalacao.json";
import { supabase } from "../../../src/lib/supabase";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Modelos verificados e testados com a chave da API (respostas entre 3s e 5s)
const GEMINI_MODELS = [
    "gemini-3.5-flash-lite", // Ultra rápido (~3.0s) e disponível
    "gemini-flash-latest",   // Rápido e estável (~5.3s)
    "gemini-3.5-flash",      // Fallback
];

// Aumenta o timeout da Vercel/Next.js para esta rota
export const config = { api: { responseLimit: false } };

async function chamarGemini(prompt) {
    for (const modelo of GEMINI_MODELS) {
        const url = `${BASE_URL}/${modelo}:generateContent?key=${GEMINI_API_KEY}`;
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
                }),
            });

            if (res.status === 503 || res.status === 429) {
                console.warn(`Modelo ${modelo} sobrecarregado (${res.status}), tentando próximo...`);
                continue; // tenta o próximo modelo
            }

            if (!res.ok) {
                const txt = await res.text();
                console.error(`Modelo ${modelo} retornou ${res.status}`);
                continue; // tenta próximo em vez de lançar erro
            }

            const data = await res.json();
            const texto = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            console.log(`Gemini respondeu com modelo: ${modelo}`);
            return texto;
        } catch (err) {
            if (err.message?.includes("sobrecarregado") || err.message?.includes("503") || err.message?.includes("429")) {
                continue;
            }
            throw err;
        }
    }
    throw new Error("Todos os modelos Gemini estão temporariamente indisponíveis.");
}

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Apenas POST é permitido" });
    }

    const { problema } = req.body;

    if (!problema?.trim()) {
        return res.status(400).json({ error: "Descreva o problema" });
    }

    if (!GEMINI_API_KEY) {
        return res.status(503).json({ error: "Gemini API não configurada" });
    }

    // Busca lista de manuais disponíveis
    let manuaisDisponiveis = [];
    try {
        if (supabase) {
            let { data, error } = await supabase
                .from("manuais")
                .select("id, nome, descricao")
                .eq("aprovado", true);

            if (error && error.message?.includes("aprovado")) {
                const fallback = await supabase
                    .from("manuais")
                    .select("id, nome, descricao");
                data = fallback.data;
            }

            manuaisDisponiveis = data || [];
        } else {

            manuaisDisponiveis = Object.values(instalacoesLocal)
                .flat()
                .map(({ id, nome, descricao }) => ({ id, nome, descricao }));
        }
    } catch (_) {
        manuaisDisponiveis = Object.values(instalacoesLocal)
            .flat()
            .map(({ id, nome, descricao }) => ({ id, nome, descricao }));
    }

    // Constrói o prompt para o Gemini
    const manuaisTexto = manuaisDisponiveis
        .map((m) => `- ID ${m.id}: "${m.nome}" — ${m.descricao}`)
        .join("\n");

    const prompt = `Você é um assistente técnico de suporte N1 (help desk) especializado em TI corporativa.

O usuário está com o seguinte problema:
"${problema}"

Manuais técnicos disponíveis no sistema:
${manuaisTexto}

Analise o problema e responda EXCLUSIVAMENTE com um JSON válido, sem nenhum texto adicional, sem markdown, sem explicação fora do JSON.

Se algum dos manuais acima for relevante para resolver o problema, responda:
{
  "tipo": "manuais_encontrados",
  "manuais": [{ "id": <número>, "relevancia": "<breve explicação de por que este manual ajuda>" }]
}

Se NENHUM manual for relevante, gere um passo a passo para resolver o problema e responda:
{
  "tipo": "passo_a_passo",
  "sugestaoNome": "<nome curto para este manual>",
  "sugestaoDescricao": "<descrição em uma frase>",
  "passos": [
    { "titulo": "<título do passo>", "descricao": "<instrução clara e detalhada>" }
  ]
}

Regras:
- Use linguagem clara e técnica, em português brasileiro.
- Passo a passo deve ter entre 3 e 8 passos.
- Se houver múltiplos manuais relevantes, liste apenas os 3 mais relevantes.
- Responda SOMENTE o JSON, nada mais.`;

    try {
        const textoBruto = await chamarGemini(prompt);

        // Remove possíveis blocos de markdown ```json ... ```
        const textoLimpo = textoBruto
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        let resposta;
        try {
            resposta = JSON.parse(textoLimpo);
        } catch {
            console.error("JSON inválido do Gemini:", textoLimpo);
            return res.status(502).json({ error: "Resposta da IA em formato inválido" });
        }

        // Se encontrou manuais, enriquece com nome e descricao completos
        if (resposta.tipo === "manuais_encontrados" && Array.isArray(resposta.manuais)) {
            resposta.manuais = resposta.manuais
                .map((m) => {
                    const manual = manuaisDisponiveis.find((md) => md.id === m.id);
                    return manual ? { ...manual, relevancia: m.relevancia } : null;
                })
                .filter(Boolean);
        }

        return res.status(200).json(resposta);
    } catch (err) {
        console.error("Erro interno:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
