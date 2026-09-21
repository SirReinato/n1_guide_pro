import { createContext, useContext, useState, useEffect } from "react";
import instalacoesLocal from "../data/instalacao.json";

const BuscaContext = createContext();

export function BuscaProvider({ children }) {
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [todosOsItens, setTodosOsItens] = useState(
        Object.values(instalacoesLocal).flat()
    );

    useEffect(() => {
        // Busca a lista atualizada de manuais aprovados da API
        fetch("/api/manuais")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setTodosOsItens(data);
                }
            })
            .catch(() => {});
    }, []);

    // Listener global de atalhos de teclado
    useEffect(() => {
        function handleKeyDown(e) {
            // Ctrl+K ou Cmd+K: abre modal de busca rápida
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setModalAberto((prev) => !prev);
            }

            // Tecla / (apenas se o foco não estiver em um campo de texto ou textarea)
            if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
                e.preventDefault();
                setModalAberto(true);
            }

            // Tecla Esc: fecha a busca
            if (e.key === "Escape") {
                setModalAberto(false);
                setBusca("");
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <BuscaContext.Provider
            value={{
                busca,
                setBusca,
                modalAberto,
                setModalAberto,
                todosOsItens,
                setTodosOsItens,
            }}
        >
            {children}
        </BuscaContext.Provider>
    );
}

export function useBusca() {
    return useContext(BuscaContext);
}

