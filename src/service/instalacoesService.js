import { supabase } from "../lib/supabase.js";
import instalacoesLocal from "../data/instalacao.json";

// ─────────────────────────────────────────────────────────────────────────────
// Fonte primária: Supabase. Fallback: JSON local (dev sem internet, etc.)
// ─────────────────────────────────────────────────────────────────────────────

async function fetchInstalacoesPorCategoriaDoSupabase() {
    let res = await supabase
        .from("manuais")
        .select("id, nome, descricao, categorias(nome)")
        .eq("aprovado", true)
        .order("id");

    // Fallback se a coluna ainda não foi criada no Supabase
    if (res.error && res.error.message?.includes("aprovado")) {
        res = await supabase
            .from("manuais")
            .select("id, nome, descricao, categorias(nome)")
            .order("id");
    }

    if (res.error) throw res.error;

    // Agrupa por categoria para manter a mesma estrutura do JSON local
    return (res.data || []).reduce((acc, manual) => {
        const cat = manual.categorias?.nome ?? "Outros";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push({
            id: manual.id,
            nome: manual.nome,
            descricao: manual.descricao,
        });
        return acc;
    }, {});
}

async function fetchTodosOsItensDoSupabase() {
    let res = await supabase
        .from("manuais")
        .select("id, nome, descricao")
        .eq("aprovado", true)
        .order("id");

    if (res.error && res.error.message?.includes("aprovado")) {
        res = await supabase
            .from("manuais")
            .select("id, nome, descricao")
            .order("id");
    }

    if (res.error) throw res.error;
    return res.data || [];
}

async function fetchPostByIdDoSupabase(id) {
    let res = await supabase
        .from("manuais")
        .select("id, nome, descricao, passos(passo, titulo, descricao, imagem)")
        .eq("id", Number(id))
        .eq("aprovado", true)
        .single();

    if (res.error && res.error.message?.includes("aprovado")) {
        res = await supabase
            .from("manuais")
            .select("id, nome, descricao, passos(passo, titulo, descricao, imagem)")
            .eq("id", Number(id))
            .single();
    }

    if (res.error) throw res.error;

    return {
        id: res.data.id,
        nome: res.data.nome,
        descricao: res.data.descricao,
        passo_passo: (res.data.passos || []).sort((a, b) => a.passo - b.passo),
    };
}


// ─────────────────────────────────────────────────────────────────────────────
// Helpers de fallback local
// ─────────────────────────────────────────────────────────────────────────────

function getTodosLocal() {
    return Object.values(instalacoesLocal).flat();
}

function getPostByIdLocal(id) {
    return getTodosLocal().find((item) => item.id === Number(id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Funções públicas — mesma assinatura de antes
// ─────────────────────────────────────────────────────────────────────────────

// Para listagem por categoria
export async function getInstalacoesPorCategoria() {
    if (supabase) {
        try {
            const data = await fetchInstalacoesPorCategoriaDoSupabase();
            if (data && Object.keys(data).length > 0) {
                return data;
            }
        } catch (err) {
            console.error("Supabase indisponível, usando fallback local:", err.message);
        }
    }
    return instalacoesLocal;
}

// Para busca global
export async function getTodosOsItens() {
    if (supabase) {
        try {
            const data = await fetchTodosOsItensDoSupabase();
            if (data && data.length > 0) {
                return data;
            }
        } catch (err) {
            console.error("Supabase indisponível, usando fallback local:", err.message);
        }
    }
    return getTodosLocal();
}

// Para página de post
export async function getPostById(id) {
    if (supabase) {
        try {
            const data = await fetchPostByIdDoSupabase(id);
            if (data) return data;
        } catch (err) {
            console.error("Supabase indisponível, usando fallback local:", err.message);
        }
    }
    return getPostByIdLocal(id);
}


// Para getStaticPaths
export async function getAllPostIds() {
    const todos = await getTodosOsItens();
    return todos.map((item) => ({
        params: { id: String(item.id) },
    }));
}

