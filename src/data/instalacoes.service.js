import instalacoes from "./instalacao.json";

export function getTodosOsItens() {
    return Object.values(instalacoes).flat();
}

export function getInstalacoesPorCategoria() {
    return instalacoes;
}

export function getPostById(id) {
    const todos = getTodosOsItens();
    return todos.find((item) => item.id === Number(id));
}

export function getAllPostIds() {
    return getTodosOsItens().map((item) => ({
        params: { id: String(item.id) },
    }));
}
