import instalacoesLocal from "../data/instalacao.json";

const API_URL = null; // futuramente vou colocar a URL da API aqui

// Fonte geral de dados atualmente JSON local
async function fetchInstalacoes() {
    if (API_URL) {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Erro API: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar API, usando fallback local", error);
            return instalacoesLocal;
        }
    }

    return instalacoesLocal;
}

// Para listagem por categoria
export async function getInstalacoesPorCategoria() {
    return await fetchInstalacoes();
}

// Para busca global
export async function getTodosOsItens() {
    const instalacoes = await fetchInstalacoes();
    return Object.values(instalacoes).flat();
}

// Para página de post
export async function getPostById(id) {
    const todos = await getTodosOsItens();
    return todos.find((item) => item.id === Number(id));
}

// Para getStaticPaths
export async function getAllPostIds() {
    const todos = await getTodosOsItens();
    return todos.map((item) => ({
        params: { id: String(item.id) },
    }));
}
