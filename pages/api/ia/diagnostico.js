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

    const { problema, contextoAnterior } = req.body;

    if (!problema?.trim()) {
        return res.status(400).json({ error: "Descreva o problema" });
    }

    if (!GEMINI_API_KEY) {
        return res.status(503).json({ error: "Gemini API não configurada" });
    }

    // Busca lista de manuais disponíveis (apenas os aprovados)
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

    let textoEntradaUsuario = `"${problema.trim()}"`;
    if (contextoAnterior && contextoAnterior.trim()) {
        textoEntradaUsuario = `Problema inicial: "${contextoAnterior.trim()}"\nInformações adicionais do usuário para refinar: "${problema.trim()}"`;
    }

    const prompt = `Você é um assistente técnico de suporte N1 (help desk) especializado em TI corporativa.

O usuário relatou a seguinte situação:
${textoEntradaUsuario}

Manuais técnicos cadastrados no sistema da empresa:
${manuaisTexto}

Analise a situação com extremo cuidado técnico. Responda EXCLUSIVAMENTE com um JSON válido, sem markdown, sem texto fora do JSON.

DIRETRIZES DE RESPOSTA:

1. QUANDO A PERGUNTA FOR VAGA, CURTA OU FALTAR CONTEXTO (ex: "erro no antivirus", "não abre", "travou", "tela azul", "problema no pc"):
- O usuário deu pouca informação para que possamos fornecer uma solução exata imediatamente.
- Peça mais detalhes, forneça sugestões rápidas e, se algum manual tiver relação preventiva, liste em "manuais":
{
  "tipo": "clarificacao",
  "precisaMaisDetalhes": true,
  "perguntaClarificacao": "<pergunta amigável e direta pedindo o detalhe do erro>",
  "sugestoesRapidas": ["<opção curta 1>", "<opção curta 2>", "<opção curta 3>"],
  "manuais": [{ "id": <número>, "relevancia": "<breve explicação de como pode ajudar preventivamente>" }]
}

2. QUANDO O USUÁRIO FORNECER UM PROBLEMA ESPECÍFICO (OU CLICAR EM UMA SUGESTÃO / REFINAR A CONSULTA):
- REGRA FUNDAMENTAL: VOCÊ DEVE OBRIGATORIAMENTE GERAR UM PASSO A PASSO TÉCNICO N1 PRÁTICO E COMPLETO ("passos"). Nunca devolva apenas links de manuais sem o passo a passo.
- O usuário precisa de instruções de ação claras e imediatas na tela.
- Se algum manual da empresa tratar do mesmo assunto ou for útil como apoio, liste-o em "manuaisRelacionados" (com ID e relevância).
- Estrutura:
{
  "tipo": "passo_a_passo",
  "precisaMaisDetalhes": false,
  "sugestaoNome": "<nome técnico claro para este procedimento>",
  "sugestaoDescricao": "<resumo do diagnóstico e objetivo do procedimento>",
  "passos": [
    { "titulo": "<Passo 1: Teste/Diagnóstico inicial>", "descricao": "<orientação detalhada de N1>" },
    { "titulo": "<Passo 2: Ação corretiva>", "descricao": "<orientação detalhada de N1>" },
    { "titulo": "<Passo 3: Validação/Teste final>", "descricao": "<como testar e confirmar a resolução>" }
  ],
  "manuaisRelacionados": [
    { "id": <número>, "relevancia": "<por que este manual da empresa é o documento oficial ou de apoio>" }
  ]
}

Regras:
- Use linguagem clara e técnica, em português brasileiro.
- Sugestões rápidas devem ter no máximo 4 palavras cada.
- No passo a passo, forneça de 3 a 5 passos práticos e objetivos.
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

        // Se a resposta pede mais detalhes (clarificação)
        if (resposta.precisaMaisDetalhes) {
            resposta.tipo = "clarificacao";
            if (Array.isArray(resposta.manuais)) {
                resposta.manuais = resposta.manuais
                    .map((m) => {
                        const manual = manuaisDisponiveis.find((md) => md.id === m.id);
                        return manual ? { ...manual, relevancia: m.relevancia } : null;
                    })
                    .filter(Boolean);
            }
        } else {
            // Se não precisa de mais detalhes, deve ser passo a passo
            resposta.tipo = "passo_a_passo";

            // Se o Gemini colocou manuais na chave 'manuais' em vez de 'manuaisRelacionados', unifica
            const listaRelacionados = resposta.manuaisRelacionados || resposta.manuais || [];
            if (Array.isArray(listaRelacionados)) {
                resposta.manuaisRelacionados = listaRelacionados
                    .map((m) => {
                        const manual = manuaisDisponiveis.find((md) => md.id === m.id);
                        return manual ? { ...manual, relevancia: m.relevancia } : null;
                    })
                    .filter(Boolean);
            }
        }

        return res.status(200).json(resposta);
    } catch (err) {
        console.error("Erro interno:", err);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
