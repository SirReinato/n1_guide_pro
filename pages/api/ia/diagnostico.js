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

Manuais técnicos disponíveis no sistema da empresa:
${manuaisTexto}

Analise a situação com extremo cuidado técnico. Responda EXCLUSIVAMENTE com um JSON válido, sem markdown, sem texto fora do JSON.

DIRETRIZES CRÍTICAS PARA ESCOLHA DO TIPO DE RESPOSTA:

1. QUANDO É UMA DÚVIDA VAGA/CURTA (ex: "erro no antivirus", "não abre", "tela azul", "problema no pc"):
- O usuário não deu detalhes suficientes do erro ou do programa.
- Retorne:
{
  "tipo": "manuais_encontrados",
  "precisaMaisDetalhes": true,
  "perguntaClarificacao": "<pergunta direta e amigável pedindo o detalhe do erro>",
  "sugestoesRapidas": ["<opção 1>", "<opção 2>", "<opção 3>"],
  "manuais": [{ "id": <número>, "relevancia": "<por que este manual pode ter relação preventiva ou preliminar>" }]
}
(Observação: Se houver qualquer manual mesmo que com relação parcial, inclua-o em "manuais" para que o usuário já possa conferir. Se não houver nenhum, retorne "manuais": [])

2. QUANDO EXISTE UM MANUAL EXATO E ESPECÍFICO PARA AQUELE ASSUNTO:
- ATENÇÃO: Só escolha esta opção se o manual da lista for DIRETAMENTE SOBRE o programa ou assunto que o usuário precisa (ex: o usuário quer instalar ou consertar o Serpro ID e existe o manual do Serpro ID).
- Se o usuário perguntou sobre antivírus genérico, erro no Windows, tela azul ou software sem manual dedicado, NÃO use esta opção!
- Retorne:
{
  "tipo": "manuais_encontrados",
  "precisaMaisDetalhes": false,
  "manuais": [{ "id": <número>, "relevancia": "<explicação de como o manual resolve exatamente o problema>" }]
}

3. QUANDO É UM PROBLEMA TÉCNICO SEM MANUAL ESPECÍFICO DIRETO (OU QUANDO O USUÁRIO JÁ REFINOU / CLICOU NUMA OPÇÃO):
- Se não houver manual 100% específico para o problema relatado, VOCÊ DEVE GERAR UM PASSO A PASSO TÉCNICO N1 PRÁTICO de testes e resolução!
- Se houver algum manual parcialmente relacionado no sistema, você pode incluí-lo em "manuaisRelacionados" como referência complementar, mas DEVE GERAR O PASSO A PASSO!
- Retorne:
{
  "tipo": "passo_a_passo",
  "precisaMaisDetalhes": false,
  "sugestaoNome": "<nome técnico claro para este procedimento>",
  "sugestaoDescricao": "<resumo do que este procedimento testa e resolve>",
  "passos": [
    { "titulo": "<passo 1: teste ou diagnóstico inicial>", "descricao": "<instrução detalhada>" },
    { "titulo": "<passo 2: ação corretiva>", "descricao": "<instrução detalhada>" },
    { "titulo": "<passo 3: teste de validação>", "descricao": "<como testar se funcionou>" }
  ],
  "manuaisRelacionados": [{ "id": <número>, "relevancia": "<relação complementar, se houver>" }]
}

Regras:
- Use linguagem clara e técnica, em português brasileiro.
- Sugestões rápidas devem ter no máximo 4 palavras cada.
- Se houver múltiplos manuais relevantes, liste no máximo os 3 mais próximos.
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

        // Se encontrou manuais diretos, enriquece com nome e descricao completos
        if (resposta.tipo === "manuais_encontrados" && Array.isArray(resposta.manuais)) {
            resposta.manuais = resposta.manuais
                .map((m) => {
                    const manual = manuaisDisponiveis.find((md) => md.id === m.id);
                    return manual ? { ...manual, relevancia: m.relevancia } : null;
                })
                .filter(Boolean);
        }

        // Se gerou passo a passo e trouxe manuais complementares, enriquece também
        if (resposta.tipo === "passo_a_passo" && Array.isArray(resposta.manuaisRelacionados)) {
            resposta.manuaisRelacionados = resposta.manuaisRelacionados
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
